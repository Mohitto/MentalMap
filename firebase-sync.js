/**
 * MentalMap — Firebase glue (Auth + Firestore).
 *
 * Loaded lazily via `import()`, never as a static <script> tag — see the
 * ACCOUNT / CLOUD SYNC section of app.js, which is the only code that ever
 * imports this file, and only once a user actually opens the Account modal
 * or a previous connection is detected on this device. Nothing here runs for
 * a user who never touches sync.
 *
 * Person records sync as plain fields — there is no client-side encryption.
 * Firestore security rules (firestore.rules) are the only protection: they
 * restrict every document under users/{uid} to that uid's own requests.
 * (An earlier version derived a per-account encryption key from the
 * account's password, but that made a Firebase password reset permanently
 * destroy access to the encrypted data — the opposite of what a password
 * reset is for. Plain sync trades that guarantee for a reset that actually
 * works, same as almost every other app.)
 */

import { initializeApp } from 'https://www.gstatic.com/firebasejs/12.17.1/firebase-app.js';
import {
  getAuth, GoogleAuthProvider, signInWithPopup, signInWithRedirect, getRedirectResult,
  onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut,
  sendPasswordResetEmail, sendEmailVerification, reload
} from 'https://www.gstatic.com/firebasejs/12.17.1/firebase-auth.js';
import {
  initializeFirestore, persistentLocalCache, doc, setDoc, getDoc, getDocs, collection,
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

export function sendPasswordReset(email) {
  return sendPasswordResetEmail(auth, email);
}

export function sendVerificationEmail(user) {
  return sendEmailVerification(user);
}

/**
 * Refreshes a cached user object in place (Firebase mutates it, no return
 * value) — needed so emailVerified reflects a link the user clicked in
 * another tab or device rather than the stale value from this browser's
 * last sign-in.
 */
export function refreshUser(user) {
  return reload(user);
}

// ── firestore ────────────────────────────────────────────────────────────

export async function pushPerson(uid, personId, record, updatedAtClientMs) {
  const ref = doc(db, 'users', uid, 'people', personId);
  await setDoc(ref, Object.assign({}, record, {
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

// A single small doc for app preferences (currently just the level-field
// view) — one doc rather than a collection since there's only ever one.
export async function pushSettings(uid, settings) {
  const ref = doc(db, 'users', uid, 'settings', 'preferences');
  await setDoc(ref, Object.assign({}, settings, { updatedAt: serverTimestamp() }));
}

export async function fetchSettingsOnce(uid) {
  const snap = await getDoc(doc(db, 'users', uid, 'settings', 'preferences'));
  return snap.exists() ? snap.data() : null;
}
