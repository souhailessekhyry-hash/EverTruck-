import { useEffect, useRef } from "react";
import { Link } from "react-router";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Truck,
  Warehouse,
  Package,
  Snowflake,
  Clock,
  MapPin,
  Shield,
  Zap,
  Globe,
  BarChart3,
  Users,
  CheckCircle,
  Play,
} from "lucide-react";
import CountUp from "react-countup";

/* ─── Animation helpers ─── */
function FadeIn({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.7, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ─── Hero Section ─── */
function HeroSection() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let time = 0;

    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    resize();
    window.addEventListener("resize", resize);

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    };
    canvas.addEventListener("mousemove", handleMouseMove);

    const draw = () => {
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      ctx.clearRect(0, 0, w, h);

      // Draw grid
      ctx.strokeStyle = "rgba(255,255,255,0.03)";
      ctx.lineWidth = 1;
      const gridSize = 40;
      const offsetX = (time * 10) % gridSize;

      for (let x = -gridSize + offsetX; x < w + gridSize; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      for (let y = 0; y < h; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      // Draw pulsing horizontal band
      const bandY = h * 0.55;
      const bandHeight = 120;
      const pulse = Math.sin(time * 2) * 0.3 + 0.7;

      const bandGrad = ctx.createLinearGradient(0, bandY - bandHeight / 2, 0, bandY + bandHeight / 2);
      bandGrad.addColorStop(0, `rgba(230, 57, 70, 0)`);
      bandGrad.addColorStop(0.3, `rgba(230, 57, 70, ${0.15 * pulse})`);
      bandGrad.addColorStop(0.5, `rgba(230, 57, 70, ${0.35 * pulse})`);
      bandGrad.addColorStop(0.7, `rgba(230, 57, 70, ${0.15 * pulse})`);
      bandGrad.addColorStop(1, `rgba(230, 57, 70, 0)`);
      ctx.fillStyle = bandGrad;
      ctx.fillRect(0, bandY - bandHeight / 2, w, bandHeight);

      // Draw undulating terrain
      ctx.strokeStyle = "rgba(255,255,255,0.08)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      const rows = 20;
      const cellH = h / 3 / rows;

      for (let row = 0; row < rows; row++) {
        const y = bandY + 60 + row * cellH;
        ctx.beginPath();
        for (let x = 0; x <= w; x += 2) {
          const distFromMouse = Math.sqrt(
            Math.pow(x - mouseRef.current.x, 2) + Math.pow(y - mouseRef.current.y, 2)
          );
          const mouseEffect = distFromMouse < 150 ? (150 - distFromMouse) / 150 * 15 : 0;
          const waveZ =
            Math.sin((x + time * 40) * 0.008 + row * 0.3) *
            Math.cos((x + time * 30) * 0.005 + row * 0.2) *
            (8 + mouseEffect);
          if (x === 0) ctx.moveTo(x, y + waveZ);
          else ctx.lineTo(x, y + waveZ);
        }
        ctx.stroke();
      }

      // Draw glowing nodes
      for (let i = 0; i < 15; i++) {
        const nx = ((i * 137.5 + time * 30) % w);
        const ny = bandY + 60 + Math.sin(i * 0.8 + time) * 80;
        const nodeSize = 2 + Math.sin(i + time * 2) * 1;
        const nodePulse = Math.sin(time * 3 + i) * 0.5 + 0.5;

        ctx.beginPath();
        ctx.arc(nx, ny, nodeSize, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(15, 163, 177, ${0.6 * nodePulse})`;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(nx, ny, nodeSize * 4, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(15, 163, 177, ${0.1 * nodePulse})`;
        ctx.fill();
      }

      time += 0.016;
      animId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Hero Background Photo */}
      <div className="absolute inset-0 z-0">
        <img
          src="/images/fleet-hero.jpg"
          alt="EverTruck Fleet"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-navy-900/80 via-navy-900/70 to-navy-900/95" />
        <div className="absolute inset-0 bg-gradient-to-r from-navy-900/60 via-transparent to-navy-900/60" />
      </div>

      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: 1,
          opacity: 0.6,
        }}
      />

      {/* Hero Content */}
      <div className="relative z-10 text-center section-padding max-w-5xl mx-auto pt-20">
        <FadeIn>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-crimson-500/10 border border-crimson-500/20 text-crimson-400 text-sm font-medium mb-8">
            <Zap className="w-4 h-4" />
            Global Logistics in Motion
          </div>
        </FadeIn>

        <FadeIn delay={0.1}>
          <h1 className="heading-xl mb-6">
            <span className="text-white">GLOBAL LOGISTICS</span>
            <br />
            <span className="text-crimson-500">IN MOTION</span>
          </h1>
        </FadeIn>

        <FadeIn delay={0.2}>
          <p className="body-text max-w-2xl mx-auto mb-10 text-lg">
            Precision-engineered transport solutions for the modern supply chain.
            From freight to final mile, we deliver with unmatched reliability and
            real-time visibility.
          </p>
        </FadeIn>

        <FadeIn delay={0.3}>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/tracking" className="btn-primary flex items-center gap-2 text-lg px-8 py-4">
              Track Shipment
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link to="/fleet" className="btn-secondary flex items-center gap-2 text-lg px-8 py-4">
              <Play className="w-5 h-5" />
              Fleet Overview
            </Link>
          </div>
        </FadeIn>

        {/* Stats Row */}
        <FadeIn delay={0.5}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-20">
            {[
              { value: 15000, suffix: "+", label: "Deliveries" },
              { value: 99.8, suffix: "%", label: "On-Time Rate", decimals: 1 },
              { value: 120, suffix: "+", label: "Countries" },
              { value: 24, suffix: "/7", label: "Support" },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-white">
                  <CountUp end={stat.value} duration={2.5} decimals={stat.decimals || 0} />
                  {stat.suffix}
                </div>
                <div className="text-sm text-gray-400 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

/* ─── Services Section ─── */
function ServicesSection() {
  const services = [
    {
      icon: Truck,
      title: "Freight Transport",
      description: "Full truckload and less-than-truckload services across North America with real-time GPS tracking.",
      image: "/images/services/fleet.jpg",
    },
    {
      icon: Warehouse,
      title: "Warehousing",
      description: "State-of-the-art distribution centers with automated inventory management and same-day fulfillment.",
      image: "/images/services/warehouse.jpg",
    },
    {
      icon: Truck,
      title: "Heavy Haul",
      description: "Specialized equipment for oversized and overweight cargo with route planning and permit management.",
      image: "/images/services/heavy-haul.jpg",
    },
    {
      icon: Package,
      title: "Last Mile Delivery",
      description: "Urban delivery solutions with optimized routing, proof of delivery, and customer notifications.",
      image: "/images/services/fleet.jpg",
    },
    {
      icon: Snowflake,
      title: "Cold Chain",
      description: "Temperature-controlled logistics from -25C to +25C with continuous monitoring and compliance.",
      image: "/images/services/warehouse.jpg",
    },
    {
      icon: Clock,
      title: "Express Shipping",
      description: "Time-critical deliveries with dedicated vehicles, air freight partnerships, and priority handling.",
      image: "/images/services/heavy-haul.jpg",
    },
  ];

  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-crimson-500/5 rounded-full blur-3xl" />

      <div className="relative section-padding max-w-[1400px] mx-auto">
        <div className="grid lg:grid-cols-5 gap-12 lg:gap-16">
          {/* Sticky Title */}
          <div className="lg:col-span-2">
            <div className="lg:sticky lg:top-32">
              <FadeIn>
                <span className="text-crimson-400 text-sm uppercase tracking-widest font-semibold">
                  What We Offer
                </span>
                <h2 className="heading-lg text-white mt-3 mb-6">
                  OUR
                  <br />
                  SERVICES
                </h2>
                <p className="body-text mb-8">
                  Comprehensive logistics solutions tailored to your supply chain
                  needs. From warehouse to doorstep, we handle every mile with
                  precision.
                </p>
                <Link to="/services" className="btn-primary inline-flex items-center gap-2">
                  View All Services
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </FadeIn>
            </div>
          </div>

          {/* Service Cards */}
          <div className="lg:col-span-3 space-y-6">
            {services.map((service, i) => (
              <FadeIn key={i} delay={i * 0.1}>
                <div className="glass-card-hover group overflow-hidden">
                  <div className="grid sm:grid-cols-[140px_1fr] gap-0">
                    <div className="relative h-full min-h-[140px]">
                      <img
                        src={service.image}
                        alt={service.title}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-navy-900/40" />
                    </div>
                    <div className="p-6">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-lg bg-crimson-500/10 flex items-center justify-center">
                          <service.icon className="w-5 h-5 text-crimson-400" />
                        </div>
                        <h3 className="text-xl font-semibold text-white">
                          {service.title}
                        </h3>
                      </div>
                      <p className="text-gray-400 text-sm leading-relaxed">
                        {service.description}
                      </p>
                    </div>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Operations Section ─── */
function OperationsSection() {
  const features = [
    { icon: MapPin, text: "Real-time Geofencing" },
    { icon: BarChart3, text: "Predictive ETA Modeling" },
    { icon: Shield, text: "Cargo Insurance Coverage" },
    { icon: Globe, text: "Multi-modal Transport" },
    { icon: Zap, text: "AI Route Optimization" },
    { icon: Clock, text: "24/7 Live Monitoring" },
  ];

  return (
    <section className="py-24 relative overflow-hidden">
      <div className="section-padding max-w-[1400px] mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left Content */}
          <div>
            <FadeIn>
              <span className="text-teal-400 text-sm uppercase tracking-widest font-semibold">
                Technology
              </span>
              <h2 className="heading-lg text-white mt-3 mb-6">
                PRECISION
                <br />
                ROUTING
              </h2>
              <p className="body-text mb-8">
                Our proprietary routing engine combines AI, real-time traffic
                data, and historical performance to optimize every delivery. The
                result is fewer delays, lower costs, and complete visibility from
                pickup to delivery.
              </p>
            </FadeIn>

            <div className="grid sm:grid-cols-2 gap-4">
              {features.map((feature, i) => (
                <FadeIn key={i} delay={i * 0.08}>
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/5">
                    <div className="w-8 h-8 rounded-lg bg-mint-500/10 flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="w-4 h-4 text-mint-400" />
                    </div>
                    <span className="text-sm text-gray-200">{feature.text}</span>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>

          {/* Right Visual */}
          <FadeIn delay={0.2}>
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-br from-crimson-500/10 to-teal-500/10 rounded-2xl blur-2xl" />
              <div className="relative glass-card overflow-hidden">
                <img
                  src="/images/control-room.jpg"
                  alt="Operations Control Center"
                  className="w-full h-[400px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-900/90 via-navy-900/40 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { label: "Active Routes", value: "2,847" },
                      { label: "Avg. Speed", value: "68 mph" },
                      { label: "Efficiency", value: "97.3%" },
                    ].map((stat, i) => (
                      <div key={i} className="text-center">
                        <div className="text-xl font-bold text-white">{stat.value}</div>
                        <div className="text-xs text-gray-400">{stat.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}

/* ─── Sustainability Section ─── */
function SustainabilitySection() {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="section-padding max-w-[1400px] mx-auto">
        <FadeIn>
          <div className="relative rounded-2xl overflow-hidden">
            <img
              src="/images/services/sustainability.jpg"
              alt="Sustainable Logistics"
              className="w-full h-[400px] lg:h-[500px] object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-navy-900/95 via-navy-900/70 to-transparent" />
            <div className="absolute inset-0 flex items-center section-padding">
              <div className="max-w-xl">
                <span className="text-mint-400 text-sm uppercase tracking-widest font-semibold">
                  Sustainability
                </span>
                <h2 className="heading-lg text-white mt-3 mb-6">
                  GREEN
                  <br />
                  LOGISTICS
                </h2>
                <p className="body-text mb-6">
                  Committed to carbon neutrality by 2030. Our fleet of electric
                  and hybrid vehicles, solar-powered distribution centers, and
                  AI-optimized routes are reducing our environmental impact while
                  maintaining the highest service standards.
                </p>
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { value: "40%", label: "Renewable Energy" },
                    { value: "-35%", label: "CO2 Reduction" },
                    { value: "2030", label: "Net Zero Target" },
                  ].map((stat, i) => (
                    <div key={i}>
                      <div className="text-2xl font-bold text-mint-400">{stat.value}</div>
                      <div className="text-xs text-gray-400">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

/* ─── Network Section ─── */
function NetworkSection() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let time = 0;
    const mouse = { x: 0, y: 0 };

    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    resize();
    window.addEventListener("resize", resize);

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };
    canvas.addEventListener("mousemove", handleMouseMove);

    const particles = Array.from({ length: 80 }, () => ({
      x: Math.random() * canvas.offsetWidth,
      y: Math.random() * canvas.offsetHeight,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      size: 1 + Math.random() * 2,
    }));

    const hubs = [
      { x: 0.3, y: 0.5, radius: 30 },
      { x: 0.6, y: 0.3, radius: 25 },
      { x: 0.8, y: 0.7, radius: 20 },
    ];

    const draw = () => {
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;

      ctx.fillStyle = "rgba(0, 29, 61, 0.15)";
      ctx.fillRect(0, 0, w, h);

      // Draw hubs
      hubs.forEach((hub, i) => {
        const hx = hub.x * w;
        const hy = hub.y * h;
        const pulse = Math.sin(time * 0.5 + i) * 0.3 + 0.7;

        ctx.beginPath();
        ctx.arc(hx, hy, hub.radius * pulse, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(15, 163, 177, 0.08)`;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(hx, hy, 4, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(15, 163, 177, 0.8)`;
        ctx.fill();
      });

      // Update and draw particles
      particles.forEach((p, i) => {
        // Mouse gravity
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 200) {
          const force = (200 - dist) / 200;
          p.vx -= (dx / dist) * force * 0.05;
          p.vy -= (dy / dist) * force * 0.05;
        }

        p.vx *= 0.98;
        p.vy *= 0.98;
        p.x += p.vx;
        p.y += p.vy;

        // Wrap around
        if (p.x < 0) p.x = w;
        if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h;
        if (p.y > h) p.y = 0;

        // Draw particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${0.3 + Math.sin(time + i) * 0.2})`;
        ctx.fill();

        // Draw connections
        particles.slice(i + 1).forEach((p2) => {
          const d = Math.sqrt((p.x - p2.x) ** 2 + (p.y - p2.y) ** 2);
          if (d < 100) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(15, 163, 177, ${(100 - d) / 100 * 0.15})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        });
      });

      time += 0.016;
      animId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <section className="py-24 relative overflow-hidden">
      <div className="section-padding max-w-[1400px] mx-auto">
        <div className="text-center mb-12">
          <FadeIn>
            <span className="text-teal-400 text-sm uppercase tracking-widest font-semibold">
              Network
            </span>
            <h2 className="heading-lg text-white mt-3">
              GLOBAL <span className="text-teal-400">CONNECTIVITY</span>
            </h2>
          </FadeIn>
        </div>

        <FadeIn delay={0.2}>
          <div className="relative h-[500px] rounded-2xl overflow-hidden glass-card">
            <canvas
              ref={canvasRef}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
              }}
            />
            {/* Overlay Stats Cards */}
            <div className="absolute bottom-6 left-6 right-6 grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { value: "4,200+", label: "Active Nodes" },
                { value: "99.98%", label: "Uptime" },
                { value: "150+", label: "Hub Locations" },
                { value: "<2ms", label: "Latency" },
              ].map((stat, i) => (
                <div key={i} className="glass-card p-4 text-center">
                  <div className="text-xl font-bold text-white">{stat.value}</div>
                  <div className="text-xs text-gray-400">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

/* ─── Testimonials Section ─── */
function TestimonialsSection() {
  const testimonials = [
    {
      name: "David Martinez",
      company: "GlobalTech Industries",
      role: "Supply Chain Director",
      content: "EverTruck has transformed our logistics operations. Their real-time tracking and proactive communication have reduced our delivery complaints by 90%.",
      rating: 5,
    },
    {
      name: "Jennifer Walsh",
      company: "FreshFoods Distribution",
      role: "Operations Manager",
      content: "The cold chain logistics service is exceptional. Our temperature-sensitive products arrive in perfect condition every time.",
      rating: 5,
    },
    {
      name: "Robert Chang",
      company: "BuildRight Construction",
      role: "Project Manager",
      content: "We've relied on EverTruck for heavy haul services for three years. Their specialized equipment and experienced drivers handle our oversized loads with precision.",
      rating: 5,
    },
  ];

  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-crimson-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl" />

      <div className="relative section-padding max-w-[1400px] mx-auto">
        <div className="text-center mb-16">
          <FadeIn>
            <span className="text-golden-400 text-sm uppercase tracking-widest font-semibold">
              Testimonials
            </span>
            <h2 className="heading-lg text-white mt-3">
              CLIENT <span className="text-golden-400">STORIES</span>
            </h2>
          </FadeIn>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <FadeIn key={i} delay={i * 0.15}>
              <div className="glass-card-hover p-6 h-full">
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <div
                      key={j}
                      className={`w-4 h-4 rounded-full ${
                        j < t.rating ? "bg-golden-400" : "bg-gray-600"
                      }`}
                    />
                  ))}
                </div>
                <p className="text-gray-300 text-sm leading-relaxed mb-6">
                  "{t.content}"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-crimson-500/20 flex items-center justify-center">
                    <Users className="w-5 h-5 text-crimson-400" />
                  </div>
                  <div>
                    <div className="text-white font-medium text-sm">{t.name}</div>
                    <div className="text-gray-500 text-xs">
                      {t.role}, {t.company}
                    </div>
                  </div>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Fleet Gallery Section ─── */
function FleetGallerySection() {
  const photos = [
    {
      src: "/images/fleet-hero.jpg",
      title: "Long-Haul Fleet",
      desc: "Class 8 semis deployed across interstate corridors",
      badge: "Highway",
    },
    {
      src: "/images/services/truck-highway.jpg",
      title: "On The Road",
      desc: "Real-time GPS tracking on every active route",
      badge: "Live",
    },
    {
      src: "/images/services/warehouse-ops.jpg",
      title: "Distribution Hub",
      desc: "6 automated fulfillment centers nationwide",
      badge: "Operations",
    },
  ];

  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-navy-950/30 to-transparent pointer-events-none" />
      <div className="section-padding max-w-[1400px] mx-auto">
        <div className="text-center mb-14">
          <FadeIn>
            <span className="text-crimson-400 text-sm uppercase tracking-widest font-semibold">Our Fleet</span>
            <h2 className="heading-lg text-white mt-3">
              THE <span className="text-crimson-500">FLEET</span> IN ACTION
            </h2>
            <p className="body-text max-w-xl mx-auto mt-4">
              Over 200 vehicles operating across 48 states — from heavy freight
              semis to last-mile delivery vans.
            </p>
          </FadeIn>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {photos.map((photo, i) => (
            <FadeIn key={i} delay={i * 0.12}>
              <div className="group relative rounded-2xl overflow-hidden h-72 cursor-pointer shadow-2xl">
                <img
                  src={photo.src}
                  alt={photo.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-900/90 via-navy-900/30 to-transparent" />
                {/* Badge */}
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 rounded-full bg-crimson-500/80 text-white text-xs font-bold uppercase tracking-wider backdrop-blur-sm border border-crimson-400/30">
                    {photo.badge}
                  </span>
                </div>
                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-5 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                  <h3 className="text-white font-bold text-lg">{photo.title}</h3>
                  <p className="text-gray-300 text-sm mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {photo.desc}
                  </p>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>

        <FadeIn delay={0.4}>
          <div className="mt-8 text-center">
            <Link to="/fleet" className="btn-primary inline-flex items-center gap-2 px-8 py-4 text-base">
              Explore Full Fleet Roster
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

/* ─── Team Section ─── */
function TeamSection() {
  const team = [
    { name: "James Hartwell", role: "Head of Operations", exp: "18 yrs" },
    { name: "Sarah Chen", role: "Fleet Director", exp: "12 yrs" },
    { name: "Marcus Williams", role: "Logistics Engineer", exp: "9 yrs" },
    { name: "Amira Hassan", role: "Safety & Compliance", exp: "14 yrs" },
  ];

  return (
    <section className="py-24 relative overflow-hidden">
      <div className="section-padding max-w-[1400px] mx-auto">
        <div className="grid lg:grid-cols-2 gap-14 items-center">
          {/* Left: Photo */}
          <FadeIn>
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-br from-teal-500/10 to-crimson-500/10 rounded-3xl blur-2xl" />
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src="/images/team/team-photo.jpg"
                  alt="EverTruck Team"
                  className="w-full h-[480px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-900/70 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="glass-card p-4 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-crimson-500 to-amber-500 flex items-center justify-center flex-shrink-0">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="text-white font-bold text-sm">200+ Certified Drivers</div>
                      <div className="text-gray-400 text-xs">CDL Class A & B across all 48 states</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </FadeIn>

          {/* Right: Team Info */}
          <div>
            <FadeIn>
              <span className="text-teal-400 text-sm uppercase tracking-widest font-semibold">Our People</span>
              <h2 className="heading-lg text-white mt-3 mb-4">
                THE TEAM
                <br />
                <span className="text-teal-400">BEHIND THE WHEEL</span>
              </h2>
              <p className="body-text mb-8">
                From seasoned CDL drivers to dispatch experts and operations
                analysts — our team brings decades of combined logistics
                experience to every shipment.
              </p>
            </FadeIn>

            <div className="space-y-4">
              {team.map((member, i) => (
                <FadeIn key={i} delay={i * 0.1}>
                  <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/5 hover:border-teal-500/30 hover:bg-white/[0.07] transition-all group">
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-teal-500/20 to-cyan-500/20 border border-teal-500/30 flex items-center justify-center text-teal-400 font-bold text-sm flex-shrink-0 group-hover:scale-110 transition-transform">
                      {member.name.split(" ").map((n) => n[0]).join("")}
                    </div>
                    <div className="flex-1">
                      <div className="text-white font-semibold text-sm">{member.name}</div>
                      <div className="text-gray-400 text-xs">{member.role}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-teal-400 font-bold text-sm">{member.exp}</div>
                      <div className="text-gray-500 text-xs">Experience</div>
                    </div>
                  </div>
                </FadeIn>
              ))}
            </div>

            <FadeIn delay={0.5}>
              <Link to="/about" className="mt-8 btn-secondary inline-flex items-center gap-2">
                Meet the Full Team
                <ArrowRight className="w-4 h-4" />
              </Link>
            </FadeIn>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── CTA Section ─── */
function CTASection() {
  return (
    <section className="py-24">
      <div className="section-padding max-w-[1400px] mx-auto">
        <FadeIn>
          <div className="relative glass-card p-12 lg:p-16 text-center overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-crimson-500/10 rounded-full blur-3xl" />
            <div className="relative">
              <h2 className="heading-lg text-white mb-4">
                READY TO <span className="text-crimson-400">SHIP?</span>
              </h2>
              <p className="body-text max-w-2xl mx-auto mb-8">
                Get a free quote in minutes. Our logistics experts will design a
                custom solution tailored to your specific requirements.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link to="/quote" className="btn-primary text-lg px-8 py-4 flex items-center gap-2">
                  Request a Quote
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link to="/contact" className="btn-secondary text-lg px-8 py-4">
                  Contact Sales
                </Link>
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

/* ─── Home Page ─── */
export default function Home() {
  return (
    <>
      <HeroSection />
      <ServicesSection />
      <OperationsSection />
      <FleetGallerySection />
      <SustainabilitySection />
      <TeamSection />
      <NetworkSection />
      <TestimonialsSection />
      <CTASection />
    </>
  );
}
