import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

/**
 * @libsql/client does not accept the `./` prefix on `file:` URLs.
 * Strip it so that `file:./prisma/dev.db` becomes `file:prisma/dev.db`.
 */
function normaliseLibSqlUrl(url: string): string {
  if (url.startsWith("file:./")) return `file:${url.slice(7)}`;
  return url;
}

function createPrismaClient() {
  const url = normaliseLibSqlUrl(
    process.env.DATABASE_URL ?? "file:prisma/dev.db",
  );
  const adapter = new PrismaLibSql({ url });
  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;
