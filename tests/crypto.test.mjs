// Exercise crypto.js under Node's WebCrypto (same SubtleCrypto as the browser).
import fs from 'fs';
import { webcrypto } from 'crypto';
if (!globalThis.crypto) Object.defineProperty(globalThis, "crypto", { value: webcrypto });
globalThis.btoa = s => Buffer.from(s, 'binary').toString('base64');
globalThis.atob = s => Buffer.from(s, 'base64').toString('binary');
const g = {};
new Function('window', fs.readFileSync(new URL('../crypto.js', import.meta.url), 'utf8') + '\n')(g);
const C = g.MentalMapCrypto;

const uid = 'user-abc', pid = 'person-1';
const person = { name: 'Anna Kowalska', answers: [3,3,6,3,3,3,3,3,3,3,3,3,3,3,3,2],
                 answerIndices: new Array(16).fill(0), gateAnswer: -4, secretCap: 3, gradientIndex: 7 };
let pass = 0, fail = 0;
const ok = (c, m) => { if (c) { pass++; console.log('  PASS', m); } else { fail++; console.log('  FAIL', m); } };

const t0 = Date.now();
const { dek, dekId, recoveryCode, docs } = await C.setupKeyring({ passphrase: 'Zażółć gęślą jaźń 42' });
console.log(`setupKeyring (2x PBKDF2 @600k): ${Date.now() - t0}ms`);
ok(docs.length === 2, 'recovery + passphrase wrappings created');
ok(docs[0].kind === 'recovery' && docs[1].kind === 'passphrase', 'wrapping kinds correct');
ok(docs[0].salt !== docs[1].salt, 'independent salts per wrapping');
ok(C.b64uDecode(docs[0].wrappedDek).length === 48, 'wrapped DEK is 48 bytes (32 key + 16 tag)');
ok(/^[0-9A-HJKMNP-TV-Z]{5}(-[0-9A-HJKMNP-TV-Z]{1,5}){5}$/.test(recoveryCode), 'recovery code format: ' + recoveryCode);

const enc = await C.encryptRecord(person, dek, uid, pid);
ok(!JSON.stringify(enc).includes('Anna'), 'name absent from ciphertext');
ok(!JSON.stringify(enc).includes('Kowalska'), 'surname absent from ciphertext');
const dec = await C.decryptRecord(enc, dek, uid, pid);
ok(dec.name === 'Anna Kowalska', 'name round-trips');
ok(JSON.stringify(dec.answers) === JSON.stringify(person.answers), 'answers round-trip');
ok(dec.gateAnswer === -4, 'gateAnswer round-trips');

const enc2 = await C.encryptRecord(person, dek, uid, pid);
ok(enc.iv !== enc2.iv, 'fresh IV on every encrypt (GCM nonce reuse would be fatal)');

let moved = false;
try { await C.decryptRecord(enc, dek, uid, 'person-2'); moved = true; } catch (_) {}
ok(!moved, 'AAD blocks moving a record onto another person');
let crossUser = false;
try { await C.decryptRecord(enc, dek, 'other-uid', pid); crossUser = true; } catch (_) {}
ok(!crossUser, 'AAD blocks decrypting under another uid');

const dekFromPass = await C.unlock(docs[1], 'Zażółć gęślą jaźń 42');
ok((await C.decryptRecord(enc, dekFromPass, uid, pid)).name === 'Anna Kowalska', 'unlock via passphrase');
const dekFromCode = await C.unlock(docs[0], recoveryCode.toLowerCase().replace(/-/g, ' '));
ok((await C.decryptRecord(enc, dekFromCode, uid, pid)).name === 'Anna Kowalska', 'unlock via recovery code typed lowercase with spaces');
ok(dekFromPass.extractable === false, 'unlocked DEK is non-extractable by default');

let badRejected = false;
try { await C.unlock(docs[1], 'zle haslo'); } catch (e) { badRejected = e.code === 'BAD_SECRET'; }
ok(badRejected, 'wrong passphrase rejected with BAD_SECRET');

// NFC vs NFD: the same Polish passphrase from two different keyboards.
const nfd = 'Zażółć gęślą jaźń 42'.normalize('NFD');
ok(nfd !== 'Zażółć gęślą jaźń 42', 'test really is using a different byte sequence');
let nfdWorks = false;
try { await C.unlock(docs[1], nfd); nfdWorks = true; } catch (_) {}
ok(nfdWorks, 'NFKC normalisation makes NFD-encoded Polish passphrase unlock');


// A generated DEK must be extractable so it can be wrapped; caching it in that
// state would persist readable key bytes and defeat the device cache entirely.
const nonExt = await C.toNonExtractable(dek);
ok(nonExt.extractable === false, 'toNonExtractable downgrades a generated DEK');
ok((await C.decryptRecord(enc, nonExt, uid, pid)).name === 'Anna Kowalska', 'downgraded DEK still decrypts');
let wrapRefused = false;
try { await C.wrapDEK(nonExt, await C.deriveKEK('x', C.randomBytes(16), 1000)); }
catch (_) { wrapRefused = true; }
ok(wrapRefused, 'non-extractable DEK cannot be re-wrapped (so a borrowed unlocked phone cannot re-key the account)');

const codes = new Set();
for (let i = 0; i < 3000; i++) codes.add(C.generateRecoveryCode());
ok(codes.size === 3000, '3000 recovery codes, no collisions');

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
