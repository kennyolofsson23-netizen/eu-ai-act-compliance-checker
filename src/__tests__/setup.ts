// Global test setup — runs before any test file is imported.
// Sets required environment variables so modules that validate them at load
// time (e.g. src/lib/auth/config.ts) don't throw during test runs.
process.env.AUTH_SECRET = "test-secret-for-unit-tests-only";
process.env.NEXTAUTH_SECRET = "test-secret-for-unit-tests-only";
