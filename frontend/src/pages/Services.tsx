import { motion } from "framer-motion";
import { Link } from "react-router";
import {
  Truck,
  Warehouse,
  Package,
  Snowflake,
  Clock,
  Shield,
  BarChart3,
  Globe,
  Headphones,
  ArrowRight,
  CheckCircle,
} from "lucide-react";

function FadeIn({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

const services = [
  {
    icon: Truck,
    title: "Freight Transport",
    description: "Full truckload (FTL) and less-than-truckload (LTL) services across North America. Our modern fleet includes dry vans, flatbeds, and specialized equipment for every cargo type.",
    features: ["Real-time GPS tracking", "Dedicated account managers", "Expedited options available", "Cross-border expertise"],
    image: "/images/services/fleet.jpg",
  },
  {
    icon: Warehouse,
    title: "Warehousing & Distribution",
    description: "Strategically located distribution centers with automated inventory management, same-day fulfillment, and seamless integration with your systems.",
    features: ["WMS integration", "Pick & pack services", "Cross-docking", "Returns management"],
    image: "/images/services/warehouse.jpg",
  },
  {
    icon: Truck,
    title: "Heavy Haul & Oversized",
    description: "Specialized transport for oversized, overweight, and project cargo. Complete route surveys, permit management, and escort services.",
    features: ["Route engineering", "Permit procurement", "Pilot car services", "Project logistics"],
    image: "/images/services/heavy-haul.jpg",
  },
  {
    icon: Package,
    title: "Last Mile Delivery",
    description: "Urban and suburban final-mile solutions with optimized routing, proof of delivery, and real-time customer notifications.",
    features: ["Same-day delivery", "White glove service", "Installation support", "Reverse logistics"],
    image: "/images/services/fleet.jpg",
  },
  {
    icon: Snowflake,
    title: "Cold Chain Logistics",
    description: "Temperature-controlled transport from -25C to +25C. Continuous monitoring, backup systems, and full regulatory compliance.",
    features: ["Reefer trucks & trailers", "Temperature logging", "FDA compliant", "Pharmaceutical certified"],
    image: "/images/services/warehouse.jpg",
  },
  {
    icon: Clock,
    title: "Express & Time-Critical",
    description: "When every minute counts. Dedicated vehicles, air freight partnerships, and hand-carry services for urgent shipments.",
    features: ["Next flight out", "Dedicated vehicles", "On-board courier", "24/7 availability"],
    image: "/images/services/heavy-haul.jpg",
  },
];

const additionalServices = [
  { icon: Shield, title: "Cargo Insurance", description: "Comprehensive coverage options for every shipment value." },
  { icon: BarChart3, title: "Supply Chain Analytics", description: "Data-driven insights to optimize your logistics operations." },
  { icon: Globe, title: "International Freight", description: "Air, ocean, and ground transport to 120+ countries." },
  { icon: Headphones, title: "24/7 Support", description: "Round-the-clock customer service and shipment monitoring." },
];

export default function Services() {
  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-crimson-500/5 to-teal-500/5" />
        <div className="relative section-padding max-w-[1400px] mx-auto text-center">
          <FadeIn>
            <span className="text-crimson-400 text-sm uppercase tracking-widest font-semibold">
              Solutions
            </span>
            <h1 className="heading-xl text-white mt-4 mb-6">
              COMPREHENSIVE
              <br />
              <span className="text-crimson-500">SERVICES</span>
            </h1>
            <p className="body-text max-w-2xl mx-auto">
              From standard freight to specialized transport, we offer a complete
              range of logistics services designed to meet your unique requirements.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Main Services */}
      <section className="py-24">
        <div className="section-padding max-w-[1400px] mx-auto">
          <div className="space-y-24">
            {services.map((service, i) => (
              <div key={i} className={`grid lg:grid-cols-2 gap-12 items-center ${i % 2 === 1 ? "lg:grid-flow-dense" : ""}`}>
                <FadeIn className={i % 2 === 1 ? "lg:col-start-2" : ""}>
                  <div className="relative rounded-2xl overflow-hidden">
                    <img
                      src={service.image}
                      alt={service.title}
                      className="w-full h-[350px] object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-navy-900/60 to-transparent" />
                  </div>
                </FadeIn>
                <FadeIn delay={0.2} className={i % 2 === 1 ? "lg:col-start-1 lg:row-start-1" : ""}>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-crimson-500/10 flex items-center justify-center">
                      <service.icon className="w-6 h-6 text-crimson-400" />
                    </div>
                    <h2 className="heading-md text-white">{service.title}</h2>
                  </div>
                  <p className="body-text mb-6">{service.description}</p>
                  <ul className="space-y-3 mb-8">
                    {service.features.map((f, j) => (
                      <li key={j} className="flex items-center gap-3 text-gray-300">
                        <CheckCircle className="w-5 h-5 text-mint-400 flex-shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Link to="/quote" className="btn-primary inline-flex items-center gap-2">
                    Request Quote
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </FadeIn>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Services */}
      <section className="py-24 bg-navy-800/30">
        <div className="section-padding max-w-[1400px] mx-auto">
          <div className="text-center mb-16">
            <FadeIn>
              <span className="text-teal-400 text-sm uppercase tracking-widest font-semibold">
                More Services
              </span>
              <h2 className="heading-lg text-white mt-3">
                ADDITIONAL <span className="text-teal-400">OFFERINGS</span>
              </h2>
            </FadeIn>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {additionalServices.map((s, i) => (
              <FadeIn key={i} delay={i * 0.1}>
                <div className="glass-card-hover p-6 h-full">
                  <div className="w-12 h-12 rounded-xl bg-teal-500/10 flex items-center justify-center mb-4">
                    <s.icon className="w-6 h-6 text-teal-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">{s.title}</h3>
                  <p className="text-gray-400 text-sm">{s.description}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
        <div className="section-padding max-w-[1400px] mx-auto">
          <FadeIn>
            <div className="glass-card p-12 text-center relative overflow-hidden">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[200px] bg-crimson-500/10 rounded-full blur-3xl" />
              <div className="relative">
                <h2 className="heading-md text-white mb-4">
                  Not Sure What You Need?
                </h2>
                <p className="body-text max-w-xl mx-auto mb-8">
                  Our logistics experts will analyze your requirements and recommend
                  the optimal solution for your business.
                </p>
                <Link to="/quote" className="btn-primary inline-flex items-center gap-2">
                  Get Free Consultation
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>
    </div>
  );
}
