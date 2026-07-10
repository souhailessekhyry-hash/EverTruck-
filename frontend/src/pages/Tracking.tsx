import { useState } from "react";
import { motion } from "framer-motion";
import { trpc } from "@/providers/trpc";
import {
  Search,
  MapPin,
  Clock,
  Package,
  CheckCircle,
  Truck,
  AlertCircle,
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

const statusConfig: Record<string, { icon: typeof Package; color: string; bg: string; label: string }> = {
  pending: { icon: Clock, color: "text-golden-400", bg: "bg-golden-500/10", label: "Pending" },
  picked_up: { icon: Truck, color: "text-teal-400", bg: "bg-teal-500/10", label: "Picked Up" },
  in_transit: { icon: Truck, color: "text-crimson-400", bg: "bg-crimson-500/10", label: "In Transit" },
  out_for_delivery: { icon: Package, color: "text-mint-400", bg: "bg-mint-500/10", label: "Out for Delivery" },
  delivered: { icon: CheckCircle, color: "text-mint-400", bg: "bg-mint-500/10", label: "Delivered" },
  cancelled: { icon: AlertCircle, color: "text-red-400", bg: "bg-red-500/10", label: "Cancelled" },
  on_hold: { icon: Clock, color: "text-golden-400", bg: "bg-golden-500/10", label: "On Hold" },
};

export default function Tracking() {
  const [trackingNumber, setTrackingNumber] = useState("");
  const [searched, setSearched] = useState(false);

  const {
    data: shipment,
    isLoading,
    error,
  } = trpc.shipment.getByTracking.useQuery(
    { trackingNumber },
    { enabled: searched && trackingNumber.length > 0, retry: false }
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingNumber.trim()) {
      toast.error("Please enter a tracking number");
      return;
    }
    setSearched(true);
  };

  const handleQuickTrack = (num: string) => {
    setTrackingNumber(num);
    setSearched(true);
  };

  const status = shipment?.status ? statusConfig[shipment.status] : null;

  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-crimson-500/5 to-teal-500/5" />
        <div className="relative section-padding max-w-[1400px] mx-auto">
          <div className="text-center max-w-2xl mx-auto">
            <FadeIn>
              <span className="text-crimson-400 text-sm uppercase tracking-widest font-semibold">
                Track & Trace
              </span>
              <h1 className="heading-xl text-white mt-4 mb-6">
                SHIPMENT <span className="text-crimson-500">TRACKING</span>
              </h1>
              <p className="body-text">
                Enter your tracking number to get real-time updates on your shipment's
                location and estimated delivery time.
              </p>
            </FadeIn>
          </div>

          {/* Search Form */}
          <FadeIn delay={0.2}>
            <form onSubmit={handleSearch} className="mt-10 max-w-xl mx-auto">
              <div className="flex gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type="text"
                    value={trackingNumber}
                    onChange={(e) => { setTrackingNumber(e.target.value); setSearched(false); }}
                    placeholder="Enter tracking number (e.g., EVT-2024-A001)"
                    className="input-field w-full pl-12 pr-4 py-4"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="btn-primary px-8 py-4 disabled:opacity-50"
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    "Track"
                  )}
                </button>
              </div>
            </form>
          </FadeIn>

          {/* Quick Track */}
          <FadeIn delay={0.3}>
            <div className="mt-6 text-center">
              <span className="text-gray-500 text-sm">Try: </span>
              {["EVT-2024-A001", "EVT-2024-A002", "EVT-2024-A003"].map((num) => (
                <button
                  key={num}
                  onClick={() => handleQuickTrack(num)}
                  className="text-sm text-crimson-400 hover:text-crimson-300 mx-2 underline"
                >
                  {num}
                </button>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Results */}
      {searched && !isLoading && (
        <section className="pb-24">
          <div className="section-padding max-w-[1000px] mx-auto">
            {error || !shipment ? (
              <FadeIn>
                <div className="glass-card p-12 text-center">
                  <AlertCircle className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">
                    Shipment Not Found
                  </h3>
                  <p className="text-gray-400">
                    We couldn't find a shipment with tracking number "{trackingNumber}".
                    Please check the number and try again.
                  </p>
                </div>
              </FadeIn>
            ) : (
              <div className="space-y-6">
                {/* Shipment Header */}
                <FadeIn>
                  <div className="glass-card p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <h2 className="text-2xl font-bold text-white">
                            {shipment.trackingNumber}
                          </h2>
                          {status && (
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${status.bg} ${status.color}`}>
                              {status.label}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-6 text-sm text-gray-400">
                          <span className="flex items-center gap-2">
                            <MapPin className="w-4 h-4" />
                            From: {shipment.origin}
                          </span>
                          <span className="flex items-center gap-2">
                            <MapPin className="w-4 h-4" />
                            To: {shipment.destination}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-400">Estimated Delivery</div>
                        <div className="text-lg font-semibold text-white">
                          {shipment.estimatedDelivery
                            ? String(new Date(String(shipment.estimatedDelivery)).toLocaleDateString("en-US", {
                                month: "long",
                                day: "numeric",
                                year: "numeric",
                              }))
                            : "TBD"}
                        </div>
                      </div>
                    </div>
                  </div>
                </FadeIn>

                {/* Progress Bar */}
                <FadeIn delay={0.1}>
                  <div className="glass-card p-6">
                    <div className="relative">
                      <div className="flex justify-between mb-2">
                        {["Pending", "Picked Up", "In Transit", "Out for Delivery", "Delivered"].map((step, i) => {
                          const stepKeys = ["pending", "picked_up", "in_transit", "out_for_delivery", "delivered"];
                          const currentStep = stepKeys.indexOf(shipment.status ?? "");
                          const isActive = i <= currentStep;
                          const isCurrent = i === currentStep;
                          return (
                            <div key={i} className="flex flex-col items-center flex-1">
                              <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold mb-1 ${
                                  isCurrent
                                    ? "bg-crimson-500 text-white"
                                    : isActive
                                    ? "bg-mint-500/20 text-mint-400"
                                    : "bg-white/5 text-gray-600"
                                }`}
                              >
                                {isActive && !isCurrent ? (
                                  <CheckCircle className="w-4 h-4" />
                                ) : (
                                  i + 1
                                )}
                              </div>
                              <span className={`text-xs ${isActive ? "text-white" : "text-gray-600"}`}>
                                {step}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                      <div className="absolute top-4 left-4 right-4 h-0.5 bg-white/5 -z-10">
                        <div
                          className="h-full bg-crimson-500 transition-all duration-500"
                          style={{
                            width: `${
                              (["pending", "picked_up", "in_transit", "out_for_delivery", "delivered"].indexOf(
                                shipment.status ?? ""
                              ) /
                                4) *
                              100
                            }%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </FadeIn>

                {/* Shipment Details */}
                <FadeIn delay={0.2}>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="glass-card p-6">
                      <h3 className="text-lg font-semibold text-white mb-4">Shipment Details</h3>
                      <div className="space-y-3">
                        {[
                          { label: "Weight", value: shipment.weight ? `${shipment.weight} kg` : "N/A" },
                          { label: "Dimensions", value: shipment.dimensions || "N/A" },
                          { label: "Priority", value: shipment.priority || "Normal" },
                          { label: "Created", value: shipment.createdAt ? new Date(shipment.createdAt).toLocaleDateString() : "N/A" },
                        ].map((item, i) => (
                          <div key={i} className="flex justify-between text-sm">
                            <span className="text-gray-400">{item.label}</span>
                            <span className="text-white">{item.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="glass-card p-6">
                      <h3 className="text-lg font-semibold text-white mb-4">Tracking History</h3>
                      <div className="space-y-4">
                        {shipment.events && shipment.events.length > 0 ? (
                          [...shipment.events].reverse().map((event, i) => (
                            <div key={i} className="flex gap-4">
                              <div className="flex flex-col items-center">
                                <div className="w-3 h-3 rounded-full bg-crimson-500" />
                                {i < shipment.events!.length - 1 && (
                                  <div className="w-px h-full bg-white/10 mt-1" />
                                )}
                              </div>
                              <div className="pb-4">
                                <div className="text-sm text-white font-medium">
                                  {event.description}
                                </div>
                                <div className="text-xs text-gray-500 mt-1">
                                  {event.location} • {new Date(String(event.timestamp ?? Date.now())).toLocaleString()}
                                </div>
                              </div>
                            </div>
                          ))
                        ) : (
                          <p className="text-gray-500 text-sm">No tracking events yet.</p>
                        )}
                      </div>
                    </div>
                  </div>
                </FadeIn>
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  );
}
