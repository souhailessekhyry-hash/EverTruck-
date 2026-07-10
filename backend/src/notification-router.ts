import { z } from "zod";
import { eq, desc } from "drizzle-orm";
import { createRouter, publicQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { notifications } from "@db/schema";
import { verifyJWT } from "./lib/auth-utils";

export const notificationRouter = createRouter({
  list: publicQuery.query(async ({ ctx }) => {
    const authHeader = ctx.req.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) return [];

    const token = authHeader.replace("Bearer ", "");
    try {
      const payload = await verifyJWT(token);
      const db = getDb();
      return db.query.notifications.findMany({
        where: eq(notifications.userId, payload.userId),
        orderBy: [desc(notifications.createdAt)],
        limit: 20,
      });
    } catch {
      return [];
    }
  }),

  create: publicQuery
    .input(
      z.object({
        userId: z.number(),
        title: z.string().min(1),
        message: z.string().optional(),
        type: z.enum(["info", "success", "warning", "error"]).optional(),
        link: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const result = await db.insert(notifications).values(input);
      return { id: Number(result[0].insertId) };
    }),

  markRead: publicQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.update(notifications)
        .set({ read: true })
        .where(eq(notifications.id, input.id));
      return { success: true };
    }),

  markAllRead: publicQuery.mutation(async ({ ctx }) => {
    const authHeader = ctx.req.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) return { success: false };

    const token = authHeader.replace("Bearer ", "");
    try {
      const payload = await verifyJWT(token);
      const db = getDb();
      await db.update(notifications)
        .set({ read: true })
        .where(eq(notifications.userId, payload.userId));
      return { success: true };
    } catch {
      return { success: false };
    }
  }),
});
