import { useState } from "react";
import { motion } from "framer-motion";
import { trpc } from "@/providers/trpc";
import {
  CheckCircle,
  ArrowRight,
  Loader2,
  Package,
  MapPin,
  Weight,
  MessageSquare,
} from "lucide-react";
import { toast } from "sonner";

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

export default function Quote() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    origin: "",
    destination: "",
    cargoType: "",
    weight: "",
    dimensions: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const submitQuote = trpc.quote.submit.useMutation({
    onSuccess: () => {
      setSubmitted(true);
      toast.success("Quote request submitted successfully!");
    },
    onError: (err) => {
      toast.error(err.message || "Failed to submit quote request");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.origin || !form.destination) {
      toast.error("Please fill in all required fields");
      return;
    }
    submitQuote.mutate(form);
  };

  const updateField = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  if (submitted) {
    return (
      <div className="pt-20">
        <section className="py-24">
          <div className="section-padding max-w-[600px] mx-auto text-center">
            <FadeIn>
              <div className="glass-card p-12">
                <CheckCircle className="w-16 h-16 text-mint-400 mx-auto mb-6" />
                <h2 className="heading-md text-white mb-4">Quote Request Received</h2>
                <p className="body-text">
                  Thank you for your request! Our team will review your requirements
                  and get back to you within 24 hours with a customized quote.
                </p>
              </div>
            </FadeIn>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-crimson-500/5 to-teal-500/5" />
        <div className="relative section-padding max-w-[1400px] mx-auto text-center">
          <FadeIn>
            <span className="text-crimson-400 text-sm uppercase tracking-widest font-semibold">
              Get a Quote
            </span>
            <h1 className="heading-xl text-white mt-4 mb-6">
              REQUEST A <span className="text-crimson-500">QUOTE</span>
            </h1>
            <p className="body-text max-w-2xl mx-auto">
              Fill out the form below and our logistics experts will prepare a
              customized quote for your shipping needs.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Form */}
      <section className="pb-24">
        <div className="section-padding max-w-[800px] mx-auto">
          <FadeIn>
            <form onSubmit={handleSubmit} className="glass-card p-8 space-y-6">
              {/* Contact Info */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Package className="w-5 h-5 text-crimson-400" />
                  Contact Information
                </h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Name *</label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) => updateField("name", e.target.value)}
                      className="input-field w-full"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Email *</label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => updateField("email", e.target.value)}
                      className="input-field w-full"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Phone</label>
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={(e) => updateField("phone", e.target.value)}
                      className="input-field w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Company</label>
                    <input
                      type="text"
                      value={form.company}
                      onChange={(e) => updateField("company", e.target.value)}
                      className="input-field w-full"
                    />
                  </div>
                </div>
              </div>

              {/* Shipping Details */}
              <div className="border-t border-white/5 pt-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-crimson-400" />
                  Shipping Details
                </h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Origin *</label>
                    <input
                      type="text"
                      value={form.origin}
                      onChange={(e) => updateField("origin", e.target.value)}
                      placeholder="City, State"
                      className="input-field w-full"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Destination *</label>
                    <input
                      type="text"
                      value={form.destination}
                      onChange={(e) => updateField("destination", e.target.value)}
                      placeholder="City, State"
                      className="input-field w-full"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Cargo Type</label>
                    <select
                      value={form.cargoType}
                      onChange={(e) => updateField("cargoType", e.target.value)}
                      className="input-field w-full"
                    >
                      <option value="">Select type</option>
                      <option value="general">General Freight</option>
                      <option value="refrigerated">Refrigerated</option>
                      <option value="hazmat">Hazardous Materials</option>
                      <option value="oversized">Oversized/Heavy</option>
                      <option value="fragile">Fragile</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Cargo Specs */}
              <div className="border-t border-white/5 pt-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Weight className="w-5 h-5 text-crimson-400" />
                  Cargo Specifications
                </h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Weight (kg)</label>
                    <input
                      type="number"
                      value={form.weight}
                      onChange={(e) => updateField("weight", e.target.value)}
                      placeholder="e.g., 5000"
                      className="input-field w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Dimensions (LxWxH)</label>
                    <input
                      type="text"
                      value={form.dimensions}
                      onChange={(e) => updateField("dimensions", e.target.value)}
                      placeholder="e.g., 120x80x100 cm"
                      className="input-field w-full"
                    />
                  </div>
                </div>
              </div>

              {/* Message */}
              <div className="border-t border-white/5 pt-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-crimson-400" />
                  Additional Information
                </h3>
                <textarea
                  value={form.message}
                  onChange={(e) => updateField("message", e.target.value)}
                  placeholder="Any special requirements or notes..."
                  rows={4}
                  className="input-field w-full resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={submitQuote.isPending}
                className="btn-primary w-full flex items-center justify-center gap-2 py-4 disabled:opacity-50"
              >
                {submitQuote.isPending ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    Submit Quote Request
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>
          </FadeIn>
        </div>
      </section>
    </div>
  );
}
