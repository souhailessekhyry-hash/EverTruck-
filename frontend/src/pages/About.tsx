import { motion } from "framer-motion";
import {
  Truck,
  Target,
  Eye,
  Heart,
  Users,
  Award,
  TrendingUp,
  Shield,
} from "lucide-react";

function FadeIn({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, delay }}
    >
      {children}
    </motion.div>
  );
}

const values = [
  {
    icon: Target,
    title: "Mission",
    description: "To redefine logistics through innovation, reliability, and unmatched customer service, connecting businesses and communities worldwide.",
  },
  {
    icon: Eye,
    title: "Vision",
    description: "To become the world's most trusted logistics partner, setting new standards for efficiency, sustainability, and technological advancement.",
  },
  {
    icon: Heart,
    title: "Values",
    description: "Integrity, excellence, innovation, and sustainability guide every decision we make. We put our customers first and take pride in every delivery.",
  },
];

const stats = [
  { icon: Truck, value: "500+", label: "Vehicles" },
  { icon: Users, value: "1,200+", label: "Team Members" },
  { icon: Award, value: "25+", label: "Years Experience" },
  { icon: TrendingUp, value: "99.8%", label: "Satisfaction" },
  { icon: Shield, value: "15M+", label: "Deliveries" },
  { icon: Target, value: "120+", label: "Countries" },
];

const milestones = [
  { year: "1999", title: "Founded", description: "EverTruck started with just 5 trucks in New York City." },
  { year: "2005", title: "National Expansion", description: "Expanded operations to all 50 US states." },
  { year: "2012", title: "Tech Innovation", description: "Launched proprietary GPS tracking and route optimization platform." },
  { year: "2018", title: "Green Initiative", description: "Began fleet electrification and carbon neutrality commitment." },
  { year: "2023", title: "Global Reach", description: "Expanded to 120+ countries with international partnerships." },
  { year: "2024", title: "AI-Powered", description: "Implemented full AI-driven logistics management system." },
];

export default function About() {
  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-crimson-500/5 to-teal-500/5" />
        <div className="relative section-padding max-w-[1400px] mx-auto">
          <div className="text-center max-w-3xl mx-auto">
            <FadeIn>
              <span className="text-crimson-400 text-sm uppercase tracking-widest font-semibold">
                About Us
              </span>
              <h1 className="heading-xl text-white mt-4 mb-6">
                DRIVING THE FUTURE
                <br />
                OF <span className="text-crimson-500">LOGISTICS</span>
              </h1>
              <p className="body-text text-lg">
                For over 25 years, EverTruck has been at the forefront of transportation
                innovation. From a small fleet in New York to a global logistics network,
                our commitment to excellence has never wavered.
              </p>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Story + Image */}
      <section className="py-24">
        <div className="section-padding max-w-[1400px] mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <FadeIn>
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-br from-crimson-500/10 to-teal-500/10 rounded-2xl blur-2xl" />
                <img
                  src="/images/team/team.jpg"
                  alt="EverTruck Team"
                  className="relative rounded-2xl w-full h-[400px] object-cover"
                />
              </div>
            </FadeIn>
            <div>
              <FadeIn delay={0.1}>
                <h2 className="heading-md text-white mb-6">Our Story</h2>
                <div className="space-y-4 body-text">
                  <p>
                    Founded in 1999, EverTruck began with a simple mission: make
                    logistics reliable, transparent, and efficient. What started as
                    a five-truck operation in New York City has grown into one of
                    North America's most trusted logistics providers.
                  </p>
                  <p>
                    Today, we operate a fleet of 500+ vehicles, employ over 1,200
                    logistics professionals, and serve clients across 120+
                    countries. Our technology platform processes millions of data
                    points daily to optimize routes, predict delays, and ensure
                    every shipment arrives on time.
                  </p>
                  <p>
                    But we're not stopping there. With our commitment to carbon
                    neutrality by 2030 and continuous investment in autonomous
                    vehicle technology, EverTruck is shaping the future of global
                    transportation.
                  </p>
                </div>
              </FadeIn>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 bg-navy-800/30">
        <div className="section-padding max-w-[1400px] mx-auto">
          <div className="text-center mb-16">
            <FadeIn>
              <span className="text-teal-400 text-sm uppercase tracking-widest font-semibold">
                Our Culture
              </span>
              <h2 className="heading-lg text-white mt-3">
                WHAT DRIVES <span className="text-teal-400">US</span>
              </h2>
            </FadeIn>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {values.map((v, i) => (
              <FadeIn key={i} delay={i * 0.15}>
                <div className="glass-card-hover p-8 text-center h-full">
                  <div className="w-16 h-16 rounded-2xl bg-crimson-500/10 flex items-center justify-center mx-auto mb-6">
                    <v.icon className="w-8 h-8 text-crimson-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-4">{v.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{v.description}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-24">
        <div className="section-padding max-w-[1400px] mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {stats.map((s, i) => (
              <FadeIn key={i} delay={i * 0.08}>
                <div className="glass-card p-6 text-center">
                  <s.icon className="w-6 h-6 text-crimson-400 mx-auto mb-3" />
                  <div className="text-2xl font-bold text-white">{s.value}</div>
                  <div className="text-xs text-gray-500 mt-1">{s.label}</div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-24 bg-navy-800/30">
        <div className="section-padding max-w-[1000px] mx-auto">
          <div className="text-center mb-16">
            <FadeIn>
              <span className="text-golden-400 text-sm uppercase tracking-widest font-semibold">
                Our Journey
              </span>
              <h2 className="heading-lg text-white mt-3">
                MILESTONES & <span className="text-golden-400">ACHIEVEMENTS</span>
              </h2>
            </FadeIn>
          </div>
          <div className="relative">
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-white/10" />
            {milestones.map((m, i) => (
              <FadeIn key={i} delay={i * 0.1}>
                <div className={`relative flex items-start gap-8 mb-12 ${i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"}`}>
                  <div className="hidden md:block flex-1" />
                  <div className="absolute left-4 md:left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-crimson-500 mt-2" />
                  <div className="ml-12 md:ml-0 flex-1">
                    <div className="glass-card p-6">
                      <span className="text-crimson-400 font-bold text-lg">{m.year}</span>
                      <h4 className="text-white font-semibold mt-1">{m.title}</h4>
                      <p className="text-gray-400 text-sm mt-2">{m.description}</p>
                    </div>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
