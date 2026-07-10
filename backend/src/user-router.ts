import { z } from "zod";
import { eq, desc } from "drizzle-orm";
import { createRouter, adminQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { users } from "@db/schema";

export const userRouter = createRouter({
  list: adminQuery.query(async () => {
    const db = getDb();
    return db.query.users.findMany({
      columns: { passwordHash: false },
      orderBy: [desc(users.createdAt)],
    });
  }),

  getById: adminQuery
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const db = getDb();
      return db.query.users.findFirst({
        where: eq(users.id, input.id),
        columns: { passwordHash: false },
      });
    }),

  updateRole: adminQuery
    .input(
      z.object({
        id: z.number(),
        role: z.enum(["user", "admin", "manager"]),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.update(users).set({ role: input.role }).where(eq(users.id, input.id));
      return { success: true };
    }),

  toggleActive: adminQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      const user = await db.query.users.findFirst({
        where: eq(users.id, input.id),
      });
      if (!user) throw new Error("User not found");
      await db.update(users)
        .set({ isActive: !user.isActive })
        .where(eq(users.id, input.id));
      return { success: true, isActive: !user.isActive };
    }),

  delete: adminQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.delete(users).where(eq(users.id, input.id));
      return { success: true };
    }),
});
