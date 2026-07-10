import { relations } from "drizzle-orm";
import {
  users,
  shipments,
  tracking,
  invoices,
  blogCategories,
  blogPosts,
  notifications,
  mediaLibrary,
} from "./schema";

export const usersRelations = relations(users, ({ many }) => ({
  shipments: many(shipments),
  invoices: many(invoices),
  blogPosts: many(blogPosts),
  notifications: many(notifications),
  media: many(mediaLibrary),
}));

export const shipmentsRelations = relations(shipments, ({ one, many }) => ({
  user: one(users, { fields: [shipments.userId], references: [users.id] }),
  tracking: many(tracking),
  invoice: one(invoices),
}));

export const trackingRelations = relations(tracking, ({ one }) => ({
  shipment: one(shipments, { fields: [tracking.shipmentId], references: [shipments.id] }),
}));

export const invoicesRelations = relations(invoices, ({ one }) => ({
  shipment: one(shipments, { fields: [invoices.shipmentId], references: [shipments.id] }),
  user: one(users, { fields: [invoices.userId], references: [users.id] }),
}));

export const blogCategoriesRelations = relations(blogCategories, ({ many }) => ({
  posts: many(blogPosts),
}));

export const blogPostsRelations = relations(blogPosts, ({ one }) => ({
  category: one(blogCategories, { fields: [blogPosts.categoryId], references: [blogCategories.id] }),
  author: one(users, { fields: [blogPosts.authorId], references: [users.id] }),
}));

export const notificationsRelations = relations(notifications, ({ one }) => ({
  user: one(users, { fields: [notifications.userId], references: [users.id] }),
}));

export const mediaLibraryRelations = relations(mediaLibrary, ({ one }) => ({
  uploader: one(users, { fields: [mediaLibrary.uploadedBy], references: [users.id] }),
}));
