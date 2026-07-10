import { motion } from "framer-motion";
import {
  Factory,
  ShoppingCart,
  Pill,
  Cpu,
  Wheat,
  Construction,
  Fuel,
  Shirt,
  ArrowRight,
} from "lucide-react";
import { Link } from "react-router";

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

const industries = [
  {
    icon: Factory,
    title: "Manufacturing",
    description: "Just-in-time delivery of raw materials and finished goods. Optimized production line supply chains with scheduled deliveries.",
    color: "from-crimson-500/10 to-crimson-500/5",
    iconColor: "text-crimson-400",
  },
  {
    icon: ShoppingCart,
    title: "Retail & E-commerce",
    description: "Omnichannel fulfillment, same-day delivery, and returns management. Scalable solutions for peak seasons.",
    color: "from-teal-500/10 to-teal-500/5",
    iconColor: "text-teal-400",
  },
  {
    icon: Pill,
    title: "Pharmaceutical",
    description: "GDP-compliant cold chain logistics for vaccines, biologics, and temperature-sensitive medications. Full chain of custody.",
    color: "from-mint-500/10 to-mint-500/5",
    iconColor: "text-mint-400",
  },
  {
    icon: Cpu,
    title: "Technology",
    description: "Secure transport of high-value electronics with white-glove handling, anti-static packaging, and insurance coverage.",
    color: "from-golden-500/10 to-golden-500/5",
    iconColor: "text-golden-400",
  },
  {
    icon: Wheat,
    title: "Food & Beverage",
    description: "HACCP-certified cold chain from farm to shelf. Temperature monitoring, FIFO rotation, and rapid distribution.",
    color: "from-crimson-500/10 to-crimson-500/5",
    iconColor: "text-crimson-400",
  },
  {
    icon: Construction,
    title: "Construction",
    description: "Heavy haul for oversized equipment, project logistics coordination, and just-in-time material delivery to job sites.",
    color: "from-teal-500/10 to-teal-500/5",
    iconColor: "text-teal-400",
  },
  {
    icon: Fuel,
    title: "Energy & Oil",
    description: "Hazmat-certified transport of chemicals, drilling equipment, and renewable energy components with full regulatory compliance.",
    color: "from-mint-500/10 to-mint-500/5",
    iconColor: "text-mint-400",
  },
  {
    icon: Shirt,
    title: "Fashion & Apparel",
    description: "Fast fashion logistics with rapid turnaround, cross-docking, and international sourcing coordination.",
    color: "from-golden-500/10 to-golden-500/5",
    iconColor: "text-golden-400",
  },
];

export default function Industries() {
  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-crimson-500/5 to-teal-500/5" />
        <div className="relative section-padding max-w-[1400px] mx-auto text-center">
          <FadeIn>
            <span className="text-crimson-400 text-sm uppercase tracking-widest font-semibold">
              Expertise
            </span>
            <h1 className="heading-xl text-white mt-4 mb-6">
              INDUSTRIES <span className="text-crimson-500">SERVED</span>
            </h1>
            <p className="body-text max-w-2xl mx-auto">
              Specialized logistics solutions tailored to the unique requirements
              of each industry we serve.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Industries Grid */}
      <section className="py-24">
        <div className="section-padding max-w-[1400px] mx-auto">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {industries.map((ind, i) => (
              <FadeIn key={i} delay={i * 0.08}>
                <div className={`glass-card-hover p-6 h-full bg-gradient-to-br ${ind.color} border-white/5`}>
                  <div className="w-14 h-14 rounded-xl bg-white/5 flex items-center justify-center mb-4">
                    <ind.icon className={`w-7 h-7 ${ind.iconColor}`} />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-3">{ind.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{ind.description}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-navy-800/30">
        <div className="section-padding max-w-[1400px] mx-auto">
          <FadeIn>
            <div className="glass-card p-12 text-center">
              <h2 className="heading-md text-white mb-4">
                Don't See Your Industry?
              </h2>
              <p className="body-text max-w-xl mx-auto mb-8">
                We serve virtually every industry. Contact us to discuss your
                specific logistics requirements.
              </p>
              <Link to="/contact" className="btn-primary inline-flex items-center gap-2">
                Contact Our Team
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>
    </div>
  );
}
