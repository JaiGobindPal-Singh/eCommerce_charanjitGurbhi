import bcrypt from 'bcrypt';

const DEFAULT_SALT_ROUNDS = 10;

/**
 * Generate a bcrypt hash for the given plain text.
 * @param {string} plain - The plain text to hash (e.g., a password).
 * @param {number} [saltRounds=DEFAULT_SALT_ROUNDS] - Optional salt rounds.
 * @returns {Promise<string>} - Resolves to the hash.
 */
export async function generateHash(plain, saltRounds = DEFAULT_SALT_ROUNDS) {
	if (typeof plain !== 'string') throw new TypeError('plain must be a string');
	const salt = await bcrypt.genSalt(saltRounds);
	return bcrypt.hash(plain, salt);
}

/**
 * Verify a plain text against a bcrypt hash.
 * @param {string} plain - The plain text to verify.
 * @param {string} hash - The bcrypt hash to compare against.
 * @returns {Promise<boolean>} - Resolves to true if match, false otherwise.
 */
export async function verifyHash(plain, hash) {
	if (typeof plain !== 'string' || typeof hash !== 'string') return false;
	return bcrypt.compare(plain, hash);
}


