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
  getAuth, GoogleAuthProvider, signInWithRedirect, getRedirectResult,
  onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut
} from 'https://www.gstatic.com/firebasejs/12.17.1/firebase-auth.js';
import {
  initializeFirestore, persistentLocalCache, doc, setDoc, getDocs, collection,
  deleteDoc, onSnapshot, serverTimestamp
} from 'https://www.gstatic.com/firebasejs/12.17.1/firebase-firestore.js';

// TODO: replace with the real config from Firebase Console → Project settings
// → General → Your apps → Web app. This is the public web config (apiKey,
// authDomain, etc.), not a secret — safe to commit, same as the repo's own
// .gitignore comment already notes for this exact distinction.
const FIREBASE_CONFIG = {
  apiKey: 'REPLACE_WITH_YOUR_FIREBASE_API_KEY',
  authDomain: 'REPLACE_WITH_YOUR_PROJECT.firebaseapp.com',
  projectId: 'REPLACE_WITH_YOUR_PROJECT_ID',
  storageBucket: 'REPLACE_WITH_YOUR_PROJECT.appspot.com',
  messagingSenderId: 'REPLACE_WITH_YOUR_SENDER_ID',
  appId: 'REPLACE_WITH_YOUR_APP_ID'
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

export function signInWithGoogle() {
  return signInWithRedirect(auth, new GoogleAuthProvider());
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
