import { z } from "zod";
import { eq, desc } from "drizzle-orm";
import { createRouter, publicQuery, adminQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { testimonials } from "@db/schema";

export const testimonialRouter = createRouter({
  list: publicQuery.query(async () => {
    const db = getDb();
    return db.query.testimonials.findMany({
      where: eq(testimonials.featured, true),
      orderBy: [desc(testimonials.createdAt)],
      limit: 10,
    });
  }),

  listAdmin: adminQuery.query(async () => {
    const db = getDb();
    return db.query.testimonials.findMany({
      orderBy: [desc(testimonials.createdAt)],
    });
  }),

  create: adminQuery
    .input(
      z.object({
        name: z.string().min(1),
        company: z.string().optional(),
        role: z.string().optional(),
        content: z.string().min(1),
        rating: z.number().min(1).max(5).optional(),
        avatar: z.string().optional(),
        featured: z.boolean().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const result = await db.insert(testimonials).values(input);
      return { id: Number(result[0].insertId) };
    }),

  update: adminQuery
    .input(
      z.object({
        id: z.number(),
        name: z.string().min(1).optional(),
        company: z.string().optional(),
        role: z.string().optional(),
        content: z.string().min(1).optional(),
        rating: z.number().min(1).max(5).optional(),
        avatar: z.string().optional(),
        featured: z.boolean().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const { id, ...data } = input;
      await db.update(testimonials).set(data).where(eq(testimonials.id, id));
      return { success: true };
    }),

  delete: adminQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.delete(testimonials).where(eq(testimonials.id, input.id));
      return { success: true };
    }),
});
