/**
 * MentalMap — client-side encryption for email/password accounts.
 *
 * The server stores ciphertext only, wrapped by a key derived from the
 * account password itself — never sent anywhere, never stored anywhere. No
 * amount of database access — including ours — reveals what anyone wrote
 * about the people in their life, and no separate code or recovery phrase is
 * needed: the password the user already typed in to sign in is the secret.
 *
 * Google-signed-in accounts skip this file entirely (see the ACCOUNT / CLOUD
 * SYNC section of app.js) — Google never hands the app a stable secret it
 * doesn't also see, so there is nothing to derive a zero-knowledge key from.
 * Their data syncs in the clear, gated only by Firestore's per-account rules.
 *
 * Envelope design: one random 256-bit DEK per user encrypts every record, and
 * is itself wrapped by a key derived from the account password (PBKDF2). If
 * the password ever changes outside the app (e.g. a Firebase password reset),
 * the old wrapping stops working — there is no separate recovery path.
 *
 * Deliberately a classic script exposing one global rather than an ES module:
 * app.js is a classic script relying on global function declarations, and
 * converting it wholesale is a far larger change than this file justifies.
 */
(function (global) {
  'use strict';

  const KDF = { hash: 'SHA-256', iterations: 600000, saltBytes: 16 };
  const AES = { name: 'AES-GCM', length: 256, ivBytes: 12, tagLength: 128 };
  const RECORD_ALG = 'AES-GCM-256/v1';

  const te = new TextEncoder();
  const td = new TextDecoder();

  // ── base64url ──────────────────────────────────────────────────────────────
  // Chosen over Firestore's Bytes type so records round-trip cleanly through the
  // existing JSON export/import backup, which matters more here than the size.

  function b64uEncode(bytes) {
    const u8 = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
    let s = '';
    for (let i = 0; i < u8.length; i++) s += String.fromCharCode(u8[i]);
    return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  }

  function b64uDecode(str) {
    const s = String(str).replace(/-/g, '+').replace(/_/g, '/');
    const bin = atob(s + '='.repeat((4 - (s.length % 4)) % 4));
    const out = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
    return out;
  }

  function randomBytes(n) {
    return crypto.getRandomValues(new Uint8Array(n));
  }

  // ── key derivation ─────────────────────────────────────────────────────────

  /**
   * NFKC normalisation is not optional here. The passphrase is Polish, and
   * "ą ć ę ł ń ó ś ź ż" arrive as NFC from one keyboard and NFD from another.
   * Without it the same typed passphrase produces different bytes on different
   * devices — an unlock failure that is essentially impossible to reproduce.
   */
  async function deriveKEK(secret, salt, iterations) {
    const baseKey = await crypto.subtle.importKey(
      'raw',
      te.encode(String(secret).normalize('NFKC')),
      'PBKDF2',
      false,
      ['deriveKey']
    );
    return crypto.subtle.deriveKey(
      { name: 'PBKDF2', salt, iterations: iterations || KDF.iterations, hash: KDF.hash },
      baseKey,
      { name: AES.name, length: AES.length },
      false,
      ['wrapKey', 'unwrapKey']
    );
  }

  // extractable must be true, or wrapKey throws InvalidAccessException.
  async function generateDEK() {
    return crypto.subtle.generateKey({ name: AES.name, length: AES.length }, true, ['encrypt', 'decrypt']);
  }

  async function wrapDEK(dek, kek) {
    const iv = randomBytes(AES.ivBytes);
    const wrapped = await crypto.subtle.wrapKey('raw', dek, kek, {
      name: AES.name, iv, tagLength: AES.tagLength
    });
    return { wrapIv: b64uEncode(iv), wrappedDek: b64uEncode(wrapped) };
  }

  async function unwrapDEK(wrappedB64u, ivB64u, kek, opts) {
    const extractable = !!(opts && opts.extractable);
    return crypto.subtle.unwrapKey(
      'raw',
      b64uDecode(wrappedB64u),
      kek,
      { name: AES.name, iv: b64uDecode(ivB64u), tagLength: AES.tagLength },
      { name: AES.name, length: AES.length },
      extractable,
      ['encrypt', 'decrypt']
    );
  }

  // ── record encryption ──────────────────────────────────────────────────────

  /**
   * Binds each ciphertext to its owner and its record. Without this, anyone able
   * to write to the database could copy one person's encrypted blob onto another
   * person's document and the app would decrypt it without complaint — silently
   * relabelling one relationship as another.
   */
  function aad(uid, personId) {
    return te.encode(`mentalmap|v1|${uid}|${personId}`);
  }

  /**
   * The fields that make up a person record for sync purposes. For
   * email/password accounts these never leave the device except inside
   * encryptRecord's ciphertext; app.js also uses this directly, unencrypted,
   * for Google accounts, which have no password to derive a key from.
   */
  function sensitivePayload(person) {
    return {
      name: person.name,
      answers: person.answers,
      answerIndices: person.answerIndices || null,
      // Legacy records from before the gate question existed have no
      // gateAnswer at all. JSON.stringify (the encrypted path) silently drops
      // an undefined property, but a plain Firestore write (the Google/no-DEK
      // path) rejects undefined outright — so normalize it here, for both.
      gateAnswer: typeof person.gateAnswer === 'number' ? person.gateAnswer : null,
      secretCap: person.secretCap,
      gradientIndex: person.gradientIndex
    };
  }

  async function encryptRecord(person, dek, uid, personId) {
    // A fresh IV on every call, including edits of an existing record. Reusing an
    // (key, IV) pair under GCM is catastrophic — it leaks plaintext and the
    // authentication key itself.
    const iv = randomBytes(AES.ivBytes);
    const ct = await crypto.subtle.encrypt(
      { name: AES.name, iv, tagLength: AES.tagLength, additionalData: aad(uid, personId) },
      dek,
      te.encode(JSON.stringify(sensitivePayload(person)))
    );
    return { iv: b64uEncode(iv), ct: b64uEncode(ct), alg: RECORD_ALG };
  }

  async function decryptRecord(rec, dek, uid, personId) {
    const pt = await crypto.subtle.decrypt(
      { name: AES.name, iv: b64uDecode(rec.iv), tagLength: AES.tagLength, additionalData: aad(uid, personId) },
      dek,
      b64uDecode(rec.ct)
    );
    return JSON.parse(td.decode(pt));
  }

  // ── keyring flows ──────────────────────────────────────────────────────────

  function buildWrappingDoc(kind, dekId, salt, wrapped) {
    return Object.assign({
      v: 1,
      kind,
      dekId,
      kdf: 'PBKDF2',
      hash: KDF.hash,
      iterations: KDF.iterations,
      salt: b64uEncode(salt),
      wrapAlg: AES.name
    }, wrapped);
  }

  /**
   * First run for an email/password account. Returns the DEK plus the single
   * wrapping document to store, wrapped by a key derived from the account
   * password — the same secret Firebase Auth just verified, so no separate
   * code or passphrase is ever shown to the user.
   */
  async function setupKeyring(options) {
    const opts = options || {};
    if (!opts.password) throw new Error('setupKeyring requires a password');
    const dek = await generateDEK();
    const dekId = (crypto.randomUUID ? crypto.randomUUID() : b64uEncode(randomBytes(16)));
    const salt = randomBytes(KDF.saltBytes);
    const doc = buildWrappingDoc('password', dekId, salt,
      await wrapDEK(dek, await deriveKEK(opts.password, salt)));
    return { dek, dekId, docs: [doc] };
  }

  async function unlock(doc, secret, opts) {
    const kek = await deriveKEK(secret, b64uDecode(doc.salt), doc.iterations);
    try {
      return await unwrapDEK(doc.wrappedDek, doc.wrapIv, kek, opts);
    } catch (e) {
      // AES-GCM is authenticated, so a failure here means the secret was wrong
      // (or the record was tampered with). Never tell the user which — that
      // distinction is only useful to an attacker.
      const err = new Error('BAD_SECRET');
      err.code = 'BAD_SECRET';
      throw err;
    }
  }

  // ── device cache ───────────────────────────────────────────────────────────
  // A CryptoKey is structured-cloneable, so it can live in IndexedDB directly.
  // Stored non-extractable: the page can use it to decrypt but can never read its
  // bytes — not from our own code, not from an injected script, not from DevTools.
  //
  // This is "opaque to JavaScript", NOT hardware-backed. Anyone holding the
  // unlocked phone can open the app and read everything, exactly as with any
  // signed-in app. Do not describe it as hardware protection.

  const IDB_NAME = 'mentalmap-keys';
  const IDB_STORE = 'dek';

  function openIdb() {
    return new Promise((resolve, reject) => {
      const req = indexedDB.open(IDB_NAME, 1);
      req.onupgradeneeded = () => {
        if (!req.result.objectStoreNames.contains(IDB_STORE)) {
          req.result.createObjectStore(IDB_STORE);
        }
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  }

  /**
   * A freshly generated DEK is necessarily extractable — wrapKey refuses a
   * non-extractable key — so caching it as-is would store readable key bytes and
   * defeat the point of the cache. Downgrade to a non-extractable copy first.
   */
  async function toNonExtractable(dek) {
    if (!dek.extractable) return dek;
    const raw = await crypto.subtle.exportKey('raw', dek);
    return crypto.subtle.importKey('raw', raw, { name: AES.name, length: AES.length }, false, ['encrypt', 'decrypt']);
  }

  async function cacheDEK(dekMaybeExtractable, dekId, uid) {
    const dek = await toNonExtractable(dekMaybeExtractable);
    if (navigator.storage && navigator.storage.persist) {
      // Ask the browser not to evict this under storage pressure. Losing the
      // cached key is not fatal, but it forces the user to type their
      // password again on this device.
      try { await navigator.storage.persist(); } catch (_) { /* best effort */ }
    }
    const db = await openIdb();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(IDB_STORE, 'readwrite');
      tx.objectStore(IDB_STORE).put({ dek, dekId, uid }, 'current');
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  }

  async function loadCachedDEK(uid) {
    let db;
    try { db = await openIdb(); } catch (_) { return null; }
    const entry = await new Promise((resolve) => {
      const req = db.transaction(IDB_STORE, 'readonly').objectStore(IDB_STORE).get('current');
      req.onsuccess = () => resolve(req.result || null);
      req.onerror = () => resolve(null);
    });
    // A cached key belonging to a different account must never be used: on a
    // shared device that would decrypt one person's data into another's session.
    if (!entry || (uid && entry.uid && entry.uid !== uid)) return null;
    return entry;
  }

  async function forgetDevice() {
    let db;
    try { db = await openIdb(); } catch (_) { return; }
    return new Promise((resolve) => {
      const tx = db.transaction(IDB_STORE, 'readwrite');
      tx.objectStore(IDB_STORE).delete('current');
      tx.oncomplete = () => resolve();
      tx.onerror = () => resolve();
    });
  }

  global.MentalMapCrypto = {
    b64uEncode, b64uDecode, randomBytes,
    deriveKEK, generateDEK, wrapDEK, unwrapDEK,
    encryptRecord, decryptRecord, sensitivePayload,
    setupKeyring, unlock,
    cacheDEK, loadCachedDEK, forgetDevice, toNonExtractable,
    _params: { KDF, AES, RECORD_ALG }
  };
})(typeof window !== 'undefined' ? window : globalThis);
