/**
 * MentalMap — Firebase glue (Auth + Firestore).
 *
 * Loaded lazily via `import()`, never as a static <script> tag — see the
 * ACCOUNT / CLOUD SYNC section of app.js, which is the only code that ever
 * imports this file, and only once a user actually opens the Account modal
 * or a previous connection is detected on this device. Nothing here runs for
 * a user who never touches sync.
 *
 * This module only ever handles ciphertext for person records — see
 * crypto.js for the encryption itself. Firestore security rules
 * (firestore.rules) are the second, server-side layer: they restrict every
 * document under users/{uid} to that uid's own requests.
 */

import { initializeApp } from 'https://www.gstatic.com/firebasejs/12.17.1/firebase-app.js';
import {
  getAuth, GoogleAuthProvider, signInWithPopup, signInWithRedirect, getRedirectResult,
  onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut
} from 'https://www.gstatic.com/firebasejs/12.17.1/firebase-auth.js';
import {
  initializeFirestore, persistentLocalCache, doc, setDoc, getDocs, collection,
  deleteDoc, onSnapshot, serverTimestamp
} from 'https://www.gstatic.com/firebasejs/12.17.1/firebase-firestore.js';

// Public web config (apiKey, authDomain, etc.) — not a secret, safe to
// commit. See the repo's own .gitignore comment for this exact distinction
// (it's the Admin SDK service-account key that must never be committed).
const FIREBASE_CONFIG = {
  apiKey: 'AIzaSyD1uSi4biuA7YPoykZ_63Ve5MjCzoJxrlM',
  authDomain: 'mentalmap-17db4.firebaseapp.com',
  projectId: 'mentalmap-17db4',
  storageBucket: 'mentalmap-17db4.firebasestorage.app',
  messagingSenderId: '731701637961',
  appId: '1:731701637961:web:5e04bb36616875b71da098'
};

const app = initializeApp(FIREBASE_CONFIG);
const auth = getAuth(app);
// persistentLocalCache: queues writes made while offline (e.g. editing on a
// plane) and flushes them once the connection returns, instead of the push
// silently failing.
const db = initializeFirestore(app, { localCache: persistentLocalCache() });

function toMillis(rec) {
  return rec.updatedAt && typeof rec.updatedAt.toMillis === 'function'
    ? rec.updatedAt.toMillis()
    : (rec.updatedAtClient || 0);
}

// ── auth ──────────────────────────────────────────────────────────────────

export function onAuthChange(callback) {
  return onAuthStateChanged(auth, callback);
}

/** Resolves once with whatever the current session is (or null) — never hangs. */
export function getCurrentUser() {
  return new Promise((resolve) => {
    const unsub = onAuthStateChanged(auth, (user) => { unsub(); resolve(user); }, () => { unsub(); resolve(null); });
  });
}

/** Call once after any page load that might be the return leg of signInWithGoogle(). */
export async function checkRedirectResult() {
  const result = await getRedirectResult(auth);
  return result ? result.user : null;
}

// Only these mean "this browser won't give us a popup" — everything else
// (including the user simply closing the window) is a real outcome and must
// not silently turn into a second, full-page sign-in attempt.
const POPUP_UNAVAILABLE = new Set([
  'auth/popup-blocked',
  'auth/operation-not-supported-in-this-environment',
  'auth/web-storage-unsupported'
]);

/**
 * Popup first, redirect only as a fallback.
 *
 * signInWithRedirect carries the result home through a cross-origin iframe on
 * authDomain (mentalmap-17db4.firebaseapp.com), which every browser that blocks
 * third-party storage now severs — Samsung Internet does this by default via
 * Smart Anti-Tracking. The Google screen still appears and the user still
 * approves, but getRedirectResult() then resolves to null and the app drops
 * them straight back on the sign-in screen. Firebase's documented fixes are to
 * serve /__/auth/ from our own origin (impossible on GitHub Pages) or to use
 * signInWithPopup, which hands the credential back over postMessage and never
 * reads third-party storage.
 *
 * Resolves to the signed-in user, or to null when the redirect fallback has
 * taken over and the page is already navigating away.
 */
export async function signInWithGoogle({ onBeforeRedirect } = {}) {
  const provider = new GoogleAuthProvider();
  try {
    const cred = await signInWithPopup(auth, provider);
    return cred.user;
  } catch (e) {
    if (!POPUP_UNAVAILABLE.has(e && e.code)) throw e;
    if (onBeforeRedirect) onBeforeRedirect();
    await signInWithRedirect(auth, provider);
    return null;
  }
}

/** True for the two codes that just mean "the user backed out of the popup". */
export function isUserCancelledSignIn(e) {
  return !!e && (e.code === 'auth/popup-closed-by-user' || e.code === 'auth/cancelled-popup-request');
}

export async function signUpWithEmail(email, password) {
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  return cred.user;
}

export async function signInWithEmail(email, password) {
  const cred = await signInWithEmailAndPassword(auth, email, password);
  return cred.user;
}

export function signOutUser() {
  return signOut(auth);
}

// ── firestore ────────────────────────────────────────────────────────────

export async function ensureUserDoc(uid, dekId) {
  await setDoc(doc(db, 'users', uid), { dekId, createdAt: serverTimestamp() }, { merge: true });
}

/**
 * Always a fresh auto-ID document — wrappings accumulate and are never
 * edited or replaced, mirroring crypto.js's own envelope design (see
 * setupKeyring/addPassphraseWrapping there).
 */
export async function pushKeyringDoc(uid, wrappingDoc) {
  const ref = doc(collection(db, 'users', uid, 'keyring'));
  await setDoc(ref, Object.assign({}, wrappingDoc, { createdAt: serverTimestamp() }));
}

export async function fetchKeyringDocs(uid) {
  const snap = await getDocs(collection(db, 'users', uid, 'keyring'));
  return snap.docs.map(d => d.data());
}

export async function pushPerson(uid, personId, encryptedRecord, updatedAtClientMs) {
  const ref = doc(db, 'users', uid, 'people', personId);
  await setDoc(ref, Object.assign({}, encryptedRecord, {
    updatedAt: serverTimestamp(),
    updatedAtClient: updatedAtClientMs
  }));
}

export async function deletePerson(uid, personId) {
  await deleteDoc(doc(db, 'users', uid, 'people', personId));
}

export async function fetchAllPeopleOnce(uid) {
  const snap = await getDocs(collection(db, 'users', uid, 'people'));
  return snap.docs.map(d => {
    const data = d.data();
    return Object.assign({ id: d.id }, data, { updatedAtMs: toMillis(data) });
  });
}

/** Realtime listener. Returns an unsubscribe function. */
export function subscribePeople(uid, onChanges) {
  return onSnapshot(
    collection(db, 'users', uid, 'people'),
    (snapshot) => {
      const changes = snapshot.docChanges().map(change => {
        if (change.type === 'removed') return { id: change.doc.id, type: 'removed' };
        const data = change.doc.data();
        return { id: change.doc.id, type: change.type, data: Object.assign({}, data, { updatedAtMs: toMillis(data) }) };
      });
      if (changes.length) onChanges(changes);
    },
    (err) => console.error('Firestore people listener error:', err)
  );
}
