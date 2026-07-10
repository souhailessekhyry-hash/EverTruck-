import { useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "@/hooks/useAuth";
import { trpc } from "@/providers/trpc";
import {
  Package,
  MapPin,
  FileText,
  User,
  Clock,
  ArrowRight,
  Loader2,
  Truck,
  AlertCircle,
} from "lucide-react";

export default function Dashboard() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate("/login");
    }
  }, [authLoading, isAuthenticated, navigate]);

  const { data: shipments, isLoading: shipmentsLoading } = trpc.shipment.list.useQuery(
    undefined,
    { enabled: isAuthenticated }
  );

  const { data: invoices } = trpc.invoice.list.useQuery(
    undefined,
    { enabled: isAuthenticated }
  );

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-navy-900">
        <Loader2 className="w-8 h-8 animate-spin text-crimson-500" />
      </div>
    );
  }

  if (!isAuthenticated) return null;

  const recentShipments = shipments?.slice(0, 5) || [];
  const recentInvoices = invoices?.slice(0, 5) || [];

  const stats = [
    { label: "Total Shipments", value: shipments?.length || 0, icon: Package, color: "text-crimson-400", bg: "bg-crimson-500/10" },
    { label: "In Transit", value: shipments?.filter((s) => s.status === "in_transit").length || 0, icon: Truck, color: "text-teal-400", bg: "bg-teal-500/10" },
    { label: "Delivered", value: shipments?.filter((s) => s.status === "delivered").length || 0, icon: MapPin, color: "text-mint-400", bg: "bg-mint-500/10" },
    { label: "Invoices", value: invoices?.length || 0, icon: FileText, color: "text-golden-400", bg: "bg-golden-500/10" },
  ];

  return (
    <div className="pt-20 min-h-screen bg-navy-900">
      <div className="section-padding max-w-[1400px] mx-auto py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">
              Welcome, {user?.firstName || user?.name || "User"}
            </h1>
            <p className="text-gray-400 mt-1">Manage your shipments and account</p>
          </div>
          <div className="flex gap-3">
            <Link to="/tracking" className="btn-primary text-sm flex items-center gap-2">
              <Package className="w-4 h-4" />
              Track Shipment
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, i) => (
            <div key={i} className="glass-card p-5">
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 rounded-lg ${stat.bg} flex items-center justify-center`}>
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                </div>
                <span className="text-2xl font-bold text-white">{stat.value}</span>
              </div>
              <div className="text-sm text-gray-400">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Recent Shipments */}
          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                <Package className="w-5 h-5 text-crimson-400" />
                Recent Shipments
              </h2>
              <Link to="/tracking" className="text-sm text-crimson-400 hover:text-crimson-300 flex items-center gap-1">
                View All <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {shipmentsLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-crimson-500" />
              </div>
            ) : recentShipments.length > 0 ? (
              <div className="space-y-3">
                {recentShipments.map((s) => (
                  <div key={s.id} className="flex items-center gap-4 p-3 rounded-lg bg-white/5">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      s.status === "delivered" ? "bg-mint-500/10" :
                      s.status === "in_transit" ? "bg-teal-500/10" :
                      "bg-golden-500/10"
                    }`}>
                      <Truck className={`w-5 h-5 ${
                        s.status === "delivered" ? "text-mint-400" :
                        s.status === "in_transit" ? "text-teal-400" :
                        "text-golden-400"
                      }`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-white truncate">{s.trackingNumber}</div>
                      <div className="text-xs text-gray-500">{s.origin} → {s.destination}</div>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      s.status === "delivered" ? "bg-mint-500/10 text-mint-400" :
                      s.status === "in_transit" ? "bg-teal-500/10 text-teal-400" :
                      "bg-golden-500/10 text-golden-400"
                    }`}>
                      {s.status}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <AlertCircle className="w-10 h-10 text-gray-600 mx-auto mb-2" />
                <p className="text-gray-500 text-sm">No shipments yet</p>
              </div>
            )}
          </div>

          {/* Recent Invoices */}
          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-golden-400" />
                Recent Invoices
              </h2>
            </div>

            {recentInvoices.length > 0 ? (
              <div className="space-y-3">
                {recentInvoices.map((inv) => (
                  <div key={inv.id} className="flex items-center gap-4 p-3 rounded-lg bg-white/5">
                    <div className="w-10 h-10 rounded-lg bg-golden-500/10 flex items-center justify-center">
                      <FileText className="w-5 h-5 text-golden-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-white">{inv.invoiceNumber}</div>
                      <div className="text-xs text-gray-500">
                        <Clock className="w-3 h-3 inline mr-1" />
                        {new Date((inv.createdAt ?? Date.now()) as Date).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-white">${inv.total}</div>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        inv.status === "paid" ? "bg-mint-500/10 text-mint-400" :
                        inv.status === "overdue" ? "bg-red-500/10 text-red-400" :
                        "bg-golden-500/10 text-golden-400"
                      }`}>
                        {inv.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <AlertCircle className="w-10 h-10 text-gray-600 mx-auto mb-2" />
                <p className="text-gray-500 text-sm">No invoices yet</p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-6 glass-card p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Quick Actions</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { label: "Track Shipment", icon: Package, href: "/tracking", desc: "Check delivery status" },
              { label: "Request Quote", icon: FileText, href: "/quote", desc: "Get shipping rates" },
              { label: "Contact Support", icon: User, href: "/contact", desc: "Get help" },
            ].map((action, i) => (
              <Link
                key={i}
                to={action.href}
                className="flex items-center gap-4 p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
              >
                <div className="w-12 h-12 rounded-lg bg-crimson-500/10 flex items-center justify-center">
                  <action.icon className="w-6 h-6 text-crimson-400" />
                </div>
                <div>
                  <div className="text-white font-medium">{action.label}</div>
                  <div className="text-xs text-gray-500">{action.desc}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
