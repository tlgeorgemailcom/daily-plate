import bcrypt from 'bcryptjs';

const SALT_ROUNDS = 12;
const LEGACY_PREFIX = 'h1_';

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

/**
 * Verifies a plaintext password against a stored hash.
 * Handles both bcrypt hashes and the legacy h1_ checksum hashes.
 * Returns { valid, needsUpgrade } — callers should re-hash and save when needsUpgrade is true.
 */
export async function verifyPassword(
  password: string,
  stored: string
): Promise<{ valid: boolean; needsUpgrade: boolean }> {
  if (stored.startsWith(LEGACY_PREFIX)) {
    const valid = legacyHash(password) === stored;
    return { valid, needsUpgrade: valid };
  }
  const valid = await bcrypt.compare(password, stored);
  return { valid, needsUpgrade: false };
}

function legacyHash(password: string): string {
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return LEGACY_PREFIX + Math.abs(hash).toString(36);
}
