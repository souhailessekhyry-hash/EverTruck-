import { z } from "zod";
import { eq, asc } from "drizzle-orm";
import { createRouter, publicQuery, adminQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { faqs } from "@db/schema";

export const faqRouter = createRouter({
  list: publicQuery.query(async () => {
    const db = getDb();
    return db.query.faqs.findMany({
      where: eq(faqs.isActive, true),
      orderBy: [asc(faqs.sortOrder), asc(faqs.id)],
    });
  }),

  listAdmin: adminQuery.query(async () => {
    const db = getDb();
    return db.query.faqs.findMany({
      orderBy: [asc(faqs.sortOrder)],
    });
  }),

  create: adminQuery
    .input(
      z.object({
        question: z.string().min(1),
        answer: z.string().min(1),
        category: z.string().optional(),
        sortOrder: z.number().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const result = await db.insert(faqs).values(input);
      return { id: Number(result[0].insertId) };
    }),

  update: adminQuery
    .input(
      z.object({
        id: z.number(),
        question: z.string().min(1).optional(),
        answer: z.string().min(1).optional(),
        category: z.string().optional(),
        sortOrder: z.number().optional(),
        isActive: z.boolean().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const { id, ...data } = input;
      await db.update(faqs).set(data).where(eq(faqs.id, id));
      return { success: true };
    }),

  delete: adminQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.delete(faqs).where(eq(faqs.id, input.id));
      return { success: true };
    }),
});
