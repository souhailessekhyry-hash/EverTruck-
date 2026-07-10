import { z } from "zod";
import { eq, desc } from "drizzle-orm";
import { createRouter, publicQuery, adminQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { shipments, tracking } from "@db/schema";
import { verifyJWT } from "./lib/auth-utils";

function generateTrackingNumber(): string {
  const prefix = "EVT";
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  const timestamp = Date.now().toString(36).toUpperCase().slice(-4);
  return `${prefix}-${timestamp}-${random}`;
}

export const shipmentRouter = createRouter({
  list: publicQuery.query(async ({ ctx }) => {
    const authHeader = ctx.req.headers.get("authorization");
    const db = getDb();

    if (authHeader?.startsWith("Bearer ")) {
      try {
        const token = authHeader.replace("Bearer ", "");
        const payload = await verifyJWT(token);
        if (payload.role === "admin" || payload.role === "manager") {
          return db.query.shipments.findMany({
            orderBy: [desc(shipments.createdAt)],
          });
        }
        return db.query.shipments.findMany({
          where: eq(shipments.userId, payload.userId),
          orderBy: [desc(shipments.createdAt)],
        });
      } catch {
        // fall through to public
      }
    }

    return db.query.shipments.findMany({
      orderBy: [desc(shipments.createdAt)],
      limit: 100,
    });
  }),

  getByTracking: publicQuery
    .input(z.object({ trackingNumber: z.string() }))
    .query(async ({ input }) => {
      const db = getDb();
      const shipment = await db.query.shipments.findFirst({
        where: eq(shipments.trackingNumber, input.trackingNumber),
      });
      if (!shipment) return null;

      const events = await db.query.tracking.findMany({
        where: eq(tracking.shipmentId, shipment.id),
        orderBy: [desc(tracking.timestamp)],
      });

      return { ...shipment, events };
    }),

  create: adminQuery
    .input(
      z.object({
        userId: z.number().optional(),
        origin: z.string().min(1),
        destination: z.string().min(1),
        weight: z.string().optional(),
        dimensions: z.string().optional(),
        priority: z.enum(["low", "normal", "high", "urgent"]).optional(),
        estimatedDelivery: z.string().optional(),
        notes: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const trackingNumber = generateTrackingNumber();
      const result = await db.insert(shipments).values({
        trackingNumber,
        userId: input.userId,
        origin: input.origin,
        destination: input.destination,
        weight: input.weight ? input.weight : undefined,
        dimensions: input.dimensions,
        priority: input.priority || "normal",
        estimatedDelivery: input.estimatedDelivery ? new Date(input.estimatedDelivery) as unknown as undefined : undefined,
        notes: input.notes,
      });

      // Create initial tracking event
      const shipmentId = Number(result[0].insertId);
      await db.insert(tracking).values({
        shipmentId,
        location: input.origin,
        status: "pending",
        description: "Shipment created, awaiting pickup",
      });

      return { id: shipmentId, trackingNumber };
    }),

  updateStatus: adminQuery
    .input(
      z.object({
        id: z.number(),
        status: z.enum([
          "pending", "picked_up", "in_transit", "out_for_delivery",
          "delivered", "cancelled", "on_hold",
        ]),
        location: z.string(),
        description: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const { id, status, location, description } = input;

      await db.update(shipments).set({ status }).where(eq(shipments.id, id));
      await db.insert(tracking).values({
        shipmentId: id,
        location,
        status,
        description: description || `Status updated to ${status}`,
      });

      return { success: true };
    }),

  delete: adminQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.delete(tracking).where(eq(tracking.shipmentId, input.id));
      await db.delete(shipments).where(eq(shipments.id, input.id));
      return { success: true };
    }),
});
