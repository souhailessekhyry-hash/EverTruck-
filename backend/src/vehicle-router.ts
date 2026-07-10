import { z } from "zod";
import { eq, desc } from "drizzle-orm";
import { createRouter, publicQuery, adminQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { vehicles } from "@db/schema";

export const vehicleRouter = createRouter({
  list: publicQuery.query(async () => {
    const db = getDb();
    return db.query.vehicles.findMany({
      orderBy: [desc(vehicles.createdAt)],
    });
  }),

  getById: publicQuery
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const db = getDb();
      return db.query.vehicles.findFirst({
        where: eq(vehicles.id, input.id),
      });
    }),

  create: adminQuery
    .input(
      z.object({
        name: z.string().min(1),
        type: z.enum(["truck", "van", "trailer", "forklift", "crane"]).optional(),
        licensePlate: z.string().optional(),
        capacity: z.string().optional(),
        year: z.number().optional(),
        status: z.enum(["active", "maintenance", "retired", "available"]).optional(),
        image: z.string().optional(),
        description: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const result = await db.insert(vehicles).values({
        ...input,
        capacity: input.capacity ? input.capacity : undefined,
      });
      return { id: Number(result[0].insertId) };
    }),

  update: adminQuery
    .input(
      z.object({
        id: z.number(),
        name: z.string().min(1).optional(),
        type: z.enum(["truck", "van", "trailer", "forklift", "crane"]).optional(),
        licensePlate: z.string().optional(),
        capacity: z.string().optional(),
        year: z.number().optional(),
        status: z.enum(["active", "maintenance", "retired", "available"]).optional(),
        image: z.string().optional(),
        description: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const { id, ...data } = input;
      await db.update(vehicles).set(data).where(eq(vehicles.id, id));
      return { success: true };
    }),

  delete: adminQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.delete(vehicles).where(eq(vehicles.id, input.id));
      return { success: true };
    }),
});
