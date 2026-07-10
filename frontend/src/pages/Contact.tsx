import { useState } from "react";
import { motion } from "framer-motion";
import { trpc } from "@/providers/trpc";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  CheckCircle,
  Loader2,
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

export default function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const submitContact = trpc.contact.submit.useMutation({
    onSuccess: () => {
      setSubmitted(true);
      toast.success("Message sent successfully!");
    },
    onError: (err) => {
      toast.error(err.message || "Failed to send message");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error("Please fill in all required fields");
      return;
    }
    submitContact.mutate(form);
  };

  if (submitted) {
    return (
      <div className="pt-20">
        <section className="py-24">
          <div className="section-padding max-w-[600px] mx-auto text-center">
            <FadeIn>
              <div className="glass-card p-12">
                <CheckCircle className="w-16 h-16 text-mint-400 mx-auto mb-6" />
                <h2 className="heading-md text-white mb-4">Message Sent</h2>
                <p className="body-text">
                  Thank you for reaching out! We'll get back to you within 24 hours.
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
              Get in Touch
            </span>
            <h1 className="heading-xl text-white mt-4 mb-6">
              CONTACT <span className="text-crimson-500">US</span>
            </h1>
            <p className="body-text max-w-2xl mx-auto">
              Have a question or need a custom solution? Our team is ready to help.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Contact Info + Form */}
      <section className="pb-24">
        <div className="section-padding max-w-[1200px] mx-auto">
          <div className="grid lg:grid-cols-5 gap-12">
            {/* Contact Info */}
            <div className="lg:col-span-2">
              <FadeIn>
                <div className="space-y-6">
                  {[
                    {
                      icon: Mail,
                      title: "Email",
                      lines: ["contact@evertruck.com", "support@evertruck.com"],
                    },
                    {
                      icon: Phone,
                      title: "Phone",
                      lines: ["+1 (800) 555-EVER", "+1 (212) 555-0100"],
                    },
                    {
                      icon: MapPin,
                      title: "Address",
                      lines: ["1234 Logistics Blvd", "New York, NY 10001"],
                    },
                    {
                      icon: Clock,
                      title: "Hours",
                      lines: ["Mon - Fri: 8:00 AM - 8:00 PM", "Sat - Sun: 9:00 AM - 5:00 PM"],
                    },
                  ].map((item, i) => (
                    <div key={i} className="glass-card p-5">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-lg bg-crimson-500/10 flex items-center justify-center">
                          <item.icon className="w-5 h-5 text-crimson-400" />
                        </div>
                        <h3 className="text-white font-semibold">{item.title}</h3>
                      </div>
                      {item.lines.map((line, j) => (
                        <p key={j} className="text-gray-400 text-sm pl-13">
                          {line}
                        </p>
                      ))}
                    </div>
                  ))}
                </div>
              </FadeIn>
            </div>

            {/* Form */}
            <div className="lg:col-span-3">
              <FadeIn delay={0.2}>
                <form onSubmit={handleSubmit} className="glass-card p-8 space-y-5">
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">Name *</label>
                      <input
                        type="text"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        className="input-field w-full"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">Email *</label>
                      <input
                        type="email"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        className="input-field w-full"
                        required
                      />
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">Phone</label>
                      <input
                        type="tel"
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        className="input-field w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">Subject</label>
                      <input
                        type="text"
                        value={form.subject}
                        onChange={(e) => setForm({ ...form, subject: e.target.value })}
                        className="input-field w-full"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Message *</label>
                    <textarea
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      rows={5}
                      className="input-field w-full resize-none"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={submitContact.isPending}
                    className="btn-primary w-full flex items-center justify-center gap-2 py-4 disabled:opacity-50"
                  >
                    {submitContact.isPending ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        Send Message
                        <Send className="w-5 h-5" />
                      </>
                    )}
                  </button>
                </form>
              </FadeIn>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
