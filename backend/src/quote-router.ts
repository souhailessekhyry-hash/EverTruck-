import { z } from "zod";
import { eq, desc } from "drizzle-orm";
import { createRouter, publicQuery, adminQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { quoteRequests } from "@db/schema";

export const quoteRouter = createRouter({
  submit: publicQuery
    .input(
      z.object({
        name: z.string().min(1),
        email: z.string().email(),
        phone: z.string().optional(),
        company: z.string().optional(),
        origin: z.string().optional(),
        destination: z.string().optional(),
        cargoType: z.string().optional(),
        weight: z.string().optional(),
        dimensions: z.string().optional(),
        message: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const result = await db.insert(quoteRequests).values({
        ...input,
        weight: input.weight ? input.weight : undefined,
      });
      return { success: true, id: Number(result[0].insertId) };
    }),

  list: adminQuery.query(async () => {
    const db = getDb();
    return db.query.quoteRequests.findMany({
      orderBy: [desc(quoteRequests.createdAt)],
    });
  }),

  updateStatus: adminQuery
    .input(
      z.object({
        id: z.number(),
        status: z.enum(["new", "reviewing", "quoted", "accepted", "rejected"]),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.update(quoteRequests)
        .set({ status: input.status })
        .where(eq(quoteRequests.id, input.id));
      return { success: true };
    }),

  delete: adminQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.delete(quoteRequests).where(eq(quoteRequests.id, input.id));
      return { success: true };
    }),
});
