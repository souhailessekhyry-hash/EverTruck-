import { authRouter } from "./auth-router";
import { localAuthRouter } from "./local-auth-router";
import { vehicleRouter } from "./vehicle-router";
import { shipmentRouter } from "./shipment-router";
import { blogRouter, blogCategoryRouter } from "./blog-router";
import { faqRouter } from "./faq-router";
import { testimonialRouter } from "./testimonial-router";
import { contactRouter } from "./contact-router";
import { quoteRouter } from "./quote-router";
import { partnerRouter } from "./partner-router";
import { userRouter } from "./user-router";
import { notificationRouter } from "./notification-router";
import { invoiceRouter } from "./invoice-router";
import { statsRouter } from "./stats-router";
import { createRouter, publicQuery } from "./middleware";

export const appRouter = createRouter({
  ping: publicQuery.query(() => ({ ok: true, ts: Date.now() })),
  auth: authRouter,
  localAuth: localAuthRouter,
  vehicle: vehicleRouter,
  shipment: shipmentRouter,
  blog: blogRouter,
  blogCategory: blogCategoryRouter,
  faq: faqRouter,
  testimonial: testimonialRouter,
  contact: contactRouter,
  quote: quoteRouter,
  partner: partnerRouter,
  user: userRouter,
  notification: notificationRouter,
  invoice: invoiceRouter,
  stats: statsRouter,
});

export type AppRouter = typeof appRouter;
