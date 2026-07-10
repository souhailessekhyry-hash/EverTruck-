import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import { createRouter, publicQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { users } from "@db/schema";
import { hashPassword, verifyPassword, signJWT, verifyJWT } from "./lib/auth-utils";

export const localAuthRouter = createRouter({
  register: publicQuery
    .input(
      z.object({
        email: z.string().email(),
        password: z.string().min(6),
        firstName: z.string().min(1),
        lastName: z.string().min(1),
        phone: z.string().optional(),
        company: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const existing = await db.query.users.findFirst({
        where: eq(users.email, input.email),
      });
      if (existing) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Email already registered",
        });
      }

      const passwordHash = await hashPassword(input.password);
      const result = await db.insert(users).values({
        email: input.email,
        passwordHash,
        firstName: input.firstName,
        lastName: input.lastName,
        name: `${input.firstName} ${input.lastName}`,
        phone: input.phone,
        company: input.company,
        role: "user",
      });

      const userId = Number(result[0].insertId);
      const token = await signJWT({ userId, email: input.email, role: "user" });

      return {
        token,
        user: {
          id: userId,
          email: input.email,
          name: `${input.firstName} ${input.lastName}`,
          firstName: input.firstName,
          lastName: input.lastName,
          role: "user" as const,
        },
      };
    }),

  login: publicQuery
    .input(
      z.object({
        email: z.string().email(),
        password: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const user = await db.query.users.findFirst({
        where: eq(users.email, input.email),
      });

      if (!user || !user.passwordHash) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Invalid email or password",
        });
      }

      const valid = await verifyPassword(input.password, user.passwordHash);
      if (!valid) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Invalid email or password",
        });
      }

      const token = await signJWT({
        userId: user.id,
        email: user.email!,
        role: user.role,
      });

      return {
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
        },
      };
    }),

  me: publicQuery.query(async ({ ctx }) => {
    const authHeader = ctx.req.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return null;
    }

    const token = authHeader.replace("Bearer ", "");
    try {
      const payload = await verifyJWT(token);
      const db = getDb();
      const user = await db.query.users.findFirst({
        where: eq(users.id, payload.userId),
      });
      if (!user || !user.isActive) return null;

      return {
        id: user.id,
        email: user.email,
        name: user.name,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        avatar: user.avatar,
        phone: user.phone,
        company: user.company,
      };
    } catch {
      return null;
    }
  }),

  updateProfile: publicQuery
    .input(
      z.object({
        firstName: z.string().min(1).optional(),
        lastName: z.string().min(1).optional(),
        phone: z.string().optional(),
        company: z.string().optional(),
        avatar: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const authHeader = ctx.req.headers.get("authorization");
      if (!authHeader?.startsWith("Bearer ")) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }

      const token = authHeader.replace("Bearer ", "");
      const payload = await verifyJWT(token);
      const db = getDb();

      const updates: Record<string, unknown> = { ...input };
      if (input.firstName || input.lastName) {
        const current = await db.query.users.findFirst({
          where: eq(users.id, payload.userId),
        });
        const firstName = input.firstName ?? current?.firstName ?? "";
        const lastName = input.lastName ?? current?.lastName ?? "";
        updates.name = `${firstName} ${lastName}`.trim();
      }

      await db.update(users).set(updates).where(eq(users.id, payload.userId));
      return { success: true };
    }),

  changePassword: publicQuery
    .input(
      z.object({
        currentPassword: z.string(),
        newPassword: z.string().min(6),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const authHeader = ctx.req.headers.get("authorization");
      if (!authHeader?.startsWith("Bearer ")) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }

      const token = authHeader.replace("Bearer ", "");
      const payload = await verifyJWT(token);
      const db = getDb();

      const user = await db.query.users.findFirst({
        where: eq(users.id, payload.userId),
      });
      if (!user?.passwordHash) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "No password set" });
      }

      const valid = await verifyPassword(input.currentPassword, user.passwordHash);
      if (!valid) {
        throw new TRPCError({ code: "UNAUTHORIZED", message: "Current password is incorrect" });
      }

      const newHash = await hashPassword(input.newPassword);
      await db.update(users).set({ passwordHash: newHash }).where(eq(users.id, payload.userId));
      return { success: true };
    }),
});
