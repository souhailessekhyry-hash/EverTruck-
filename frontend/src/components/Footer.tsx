import { Link } from "react-router";
import { Truck, Mail, Phone, MapPin, ArrowRight } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const footerLinks = {
  services: [
    { label: "Freight Transport", href: "/services" },
    { label: "Warehousing", href: "/services" },
    { label: "Heavy Haul", href: "/services" },
    { label: "Last Mile Delivery", href: "/services" },
    { label: "Cold Chain", href: "/services" },
  ],
  company: [
    { label: "About Us", href: "/about" },
    { label: "Our Fleet", href: "/fleet" },
    { label: "Careers", href: "/about" },
    { label: "Blog", href: "/blog" },
    { label: "Contact", href: "/contact" },
  ],
  support: [
    { label: "Track Shipment", href: "/tracking" },
    { label: "Get a Quote", href: "/quote" },
    { label: "FAQ", href: "/faq" },
    { label: "Help Center", href: "/faq" },
  ],
  legal: [
    { label: "Privacy Policy", href: "#" },
    { label: "Terms of Service", href: "#" },
    { label: "Cookie Policy", href: "#" },
  ],
};

export default function Footer() {
  const [email, setEmail] = useState("");

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      toast.success("Subscribed to newsletter!");
      setEmail("");
    }
  };

  return (
    <footer className="bg-navy-950 border-t border-white/5">
      {/* Newsletter Section */}
      <div className="section-padding py-16 border-b border-white/5">
        <div className="max-w-[1400px] mx-auto">
          <div className="glass-card p-8 lg:p-12 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-crimson-500/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl" />
            <div className="relative grid lg:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="heading-md text-white mb-3">
                  Stay Updated with{" "}
                  <span className="text-crimson-400">EverTruck</span>
                </h3>
                <p className="body-text">
                  Subscribe to our newsletter for the latest logistics insights,
                  industry news, and company updates.
                </p>
              </div>
              <form onSubmit={handleSubscribe} className="flex gap-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="input-field flex-1"
                  required
                />
                <button
                  type="submit"
                  className="btn-primary flex items-center gap-2 whitespace-nowrap"
                >
                  Subscribe
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="section-padding py-16">
        <div className="max-w-[1400px] mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 lg:gap-12">
            {/* Brand Column */}
            <div className="col-span-2 md:col-span-3 lg:col-span-2">
              <Link to="/" className="flex items-center gap-2 mb-6">
                <Truck className="w-8 h-8 text-crimson-500" />
                <span className="text-2xl font-bold">
                  <span className="text-white">Ever</span>
                  <span className="text-crimson-500">Truck</span>
                </span>
              </Link>
              <p className="text-gray-400 text-sm mb-6 max-w-xs leading-relaxed">
                Premium logistics and transport solutions. Delivering excellence
                across the globe with cutting-edge technology and unmatched
                reliability.
              </p>
              <div className="flex flex-col gap-3">
                <a
                  href="mailto:contact@evertruck.com"
                  className="flex items-center gap-3 text-sm text-gray-400 hover:text-white transition-colors"
                >
                  <Mail className="w-4 h-4 text-crimson-500" />
                  contact@evertruck.com
                </a>
                <a
                  href="tel:+18005553837"
                  className="flex items-center gap-3 text-sm text-gray-400 hover:text-white transition-colors"
                >
                  <Phone className="w-4 h-4 text-crimson-500" />
                  +1 (800) 555-EVER
                </a>
                <div className="flex items-center gap-3 text-sm text-gray-400">
                  <MapPin className="w-4 h-4 text-crimson-500" />
                  1234 Logistics Blvd, New York, NY 10001
                </div>
              </div>
            </div>

            {/* Services */}
            <div>
              <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">
                Services
              </h4>
              <ul className="space-y-3">
                {footerLinks.services.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.href}
                      className="text-sm text-gray-400 hover:text-crimson-400 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">
                Company
              </h4>
              <ul className="space-y-3">
                {footerLinks.company.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.href}
                      className="text-sm text-gray-400 hover:text-crimson-400 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support */}
            <div>
              <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">
                Support
              </h4>
              <ul className="space-y-3">
                {footerLinks.support.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.href}
                      className="text-sm text-gray-400 hover:text-crimson-400 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">
                Legal
              </h4>
              <ul className="space-y-3">
                {footerLinks.legal.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.href}
                      className="text-sm text-gray-400 hover:text-crimson-400 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/5 section-padding py-6">
        <div className="max-w-[1400px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} EverTruck Logistics. All rights
            reserved.
          </p>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span>Made with</span>
            <span className="text-crimson-500">precision</span>
            <span>and</span>
            <span className="text-teal-400">care</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
