import { z } from "zod";
import { eq, desc } from "drizzle-orm";
import { createRouter, publicQuery, adminQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { invoices } from "@db/schema";
import { verifyJWT } from "./lib/auth-utils";

export const invoiceRouter = createRouter({
  list: publicQuery.query(async ({ ctx }) => {
    const authHeader = ctx.req.headers.get("authorization");
    const db = getDb();

    if (authHeader?.startsWith("Bearer ")) {
      try {
        const token = authHeader.replace("Bearer ", "");
        const payload = await verifyJWT(token);
        if (payload.role === "admin" || payload.role === "manager") {
          return db.query.invoices.findMany({
            with: { shipment: true, user: { columns: { id: true, name: true, email: true } } },
            orderBy: [desc(invoices.createdAt)],
          });
        }
        return db.query.invoices.findMany({
          where: eq(invoices.userId, payload.userId),
          with: { shipment: true },
          orderBy: [desc(invoices.createdAt)],
        });
      } catch {
        // fall through
      }
    }

    return db.query.invoices.findMany({
      orderBy: [desc(invoices.createdAt)],
      limit: 100,
    });
  }),

  getById: publicQuery
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const db = getDb();
      return db.query.invoices.findFirst({
        where: eq(invoices.id, input.id),
        with: { shipment: true, user: { columns: { id: true, name: true, email: true } } },
      });
    }),

  create: adminQuery
    .input(
      z.object({
        shipmentId: z.number(),
        userId: z.number(),
        amount: z.string(),
        tax: z.string().optional(),
        dueDate: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const amount = parseFloat(input.amount);
      const tax = input.tax ? parseFloat(input.tax) : 0;
      const total = amount + tax;

      const invoiceNumber = `INV-${Date.now()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;

      const result = await db.insert(invoices).values({
        invoiceNumber,
        shipmentId: input.shipmentId,
        userId: input.userId,
        amount: amount.toFixed(2),
        tax: tax.toFixed(2),
        total: total.toFixed(2),
        dueDate: input.dueDate ? new Date(input.dueDate) : undefined,
      });

      return { id: Number(result[0].insertId), invoiceNumber };
    }),

  updateStatus: adminQuery
    .input(
      z.object({
        id: z.number(),
        status: z.enum(["draft", "sent", "paid", "overdue", "cancelled"]),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const updates: Record<string, unknown> = { status: input.status };
      if (input.status === "paid") {
        updates.paidAt = new Date();
      }
      await db.update(invoices).set(updates).where(eq(invoices.id, input.id));
      return { success: true };
    }),

  delete: adminQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.delete(invoices).where(eq(invoices.id, input.id));
      return { success: true };
    }),
});
