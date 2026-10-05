export const SESSION_TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

export function isTokenValid(token: string | null | undefined): boolean {
  if (!token || !token.startsWith('modkovski_session_')) return false;
  const parts = token.split('_');
  let ts = NaN;
  if (parts.length >= 4) {
    ts = parseInt(parts[3], 10);
  } else if (parts.length === 3) {
    ts = parseInt(parts[2], 10);
  }
  if (isNaN(ts)) return true; // Legacy fallback
  const age = Date.now() - ts;
  return age >= -60000 && age <= SESSION_TTL_MS;
}
