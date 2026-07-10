import { useState } from "react";
import { motion } from "framer-motion";
import { trpc } from "@/providers/trpc";
import {
  ChevronDown,
  Loader2,
  Search,
  HelpCircle,
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

export default function FAQ() {
  const [openId, setOpenId] = useState<number | null>(null);
  const [search, setSearch] = useState("");

  const { data: faqs, isLoading } = trpc.faq.list.useQuery();

  const filteredFaqs = faqs?.filter(
    (faq) =>
      faq.question.toLowerCase().includes(search.toLowerCase()) ||
      faq.answer.toLowerCase().includes(search.toLowerCase())
  );

  const categories = [...new Set(faqs?.map((f) => f.category).filter(Boolean) || [])];

  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-crimson-500/5 to-teal-500/5" />
        <div className="relative section-padding max-w-[1400px] mx-auto text-center">
          <FadeIn>
            <span className="text-crimson-400 text-sm uppercase tracking-widest font-semibold">
              Support
            </span>
            <h1 className="heading-xl text-white mt-4 mb-6">
              FREQUENTLY ASKED <span className="text-crimson-500">QUESTIONS</span>
            </h1>
            <p className="body-text max-w-2xl mx-auto">
              Find answers to common questions about our services, processes, and policies.
            </p>
          </FadeIn>

          {/* Search */}
          <FadeIn delay={0.2}>
            <div className="mt-10 max-w-lg mx-auto relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search questions..."
                className="input-field w-full pl-12 pr-4 py-4"
              />
            </div>
          </FadeIn>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="pb-24">
        <div className="section-padding max-w-[900px] mx-auto">
          {isLoading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-crimson-500" />
            </div>
          ) : filteredFaqs && filteredFaqs.length > 0 ? (
            <div className="space-y-4">
              {categories.map((category) => (
                <div key={category} className="mb-8">
                  <h3 className="text-lg font-semibold text-teal-400 mb-4 uppercase tracking-wider">
                    {category}
                  </h3>
                  {filteredFaqs
                    .filter((f) => f.category === category)
                    .map((faq, i) => (
                      <FadeIn key={faq.id} delay={i * 0.05}>
                        <div className="glass-card mb-3 overflow-hidden">
                          <button
                            onClick={() => setOpenId(openId === faq.id ? null : faq.id)}
                            className="w-full flex items-center justify-between p-5 text-left"
                          >
                            <span className="text-white font-medium pr-4">{faq.question}</span>
                            <ChevronDown
                              className={`w-5 h-5 text-crimson-400 flex-shrink-0 transition-transform duration-300 ${
                                openId === faq.id ? "rotate-180" : ""
                              }`}
                            />
                          </button>
                          <div
                            className={`overflow-hidden transition-all duration-300 ${
                              openId === faq.id ? "max-h-96" : "max-h-0"
                            }`}
                          >
                            <div className="px-5 pb-5 text-gray-400 leading-relaxed border-t border-white/5 pt-4">
                              {faq.answer}
                            </div>
                          </div>
                        </div>
                      </FadeIn>
                    ))}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <HelpCircle className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-500">
                {search ? "No results found for your search." : "No FAQs available yet."}
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
