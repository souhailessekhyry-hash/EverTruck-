import { motion } from "framer-motion";
import {
  Gauge,
  Calendar,
  Weight,
  CheckCircle,
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

const vehicles = [
  {
    name: "Freightliner Cascadia",
    type: "Heavy Duty Truck",
    year: 2023,
    capacity: "40 tons",
    status: "Active",
    image: "/images/services/fleet.jpg",
    specs: ["Automated manual transmission", "Advanced aerodynamics", "Collision mitigation", "Fuel efficiency: 8.2 MPG"],
  },
  {
    name: "Volvo VNL 860",
    type: "Premium Sleeper",
    year: 2024,
    capacity: "36 tons",
    status: "Active",
    image: "/images/services/fleet.jpg",
    specs: ["I-Shift automated transmission", "Globetrotter XL cab", "Lane departure warning", "Fuel efficiency: 8.5 MPG"],
  },
  {
    name: "Mercedes Sprinter",
    type: "Urban Delivery Van",
    year: 2023,
    capacity: "3.5 tons",
    status: "Active",
    image: "/images/services/fleet.jpg",
    specs: ["Turbo diesel engine", "Cargo volume: 14.8 m³", "Load capacity: 1,490 kg", "City fuel: 9.8 L/100km"],
  },
  {
    name: "Great Dane Everest",
    type: "Refrigerated Trailer",
    year: 2022,
    capacity: "45 tons",
    status: "Active",
    image: "/images/services/fleet.jpg",
    specs: ["Carrier Vector 8600MT unit", "Temperature range: -25°C to +25°C", "Multi-temp zones", "GPS temperature tracking"],
  },
  {
    name: "Toyota Forklift 8FGU25",
    type: "Warehouse Forklift",
    year: 2023,
    capacity: "2.5 tons",
    status: "Active",
    image: "/images/services/warehouse.jpg",
    specs: ["LPG powered", "Lift height: 4.7m", "Turning radius: 2.1m", "Precision controls"],
  },
  {
    name: "Liebherr LTM 1090",
    type: "All-Terrain Crane",
    year: 2022,
    capacity: "90 tons",
    status: "Active",
    image: "/images/services/heavy-haul.jpg",
    specs: ["Telescopic boom: 50m", "Y-guys support", "8x8x8 drive", "Setup time: <15 min"],
  },
];

const fleetStats = [
  { label: "Total Vehicles", value: "500+" },
  { label: "Average Age", value: "2.3 years" },
  { label: "Electric/Hybrid", value: "85+" },
  { label: "Uptime Rate", value: "98.7%" },
];

export default function Fleet() {
  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-crimson-500/5 to-teal-500/5" />
        <div className="relative section-padding max-w-[1400px] mx-auto text-center">
          <FadeIn>
            <span className="text-crimson-400 text-sm uppercase tracking-widest font-semibold">
              Our Equipment
            </span>
            <h1 className="heading-xl text-white mt-4 mb-6">
              MODERN <span className="text-crimson-500">FLEET</span>
            </h1>
            <p className="body-text max-w-2xl mx-auto">
              A diverse, well-maintained fleet of vehicles equipped with the latest
              technology for safety, efficiency, and reliability.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-navy-800/30">
        <div className="section-padding max-w-[1400px] mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {fleetStats.map((s, i) => (
              <FadeIn key={i} delay={i * 0.1}>
                <div className="glass-card p-6 text-center">
                  <div className="text-3xl font-bold text-white">{s.value}</div>
                  <div className="text-sm text-gray-400 mt-1">{s.label}</div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Vehicle Cards */}
      <section className="py-24">
        <div className="section-padding max-w-[1400px] mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {vehicles.map((v, i) => (
              <FadeIn key={i} delay={i * 0.1}>
                <div className="glass-card-hover overflow-hidden h-full flex flex-col">
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={v.image}
                      alt={v.name}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                    />
                    <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-mint-500/20 text-mint-400 text-xs font-medium">
                      {v.status}
                    </div>
                  </div>
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-lg font-semibold text-white">{v.name}</h3>
                    </div>
                    <p className="text-crimson-400 text-sm mb-4">{v.type}</p>
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <Calendar className="w-4 h-4" />
                        {v.year}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <Weight className="w-4 h-4" />
                        {v.capacity}
                      </div>
                    </div>
                    <ul className="space-y-2 mt-auto">
                      {v.specs.map((s, j) => (
                        <li key={j} className="flex items-center gap-2 text-xs text-gray-400">
                          <CheckCircle className="w-3 h-3 text-mint-400 flex-shrink-0" />
                          {s}
                        </li>
                      ))}
                    </ul>
                  </div>
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
            <div className="glass-card p-12 text-center">
              <Gauge className="w-12 h-12 text-crimson-400 mx-auto mb-4" />
              <h2 className="heading-md text-white mb-4">
                Need Specialized Equipment?
              </h2>
              <p className="body-text max-w-xl mx-auto mb-8">
                We continuously invest in our fleet to ensure we have the right
                equipment for your specific needs.
              </p>
              <Link to="/quote" className="btn-primary inline-flex items-center gap-2">
                Request Equipment
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>
    </div>
  );
}
