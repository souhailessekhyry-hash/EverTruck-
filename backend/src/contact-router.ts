import { z } from "zod";
import { eq, desc } from "drizzle-orm";
import { createRouter, publicQuery, adminQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { contactMessages } from "@db/schema";

export const contactRouter = createRouter({
  submit: publicQuery
    .input(
      z.object({
        name: z.string().min(1),
        email: z.string().email(),
        phone: z.string().optional(),
        subject: z.string().optional(),
        message: z.string().min(1),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const result = await db.insert(contactMessages).values(input);
      return { success: true, id: Number(result[0].insertId) };
    }),

  list: adminQuery.query(async () => {
    const db = getDb();
    return db.query.contactMessages.findMany({
      orderBy: [desc(contactMessages.createdAt)],
    });
  }),

  updateStatus: adminQuery
    .input(
      z.object({
        id: z.number(),
        status: z.enum(["new", "read", "replied", "archived"]),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.update(contactMessages)
        .set({ status: input.status })
        .where(eq(contactMessages.id, input.id));
      return { success: true };
    }),

  delete: adminQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.delete(contactMessages).where(eq(contactMessages.id, input.id));
      return { success: true };
    }),
});
