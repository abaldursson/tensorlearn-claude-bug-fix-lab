// Contract: docs/contract.md. Pure function; do not mutate claims.
const normalize = id => (typeof id === 'string' ? id.trim() : '');

export function getClaim(claims, viewerId, claimId) {
  const target = normalize(claimId);
  const viewer = normalize(viewerId);
  if (!Array.isArray(claims) || !target || !viewer) return null;
  for (const claim of claims) {
    if (claim === null || typeof claim !== 'object') continue;
    if (normalize(claim.id) === target && normalize(claim.ownerId) === viewer) return claim;
  }
  return null;
}
