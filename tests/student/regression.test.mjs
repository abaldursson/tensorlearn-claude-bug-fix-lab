import test from 'node:test';
import assert from 'node:assert/strict';
import { getClaim } from '../../src/claims.mjs';
const claimB = { id: 'claim-B', ownerId: 'user-42', status: 'pending' };
test('viewer user-4 must not receive claim-B owned by user-42', () => {
  assert.equal(getClaim([claimB], 'user-4', 'claim-B'), null);
});
test('owner user-42 still receives claim-B', () => {
  assert.deepEqual(getClaim([claimB], 'user-42', 'claim-B'), claimB);
});
test('empty or blank viewer id matches nothing', () => {
  assert.equal(getClaim([claimB], '', 'claim-B'), null);
  assert.equal(getClaim([claimB], '   ', 'claim-B'), null);
});
test('surrounding whitespace is trimmed on all ids', () => {
  const padded = { id: ' claim-B ', ownerId: ' user-42 ', status: 'pending' };
  assert.deepEqual(getClaim([claimB], ' user-42 ', ' claim-B '), claimB);
  assert.deepEqual(getClaim([padded], 'user-42', 'claim-B'), padded);
});
test('case and leading zeroes are preserved', () => {
  assert.equal(getClaim([claimB], 'USER-42', 'claim-B'), null);
  assert.equal(getClaim([claimB], 'user-42', 'CLAIM-B'), null);
  const zero = { id: 'c-007', ownerId: 'user-007', status: 'pending' };
  assert.equal(getClaim([zero], 'user-7', 'c-007'), null);
  assert.equal(getClaim([zero], 'user-007', 'c-7'), null);
});
test('non-string ids are not coerced', () => {
  const numeric = { id: 'c1', ownerId: '42', status: 'pending' };
  assert.equal(getClaim([numeric], 42, 'c1'), null);
  assert.equal(getClaim([claimB], 'user-42', null), null);
  assert.equal(getClaim([claimB], undefined, 'claim-B'), null);
  assert.equal(getClaim([{ id: 1, ownerId: 'user-42' }], 'user-42', '1'), null);
  assert.equal(getClaim([{ id: 'c1', ownerId: 42 }], '42', 'c1'), null);
});
test('malformed records cannot match and do not break the lookup', () => {
  assert.deepEqual(getClaim([null, 'x', {}, claimB], 'user-42', 'claim-B'), claimB);
  assert.equal(getClaim([{ id: '', ownerId: '' }], '', ''), null);
});
test('non-array records return null', () => {
  assert.equal(getClaim(null, 'user-42', 'claim-B'), null);
  assert.equal(getClaim({ 0: claimB, length: 1 }, 'user-42', 'claim-B'), null);
});
test('missing claim returns null and inputs are not mutated', () => {
  const claims = Object.freeze([Object.freeze({ ...claimB })]);
  assert.equal(getClaim(claims, 'user-42', 'claim-Z'), null);
  assert.deepEqual(claims, [claimB]);
});
