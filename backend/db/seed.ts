import { getDb } from "../src/queries/connection";
import { hashPassword } from "../src/lib/auth-utils";
import {
  users,
  vehicles,
  drivers,
  shipments,
  tracking,
  blogCategories,
  blogPosts,
  faqs,
  testimonials,
  partners,
  settings,
  invoices,
} from "./schema";

async function seed() {
  const db = getDb();
  try {
    const existingUsers = await db.select().from(users).limit(1);
    if (existingUsers && existingUsers.length > 0) {
      console.log("Database already seeded with users! Skipping initial seed.");
      return;
    }
  } catch (err) {
    console.log("Checking database schema...", err);
  }
  console.log("Seeding database...");

  // Seed admin user
  const adminPassword = await hashPassword("admin123");
  await db.insert(users).values({
    email: "admin@evertruck.com",
    passwordHash: adminPassword,
    firstName: "Admin",
    lastName: "User",
    name: "Admin User",
    role: "admin",
    isActive: true,
    emailVerified: true,
  });
  console.log("Admin user created: admin@evertruck.com / admin123");

  // Seed test user
  const userPassword = await hashPassword("user123");
  await db.insert(users).values({
    email: "user@evertruck.com",
    passwordHash: userPassword,
    firstName: "John",
    lastName: "Doe",
    name: "John Doe",
    role: "user",
    isActive: true,
    emailVerified: true,
    phone: "+1 555-0101",
    company: "Acme Corp",
  });
  console.log("Test user created: user@evertruck.com / user123");

  // Seed vehicles
  await db.insert(vehicles).values([
    { name: "Freightliner Cascadia", type: "truck", licensePlate: "EVT-1001", capacity: "40.00", year: 2023, status: "active", description: "Heavy-duty long-haul truck with advanced aerodynamics" },
    { name: "Volvo VNL 860", type: "truck", licensePlate: "EVT-1002", capacity: "36.00", year: 2024, status: "active", description: "Premium sleeper cab for extended routes" },
    { name: "Mercedes Sprinter", type: "van", licensePlate: "EVT-2001", capacity: "3.50", year: 2023, status: "active", description: "Urban delivery van with GPS tracking" },
    { name: "Ford Transit", type: "van", licensePlate: "EVT-2002", capacity: "4.20", year: 2024, status: "available", description: "Versatile cargo van for city logistics" },
    { name: "Great Dane Everest", type: "trailer", licensePlate: "EVT-3001", capacity: "45.00", year: 2022, status: "active", description: "Refrigerated trailer for temperature-sensitive cargo" },
    { name: "Toyota Forklift 8FGU25", type: "forklift", licensePlate: "EVT-4001", capacity: "2.50", year: 2023, status: "active", description: "Warehouse forklift with precision controls" },
    { name: "Liebherr LTM 1090", type: "crane", licensePlate: "EVT-5001", capacity: "90.00", year: 2022, status: "active", description: "All-terrain mobile crane for heavy lifting" },
    { name: "Peterbilt 579", type: "truck", licensePlate: "EVT-1003", capacity: "38.00", year: 2024, status: "maintenance", description: "Ultra-loft sleeper with fuel efficiency" },
  ]);
  console.log("Vehicles seeded");

  // Seed drivers
  await db.insert(drivers).values([
    { firstName: "Robert", lastName: "Johnson", licenseNumber: "CDL-782341", licenseType: "Class A", phone: "+1 555-0201", email: "r.johnson@evertruck.com", status: "active", rating: "4.90" },
    { firstName: "Maria", lastName: "Garcia", licenseNumber: "CDL-892452", licenseType: "Class A", phone: "+1 555-0202", email: "m.garcia@evertruck.com", status: "active", rating: "4.95" },
    { firstName: "James", lastName: "Wilson", licenseNumber: "CDL-903563", licenseType: "Class B", phone: "+1 555-0203", email: "j.wilson@evertruck.com", status: "active", rating: "4.80" },
    { firstName: "Sarah", lastName: "Chen", licenseNumber: "CDL-114674", licenseType: "Class A", phone: "+1 555-0204", email: "s.chen@evertruck.com", status: "active", rating: "4.92" },
    { firstName: "Michael", lastName: "Brown", licenseNumber: "CDL-225785", licenseType: "Class A", phone: "+1 555-0205", email: "m.brown@evertruck.com", status: "off_duty", rating: "4.85" },
    { firstName: "Lisa", lastName: "Anderson", licenseNumber: "CDL-336896", licenseType: "Class B", phone: "+1 555-0206", email: "l.anderson@evertruck.com", status: "active", rating: "4.88" },
  ]);
  console.log("Drivers seeded");

  // Seed shipments with tracking
  const shipmentData = [
    { trackingNumber: "EVT-2024-A001", origin: "New York, NY", destination: "Los Angeles, CA", weight: "12500.50", dimensions: "48x40x36", status: "in_transit" as const, priority: "high" as const, estimatedDelivery: new Date("2024-08-15") as unknown as Date },
    { trackingNumber: "EVT-2024-A002", origin: "Chicago, IL", destination: "Miami, FL", weight: "8750.25", dimensions: "36x36x30", status: "delivered" as const, priority: "normal" as const, estimatedDelivery: new Date("2024-07-20") as unknown as Date, actualDelivery: new Date("2024-07-19") as unknown as Date },
    { trackingNumber: "EVT-2024-A003", origin: "Seattle, WA", destination: "Denver, CO", weight: "15000.00", dimensions: "53x40x48", status: "picked_up" as const, priority: "urgent" as const, estimatedDelivery: new Date("2024-08-10") as unknown as Date },
    { trackingNumber: "EVT-2024-A004", origin: "Houston, TX", destination: "Atlanta, GA", weight: "6200.75", dimensions: "32x24x20", status: "out_for_delivery" as const, priority: "normal" as const, estimatedDelivery: new Date("2024-08-05") as unknown as Date },
    { trackingNumber: "EVT-2024-A005", origin: "Boston, MA", destination: "Philadelphia, PA", weight: "9800.00", dimensions: "40x40x32", status: "pending" as const, priority: "low" as const, estimatedDelivery: new Date("2024-08-20") as unknown as Date },
  ];

  for (const s of shipmentData) {
    await db.insert(shipments).values(s);
  }
  console.log("Shipments seeded");

  // Seed tracking events
  await db.insert(tracking).values([
    { shipmentId: 1, location: "New York, NY", status: "pending", description: "Shipment created" },
    { shipmentId: 1, location: "New York, NY", status: "picked_up", description: "Cargo picked up from warehouse" },
    { shipmentId: 1, location: "Pittsburgh, PA", status: "in_transit", description: "In transit via I-76 W" },
    { shipmentId: 1, location: "Columbus, OH", status: "in_transit", description: "Arrived at Columbus distribution hub" },
    { shipmentId: 2, location: "Chicago, IL", status: "pending", description: "Shipment created" },
    { shipmentId: 2, location: "Chicago, IL", status: "picked_up", description: "Cargo picked up" },
    { shipmentId: 2, location: "Nashville, TN", status: "in_transit", description: "In transit via I-65 S" },
    { shipmentId: 2, location: "Miami, FL", status: "delivered", description: "Delivered successfully" },
    { shipmentId: 3, location: "Seattle, WA", status: "pending", description: "Shipment created" },
    { shipmentId: 3, location: "Seattle, WA", status: "picked_up", description: "Urgent pickup completed" },
    { shipmentId: 4, location: "Houston, TX", status: "pending", description: "Shipment created" },
    { shipmentId: 4, location: "Houston, TX", status: "picked_up", description: "Cargo picked up" },
    { shipmentId: 4, location: "New Orleans, LA", status: "in_transit", description: "In transit via I-10 E" },
    { shipmentId: 4, location: "Atlanta, GA", status: "out_for_delivery", description: "Out for delivery today" },
    { shipmentId: 5, location: "Boston, MA", status: "pending", description: "Shipment created, awaiting pickup" },
  ]);
  console.log("Tracking events seeded");

  // Seed invoices
  await db.insert(invoices).values([
    { invoiceNumber: "INV-2024-001", shipmentId: 2, userId: 2, amount: "2450.00", tax: "245.00", total: "2695.00", status: "paid", dueDate: new Date("2024-08-15") as unknown as Date, paidAt: new Date() },
    { invoiceNumber: "INV-2024-002", shipmentId: 1, userId: 2, amount: "3800.00", tax: "380.00", total: "4180.00", status: "sent", dueDate: new Date("2024-09-01") as unknown as Date },
    { invoiceNumber: "INV-2024-003", shipmentId: 3, userId: 2, amount: "4200.00", tax: "420.00", total: "4620.00", status: "draft", dueDate: new Date("2024-09-15") as unknown as Date },
  ]);
  console.log("Invoices seeded");

  // Seed blog categories
  await db.insert(blogCategories).values([
    { name: "Industry News", slug: "industry-news", description: "Latest updates from the logistics world" },
    { name: "Logistics Tips", slug: "logistics-tips", description: "Expert advice for efficient shipping" },
    { name: "Company Updates", slug: "company-updates", description: "News from EverTruck" },
  ]);
  console.log("Blog categories seeded");

  // Seed blog posts
  await db.insert(blogPosts).values([
    {
      title: "The Future of Autonomous Trucking",
      slug: "future-autonomous-trucking",
      excerpt: "How self-driving technology is reshaping the logistics industry...",
      content: "Autonomous trucking is no longer a distant dream. Major logistics companies are already testing self-driving trucks on highways across America. These vehicles promise to reduce delivery times, lower fuel consumption, and minimize human error. However, regulatory challenges and public acceptance remain significant hurdles. At EverTruck, we're closely monitoring these developments and preparing our fleet for the autonomous revolution. The technology could reduce operational costs by up to 40% while improving safety records dramatically.",
      coverImage: "/images/blog/autonomous-trucking.jpg",
      categoryId: 1,
      authorId: 1,
      published: true,
      featured: true,
      publishedAt: new Date("2024-07-01"),
    },
    {
      title: "5 Tips for Reducing Shipping Costs",
      slug: "reduce-shipping-costs",
      excerpt: "Practical strategies to optimize your logistics budget...",
      content: "Shipping costs can eat into your profit margins if not managed carefully. Here are five proven strategies: 1) Consolidate shipments to maximize container space, 2) Negotiate rates with multiple carriers, 3) Use technology to optimize routes, 4) Implement proper packaging to avoid dimensional weight charges, 5) Plan ahead to avoid expedited shipping fees. By applying these tips, our clients have reported savings of up to 25% on their annual shipping expenses.",
      coverImage: "/images/blog/shipping-costs.jpg",
      categoryId: 2,
      authorId: 1,
      published: true,
      featured: false,
      publishedAt: new Date("2024-07-10"),
    },
    {
      title: "EverTruck Expands to European Markets",
      slug: "european-expansion",
      excerpt: "We're excited to announce our expansion into key European markets...",
      content: "After years of successful operations in North America, EverTruck is proud to announce our expansion into major European markets. Starting September 2024, we'll offer full-service logistics solutions across Germany, France, Netherlands, and Belgium. This expansion represents a $50 million investment in new facilities, vehicles, and local talent. Our European headquarters will be based in Rotterdam, strategically positioned at Europe's largest port.",
      coverImage: "/images/blog/european-expansion.jpg",
      categoryId: 3,
      authorId: 1,
      published: true,
      featured: true,
      publishedAt: new Date("2024-07-15"),
    },
    {
      title: "Understanding Cold Chain Logistics",
      slug: "cold-chain-logistics",
      excerpt: "Everything you need to know about temperature-controlled shipping...",
      content: "Cold chain logistics is critical for industries handling perishable goods, pharmaceuticals, and temperature-sensitive products. Maintaining the right temperature throughout the supply chain requires specialized equipment, real-time monitoring, and trained personnel. Our refrigerated fleet maintains temperatures from -25C to +25C with GPS-tracked precision. We also provide temperature logging documentation for regulatory compliance.",
      coverImage: "/images/blog/cold-chain.jpg",
      categoryId: 2,
      authorId: 1,
      published: true,
      featured: false,
      publishedAt: new Date("2024-07-20"),
    },
    {
      title: "Sustainable Logistics: Our Green Initiative",
      slug: "sustainable-logistics",
      excerpt: "How EverTruck is committed to reducing its carbon footprint...",
      content: "Sustainability is at the core of our operations. We've committed to achieving carbon neutrality by 2030 through three key initiatives: transitioning our fleet to electric and hybrid vehicles, optimizing routes to reduce fuel consumption, and partnering with carbon offset programs. Our new solar-powered distribution centers generate 40% of their own energy needs. We're also piloting hydrogen fuel cell technology for long-haul routes.",
      coverImage: "/images/blog/sustainability.jpg",
      categoryId: 3,
      authorId: 1,
      published: true,
      featured: true,
      publishedAt: new Date("2024-07-25"),
    },
    {
      title: "Warehouse Automation Trends 2024",
      slug: "warehouse-automation-2024",
      excerpt: "The latest technologies transforming warehouse operations...",
      content: "Warehouse automation has reached new heights in 2024. From AI-powered inventory management to robotic picking systems, technology is revolutionizing how goods are stored and distributed. Our smart warehouses now use computer vision for quality control and autonomous mobile robots (AMRs) for internal transport. These innovations have increased our processing speed by 60% while reducing error rates to near zero.",
      coverImage: "/images/blog/warehouse-automation.jpg",
      categoryId: 1,
      authorId: 1,
      published: true,
      featured: false,
      publishedAt: new Date("2024-07-28"),
    },
  ]);
  console.log("Blog posts seeded");

  // Seed FAQs
  await db.insert(faqs).values([
    { question: "How do I track my shipment?", answer: "You can track your shipment by entering your tracking number on our Tracking page. Real-time updates include pickup confirmation, transit milestones, and delivery confirmation.", category: "General", sortOrder: 1 },
    { question: "What areas do you service?", answer: "We provide nationwide coverage across all 50 US states, plus international shipping to over 120 countries through our partner network.", category: "General", sortOrder: 2 },
    { question: "How do I get a shipping quote?", answer: "Simply fill out our Quote Request form with your shipment details including origin, destination, cargo type, and weight. Our team will respond within 24 hours.", category: "Pricing", sortOrder: 3 },
    { question: "What is your delivery time frame?", answer: "Delivery times vary by distance and service level. Standard shipping takes 3-7 business days, express 1-3 days, and same-day delivery is available in select metro areas.", category: "Shipping", sortOrder: 4 },
    { question: "Do you handle hazardous materials?", answer: "Yes, we are certified to transport hazardous materials (HAZMAT) classes 3, 4, 5, 8, and 9. Special handling fees and documentation requirements apply.", category: "Services", sortOrder: 5 },
    { question: "What insurance options are available?", answer: "All shipments include basic liability coverage. Full-value insurance is available for purchase at 1% of declared value. Maximum coverage is $500,000 per shipment.", category: "Insurance", sortOrder: 6 },
    { question: "Can I schedule a specific delivery time?", answer: "Yes, our Premium Delivery service allows you to schedule deliveries within a 2-hour window. Additional fees apply for time-specific deliveries.", category: "Shipping", sortOrder: 7 },
    { question: "How do I file a claim for damaged goods?", answer: "Claims can be filed through your account dashboard or by contacting our support team. Please provide photos of the damage and original packing materials. Claims are typically resolved within 10 business days.", category: "Support", sortOrder: 8 },
  ]);
  console.log("FAQs seeded");

  // Seed testimonials
  await db.insert(testimonials).values([
    { name: "David Martinez", company: "GlobalTech Industries", role: "Supply Chain Director", content: "EverTruck has transformed our logistics operations. Their real-time tracking and proactive communication have reduced our delivery complaints by 90%. The team's professionalism is unmatched in the industry.", rating: 5, featured: true },
    { name: "Jennifer Walsh", company: "FreshFoods Distribution", role: "Operations Manager", content: "The cold chain logistics service is exceptional. Our temperature-sensitive products arrive in perfect condition every time. Their attention to detail and compliance documentation makes audits a breeze.", rating: 5, featured: true },
    { name: "Robert Chang", company: "BuildRight Construction", role: "Project Manager", content: "We've relied on EverTruck for heavy haul services for three years. Their specialized equipment and experienced drivers handle our oversized loads with precision. Highly recommended for any construction logistics needs.", rating: 5, featured: true },
    { name: "Amanda Foster", company: "MedSupply Co", role: "Logistics Coordinator", content: "Working with EverTruck has been a game-changer for our medical supply deliveries. Their white-glove service and temperature-controlled transport give us complete peace of mind.", rating: 4, featured: true },
    { name: "Carlos Rivera", company: "AutoParts Plus", role: "Warehouse Manager", content: "The integration with our warehouse management system was seamless. Their API and real-time updates have streamlined our entire fulfillment process. Great technology partners.", rating: 5, featured: false },
    { name: "Lisa Thompson", company: "E-Shop Express", role: "CEO", content: "EverTruck's last-mile delivery service helped us achieve same-day delivery in 15 major cities. Our customer satisfaction scores have never been higher. They're an integral part of our growth story.", rating: 5, featured: true },
  ]);
  console.log("Testimonials seeded");

  // Seed partners
  await db.insert(partners).values([
    { name: "FedEx", website: "https://fedex.com", tier: "platinum", isActive: true },
    { name: "UPS", website: "https://ups.com", tier: "platinum", isActive: true },
    { name: "DHL", website: "https://dhl.com", tier: "gold", isActive: true },
    { name: "Maersk", website: "https://maersk.com", tier: "gold", isActive: true },
    { name: "C.H. Robinson", website: "https://chrobinson.com", tier: "silver", isActive: true },
    { name: "XPO Logistics", website: "https://xpo.com", tier: "silver", isActive: true },
    { name: "Ryder", website: "https://ryder.com", tier: "bronze", isActive: true },
    { name: "Penske", website: "https://penske.com", tier: "bronze", isActive: true },
  ]);
  console.log("Partners seeded");

  // Seed settings
  await db.insert(settings).values([
    { key: "site_name", value: "EverTruck", type: "string" },
    { key: "site_description", value: "Premium Logistics & Transport Solutions", type: "string" },
    { key: "contact_email", value: "contact@evertruck.com", type: "string" },
    { key: "contact_phone", value: "+1 (800) 555-EVER", type: "string" },
    { key: "maintenance_mode", value: "false", type: "boolean" },
  ]);
  console.log("Settings seeded");

  console.log("\nSeed complete! You can now login with:");
  console.log("  Admin: admin@evertruck.com / admin123");
  console.log("  User:  user@evertruck.com / user123");
}

seed().then(() => process.exit(0)).catch((e) => {
  if (e?.code === 'ER_DUP_ENTRY' || String(e).includes('Duplicate entry')) {
    console.log("Database already contains seeded data. Proceeding to start API server!");
    process.exit(0);
  } else {
    console.error(e);
    process.exit(1);
  }
});
