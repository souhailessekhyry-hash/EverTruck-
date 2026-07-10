import {
  mysqlTable,
  varchar,
  text,
  timestamp,
  bigint,
  int,
  boolean,
  decimal,
  date,
} from "drizzle-orm/mysql-core";

// ============================================
// USERS (Auth + Client Portal)
// ============================================
export const users = mysqlTable("users", {
  id: bigint("id", { mode: "number" }).autoincrement().primaryKey(),
  unionId: varchar("unionId", { length: 255 }).unique(),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 320 }),
  avatar: text("avatar"),
  role: varchar("role", { length: 50 }).default("user").notNull().$type<"user" | "admin" | "manager">(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
  lastSignInAt: timestamp("lastSignInAt").defaultNow().notNull(),
  // Local auth fields
  passwordHash: varchar("password_hash", { length: 255 }),
  firstName: varchar("first_name", { length: 100 }),
  lastName: varchar("last_name", { length: 100 }),
  phone: varchar("phone", { length: 50 }),
  company: varchar("company", { length: 200 }),
  isActive: boolean("is_active").default(true),
  emailVerified: boolean("email_verified").default(false),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// ============================================
// VEHICLES (Fleet Management)
// ============================================
export const vehicles = mysqlTable("vehicles", {
  id: bigint("id", { mode: "number" }).autoincrement().primaryKey(),
  name: varchar("name", { length: 200 }).notNull(),
  type: varchar("type", { length: 50 }).default("truck").$type<"truck" | "van" | "trailer" | "forklift" | "crane">(),
  licensePlate: varchar("license_plate", { length: 50 }).unique(),
  capacity: decimal("capacity", { precision: 10, scale: 2 }),
  year: int("year"),
  status: varchar("status", { length: 50 }).default("available").$type<"active" | "maintenance" | "retired" | "available">(),
  image: varchar("image", { length: 500 }),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow(),
});

export type Vehicle = typeof vehicles.$inferSelect;
export type InsertVehicle = typeof vehicles.$inferInsert;

// ============================================
// DRIVERS
// ============================================
export const drivers = mysqlTable("drivers", {
  id: bigint("id", { mode: "number" }).autoincrement().primaryKey(),
  firstName: varchar("first_name", { length: 100 }).notNull(),
  lastName: varchar("last_name", { length: 100 }).notNull(),
  licenseNumber: varchar("license_number", { length: 100 }).unique(),
  licenseType: varchar("license_type", { length: 50 }),
  phone: varchar("phone", { length: 50 }),
  email: varchar("email", { length: 255 }),
  status: varchar("status", { length: 50 }).default("active").$type<"active" | "off_duty" | "on_leave" | "suspended">(),
  avatar: varchar("avatar", { length: 500 }),
  rating: decimal("rating", { precision: 3, scale: 2 }).default("5.00"),
  createdAt: timestamp("created_at").defaultNow(),
});

export type Driver = typeof drivers.$inferSelect;
export type InsertDriver = typeof drivers.$inferInsert;

// ============================================
// SHIPMENTS (Core Logistics)
// ============================================
export const shipments = mysqlTable("shipments", {
  id: bigint("id", { mode: "number" }).autoincrement().primaryKey(),
  trackingNumber: varchar("tracking_number", { length: 100 }).notNull().unique(),
  userId: bigint("user_id", { mode: "number" }).references(() => users.id),
  origin: varchar("origin", { length: 300 }).notNull(),
  destination: varchar("destination", { length: 300 }).notNull(),
  weight: decimal("weight", { precision: 10, scale: 2 }),
  dimensions: varchar("dimensions", { length: 100 }),
  status: varchar("status", { length: 50 }).default("pending").$type<"pending" | "picked_up" | "in_transit" | "out_for_delivery" | "delivered" | "cancelled" | "on_hold">(),
  priority: varchar("priority", { length: 50 }).default("normal").$type<"low" | "normal" | "high" | "urgent">(),
  estimatedDelivery: date("estimated_delivery"),
  actualDelivery: date("actual_delivery"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
});

export type Shipment = typeof shipments.$inferSelect;
export type InsertShipment = typeof shipments.$inferInsert;

// ============================================
// TRACKING (Shipment Events)
// ============================================
export const tracking = mysqlTable("tracking", {
  id: bigint("id", { mode: "number" }).autoincrement().primaryKey(),
  shipmentId: bigint("shipment_id", { mode: "number" }).references(() => shipments.id),
  location: varchar("location", { length: 300 }).notNull(),
  status: varchar("status", { length: 100 }).notNull(),
  description: text("description"),
  timestamp: timestamp("timestamp").defaultNow(),
  latitude: decimal("latitude", { precision: 10, scale: 8 }),
  longitude: decimal("longitude", { precision: 11, scale: 8 }),
});

export type Tracking = typeof tracking.$inferSelect;
export type InsertTracking = typeof tracking.$inferInsert;

// ============================================
// INVOICES
// ============================================
export const invoices = mysqlTable("invoices", {
  id: bigint("id", { mode: "number" }).autoincrement().primaryKey(),
  invoiceNumber: varchar("invoice_number", { length: 100 }).unique(),
  shipmentId: bigint("shipment_id", { mode: "number" }).references(() => shipments.id),
  userId: bigint("user_id", { mode: "number" }).references(() => users.id),
  amount: decimal("amount", { precision: 12, scale: 2 }).notNull(),
  tax: decimal("tax", { precision: 12, scale: 2 }).default("0"),
  total: decimal("total", { precision: 12, scale: 2 }).notNull(),
  status: varchar("status", { length: 50 }).default("draft").$type<"draft" | "sent" | "paid" | "overdue" | "cancelled">(),
  dueDate: date("due_date"),
  paidAt: timestamp("paid_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

export type Invoice = typeof invoices.$inferSelect;
export type InsertInvoice = typeof invoices.$inferInsert;

// ============================================
// BLOG CATEGORIES
// ============================================
export const blogCategories = mysqlTable("blog_categories", {
  id: bigint("id", { mode: "number" }).autoincrement().primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  slug: varchar("slug", { length: 100 }).unique(),
  description: text("description"),
});

export type BlogCategory = typeof blogCategories.$inferSelect;
export type InsertBlogCategory = typeof blogCategories.$inferInsert;

// ============================================
// BLOG POSTS
// ============================================
export const blogPosts = mysqlTable("blog_posts", {
  id: bigint("id", { mode: "number" }).autoincrement().primaryKey(),
  title: varchar("title", { length: 300 }).notNull(),
  slug: varchar("slug", { length: 300 }).unique(),
  excerpt: text("excerpt"),
  content: text("content").notNull(),
  coverImage: varchar("cover_image", { length: 500 }),
  categoryId: bigint("category_id", { mode: "number" }).references(() => blogCategories.id),
  authorId: bigint("author_id", { mode: "number" }).references(() => users.id),
  published: boolean("published").default(false),
  featured: boolean("featured").default(false),
  viewCount: int("view_count").default(0),
  publishedAt: timestamp("published_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

export type BlogPost = typeof blogPosts.$inferSelect;
export type InsertBlogPost = typeof blogPosts.$inferInsert;

// ============================================
// FAQS
// ============================================
export const faqs = mysqlTable("faqs", {
  id: bigint("id", { mode: "number" }).autoincrement().primaryKey(),
  question: text("question").notNull(),
  answer: text("answer").notNull(),
  category: varchar("category", { length: 100 }),
  sortOrder: int("sort_order").default(0),
  isActive: boolean("is_active").default(true),
});

export type Faq = typeof faqs.$inferSelect;
export type InsertFaq = typeof faqs.$inferInsert;

// ============================================
// TESTIMONIALS
// ============================================
export const testimonials = mysqlTable("testimonials", {
  id: bigint("id", { mode: "number" }).autoincrement().primaryKey(),
  name: varchar("name", { length: 200 }).notNull(),
  company: varchar("company", { length: 200 }),
  role: varchar("role", { length: 100 }),
  content: text("content").notNull(),
  rating: int("rating").default(5),
  avatar: varchar("avatar", { length: 500 }),
  featured: boolean("featured").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export type Testimonial = typeof testimonials.$inferSelect;
export type InsertTestimonial = typeof testimonials.$inferInsert;

// ============================================
// CONTACT MESSAGES
// ============================================
export const contactMessages = mysqlTable("contact_messages", {
  id: bigint("id", { mode: "number" }).autoincrement().primaryKey(),
  name: varchar("name", { length: 200 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 50 }),
  subject: varchar("subject", { length: 200 }),
  message: text("message").notNull(),
  status: varchar("status", { length: 50 }).default("new").$type<"new" | "read" | "replied" | "archived">(),
  createdAt: timestamp("created_at").defaultNow(),
});

export type ContactMessage = typeof contactMessages.$inferSelect;
export type InsertContactMessage = typeof contactMessages.$inferInsert;

// ============================================
// QUOTE REQUESTS
// ============================================
export const quoteRequests = mysqlTable("quote_requests", {
  id: bigint("id", { mode: "number" }).autoincrement().primaryKey(),
  name: varchar("name", { length: 200 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 50 }),
  company: varchar("company", { length: 200 }),
  origin: varchar("origin", { length: 300 }),
  destination: varchar("destination", { length: 300 }),
  cargoType: varchar("cargo_type", { length: 100 }),
  weight: decimal("weight", { precision: 10, scale: 2 }),
  dimensions: varchar("dimensions", { length: 100 }),
  message: text("message"),
  status: varchar("status", { length: 50 }).default("new").$type<"new" | "reviewing" | "quoted" | "accepted" | "rejected">(),
  createdAt: timestamp("created_at").defaultNow(),
});

export type QuoteRequest = typeof quoteRequests.$inferSelect;
export type InsertQuoteRequest = typeof quoteRequests.$inferInsert;

// ============================================
// PARTNERS
// ============================================
export const partners = mysqlTable("partners", {
  id: bigint("id", { mode: "number" }).autoincrement().primaryKey(),
  name: varchar("name", { length: 200 }).notNull(),
  logo: varchar("logo", { length: 500 }),
  website: varchar("website", { length: 300 }),
  tier: varchar("tier", { length: 50 }).default("silver").$type<"platinum" | "gold" | "silver" | "bronze">(),
  isActive: boolean("is_active").default(true),
});

export type Partner = typeof partners.$inferSelect;
export type InsertPartner = typeof partners.$inferInsert;

// ============================================
// MEDIA LIBRARY
// ============================================
export const mediaLibrary = mysqlTable("media_library", {
  id: bigint("id", { mode: "number" }).autoincrement().primaryKey(),
  filename: varchar("filename", { length: 500 }).notNull(),
  originalName: varchar("original_name", { length: 500 }),
  mimeType: varchar("mime_type", { length: 100 }),
  size: bigint("size", { mode: "number" }),
  url: varchar("url", { length: 1000 }).notNull(),
  folder: varchar("folder", { length: 200 }).default("uploads"),
  uploadedBy: bigint("uploaded_by", { mode: "number" }).references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
});

export type Media = typeof mediaLibrary.$inferSelect;
export type InsertMedia = typeof mediaLibrary.$inferInsert;

// ============================================
// SETTINGS (Key-Value Store)
// ============================================
export const settings = mysqlTable("settings", {
  id: bigint("id", { mode: "number" }).autoincrement().primaryKey(),
  key: varchar("key", { length: 200 }).notNull().unique(),
  value: text("value"),
  type: varchar("type", { length: 50 }).default("string").$type<"string" | "number" | "boolean" | "json">(),
});

export type Setting = typeof settings.$inferSelect;
export type InsertSetting = typeof settings.$inferInsert;

// ============================================
// NOTIFICATIONS
// ============================================
export const notifications = mysqlTable("notifications", {
  id: bigint("id", { mode: "number" }).autoincrement().primaryKey(),
  userId: bigint("user_id", { mode: "number" }).references(() => users.id),
  title: varchar("title", { length: 300 }).notNull(),
  message: text("message"),
  type: varchar("type", { length: 50 }).default("info").$type<"info" | "success" | "warning" | "error">(),
  read: boolean("read").default(false),
  link: varchar("link", { length: 500 }),
  createdAt: timestamp("created_at").defaultNow(),
});

export type Notification = typeof notifications.$inferSelect;
export type InsertNotification = typeof notifications.$inferInsert;
