import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { z } from "zod";
import { prisma } from "@/lib/db/client";
import bcrypt from "bcryptjs";

export const credentialsProvider = Credentials({
  credentials: {
    email: { label: "Email", type: "email" },
    password: { label: "Password", type: "password" },
  },
  async authorize(credentials) {
    const parsed = z.object({
      email: z.string().email(),
      password: z.string().min(8),
    }).safeParse(credentials);

    if (!parsed.success) return null;

    const user = await prisma.user.findUnique({
      where: { email: parsed.data.email },
    });

    // Always run bcrypt to prevent timing-based user enumeration
    const DUMMY_HASH = "$2b$12$dummyhashfortimingnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnn";
    const passwordMatch = await bcrypt.compare(
      parsed.data.password,
      user?.passwordHash ?? DUMMY_HASH,
    );

    if (!user || !user.passwordHash || !passwordMatch) return null;

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      image: user.image,
    };
  },
});

export const googleProvider = Google({
  clientId: process.env.GOOGLE_CLIENT_ID!,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
});
