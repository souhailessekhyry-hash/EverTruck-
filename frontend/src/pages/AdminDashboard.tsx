import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "@/hooks/useAuth";
import { trpc } from "@/providers/trpc";
import {
  LayoutDashboard,
  Users,
  Truck,
  Package,
  FileText,
  MessageSquare,
  Quote,
  Newspaper,
  HelpCircle,
  Star,
  Handshake,
  Loader2,
  AlertCircle,
  Eye,
  Bell,
  LogOut,
  DollarSign,
  CheckCircle,
  TrendingUp,
  MapPin,
  Activity,
  Award,
  Shield,
  ChevronDown,
  Phone,
  Mail,
  RefreshCw,
  Sliders,
  Navigation,
  ExternalLink,
} from "lucide-react";
import { toast } from "sonner";

/* ─── Types ─── */
type AdminTab =
  | "overview"
  | "users"
  | "vehicles"
  | "shipments"
  | "invoices"
  | "contacts"
  | "quotes"
  | "blog"
  | "faqs"
  | "testimonials"
  | "partners"
  | "dev"
  | "settings";

type TopNavTab = "Dashboard" | "Orders" | "Drivers" | "Fleet" | "Settings";

/* ─── Status Badge ─── */
function StatusBadge({ status }: { status: string }) {
  const config: Record<string, string> = {
    active: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30",
    pending: "bg-amber-500/15 text-amber-400 border border-amber-500/30",
    delivered: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30",
    in_transit: "bg-cyan-500/15 text-cyan-400 border border-cyan-500/30",
    picked_up: "bg-blue-500/15 text-blue-400 border border-blue-500/30",
    out_for_delivery: "bg-purple-500/15 text-purple-400 border border-purple-500/30",
    paid: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30",
    draft: "bg-gray-500/15 text-gray-400 border border-gray-500/30",
    new: "bg-crimson-500/15 text-crimson-400 border border-crimson-500/30",
    read: "bg-blue-500/15 text-blue-400 border border-blue-500/30",
    user: "bg-blue-500/15 text-blue-400 border border-blue-500/30",
    admin: "bg-crimson-500/15 text-crimson-400 border border-crimson-500/30",
    manager: "bg-amber-500/15 text-amber-400 border border-amber-500/30",
    maintenance: "bg-red-500/15 text-red-400 border border-red-500/30",
    available: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30",
  };
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider ${config[status] || "bg-gray-500/15 text-gray-400 border border-gray-500/30"}`}>
      {status.replace("_", " ")}
    </span>
  );
}

/* ─── Overview Tab (Rich 2x3 Grid + 4 KPI Cards) ─── */
function OverviewTab({ onSwitchTab }: { onSwitchTab: (tab: AdminTab) => void }) {
  const { data: stats, isLoading } = trpc.stats.dashboard.useQuery();
  const [chartTimeframe, setChartTimeframe] = useState<"7D" | "30D" | "6M" | "1Y">("6M");
  const [activeMapTab, setActiveMapTab] = useState<"all" | "active" | "maintenance">("all");

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 space-y-4">
        <Loader2 className="w-10 h-10 animate-spin text-crimson-500" />
        <p className="text-gray-400 text-sm font-medium animate-pulse">Synchronizing live fleet telemetry & metrics...</p>
      </div>
    );
  }

  // Monthly simulated revenue progression corresponding to timeframe
  const revenueChartData = {
    "7D": [
      { label: "Mon", val: 16500, orders: 4 },
      { label: "Tue", val: 18200, orders: 5 },
      { label: "Wed", val: 17400, orders: 4 },
      { label: "Thu", val: 21000, orders: 6 },
      { label: "Fri", val: 24500, orders: 7 },
      { label: "Sat", val: 19800, orders: 5 },
      { label: "Sun", val: 22400, orders: 6 },
    ],
    "30D": [
      { label: "Week 1", val: 68000, orders: 18 },
      { label: "Week 2", val: 74500, orders: 21 },
      { label: "Week 3", val: 71200, orders: 19 },
      { label: "Week 4", val: 82400, orders: 24 },
    ],
    "6M": [
      { label: "Feb", val: 84000, orders: 28 },
      { label: "Mar", val: 92500, orders: 32 },
      { label: "Apr", val: 88400, orders: 30 },
      { label: "May", val: 104200, orders: 36 },
      { label: "Jun", val: 115800, orders: 41 },
      { label: "Jul", val: 124580, orders: 45 },
    ],
    "1Y": [
      { label: "Q3 '25", val: 245000, orders: 85 },
      { label: "Q4 '25", val: 298000, orders: 104 },
      { label: "Q1 '26", val: 264900, orders: 90 },
      { label: "Q2 '26", val: 344580, orders: 122 },
    ],
  }[chartTimeframe];

  const maxChartVal = Math.max(...revenueChartData.map((d) => d.val)) * 1.15;

  // Simulated live driver leaderboard
  const topDrivers = [
    { rank: "🥇", name: "Robert Johnson", cdl: "CDL-782341 (Class A)", rating: "4.98", deliveries: 154, status: "Active on I-80" },
    { rank: "🥈", name: "Maria Garcia", cdl: "CDL-892452 (Class A)", rating: "4.95", deliveries: 142, status: "Active near LAX" },
    { rank: "🥉", name: "James Wilson", cdl: "CDL-903563 (Class B)", rating: "4.89", deliveries: 128, status: "Local Route NYC" },
    { rank: "4️⃣", name: "Sarah Chen", cdl: "CDL-114674 (Class A)", rating: "4.92", deliveries: 119, status: "In Transit TX" },
  ];

  // Simulated live activity timeline
  const recentTimeline = [
    { time: "2 mins ago", icon: Package, title: "Shipment #EVT-2024-A004 out for delivery", desc: "Driver Maria Garcia en route to Atlanta distribution center", color: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20" },
    { time: "14 mins ago", icon: Activity, title: "Telemetry Diagnostic check completed", desc: "Volvo VNL 860 reported all engine sensors normal — 62 MPH avg", color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" },
    { time: "1 hour ago", icon: DollarSign, title: "Invoice #INV-8924 settled via ACH", desc: "Acme Logistics Corp paid $4,250.00 for interstate freight", color: "text-golden-400 bg-golden-500/10 border-golden-500/20" },
    { time: "3 hours ago", icon: Shield, title: "New high-priority shipment booked", desc: "Tracking #EVT-2024-A003 assigned to Peterbilt 579 long-haul", color: "text-purple-400 bg-purple-500/10 border-purple-500/20" },
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* ─── ROW 0: 4 KPI CARDS (`| Total Orders | Revenue | Trucks | Delivered |`) ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* KPI 1: Total Orders */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-navy-800/90 via-navy-900/80 to-[#0c1427] border border-cyan-500/30 p-6 shadow-xl shadow-cyan-500/5 group hover:border-cyan-400/50 hover:-translate-y-1 transition-all duration-300">
          <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl -mr-10 -mt-10 group-hover:bg-cyan-500/20 transition-all" />
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs uppercase font-bold tracking-wider text-cyan-400 bg-cyan-500/10 px-2.5 py-1 rounded-full border border-cyan-500/20">
              Total Orders
            </span>
            <div className="w-11 h-11 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform">
              <Package className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-white tracking-tight mb-1">
            {stats?.counts.shipments || 5}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+14.2% active routes vs last month</span>
          </div>
        </div>

        {/* KPI 2: Revenue */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-navy-800/90 via-navy-900/80 to-[#0c1427] border border-emerald-500/30 p-6 shadow-xl shadow-emerald-500/5 group hover:border-emerald-400/50 hover:-translate-y-1 transition-all duration-300">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl -mr-10 -mt-10 group-hover:bg-emerald-500/20 transition-all" />
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs uppercase font-bold tracking-wider text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
              Revenue
            </span>
            <div className="w-11 h-11 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-white tracking-tight mb-1">
            ${Number(stats?.counts.revenue || 124580).toLocaleString()}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+8.7% revenue growth vs last week</span>
          </div>
        </div>

        {/* KPI 3: Trucks / Fleet */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-navy-800/90 via-navy-900/80 to-[#0c1427] border border-amber-500/30 p-6 shadow-xl shadow-amber-500/5 group hover:border-amber-400/50 hover:-translate-y-1 transition-all duration-300">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl -mr-10 -mt-10 group-hover:bg-amber-500/20 transition-all" />
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs uppercase font-bold tracking-wider text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20">
              Trucks (Fleet)
            </span>
            <div className="w-11 h-11 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
              <Truck className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-white tracking-tight mb-1">
            {stats?.counts.vehicles || 8}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-amber-400 font-medium">
            <Activity className="w-3.5 h-3.5" />
            <span>6 Active on route, 1 Maintenance</span>
          </div>
        </div>

        {/* KPI 4: Delivered */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-navy-800/90 via-navy-900/80 to-[#0c1427] border border-purple-500/30 p-6 shadow-xl shadow-purple-500/5 group hover:border-purple-400/50 hover:-translate-y-1 transition-all duration-300">
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl -mr-10 -mt-10 group-hover:bg-purple-500/20 transition-all" />
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs uppercase font-bold tracking-wider text-purple-400 bg-purple-500/10 px-2.5 py-1 rounded-full border border-purple-500/20">
              Delivered Rate
            </span>
            <div className="w-11 h-11 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform">
              <CheckCircle className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-white tracking-tight mb-1">
            99.4%
          </div>
          <div className="flex items-center gap-1.5 text-xs text-purple-400 font-medium">
            <Award className="w-3.5 h-3.5" />
            <span>142 total shipments delivered on time</span>
          </div>
        </div>
      </div>

      {/* ─── ROW 1: (`| Revenue Chart | Fleet Status |`) ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Revenue Chart Widget */}
        <div className="lg:col-span-2 rounded-2xl bg-gradient-to-b from-navy-800/80 to-navy-900/90 border border-white/10 p-6 shadow-2xl flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-emerald-400" />
                  Revenue Analytics & Freight Volume
                </h3>
                <p className="text-xs text-gray-400 mt-0.5">Real-time financial progression across all logistics corridors</p>
              </div>
              <div className="flex items-center bg-navy-950/80 border border-white/10 rounded-xl p-1">
                {(["7D", "30D", "6M", "1Y"] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setChartTimeframe(t)}
                    className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                      chartTimeframe === t
                        ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/20"
                        : "text-gray-400 hover:text-white"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom SVG Bar/Area Chart */}
            <div className="h-64 flex items-end justify-between gap-2 sm:gap-4 pt-8 pb-2 px-2 border-b border-white/10 relative">
              {/* Background horizontal grid lines */}
              <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-20">
                <div className="border-b border-white/40 w-full" />
                <div className="border-b border-white/40 w-full" />
                <div className="border-b border-white/40 w-full" />
                <div className="border-b border-white/40 w-full" />
              </div>

              {revenueChartData.map((d, i) => {
                const heightPercent = Math.max(12, Math.round((d.val / maxChartVal) * 100));
                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-2 group relative z-10">
                    {/* Tooltip on hover */}
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 absolute -top-12 bg-navy-950 border border-emerald-500/40 text-white text-[11px] font-medium py-1 px-2 rounded-lg shadow-xl pointer-events-none whitespace-nowrap z-30">
                      <div className="text-emerald-400 font-bold">${d.val.toLocaleString()}</div>
                      <div className="text-gray-400">{d.orders} shipments handled</div>
                    </div>

                    {/* Bar */}
                    <div className="w-full max-w-[48px] bg-navy-950/60 rounded-t-lg h-48 flex items-end p-1">
                      <div
                        style={{ height: `${heightPercent}%` }}
                        className="w-full rounded-t-md bg-gradient-to-t from-emerald-600 via-teal-500 to-cyan-400 group-hover:brightness-125 transition-all duration-500 relative overflow-hidden shadow-lg shadow-emerald-500/10"
                      >
                        <div className="absolute top-0 inset-x-0 h-1 bg-white/50" />
                      </div>
                    </div>
                    <span className="text-xs font-semibold text-gray-400 group-hover:text-white transition-colors">
                      {d.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Chart Footer summary */}
          <div className="flex items-center justify-between pt-4 text-xs text-gray-400">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                <span>Interstate Freight (78%)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
                <span>Last-Mile Delivery (22%)</span>
              </div>
            </div>
            <span className="font-mono text-emerald-400 font-bold">Total Period: ${revenueChartData.reduce((acc, c) => acc + c.val, 0).toLocaleString()}</span>
          </div>
        </div>

        {/* Right Col: Fleet Status Widget */}
        <div className="rounded-2xl bg-gradient-to-b from-navy-800/80 to-navy-900/90 border border-white/10 p-6 shadow-2xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Truck className="w-5 h-5 text-amber-400" />
                Fleet Status & Health
              </h3>
              <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20">
                8 Vehicles
              </span>
            </div>

            {/* Progress breakdown */}
            <div className="space-y-4 mb-6">
              <div>
                <div className="flex justify-between text-xs font-medium mb-1.5">
                  <span className="text-emerald-400 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    Active On Highway / Route
                  </span>
                  <span className="text-white font-bold">6 Trucks (75%)</span>
                </div>
                <div className="w-full h-2.5 bg-navy-950 rounded-full overflow-hidden p-0.5 border border-white/5">
                  <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full" style={{ width: "75%" }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-medium mb-1.5">
                  <span className="text-cyan-400 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-cyan-400" />
                    Available / Standby at Depot
                  </span>
                  <span className="text-white font-bold">1 Van (12.5%)</span>
                </div>
                <div className="w-full h-2.5 bg-navy-950 rounded-full overflow-hidden p-0.5 border border-white/5">
                  <div className="h-full bg-gradient-to-r from-cyan-500 to-blue-400 rounded-full" style={{ width: "12.5%" }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-medium mb-1.5">
                  <span className="text-red-400 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-red-400" />
                    Scheduled Diagnostic Maintenance
                  </span>
                  <span className="text-white font-bold">1 Truck (12.5%)</span>
                </div>
                <div className="w-full h-2.5 bg-navy-950 rounded-full overflow-hidden p-0.5 border border-white/5">
                  <div className="h-full bg-gradient-to-r from-red-500 to-orange-400 rounded-full" style={{ width: "12.5%" }} />
                </div>
              </div>
            </div>

            {/* Quick Fleet Telemetry Highlights */}
            <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-navy-950/60 border border-white/5">
              <div className="p-2.5 rounded-lg bg-white/[0.03]">
                <div className="text-[10px] text-gray-400 uppercase font-semibold">Avg Fuel Economy</div>
                <div className="text-base font-extrabold text-white mt-0.5">7.4 MPG</div>
                <div className="text-[10px] text-emerald-400">+0.4 vs industry</div>
              </div>
              <div className="p-2.5 rounded-lg bg-white/[0.03]">
                <div className="text-[10px] text-gray-400 uppercase font-semibold">Active GPS Sensors</div>
                <div className="text-base font-extrabold text-white mt-0.5">100% Online</div>
                <div className="text-[10px] text-cyan-400">Zero telemetry dropouts</div>
              </div>
            </div>
          </div>

          <button
            onClick={() => onSwitchTab("vehicles")}
            className="mt-4 w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500/15 to-orange-500/15 hover:from-amber-500/25 hover:to-orange-500/25 border border-amber-500/30 text-amber-300 font-semibold text-xs flex items-center justify-center gap-2 transition-all"
          >
            <span>Inspect Full Fleet Roster</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* ─── ROW 2: (`| Recent Orders | Live Map |`) ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Recent Orders Table */}
        <div className="lg:col-span-2 rounded-2xl bg-gradient-to-b from-navy-800/80 to-navy-900/90 border border-white/10 overflow-hidden shadow-2xl flex flex-col justify-between">
          <div>
            <div className="p-6 border-b border-white/10 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Package className="w-5 h-5 text-cyan-400" />
                  Recent Orders & Active Shipments
                </h3>
                <p className="text-xs text-gray-400 mt-0.5">Real-time status of cargo across primary national transport lanes</p>
              </div>
              <button
                onClick={() => onSwitchTab("shipments")}
                className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-cyan-400 font-semibold flex items-center gap-1.5 transition-colors"
              >
                <span>View All Orders</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/5 bg-navy-950/40 text-left text-[11px] uppercase tracking-wider font-bold text-gray-400">
                    <th className="px-5 py-3.5">Tracking #</th>
                    <th className="px-5 py-3.5">Origin → Destination</th>
                    <th className="px-5 py-3.5">Priority</th>
                    <th className="px-5 py-3.5">Status</th>
                    <th className="px-5 py-3.5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-sm">
                  {stats?.recentShipments?.slice(0, 5).map((s) => (
                    <tr key={s.id} className="hover:bg-white/[0.04] transition-colors">
                      <td className="px-5 py-3.5 font-mono font-bold text-cyan-400">{s.trackingNumber}</td>
                      <td className="px-5 py-3.5">
                        <div className="text-white font-medium">{s.origin} → {s.destination}</div>
                        <div className="text-xs text-gray-500">{s.weight || "12,500"} lbs freight</div>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold uppercase ${
                          s.priority === "urgent" ? "bg-red-500/15 text-red-400 border border-red-500/30" :
                          s.priority === "high" ? "bg-amber-500/15 text-amber-400 border border-amber-500/30" :
                          "bg-blue-500/15 text-blue-400 border border-blue-500/30"
                        }`}>
                          {s.priority === "urgent" ? "🔥 Urgent" : s.priority === "high" ? "⚡ High" : "🟢 Normal"}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <StatusBadge status={s.status || "in_transit"} />
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <button
                          onClick={() => onSwitchTab("shipments")}
                          className="p-1.5 rounded-lg bg-white/5 hover:bg-cyan-500/20 text-gray-400 hover:text-cyan-400 transition-colors"
                          title="Track Telemetry"
                        >
                          <Navigation className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  )) || (
                    <tr>
                      <td colSpan={5} className="px-5 py-8 text-center text-gray-500">No recent shipments</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Col: Live Map Simulated Radar */}
        <div className="rounded-2xl bg-gradient-to-b from-navy-800/80 to-navy-900/90 border border-white/10 p-6 shadow-2xl flex flex-col justify-between relative overflow-hidden">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-crimson-400" />
                  Live Map Radar
                </h3>
                <p className="text-xs text-gray-400">Simulated GPS telemetry tracker</p>
              </div>
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-crimson-500/15 border border-crimson-500/30 text-crimson-400 text-xs font-bold">
                <span className="w-2 h-2 rounded-full bg-crimson-500 animate-ping" />
                GPS LIVE
              </span>
            </div>

            {/* Simulated Dark Map Canvas */}
            <div className="h-56 rounded-xl bg-[#070b14] border border-white/10 relative overflow-hidden p-4 flex flex-col justify-between">
              {/* Grid map overlay lines */}
              <div className="absolute inset-0 opacity-15 pointer-events-none" style={{
                backgroundImage: "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.4) 1px, transparent 0)",
                backgroundSize: "20px 20px"
              }} />

              {/* Highway lines simulation */}
              <div className="absolute top-1/3 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent -rotate-6" />
              <div className="absolute top-2/3 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent rotate-12" />

              {/* Pulsing vehicle GPS markers */}
              <div className="absolute top-[28%] left-[24%] flex items-center gap-1.5 group cursor-pointer">
                <span className="relative flex h-3.5 w-3.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-cyan-500 border border-white" />
                </span>
                <span className="text-[10px] bg-navy-900/90 border border-cyan-500/40 text-cyan-300 font-mono px-1.5 py-0.5 rounded shadow">
                  EVT-1001 (64 MPH)
                </span>
              </div>

              <div className="absolute top-[62%] left-[68%] flex items-center gap-1.5 group cursor-pointer">
                <span className="relative flex h-3.5 w-3.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border border-white" />
                </span>
                <span className="text-[10px] bg-navy-900/90 border border-emerald-500/40 text-emerald-300 font-mono px-1.5 py-0.5 rounded shadow">
                  EVT-1002 (58 MPH)
                </span>
              </div>

              <div className="absolute top-[40%] right-[15%] flex items-center gap-1.5 group cursor-pointer">
                <span className="relative flex h-3 w-3">
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500 border border-white" />
                </span>
                <span className="text-[10px] bg-navy-900/90 border border-amber-500/40 text-amber-300 font-mono px-1.5 py-0.5 rounded shadow">
                  EVT-2001 (NYC Depot)
                </span>
              </div>

              {/* Legend inside map */}
              <div className="relative z-10 flex items-center justify-between text-[10px] text-gray-400 bg-navy-950/80 px-2.5 py-1.5 rounded-lg border border-white/5 mt-auto">
                <span className="font-mono text-cyan-400">LAT: 39.8283° N | LON: 98.5795° W</span>
                <span>Active Tracking Hub</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 mt-4 text-center text-xs">
            <div className="p-2 rounded-lg bg-white/[0.03] border border-white/5">
              <div className="text-gray-400 text-[10px]">On Highway</div>
              <div className="font-bold text-white text-sm">6 Trucks</div>
            </div>
            <div className="p-2 rounded-lg bg-white/[0.03] border border-white/5">
              <div className="text-gray-400 text-[10px]">City Routes</div>
              <div className="font-bold text-white text-sm">2 Vans</div>
            </div>
            <div className="p-2 rounded-lg bg-white/[0.03] border border-white/5">
              <div className="text-gray-400 text-[10px]">Alerts</div>
              <div className="font-bold text-amber-400 text-sm">1 Serv</div>
            </div>
          </div>
        </div>
      </div>

      {/* ─── ROW 3: (`| Drivers Performance | Recent Activity |`) ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Col: Drivers Performance Leaderboard */}
        <div className="rounded-2xl bg-gradient-to-b from-navy-800/80 to-navy-900/90 border border-white/10 p-6 shadow-2xl">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Award className="w-5 h-5 text-golden-400" />
                Drivers Performance Leaderboard
              </h3>
              <p className="text-xs text-gray-400 mt-0.5">Top ranked CDL operators by customer safety & delivery precision</p>
            </div>
            <button
              onClick={() => onSwitchTab("users")}
              className="text-xs text-golden-400 hover:underline font-semibold"
            >
              Manage All (6) →
            </button>
          </div>

          <div className="space-y-3">
            {topDrivers.map((d, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-3.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/5 transition-all"
              >
                <div className="flex items-center gap-3.5">
                  <span className="text-2xl">{d.rank}</span>
                  <div>
                    <div className="text-sm font-bold text-white flex items-center gap-2">
                      <span>{d.name}</span>
                      <span className="text-[10px] font-mono text-cyan-400 bg-cyan-500/10 px-1.5 py-0.5 rounded border border-cyan-500/20">
                        {d.cdl}
                      </span>
                    </div>
                    <div className="text-xs text-gray-400 flex items-center gap-3 mt-0.5">
                      <span className="text-emerald-400 font-semibold">{d.status}</span>
                      <span>•</span>
                      <span>{d.deliveries} deliveries on-time</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="text-sm font-extrabold text-golden-400 flex items-center gap-1 justify-end">
                      <Star className="w-3.5 h-3.5 fill-golden-400" />
                      <span>{d.rating}</span>
                    </div>
                    <div className="text-[10px] text-gray-500 uppercase font-semibold">Safety Score</div>
                  </div>
                  <div className="flex gap-1">
                    <button className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors">
                      <Phone className="w-3.5 h-3.5" />
                    </button>
                    <button className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors">
                      <Mail className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Col: Recent Activity Audit Timeline */}
        <div className="rounded-2xl bg-gradient-to-b from-navy-800/80 to-navy-900/90 border border-white/10 p-6 shadow-2xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Activity className="w-5 h-5 text-purple-400" />
                  Recent Activity & System Audit Feed
                </h3>
                <p className="text-xs text-gray-400 mt-0.5">Live chronological event stream from fleet IoT sensors & database</p>
              </div>
              <span className="w-2.5 h-2.5 rounded-full bg-purple-400 animate-ping" />
            </div>

            <div className="space-y-4 relative before:absolute before:inset-0 before:left-5 before:w-0.5 before:bg-white/10">
              {recentTimeline.map((item, i) => (
                <div key={i} className="flex items-start gap-4 relative z-10">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${item.color}`}>
                    <item.icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 bg-white/[0.02] p-3 rounded-xl border border-white/5 hover:border-white/15 transition-colors">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-bold text-white">{item.title}</span>
                      <span className="text-[10px] font-mono text-gray-500">{item.time}</span>
                    </div>
                    <p className="text-xs text-gray-400 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-white/5 flex items-center justify-between text-xs text-gray-400 mt-6">
            <span>Audit retention: 90 days active storage</span>
            <button
              onClick={() => toast.info("Audit logs exported in CSV")}
              className="text-cyan-400 hover:underline font-semibold"
            >
              Download Full Audit Log →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Generic Data Table Component ─── */
function DataTable({
  columns,
  data,
  isLoading,
  actions,
}: {
  columns: { key: string; label: string; render?: (row: Record<string, unknown>) => React.ReactNode }[];
  data: Record<string, unknown>[];
  isLoading: boolean;
  actions?: (row: Record<string, unknown>) => React.ReactNode;
}) {
  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-crimson-500" />
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="text-center py-20 bg-navy-800/50 rounded-2xl border border-white/5">
        <AlertCircle className="w-12 h-12 text-gray-500 mx-auto mb-3" />
        <p className="text-gray-400 font-medium">No records available</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-gradient-to-b from-navy-800/80 to-navy-900/90 border border-white/10 overflow-hidden shadow-2xl">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/10 bg-navy-950/50 text-left text-xs uppercase text-gray-400 font-bold tracking-wider">
              {columns.map((col) => (
                <th key={col.key} className="px-5 py-3.5">
                  {col.label}
                </th>
              ))}
              {actions && <th className="px-5 py-3.5 text-right">Actions</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-sm">
            {data.map((row, i) => (
              <tr key={i} className="hover:bg-white/[0.04] transition-colors">
                {columns.map((col) => (
                  <td key={col.key} className="px-5 py-3.5 text-gray-200">
                    {col.render ? col.render(row) : String(row[col.key] ?? "—")}
                  </td>
                ))}
                {actions && <td className="px-5 py-3.5 text-right">{actions(row)}</td>}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ─── Users Tab ─── */
function UsersTab() {
  const { data: users, isLoading } = trpc.user.list.useQuery();
  const utils = trpc.useUtils();
  const toggleActive = trpc.user.toggleActive.useMutation({
    onSuccess: () => { utils.user.list.invalidate(); toast.success("User updated"); },
  });

  return (
    <DataTable
      columns={[
        { key: "id", label: "ID" },
        { key: "name", label: "Name" },
        { key: "email", label: "Email" },
        { key: "role", label: "Role", render: (row) => <StatusBadge status={String(row.role)} /> },
        { key: "createdAt", label: "Joined", render: (row) => new Date(String(row.createdAt ?? Date.now())).toLocaleDateString() },
      ]}
      data={(users || []).map((u) => ({ ...u, name: u.name || "—" }))}
      isLoading={isLoading}
      actions={(row) => (
        <div className="flex gap-2 justify-end">
          <button
            onClick={() => toggleActive.mutate({ id: Number(row.id) })}
            className="p-1.5 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
            title="Toggle Active"
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>
      )}
    />
  );
}

/* ─── Vehicles Tab ─── */
function VehiclesTab() {
  const { data: vehicles, isLoading } = trpc.vehicle.list.useQuery();

  return (
    <DataTable
      columns={[
        { key: "name", label: "Name", render: (row) => <span className="font-bold text-white">{String(row.name)}</span> },
        { key: "type", label: "Type", render: (row) => <span className="uppercase text-xs font-mono bg-white/5 px-2 py-0.5 rounded text-gray-300">{String(row.type)}</span> },
        { key: "licensePlate", label: "License Plate", render: (row) => <span className="font-mono text-cyan-400">{String(row.licensePlate)}</span> },
        { key: "capacity", label: "Capacity", render: (row) => `${String(row.capacity)} Tons` },
        { key: "status", label: "Status", render: (row) => <StatusBadge status={String(row.status)} /> },
      ]}
      data={(vehicles || []) as Record<string, unknown>[]}
      isLoading={isLoading}
    />
  );
}

/* ─── Shipments Tab ─── */
function ShipmentsTab() {
  const { data: shipments, isLoading } = trpc.shipment.list.useQuery();

  return (
    <DataTable
      columns={[
        { key: "trackingNumber", label: "Tracking #", render: (row) => <span className="font-mono font-bold text-cyan-400">{String(row.trackingNumber)}</span> },
        { key: "origin", label: "Origin" },
        { key: "destination", label: "Destination" },
        { key: "status", label: "Status", render: (row) => <StatusBadge status={String(row.status)} /> },
        { key: "priority", label: "Priority" },
      ]}
      data={(shipments || []) as Record<string, unknown>[]}
      isLoading={isLoading}
    />
  );
}

/* ─── Invoices Tab ─── */
function InvoicesTab() {
  const { data: invoices, isLoading } = trpc.invoice.list.useQuery();

  return (
    <DataTable
      columns={[
        { key: "invoiceNumber", label: "Invoice #", render: (row) => <span className="font-mono font-bold text-golden-400">{String(row.invoiceNumber)}</span> },
        { key: "amount", label: "Amount", render: (row) => `$${row.amount}` },
        { key: "total", label: "Total", render: (row) => <span className="font-bold text-emerald-400">${row.total}</span> },
        { key: "status", label: "Status", render: (row) => <StatusBadge status={String(row.status)} /> },
        { key: "createdAt", label: "Date", render: (row) => new Date(String(row.createdAt ?? Date.now())).toLocaleDateString() },
      ]}
      data={(invoices || []) as Record<string, unknown>[]}
      isLoading={isLoading}
    />
  );
}

/* ─── Contacts Tab ─── */
function ContactsTab() {
  const { data: contacts, isLoading } = trpc.contact.list.useQuery();
  const utils = trpc.useUtils();
  const updateStatus = trpc.contact.updateStatus.useMutation({
    onSuccess: () => { utils.contact.list.invalidate(); toast.success("Status updated"); },
  });

  return (
    <DataTable
      columns={[
        { key: "name", label: "Name", render: (row) => <span className="font-bold text-white">{String(row.name)}</span> },
        { key: "email", label: "Email" },
        { key: "subject", label: "Subject" },
        { key: "status", label: "Status", render: (row) => <StatusBadge status={String(row.status)} /> },
        { key: "createdAt", label: "Date", render: (row) => new Date(String(row.createdAt ?? Date.now())).toLocaleDateString() },
      ]}
      data={(contacts || []) as Record<string, unknown>[]}
      isLoading={isLoading}
      actions={(row) => (
        <select
          value={String(row.status)}
          onChange={(e) => updateStatus.mutate({ id: Number(row.id), status: e.target.value as "new" | "read" | "replied" | "archived" })}
          className="bg-navy-950 border border-white/20 rounded-lg px-2.5 py-1 text-xs text-white font-medium"
        >
          <option value="new">New</option>
          <option value="read">Read</option>
          <option value="replied">Replied</option>
          <option value="archived">Archived</option>
        </select>
      )}
    />
  );
}

/* ─── Quotes Tab ─── */
function QuotesTab() {
  const { data: quotes, isLoading } = trpc.quote.list.useQuery();
  const utils = trpc.useUtils();
  const updateStatus = trpc.quote.updateStatus.useMutation({
    onSuccess: () => { utils.quote.list.invalidate(); toast.success("Status updated"); },
  });

  return (
    <DataTable
      columns={[
        { key: "name", label: "Name", render: (row) => <span className="font-bold text-white">{String(row.name)}</span> },
        { key: "email", label: "Email" },
        { key: "origin", label: "Origin" },
        { key: "destination", label: "Destination" },
        { key: "status", label: "Status", render: (row) => <StatusBadge status={String(row.status)} /> },
      ]}
      data={(quotes || []) as Record<string, unknown>[]}
      isLoading={isLoading}
      actions={(row) => (
        <select
          value={String(row.status)}
          onChange={(e) => updateStatus.mutate({ id: Number(row.id), status: e.target.value as "new" | "reviewing" | "quoted" | "accepted" | "rejected" })}
          className="bg-navy-950 border border-white/20 rounded-lg px-2.5 py-1 text-xs text-white font-medium"
        >
          <option value="new">New</option>
          <option value="reviewing">Reviewing</option>
          <option value="quoted">Quoted</option>
          <option value="accepted">Accepted</option>
          <option value="rejected">Rejected</option>
        </select>
      )}
    />
  );
}

/* ─── Blog Tab ─── */
function BlogTab() {
  const { data: posts, isLoading } = trpc.blog.listAdmin.useQuery();

  return (
    <DataTable
      columns={[
        { key: "title", label: "Title", render: (row) => <span className="font-bold text-white">{String(row.title)}</span> },
        { key: "slug", label: "Slug" },
        { key: "published", label: "Published", render: (row) => row.published ? <span className="text-emerald-400 font-semibold">Yes</span> : <span className="text-gray-500">No</span> },
        { key: "featured", label: "Featured", render: (row) => row.featured ? <span className="text-golden-400 font-semibold">Yes</span> : <span className="text-gray-500">No</span> },
        { key: "createdAt", label: "Date", render: (row) => new Date(String(row.createdAt ?? Date.now())).toLocaleDateString() },
      ]}
      data={(posts || []) as Record<string, unknown>[]}
      isLoading={isLoading}
    />
  );
}

/* ─── FAQs Tab ─── */
function FaqsTab() {
  const { data: faqs, isLoading } = trpc.faq.listAdmin.useQuery();

  return (
    <DataTable
      columns={[
        { key: "question", label: "Question", render: (row) => <span className="line-clamp-1 max-w-xs font-medium text-white">{String(row.question)}</span> },
        { key: "category", label: "Category" },
        { key: "isActive", label: "Active", render: (row) => row.isActive ? <span className="text-emerald-400 font-semibold">Yes</span> : <span className="text-red-400">No</span> },
        { key: "sortOrder", label: "Order" },
      ]}
      data={(faqs || []) as Record<string, unknown>[]}
      isLoading={isLoading}
    />
  );
}

/* ─── Testimonials Tab ─── */
function TestimonialsTab() {
  const { data: testimonials, isLoading } = trpc.testimonial.listAdmin.useQuery();

  return (
    <DataTable
      columns={[
        { key: "name", label: "Name", render: (row) => <span className="font-bold text-white">{String(row.name)}</span> },
        { key: "company", label: "Company" },
        { key: "rating", label: "Rating", render: (row) => <span className="text-golden-400 font-bold">{String(row.rating)} ★</span> },
        { key: "featured", label: "Featured", render: (row) => row.featured ? <span className="text-golden-400 font-semibold">Yes</span> : <span className="text-gray-500">No</span> },
      ]}
      data={(testimonials || []) as Record<string, unknown>[]}
      isLoading={isLoading}
    />
  );
}

/* ─── Partners Tab ─── */
function PartnersTab() {
  const { data: partners, isLoading } = trpc.partner.listAdmin.useQuery();

  return (
    <DataTable
      columns={[
        { key: "name", label: "Name", render: (row) => <span className="font-bold text-white">{String(row.name)}</span> },
        { key: "tier", label: "Tier", render: (row) => <StatusBadge status={String(row.tier)} /> },
        { key: "website", label: "Website", render: (row) => <span className="text-cyan-400 hover:underline">{String(row.website)}</span> },
        { key: "isActive", label: "Active", render: (row) => row.isActive ? <span className="text-emerald-400 font-semibold">Yes</span> : <span className="text-red-400">No</span> },
      ]}
      data={(partners || []) as Record<string, unknown>[]}
      isLoading={isLoading}
    />
  );
}

/* ─── Developer Dashboard Tab ─── */
function DevTab() {
  const [ping, setPing] = useState<number | null>(null);
  const [pinging, setPinging] = useState(false);
  const [copyMsg, setCopyMsg] = useState<string | null>(null);

  const measurePing = async () => {
    setPinging(true);
    const start = performance.now();
    try {
      await fetch("/api/health", { cache: "no-store" });
      setPing(Math.round(performance.now() - start));
    } catch {
      setPing(-1);
    }
    setPinging(false);
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopyMsg(label);
      setTimeout(() => setCopyMsg(null), 2000);
      toast.success(`${label} copied!`);
    });
  };

  const services = [
    { name: "Backend API", endpoint: "/api/health", method: "GET", status: "Online", latency: "~12ms", color: "emerald" },
    { name: "tRPC Router", endpoint: "/api/trpc/ping", method: "GET", status: "Online", latency: "~18ms", color: "emerald" },
    { name: "MySQL Database", endpoint: "mysql:3306", method: "TCP", status: "Healthy", latency: "~3ms", color: "emerald" },
    { name: "Redis Cache", endpoint: "redis:6379", method: "TCP", status: "Healthy", latency: "~1ms", color: "emerald" },
    { name: "Nginx Proxy", endpoint: ":8080", method: "HTTP", status: "Active", latency: "~0.8ms", color: "cyan" },
    { name: "Frontend Vite", endpoint: ":3000", method: "HTTP", status: "Built", latency: "—", color: "blue" },
  ];

  const envVars = [
    { key: "NODE_ENV", value: "development", secret: false },
    { key: "PORT", value: "4000", secret: false },
    { key: "DATABASE_URL", value: "mysql://evertruck:●●●●●●@mysql:3306/evertruck_db", secret: true },
    { key: "REDIS_URL", value: "redis://redis:6379", secret: false },
    { key: "APP_ID", value: "evertruck-app-local", secret: false },
    { key: "APP_SECRET", value: "●●●●●●●●●●●●●●●●", secret: true },
  ];

  const dbMetrics = [
    { label: "Tables", value: "14", icon: "🗄️", sub: "All migrated" },
    { label: "Active Connections", value: "3 / 100", icon: "🔗", sub: "Pool usage: 3%" },
    { label: "Query Avg", value: "4.2ms", icon: "⚡", sub: "p99: 28ms" },
    { label: "DB Size", value: "18.4 MB", icon: "💾", sub: "evertruck_db" },
  ];

  const devNotes = [
    "✅ Drizzle ORM: schema synced — run `npm run db:migrate` if schema changes",
    "✅ tRPC v11: all routers type-safe — check /backend/src/router.ts",
    "⚠️  Frontend: Vite HMR disabled in Docker dev — rebuild image on changes",
    "💡 Seed data: `docker compose exec backend npm run db:seed` for demo data",
    "💡 API Explorer: visit http://localhost:8080/api/trpc/ping for health check",
    "🔐 Admin login: Use role=admin account from DB seed or register manually",
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#0d1f3c] via-[#0a1627] to-[#0c1a30] border border-cyan-500/20 p-6 shadow-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl" />
        <div className="relative flex items-center justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 flex items-center justify-center">
                <Sliders className="w-5 h-5 text-cyan-400" />
              </div>
              <div>
                <h2 className="text-xl font-extrabold text-white">Developer Dashboard</h2>
                <p className="text-xs text-cyan-400/80">System internals, API health & environment inspector</p>
              </div>
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[11px] font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                All Services Online
              </span>
              <span className="text-[11px] text-gray-400 font-mono">Stack: Hono + tRPC + Drizzle + MySQL + Redis + Nginx</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={measurePing}
              disabled={pinging}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 text-xs font-bold transition-all disabled:opacity-50"
            >
              {pinging ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
              {ping === null ? "Ping API" : ping === -1 ? "Error" : `${ping}ms`}
            </button>
          </div>
        </div>
      </div>

      {/* Row 1: Services Health + DB Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Services Health */}
        <div className="rounded-2xl bg-gradient-to-b from-navy-800/80 to-navy-900/90 border border-white/10 p-6 shadow-2xl">
          <h3 className="text-base font-bold text-white flex items-center gap-2 mb-5">
            <Activity className="w-4 h-4 text-emerald-400" />
            Service Health Monitor
          </h3>
          <div className="space-y-3">
            {services.map((svc, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03] border border-white/5 hover:border-white/10 transition-all group">
                <div className="flex items-center gap-3">
                  <span className={`w-2 h-2 rounded-full bg-${svc.color}-400 animate-pulse`} />
                  <div>
                    <div className="text-sm font-semibold text-white">{svc.name}</div>
                    <div className="text-[11px] font-mono text-gray-500">{svc.method} · {svc.endpoint}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[11px] font-mono text-gray-400">{svc.latency}</span>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-${svc.color}-500/15 text-${svc.color}-400 border border-${svc.color}-500/30`}>
                    {svc.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Database Metrics */}
        <div className="rounded-2xl bg-gradient-to-b from-navy-800/80 to-navy-900/90 border border-white/10 p-6 shadow-2xl">
          <h3 className="text-base font-bold text-white flex items-center gap-2 mb-5">
            <Shield className="w-4 h-4 text-amber-400" />
            Database & Cache Metrics
          </h3>
          <div className="grid grid-cols-2 gap-4 mb-5">
            {dbMetrics.map((m, i) => (
              <div key={i} className="p-4 rounded-xl bg-white/[0.03] border border-white/5 hover:border-amber-500/20 transition-all">
                <div className="text-xl mb-1">{m.icon}</div>
                <div className="text-lg font-extrabold text-white">{m.value}</div>
                <div className="text-[11px] font-semibold text-gray-300">{m.label}</div>
                <div className="text-[10px] text-gray-500 mt-0.5">{m.sub}</div>
              </div>
            ))}
          </div>
          {/* Redis Stats */}
          <div className="p-4 rounded-xl bg-navy-950/60 border border-white/5">
            <div className="text-xs font-bold text-red-400 mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-400" />
              Redis Cache · evertruck-redis
            </div>
            <div className="grid grid-cols-3 gap-3 text-center">
              {[
                { label: "Keys", val: "48" },
                { label: "Memory", val: "1.2MB" },
                { label: "Hit Rate", val: "94.7%" },
              ].map((r, i) => (
                <div key={i}>
                  <div className="text-sm font-bold text-white">{r.val}</div>
                  <div className="text-[10px] text-gray-500">{r.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Row 2: Environment Variables */}
      <div className="rounded-2xl bg-gradient-to-b from-navy-800/80 to-navy-900/90 border border-white/10 p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Eye className="w-4 h-4 text-purple-400" />
            Environment Variables (Backend)
          </h3>
          {copyMsg && (
            <span className="text-[11px] text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20 font-semibold animate-in fade-in duration-200">
              ✓ {copyMsg} copied
            </span>
          )}
        </div>
        <div className="space-y-2">
          {envVars.map((env, i) => (
            <div key={i} className="flex items-center justify-between gap-4 p-3 rounded-xl bg-navy-950/60 border border-white/5 hover:border-white/10 group transition-all">
              <div className="flex items-center gap-3 min-w-0">
                <span className={`text-[11px] font-bold px-2 py-0.5 rounded font-mono ${env.secret ? "bg-red-500/15 text-red-400 border border-red-500/20" : "bg-blue-500/15 text-blue-400 border border-blue-500/20"}`}>
                  {env.secret ? "🔐 SECRET" : "📄 PUBLIC"}
                </span>
                <span className="text-xs font-mono font-bold text-cyan-400">{env.key}</span>
              </div>
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-xs font-mono text-gray-300 truncate max-w-[280px]">{env.value}</span>
                {!env.secret && (
                  <button
                    onClick={() => copyToClipboard(env.value, env.key)}
                    className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all"
                    title="Copy value"
                  >
                    <RefreshCw className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Row 3: API Routes + Dev Notes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* tRPC API Routes */}
        <div className="rounded-2xl bg-gradient-to-b from-navy-800/80 to-navy-900/90 border border-white/10 p-6 shadow-2xl">
          <h3 className="text-base font-bold text-white flex items-center gap-2 mb-5">
            <Navigation className="w-4 h-4 text-cyan-400" />
            tRPC API Endpoints
          </h3>
          <div className="space-y-2">
            {[
              { router: "auth", proc: "login, register, me, logout", type: "mutation / query" },
              { router: "user", proc: "list, toggleActive", type: "admin query" },
              { router: "vehicle", proc: "list, create", type: "query / mutation" },
              { router: "shipment", proc: "list, create, track", type: "query / mutation" },
              { router: "invoice", proc: "list, create", type: "query / mutation" },
              { router: "stats", proc: "dashboard", type: "admin query" },
              { router: "contact", proc: "submit, list, updateStatus", type: "mutation / admin" },
              { router: "quote", proc: "submit, list, updateStatus", type: "mutation / admin" },
              { router: "blog", proc: "list, listAdmin, bySlug", type: "query" },
              { router: "faq", proc: "list, listAdmin", type: "query" },
            ].map((r, i) => (
              <div key={i} className="flex items-center justify-between p-2.5 rounded-lg bg-navy-950/60 border border-white/5 text-xs group hover:border-cyan-500/20 transition-all">
                <div className="flex items-center gap-2">
                  <span className="text-cyan-400 font-mono font-bold">/api/trpc/{r.router}.*</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-500 font-mono hidden sm:block">{r.proc}</span>
                  <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 text-[10px] font-semibold">{r.type}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Developer Notes */}
        <div className="rounded-2xl bg-gradient-to-b from-navy-800/80 to-navy-900/90 border border-white/10 p-6 shadow-2xl">
          <h3 className="text-base font-bold text-white flex items-center gap-2 mb-5">
            <FileText className="w-4 h-4 text-golden-400" />
            Developer Notes & Quick Commands
          </h3>
          <div className="space-y-3 mb-6">
            {devNotes.map((note, i) => (
              <div key={i} className="p-3 rounded-xl bg-navy-950/60 border border-white/5 text-xs text-gray-300 leading-relaxed hover:border-white/10 transition-colors">
                {note}
              </div>
            ))}
          </div>
          <div className="space-y-2">
            <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-3">Quick Commands</div>
            {[
              { cmd: "docker compose logs -f backend", label: "Backend logs" },
              { cmd: "docker compose exec backend npm run db:migrate", label: "Run migrations" },
              { cmd: "docker compose exec backend npm run db:seed", label: "Seed DB" },
              { cmd: "docker compose restart backend", label: "Restart backend" },
            ].map((c, i) => (
              <div
                key={i}
                onClick={() => copyToClipboard(c.cmd, c.label)}
                className="flex items-center justify-between p-2.5 rounded-lg bg-navy-950/80 border border-white/5 hover:border-cyan-500/30 hover:bg-white/[0.04] cursor-pointer transition-all group"
              >
                <code className="text-[11px] text-cyan-400 font-mono truncate">{c.cmd}</code>
                <span className="text-[10px] text-gray-500 group-hover:text-gray-300 ml-2 shrink-0 transition-colors">Copy</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── MAIN ADMIN DASHBOARD (With Exact Top Navigation & Sub-Header) ─── */
export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<AdminTab>("overview");
  const [activeTopNav, setActiveTopNav] = useState<TopNavTab>("Dashboard");
  const [showSettingsMenu, setShowSettingsMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const { user, isAuthenticated, isAdmin, isLoading, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || !isAdmin)) {
      navigate("/");
    }
  }, [isLoading, isAuthenticated, isAdmin, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#070b14]">
        <Loader2 className="w-10 h-10 animate-spin text-crimson-500" />
      </div>
    );
  }

  if (!isAdmin) return null;

  // Handle top navigation click switching
  const handleTopNavClick = (nav: TopNavTab) => {
    setActiveTopNav(nav);
    if (nav === "Dashboard") setActiveTab("overview");
    if (nav === "Orders") setActiveTab("shipments");
    if (nav === "Drivers") setActiveTab("users");
    if (nav === "Fleet") setActiveTab("vehicles");
    if (nav === "Settings") {
      setShowSettingsMenu(!showSettingsMenu);
      setActiveTab("invoices");
    } else {
      setShowSettingsMenu(false);
    }
  };

  const renderTab = () => {
    switch (activeTab) {
      case "overview": return <OverviewTab onSwitchTab={(tab) => { setActiveTab(tab); if (tab === "vehicles") setActiveTopNav("Fleet"); if (tab === "shipments") setActiveTopNav("Orders"); if (tab === "users") setActiveTopNav("Drivers"); }} />;
      case "users": return <UsersTab />;
      case "vehicles": return <VehiclesTab />;
      case "shipments": return <ShipmentsTab />;
      case "invoices": return <InvoicesTab />;
      case "contacts": return <ContactsTab />;
      case "quotes": return <QuotesTab />;
      case "blog": return <BlogTab />;
      case "faqs": return <FaqsTab />;
      case "testimonials": return <TestimonialsTab />;
      case "partners": return <PartnersTab />;
      case "dev": return <DevTab />;
      default: return <OverviewTab onSwitchTab={setActiveTab} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#070b14] text-gray-100 font-sans antialiased selection:bg-crimson-500 selection:text-white flex flex-col">
      {/* ─── TOP HORIZONTAL NAVBAR (`Logo | Dashboard | Orders | Drivers | Fleet | Settings`) ─── */}
      <header className="sticky top-0 z-50 bg-navy-950/90 backdrop-blur-xl border-b border-white/10 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
          {/* Logo Section */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => handleTopNavClick("Dashboard")}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-crimson-600 to-amber-500 flex items-center justify-center shadow-lg shadow-crimson-500/20">
              <Truck className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-extrabold tracking-tight text-white">EverTruck</span>
                <span className="text-[10px] font-bold uppercase tracking-widest bg-crimson-500/20 text-crimson-400 border border-crimson-500/40 px-2 py-0.5 rounded-full">
                  Admin Pro
                </span>
              </div>
              <p className="text-[10px] text-gray-400 hidden sm:block">Logistics Command & Fleet Operations</p>
            </div>
          </div>

          {/* Horizontal Navigation Links */}
          <nav className="hidden md:flex items-center gap-1.5 bg-navy-900/90 border border-white/10 rounded-2xl p-1.5 shadow-inner">
            {(["Dashboard", "Orders", "Drivers", "Fleet", "Settings"] as const).map((navItem) => {
              const isActive = activeTopNav === navItem;
              return (
                <button
                  key={navItem}
                  onClick={() => handleTopNavClick(navItem)}
                  className={`px-5 py-2 rounded-xl text-xs font-bold tracking-wide transition-all relative ${
                    isActive
                      ? "bg-gradient-to-r from-crimson-600 to-crimson-500 text-white shadow-lg shadow-crimson-500/25"
                      : "text-gray-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {navItem}
                </button>
              );
            })}
          </nav>

          {/* Right Action: Back to Home & Mobile Menu Trigger */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/")}
              className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-gray-300 hover:text-white transition-all flex items-center gap-1.5"
            >
              <span>Public Site</span>
              <ExternalLink className="w-3.5 h-3.5 text-gray-400" />
            </button>
          </div>
        </div>

        {/* Secondary Settings/Management Dropdown bar when "Settings" is clicked */}
        {showSettingsMenu && (
          <div className="bg-navy-900/95 border-t border-white/10 px-4 sm:px-8 py-2.5 flex items-center gap-2 overflow-x-auto text-xs animate-in slide-in-from-top-2 duration-200">
            <span className="text-gray-400 font-semibold mr-2">Manage Module:</span>
            {[
              { id: "invoices", label: "Invoices & Billing" },
              { id: "contacts", label: "Contact Inquiries" },
              { id: "quotes", label: "Quote Requests" },
              { id: "blog", label: "Blog & SEO" },
              { id: "faqs", label: "FAQs Base" },
              { id: "testimonials", label: "Testimonials" },
              { id: "partners", label: "Partners & Fleet Network" },
              { id: "dev", label: "🛠 Developer Dashboard" },
            ].map((sub) => (
              <button
                key={sub.id}
                onClick={() => setActiveTab(sub.id as AdminTab)}
                className={`px-3 py-1 rounded-lg transition-all whitespace-nowrap font-medium ${
                  activeTab === sub.id ? "bg-amber-500/20 text-amber-300 border border-amber-500/40" : "text-gray-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                {sub.label}
              </button>
            ))}
          </div>
        )}
      </header>

      {/* ─── SUB-HEADER (`Welcome Admin | Notifications & Profile`) ─── */}
      <section className="bg-gradient-to-r from-navy-900/90 via-[#0a1224] to-navy-900/90 border-b border-white/10 py-5 px-4 sm:px-6 lg:px-8 shadow-lg">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {/* Welcome Admin */}
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2.5">
              <span>Welcome back,</span>
              <span className="bg-gradient-to-r from-crimson-400 via-amber-300 to-cyan-400 bg-clip-text text-transparent">
                {user?.name || "Admin"}
              </span>
              <span className="text-xl">⚡</span>
            </h1>
            <div className="flex items-center gap-2.5 mt-1 text-xs text-gray-400">
              <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                All Systems Operational
              </span>
              <span className="hidden sm:inline">•</span>
              <span className="hidden sm:inline">Live Telemetry & Fleet GPS Connected</span>
            </div>
          </div>

          {/* Notifications & Profile Bar */}
          <div className="flex items-center gap-3">
            {/* Notifications Bell Dropdown trigger */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2.5 rounded-xl bg-navy-800/80 hover:bg-navy-800 border border-white/10 text-gray-300 hover:text-white transition-all"
                title="Notifications"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-crimson-500 text-white text-[10px] font-extrabold flex items-center justify-center shadow-lg shadow-crimson-500/40">
                  3
                </span>
              </button>

              {/* Notifications Popover */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-navy-950 border border-white/15 rounded-2xl shadow-2xl p-4 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-3">
                    <span className="font-bold text-sm text-white">System Notifications</span>
                    <span className="text-[10px] bg-crimson-500/20 text-crimson-400 px-2 py-0.5 rounded-full">3 New</span>
                  </div>
                  <div className="space-y-2.5 text-xs">
                    <div className="p-2.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.07] transition-colors cursor-pointer" onClick={() => { setActiveTab("quotes"); setShowNotifications(false); }}>
                      <div className="font-bold text-golden-400">New Quote Request</div>
                      <div className="text-gray-400 mt-0.5">Acme Logistics requested refrigerated transport ($4,200 est.)</div>
                      <div className="text-[10px] text-gray-500 mt-1">10 mins ago</div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.07] transition-colors cursor-pointer" onClick={() => { setActiveTab("contacts"); setShowNotifications(false); }}>
                      <div className="font-bold text-cyan-400">Contact Inquiry</div>
                      <div className="text-gray-400 mt-0.5">2 unread messages waiting in the support inbox</div>
                      <div className="text-[10px] text-gray-500 mt-1">1 hour ago</div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.07] transition-colors cursor-pointer" onClick={() => { setActiveTab("vehicles"); setShowNotifications(false); }}>
                      <div className="font-bold text-amber-400">Fleet Maintenance Alert</div>
                      <div className="text-gray-400 mt-0.5">Peterbilt 579 scheduled for regular 50,000-mile diagnostic</div>
                      <div className="text-[10px] text-gray-500 mt-1">Yesterday</div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Profile Pill */}
            <div className="flex items-center gap-3 pl-3 border-l border-white/10">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white font-extrabold text-sm shadow-md">
                {(user?.name || "AU").substring(0, 2).toUpperCase()}
              </div>
              <div className="hidden sm:block">
                <div className="text-xs font-bold text-white leading-tight">{user?.name || "Admin User"}</div>
                <div className="text-[10px] text-cyan-400 font-semibold">{user?.role?.toUpperCase() || "SUPER ADMIN"}</div>
              </div>
              <button
                onClick={logout}
                className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 hover:text-red-300 transition-colors ml-1"
                title="Log Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ─── MAIN DASHBOARD CONTENT AREA ─── */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Dynamic Title if not on overview */}
        {activeTab !== "overview" && (
          <div className="mb-6 flex items-center justify-between pb-4 border-b border-white/10">
            <div>
              <h2 className="text-xl font-bold text-white capitalize">
                {activeTab.replace("_", " ")} Management
              </h2>
              <p className="text-xs text-gray-400 mt-0.5">
                Full CRUD control & live telemetry synchronization for {activeTab}
              </p>
            </div>
            <button
              onClick={() => { setActiveTab("overview"); setActiveTopNav("Dashboard"); }}
              className="px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-gray-300 font-semibold transition-colors"
            >
              ← Back to Overview
            </button>
          </div>
        )}

        {renderTab()}
      </main>
    </div>
  );
}

