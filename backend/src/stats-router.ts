import { sql, count, sum } from "drizzle-orm";
import { createRouter, adminQuery } from "./middleware";
import { getDb } from "./queries/connection";
import {
  users,
  shipments,
  vehicles,
  drivers,
  invoices,
  contactMessages,
  quoteRequests,
  blogPosts,
} from "@db/schema";

export const statsRouter = createRouter({
  dashboard: adminQuery.query(async () => {
    const db = getDb();

    const [
      totalUsers,
      totalShipments,
      totalVehicles,
      totalDrivers,
      totalRevenue,
      pendingContacts,
      pendingQuotes,
      totalBlogPosts,
    ] = await Promise.all([
      db.select({ count: count() }).from(users),
      db.select({ count: count() }).from(shipments),
      db.select({ count: count() }).from(vehicles),
      db.select({ count: count() }).from(drivers),
      db.select({ total: sum(invoices.total) }).from(invoices).where(sql`${invoices.status} = 'paid'`),
      db.select({ count: count() }).from(contactMessages).where(sql`${contactMessages.status} = 'new'`),
      db.select({ count: count() }).from(quoteRequests).where(sql`${quoteRequests.status} = 'new'`),
      db.select({ count: count() }).from(blogPosts),
    ]);

    // Get recent shipments
    const recentShipments = await db.query.shipments.findMany({
      limit: 5,
      orderBy: [sql`${shipments.createdAt} DESC`],
    });

    // Get shipment status breakdown
    const shipmentStatusBreakdown = await db
      .select({
        status: shipments.status,
        count: count(),
      })
      .from(shipments)
      .groupBy(shipments.status);

    return {
      counts: {
        users: totalUsers[0]?.count || 0,
        shipments: totalShipments[0]?.count || 0,
        vehicles: totalVehicles[0]?.count || 0,
        drivers: totalDrivers[0]?.count || 0,
        revenue: totalRevenue[0]?.total || "0",
        pendingContacts: pendingContacts[0]?.count || 0,
        pendingQuotes: pendingQuotes[0]?.count || 0,
        blogPosts: totalBlogPosts[0]?.count || 0,
      },
      recentShipments,
      shipmentStatusBreakdown,
    };
  }),
});
