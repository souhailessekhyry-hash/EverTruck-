import { z } from "zod";
import { eq } from "drizzle-orm";
import { createRouter, publicQuery, adminQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { partners } from "@db/schema";

export const partnerRouter = createRouter({
  list: publicQuery.query(async () => {
    const db = getDb();
    return db.query.partners.findMany({
      where: eq(partners.isActive, true),
    });
  }),

  listAdmin: adminQuery.query(async () => {
    const db = getDb();
    return db.query.partners.findMany({});
  }),

  create: adminQuery
    .input(
      z.object({
        name: z.string().min(1),
        logo: z.string().optional(),
        website: z.string().optional(),
        tier: z.enum(["platinum", "gold", "silver", "bronze"]).optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const result = await db.insert(partners).values(input);
      return { id: Number(result[0].insertId) };
    }),

  update: adminQuery
    .input(
      z.object({
        id: z.number(),
        name: z.string().min(1).optional(),
        logo: z.string().optional(),
        website: z.string().optional(),
        tier: z.enum(["platinum", "gold", "silver", "bronze"]).optional(),
        isActive: z.boolean().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const { id, ...data } = input;
      await db.update(partners).set(data).where(eq(partners.id, id));
      return { success: true };
    }),

  delete: adminQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.delete(partners).where(eq(partners.id, input.id));
      return { success: true };
    }),
});
