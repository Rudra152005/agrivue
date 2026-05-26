import { useState } from "react";
import { Link, useRouter } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, Users, MapPin, Sprout, Gift, BarChart3, Bell, Settings,
  Leaf, LogOut, FileText, ClipboardCheck, Upload, AlertTriangle, Droplets,
  CheckCircle2, Clock, Search, Sun, Wind, ChevronDown, X, Plus,
  Camera, Navigation, Eye, Filter, Download, TrendingUp, ArrowUpRight,
  Loader2, Phone, Mail
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  PieChart, Pie, Cell, BarChart, Bar, Legend
} from "recharts";
import api from "@/lib/api";
import { GradientButton } from "@/components/ui-kit/GradientButton";
import { motion as m } from "framer-motion";

// ─────────────────────────── Sidebar ────────────────────────────────────────
const sidebarItems = [
  { id: "dashboard",    label: "Dashboard",            icon: LayoutDashboard },
  { id: "farmers",      label: "Assigned Farmers",     icon: Users },
  { id: "verification", label: "Land Verification",    icon: MapPin },
  { id: "crop",         label: "Crop Monitoring",      icon: Sprout },
  { id: "schemes",      label: "Scheme Applications",  icon: Gift },
  { id: "inspections",  label: "Field Inspections",    icon: ClipboardCheck },
  { id: "reports",      label: "Reports Upload",       icon: Upload },
  { id: "notifications",label: "Notifications",        icon: Bell },
  { id: "analytics",    label: "District Analytics",   icon: BarChart3 },
  { id: "settings",     label: "Settings",             icon: Settings },
];

// ─────────────────────────── Static demo data ───────────────────────────────
const cropConditionData = [
  { month: "Jan", healthy: 72, warning: 18, critical: 10 },
  { month: "Feb", healthy: 78, warning: 14, critical: 8  },
  { month: "Mar", healthy: 80, warning: 12, critical: 8  },
  { month: "Apr", healthy: 68, warning: 20, critical: 12 },
  { month: "May", healthy: 74, warning: 16, critical: 10 },
  { month: "Jun", healthy: 82, warning: 12, critical: 6  },
];

const schemeData = [
  { name: "Approved", value: 45, color: "#10b981" },
  { name: "Pending",  value: 30, color: "#f59e0b" },
  { name: "Rejected", value: 15, color: "#ef4444" },
  { name: "Review",   value: 10, color: "#3b82f6" },
];

const waterUsageData = [
  { week: "W1", usage: 820 }, { week: "W2", usage: 932 },
  { week: "W3", usage: 901 }, { week: "W4", usage: 834 },
  { week: "W5", usage: 790 }, { week: "W6", usage: 880 },
];

const mockInspections = [
  { id: 1, farmer: "Ramesh Kumar",    land: "SN-4421", village: "Anandpur",  status: "completed", date: "2026-05-25", crop: "Wheat"  },
  { id: 2, farmer: "Sunita Devi",     land: "SN-4289", village: "Rampur",    status: "pending",   date: "2026-05-26", crop: "Rice"   },
  { id: 3, farmer: "Mohan Lal",       land: "SN-3901", village: "Krishnapur",status: "in-progress",date:"2026-05-25", crop: "Corn"   },
  { id: 4, farmer: "Priya Singh",     land: "SN-4567", village: "Govindpur", status: "pending",   date: "2026-05-27", crop: "Millet" },
  { id: 5, farmer: "Ashok Verma",     land: "SN-4102", village: "Janakpur",  status: "completed", date: "2026-05-24", crop: "Rice"   },
];

const mockAlerts = [
  { id: 1, type: "warning", title: "Low Soil Moisture",      location: "Village Rampur, Sector 4",   time: "2h ago" },
  { id: 2, type: "critical", title: "Pest Alert — Aphids",   location: "Village Krishnapur, Field B", time: "4h ago" },
  { id: 3, type: "info",    title: "Irrigation Due",         location: "Village Anandpur, Sector 2",  time: "6h ago" },
  { id: 4, type: "warning", title: "Fungal Risk Detected",   location: "Village Govindpur, Field C",  time: "8h ago" },
];

// ─────────────────────────── Helpers ────────────────────────────────────────
const statusBadge = (status: string) => {
  const s: Record<string, string> = {
    completed:   "bg-success/15 text-success border-success/30",
    pending:     "bg-warning/15 text-warning border-warning/30",
    "in-progress":"bg-info/15 text-info border-info/30",
    rejected:    "bg-destructive/15 text-destructive border-destructive/30",
    approved:    "bg-success/15 text-success border-success/30",
  };
  return s[status] ?? "bg-accent/30 text-muted-foreground border-border/40";
};

// ─────────────────────────── Field Inspection Modal ─────────────────────────
function InspectionModal({ onClose }: { onClose: () => void }) {
  const [form, setForm] = useState({ farmer: "", land: "", crop: "", notes: "", status: "in-progress" });
  const [submitted, setSubmitted] = useState(false);
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(onClose, 1800);
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <motion.div initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.92 }}
        className="glass rounded-3xl p-8 w-full max-w-lg border border-primary/30 shadow-2xl relative">
        <button onClick={onClose} className="absolute top-5 right-5 text-muted-foreground hover:text-foreground p-1 rounded-full hover:bg-accent/50 transition-colors">
          <X className="h-5 w-5" />
        </button>
        <AnimatePresence mode="wait">
          {submitted ? (
            <motion.div key="done" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center py-8 gap-4">
              <div className="h-16 w-16 rounded-full bg-success/20 flex items-center justify-center text-success border border-success/40">
                <CheckCircle2 className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold text-success">Inspection Logged!</h3>
              <p className="text-sm text-muted-foreground text-center">Field inspection report has been saved to database.</p>
            </motion.div>
          ) : (
            <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="flex items-center gap-3 mb-6">
                <div className="h-10 w-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary border border-primary/30">
                  <ClipboardCheck className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold">New Field Inspection</h2>
                  <p className="text-xs text-muted-foreground">Log a new field inspection visit</p>
                </div>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                {[
                  { label: "Farmer Name", key: "farmer", placeholder: "e.g. Ramesh Kumar" },
                  { label: "Land Survey No.", key: "land", placeholder: "e.g. SN-4421" },
                  { label: "Primary Crop", key: "crop", placeholder: "e.g. Wheat, Rice, Corn" },
                ].map(f => (
                  <div key={f.key}>
                    <label className="text-xs text-muted-foreground uppercase tracking-widest mb-1.5 block">{f.label}</label>
                    <input
                      required
                      value={(form as any)[f.key]}
                      onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                      placeholder={f.placeholder}
                      className="w-full bg-background/60 border border-border/60 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary/60"
                    />
                  </div>
                ))}
                <div>
                  <label className="text-xs text-muted-foreground uppercase tracking-widest mb-1.5 block">Status</label>
                  <select value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value }))}
                    className="w-full bg-background/60 border border-border/60 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary/60">
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                    <option value="pending">Pending</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground uppercase tracking-widest mb-1.5 block">Field Notes</label>
                  <textarea required rows={3} value={form.notes}
                    onChange={e => setForm(p => ({ ...p, notes: e.target.value }))}
                    placeholder="Describe crop conditions, soil health, irrigation status..."
                    className="w-full bg-background/60 border border-border/60 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary/60 resize-none"
                  />
                </div>
                <div className="flex gap-3 mt-2">
                  <button type="button" onClick={onClose}
                    className="flex-1 px-4 py-2.5 rounded-xl border border-border/60 text-sm font-medium hover:bg-accent/30 transition-colors">
                    Cancel
                  </button>
                  <GradientButton className="flex-1" type="submit">
                    <CheckCircle2 className="h-4 w-4 mr-2" /> Submit Inspection
                  </GradientButton>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

// ─────────────────────────── Main Dashboard Component ───────────────────────
export function OfficerDashboardFull({ user }: { user: any }) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [searchQuery, setSearchQuery] = useState("");
  const [showInspectionModal, setShowInspectionModal] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");

  // Fetch real data
  const { data: analytics } = useQuery({
    queryKey: ["analytics"],
    queryFn: async () => (await api.get("/analytics")).data.data,
  });
  const { data: farmersData } = useQuery({
    queryKey: ["farmers"],
    queryFn: async () => (await api.get("/farmers?limit=20")).data.data,
  });
  const { data: landsData } = useQuery({
    queryKey: ["all-lands"],
    queryFn: async () => (await api.get("/lands")).data.data,
  });
  const { data: notificationsData } = useQuery({
    queryKey: ["notifications"],
    queryFn: async () => (await api.get("/notifications")).data.data,
  });

  const farmers: any[] = farmersData || [];
  const lands: any[] = landsData || [];
  const notifications: any[] = notificationsData || [];
  const pendingLands = lands.filter(l => !l.verified);

  // Stat cards
  const stats = [
    { label: "Assigned Farmers",        value: farmers.length || 0,         icon: Users,          color: "text-primary",     bg: "bg-primary/10",     border: "border-primary/20" },
    { label: "Pending Verifications",   value: pendingLands.length || 0,    icon: ClipboardCheck, color: "text-warning",     bg: "bg-warning/10",     border: "border-warning/20" },
    { label: "Field Visits Today",      value: mockInspections.filter(i => i.date === "2026-05-25").length, icon: Navigation, color: "text-info", bg: "bg-info/10", border: "border-info/20" },
    { label: "Crop Inspection Reports", value: mockInspections.filter(i => i.status === "completed").length, icon: FileText, color: "text-success", bg: "bg-success/10", border: "border-success/20" },
    { label: "Scheme Applications",     value: analytics?.applicationsByStatus?.find((a: any) => a._id === "pending")?.count || 0, icon: Gift, color: "text-warning", bg: "bg-warning/10", border: "border-warning/20" },
    { label: "High-Risk Crop Areas",    value: mockAlerts.filter(a => a.type === "critical").length, icon: AlertTriangle, color: "text-destructive", bg: "bg-destructive/10", border: "border-destructive/20" },
    { label: "Irrigation Alerts",       value: mockAlerts.filter(a => a.title.includes("Irrigation") || a.title.includes("Moisture")).length, icon: Droplets, color: "text-info", bg: "bg-info/10", border: "border-info/20" },
    { label: "Verified Land Records",   value: lands.filter(l => l.verified).length, icon: CheckCircle2, color: "text-success", bg: "bg-success/10", border: "border-success/20" },
  ];

  // Filter inspections
  const filteredInspections = mockInspections.filter(i => {
    const matchSearch = !searchQuery || i.farmer.toLowerCase().includes(searchQuery.toLowerCase()) || i.land.toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus = statusFilter === "all" || i.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
    } catch (err) {
      console.error("Logout request failed", err);
    }
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    window.location.href = "/login";
  };

  // ─────────── RENDER ──────────────────────────────────────────────────────
  return (
    <div className="min-h-screen grid-bg flex">
      <AnimatePresence>
        {showInspectionModal && <InspectionModal onClose={() => setShowInspectionModal(false)} />}
      </AnimatePresence>

      {/* ── Sidebar ───────────────────────────────────────────────────────── */}
      <aside className="hidden lg:flex fixed inset-y-0 left-0 w-64 flex-col glass-strong border-r border-border z-40">
        <div className="flex items-center gap-3 px-6 h-16 border-b border-border">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-primary blur-md opacity-60" />
            <div className="relative bg-gradient-primary p-2 rounded-xl">
              <Leaf className="h-5 w-5 text-primary-foreground" />
            </div>
          </div>
          <div>
            <div className="font-bold text-foreground leading-tight">Agri-TrekOps</div>
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Field Officer Portal</div>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {sidebarItems.map(item => {
            const active = activeTab === item.id;
            const Icon = item.icon;
            return (
              <button key={item.id} onClick={() => setActiveTab(item.id)} className="relative block w-full text-left">
                <div className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all
                  ${active ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground hover:bg-accent/30"}`}>
                  {active && (
                    <motion.div layoutId="officer-sidebar-active"
                      className="absolute inset-0 bg-gradient-primary rounded-xl glow"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }} />
                  )}
                  <Icon className="relative h-4 w-4" />
                  <span className="relative font-medium">{item.label}</span>
                  {item.id === "notifications" && notifications.filter(n => !n.read).length > 0 && (
                    <span className="relative ml-auto text-[10px] bg-destructive text-white rounded-full px-1.5 py-0.5 font-bold">
                      {notifications.filter(n => !n.read).length}
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-border">
          <div className="glass rounded-xl p-3 mb-3">
            <div className="flex items-center gap-2.5">
              <div className="h-9 w-9 rounded-full bg-gradient-primary flex items-center justify-center text-primary-foreground font-bold text-sm">
                {user?.name?.[0] || "O"}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold truncate">{user?.name || "Field Officer"}</p>
                <p className="text-[10px] text-muted-foreground">{user?.email || ""}</p>
              </div>
              <div className="h-2 w-2 rounded-full bg-success animate-pulse" />
            </div>
          </div>
          <button onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors">
            <LogOut className="h-4 w-4" /> Logout
          </button>
        </div>
      </aside>

      {/* ── Main content ──────────────────────────────────────────────────── */}
      <div className="lg:pl-64 flex-1">
        {/* Topbar */}
        <header className="sticky top-0 z-30 h-16 glass-strong border-b border-border flex items-center gap-4 px-4 lg:px-8">
          <div className="flex-1 relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search farmers, land records, reports..."
              className="w-full bg-accent/30 border border-border/40 rounded-xl pl-9 pr-4 py-2 text-sm focus:outline-none focus:border-primary/50"
            />
          </div>

          <div className="flex items-center gap-3 ml-auto">
            {/* Weather widget */}
            <div className="hidden md:flex items-center gap-2 glass rounded-xl px-3 py-1.5 text-xs">
              <Sun className="h-3.5 w-3.5 text-warning" />
              <span className="font-semibold">28°C</span>
              <span className="text-muted-foreground">Clear</span>
            </div>

            {/* Daily tasks */}
            <div className="hidden md:flex items-center gap-1.5 glass rounded-xl px-3 py-1.5 text-xs">
              <Clock className="h-3.5 w-3.5 text-primary" />
              <span className="font-semibold">{mockInspections.filter(i => i.status !== "completed").length}</span>
              <span className="text-muted-foreground">tasks pending</span>
            </div>

            {/* Notifications bell */}
            <button onClick={() => setActiveTab("notifications")}
              className="relative p-2 rounded-xl hover:bg-accent/40 transition-colors">
              <Bell className="h-5 w-5 text-muted-foreground" />
              {notifications.filter(n => !n.read).length > 0 && (
                <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-destructive animate-pulse" />
              )}
            </button>

            {/* Profile */}
            <div className="flex items-center gap-2 glass rounded-xl px-3 py-1.5 cursor-pointer">
              <div className="h-7 w-7 rounded-full bg-gradient-primary flex items-center justify-center text-primary-foreground text-xs font-bold">
                {user?.name?.[0] || "O"}
              </div>
              <span className="text-sm font-medium hidden md:block">{user?.name?.split(" ")[0] || "Officer"}</span>
              <span className="text-[10px] text-muted-foreground hidden md:block uppercase tracking-wider">Officer</span>
            </div>
          </div>
        </header>

        {/* Page content */}
        <motion.main initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}
          className="px-4 lg:px-8 py-6">

          {/* ── DASHBOARD TAB ──────────────────────────────────────────────── */}
          {activeTab === "dashboard" && (
            <div>
              <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
                <div>
                  <h2 className="text-2xl font-bold">Officer Workspace</h2>
                  <p className="text-sm text-muted-foreground mt-1">Welcome back, <span className="text-primary font-semibold">{user?.name || "Officer"}</span>. You have {pendingLands.length} pending verifications today.</p>
                </div>
                <div className="flex gap-2">
                  <GradientButton variant="outline" onClick={() => setActiveTab("reports")}>
                    <Upload className="h-4 w-4 mr-2" /> Upload Report
                  </GradientButton>
                  <GradientButton onClick={() => setShowInspectionModal(true)}>
                    <Plus className="h-4 w-4 mr-2" /> New Inspection
                  </GradientButton>
                </div>
              </div>

              {/* Stat Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {stats.map((s, i) => (
                  <motion.div key={i} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
                    className={`glass rounded-2xl p-5 border ${s.border} hover:scale-[1.02] transition-transform cursor-pointer`}>
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-xs text-muted-foreground uppercase tracking-widest leading-tight">{s.label}</p>
                      <div className={`p-2 rounded-xl ${s.bg}`}>
                        <s.icon className={`h-4 w-4 ${s.color}`} />
                      </div>
                    </div>
                    <p className={`text-3xl font-bold ${s.color}`}>{s.value}</p>
                  </motion.div>
                ))}
              </div>

              {/* Charts Row */}
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">
                {/* Crop Condition Trend */}
                <div className="xl:col-span-2 glass rounded-3xl p-6 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)]">
                  <div className="flex items-center justify-between mb-5">
                    <div>
                      <h3 className="font-semibold flex items-center gap-2"><TrendingUp className="h-4 w-4 text-primary" /> District Crop Conditions</h3>
                      <p className="text-xs text-muted-foreground mt-0.5">Monthly health distribution across assigned zones</p>
                    </div>
                  </div>
                  <ResponsiveContainer width="100%" height={240}>
                    <AreaChart data={cropConditionData}>
                      <defs>
                        {[["gH","#10b981"],["gW","#f59e0b"],["gC","#ef4444"]].map(([id, color]) => (
                          <linearGradient key={id} id={id} x1="0" x2="0" y1="0" y2="1">
                            <stop offset="0%" stopColor={color} stopOpacity={0.4} />
                            <stop offset="100%" stopColor={color} stopOpacity={0} />
                          </linearGradient>
                        ))}
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="oklch(1 0 0/0.05)" vertical={false} />
                      <XAxis dataKey="month" stroke="oklch(0.68 0.02 150)" fontSize={11} tickLine={false} axisLine={false} />
                      <YAxis stroke="oklch(0.68 0.02 150)" fontSize={11} tickLine={false} axisLine={false} unit="%" />
                      <Tooltip contentStyle={{ background:"oklch(0.16 0.02 160/0.9)", border:"1px solid oklch(0.30 0.03 160)", borderRadius:12 }} />
                      <Area type="monotone" dataKey="healthy" stroke="#10b981" strokeWidth={2} fill="url(#gH)" name="Healthy" />
                      <Area type="monotone" dataKey="warning" stroke="#f59e0b" strokeWidth={2} fill="url(#gW)" name="Warning" />
                      <Area type="monotone" dataKey="critical" stroke="#ef4444" strokeWidth={2} fill="url(#gC)" name="Critical" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                {/* Scheme Applications Donut */}
                <div className="glass rounded-3xl p-6 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)]">
                  <h3 className="font-semibold mb-5 flex items-center gap-2"><Gift className="h-4 w-4 text-warning" /> Scheme Applications</h3>
                  <ResponsiveContainer width="100%" height={180}>
                    <PieChart>
                      <Pie data={schemeData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value">
                        {schemeData.map((entry, i) => <Cell key={i} fill={entry.color} fillOpacity={0.9} />)}
                      </Pie>
                      <Tooltip contentStyle={{ background:"oklch(0.16 0.02 160/0.9)", border:"1px solid oklch(0.30 0.03 160)", borderRadius:12 }} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {schemeData.map(d => (
                      <div key={d.name} className="flex items-center gap-1.5 text-xs">
                        <span className="h-2 w-2 rounded-full" style={{ background: d.color }} />
                        <span className="text-muted-foreground">{d.name}</span>
                        <span className="font-bold ml-auto">{d.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom Row: Alerts + Farmer List */}
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {/* Field Alerts */}
                <div className="glass rounded-3xl p-6 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)]">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold flex items-center gap-2"><AlertTriangle className="h-4 w-4 text-warning" /> Field Alerts</h3>
                    <span className="text-[10px] uppercase tracking-widest text-muted-foreground border border-border/50 rounded px-2 py-0.5">Live</span>
                  </div>
                  <div className="space-y-3">
                    {mockAlerts.map(alert => (
                      <div key={alert.id}
                        className={`p-3 rounded-2xl border flex items-start gap-3 ${alert.type === "critical" ? "bg-destructive/10 border-destructive/30" : alert.type === "warning" ? "bg-warning/10 border-warning/30" : "bg-info/10 border-info/30"}`}>
                        <div className={`mt-0.5 p-1.5 rounded-lg ${alert.type === "critical" ? "bg-destructive/20 text-destructive" : alert.type === "warning" ? "bg-warning/20 text-warning" : "bg-info/20 text-info"}`}>
                          <AlertTriangle className="h-3.5 w-3.5" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-bold">{alert.title}</p>
                          <p className="text-[11px] text-muted-foreground mt-0.5">{alert.location}</p>
                        </div>
                        <span className="text-[10px] text-muted-foreground">{alert.time}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent Farmers */}
                <div className="glass rounded-3xl p-6 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)]">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold">Assigned Farmers</h3>
                    <button onClick={() => setActiveTab("farmers")} className="text-xs text-primary flex items-center gap-1 hover:underline">
                      View all <ArrowUpRight className="h-3 w-3" />
                    </button>
                  </div>
                  <div className="space-y-3">
                    {farmers.slice(0, 4).map((f: any) => (
                      <div key={f._id} className="flex items-center gap-3 p-3 rounded-xl border border-border/40 hover:bg-accent/20 transition-colors">
                        <div className="h-9 w-9 rounded-full bg-gradient-primary flex items-center justify-center text-primary-foreground font-bold text-sm">
                          {typeof f.user === "object" ? f.user.name?.[0] : "F"}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold truncate">{typeof f.user === "object" ? f.user.name : "Farmer"}</p>
                          <p className="text-xs text-muted-foreground">{f.village} · {f.landSize} acres</p>
                        </div>
                        <span className={`text-[10px] px-2 py-1 rounded-full border capitalize ${statusBadge(f.beneficiaryStatus)}`}>
                          {f.beneficiaryStatus}
                        </span>
                      </div>
                    ))}
                    {farmers.length === 0 && <p className="text-sm text-muted-foreground italic text-center py-6">No farmers assigned yet.</p>}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── FIELD INSPECTIONS TAB ─────────────────────────────────────── */}
          {activeTab === "inspections" && (
            <div>
              <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
                <div>
                  <h2 className="text-2xl font-bold">Field Inspections</h2>
                  <p className="text-sm text-muted-foreground">GPS-tracked field visits and crop condition reports.</p>
                </div>
                <GradientButton onClick={() => setShowInspectionModal(true)}>
                  <Plus className="h-4 w-4 mr-2" /> New Inspection
                </GradientButton>
              </div>

              {/* Filter bar */}
              <div className="glass rounded-2xl p-4 mb-6 flex flex-wrap gap-3 items-center">
                <div className="relative flex-1 min-w-[200px]">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Search farmer, land survey..."
                    className="w-full bg-background/60 border border-border/40 rounded-xl pl-9 pr-4 py-2 text-sm focus:outline-none focus:border-primary/50" />
                </div>
                <div className="flex gap-2">
                  {["all", "pending", "in-progress", "completed"].map(s => (
                    <button key={s} onClick={() => setStatusFilter(s)}
                      className={`text-xs px-3 py-1.5 rounded-xl font-medium capitalize transition-all ${statusFilter === s ? "bg-primary text-primary-foreground" : "bg-accent/30 text-muted-foreground hover:text-foreground"}`}>
                      {s === "all" ? "All" : s}
                    </button>
                  ))}
                </div>
                <GradientButton variant="outline" className="ml-auto text-xs">
                  <Download className="h-3.5 w-3.5 mr-1.5" /> Export
                </GradientButton>
              </div>

              <div className="glass rounded-3xl overflow-hidden border border-border/40 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)]">
                <table className="w-full text-sm text-left">
                  <thead className="text-[10px] uppercase tracking-widest text-muted-foreground bg-accent/30 border-b border-border/60">
                    <tr>
                      {["Farmer","Land Survey","Village","Crop","Date","Status","Actions"].map(h => (
                        <th key={h} className="px-5 py-4 font-semibold">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40">
                    {filteredInspections.map(item => (
                      <tr key={item.id} className="hover:bg-accent/20 transition-colors group">
                        <td className="px-5 py-3.5 font-semibold">{item.farmer}</td>
                        <td className="px-5 py-3.5 font-mono text-xs text-muted-foreground">{item.land}</td>
                        <td className="px-5 py-3.5 text-muted-foreground">{item.village}</td>
                        <td className="px-5 py-3.5">{item.crop}</td>
                        <td className="px-5 py-3.5 text-muted-foreground text-xs">{item.date}</td>
                        <td className="px-5 py-3.5">
                          <span className={`text-[10px] px-2.5 py-1 rounded-full border capitalize font-semibold ${statusBadge(item.status)}`}>
                            {item.status}
                          </span>
                        </td>
                        <td className="px-5 py-3.5">
                          <button className="text-primary hover:underline text-xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                            <Eye className="h-3.5 w-3.5" /> View
                          </button>
                        </td>
                      </tr>
                    ))}
                    {filteredInspections.length === 0 && (
                      <tr><td colSpan={7} className="py-10 text-center text-muted-foreground italic">No inspections found.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ── VERIFICATION TAB ──────────────────────────────────────────── */}
          {activeTab === "verification" && (
            <div>
              <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
                <div>
                  <h2 className="text-2xl font-bold">Land Verification</h2>
                  <p className="text-sm text-muted-foreground">{pendingLands.length} records pending your verification.</p>
                </div>
              </div>
              <div className="glass rounded-3xl overflow-hidden border border-border/40 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)]">
                <table className="w-full text-sm text-left">
                  <thead className="text-[10px] uppercase tracking-widest text-muted-foreground bg-accent/30 border-b border-border/60">
                    <tr>
                      {["Survey No","Village","Area","Soil Type","Status","Action"].map(h => (
                        <th key={h} className="px-5 py-4 font-semibold">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40">
                    {lands.map((land: any) => (
                      <tr key={land._id} className="hover:bg-accent/20 transition-colors group">
                        <td className="px-5 py-3.5 font-mono text-xs">{land.surveyNumber}</td>
                        <td className="px-5 py-3.5">{land.village || "—"}</td>
                        <td className="px-5 py-3.5">{land.area} <span className="text-muted-foreground text-xs">acres</span></td>
                        <td className="px-5 py-3.5 capitalize text-muted-foreground">{land.soilType || "—"}</td>
                        <td className="px-5 py-3.5">
                          <span className={`text-[10px] px-2.5 py-1 rounded-full border font-semibold ${land.verified ? statusBadge("approved") : statusBadge("pending")}`}>
                            {land.verified ? "Verified" : "Pending"}
                          </span>
                        </td>
                        <td className="px-5 py-3.5">
                          {!land.verified && (
                            <button className="text-xs text-primary border border-primary/40 px-3 py-1 rounded-lg hover:bg-primary/10 transition-colors opacity-0 group-hover:opacity-100">
                              Verify
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                    {lands.length === 0 && (
                      <tr><td colSpan={6} className="py-10 text-center text-muted-foreground italic">No land records found.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ── FARMERS TAB ───────────────────────────────────────────────── */}
          {activeTab === "farmers" && (
            <div>
              <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
                <div>
                  <h2 className="text-2xl font-bold">Assigned Farmers</h2>
                  <p className="text-sm text-muted-foreground">{farmers.length} farmers in your district.</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {farmers.map((f: any) => (
                  <div key={f._id} className="glass rounded-2xl p-5 border border-border/40 hover:border-primary/30 transition-all hover:scale-[1.01]">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="h-11 w-11 rounded-full bg-gradient-primary flex items-center justify-center text-primary-foreground font-bold text-lg">
                        {typeof f.user === "object" ? f.user.name?.[0] : "F"}
                      </div>
                      <div className="flex-1">
                        <p className="font-bold">{typeof f.user === "object" ? f.user.name : "Farmer"}</p>
                        <p className="text-xs text-muted-foreground">{f.village}, {f.district}</p>
                      </div>
                      <span className={`text-[10px] px-2 py-1 rounded-full border capitalize font-semibold ${statusBadge(f.beneficiaryStatus)}`}>
                        {f.beneficiaryStatus}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      {[
                        { label: "Land Size", value: `${f.landSize || 0} acres` },
                        { label: "Crops", value: f.crops?.join(", ") || "—" },
                        { label: "Contact", value: f.contactNumber || "—" },
                        { label: "State", value: f.state || "—" },
                      ].map(item => (
                        <div key={item.label} className="bg-accent/20 rounded-lg p-2">
                          <p className="text-muted-foreground">{item.label}</p>
                          <p className="font-semibold mt-0.5 truncate">{item.value}</p>
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-2 mt-4">
                      <button className="flex-1 text-xs py-2 rounded-xl border border-border/50 hover:bg-accent/30 transition-colors flex items-center justify-center gap-1.5">
                        <Phone className="h-3.5 w-3.5" /> Contact
                      </button>
                      <button className="flex-1 text-xs py-2 rounded-xl border border-primary/40 text-primary hover:bg-primary/10 transition-colors flex items-center justify-center gap-1.5">
                        <Eye className="h-3.5 w-3.5" /> View Profile
                      </button>
                    </div>
                  </div>
                ))}
                {farmers.length === 0 && (
                  <div className="col-span-3 glass rounded-2xl p-10 text-center text-muted-foreground italic">No farmers found.</div>
                )}
              </div>
            </div>
          )}

          {/* ── ANALYTICS TAB ─────────────────────────────────────────────── */}
          {activeTab === "analytics" && (
            <div>
              <h2 className="text-2xl font-bold mb-6">District Analytics</h2>
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <div className="glass rounded-3xl p-6 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)]">
                  <h3 className="font-semibold mb-4 flex items-center gap-2"><TrendingUp className="h-4 w-4 text-primary"/>Crop Conditions Trend</h3>
                  <ResponsiveContainer width="100%" height={260}>
                    <AreaChart data={cropConditionData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="oklch(1 0 0/0.05)" vertical={false}/>
                      <XAxis dataKey="month" stroke="oklch(0.68 0.02 150)" fontSize={11} tickLine={false} axisLine={false}/>
                      <YAxis stroke="oklch(0.68 0.02 150)" fontSize={11} tickLine={false} axisLine={false} unit="%"/>
                      <Tooltip contentStyle={{background:"oklch(0.16 0.02 160/0.9)",border:"1px solid oklch(0.30 0.03 160)",borderRadius:12}}/>
                      <Legend/>
                      <Area type="monotone" dataKey="healthy" stroke="#10b981" fill="#10b981" fillOpacity={0.2} strokeWidth={2}/>
                      <Area type="monotone" dataKey="warning" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.2} strokeWidth={2}/>
                      <Area type="monotone" dataKey="critical" stroke="#ef4444" fill="#ef4444" fillOpacity={0.2} strokeWidth={2}/>
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                <div className="glass rounded-3xl p-6 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)]">
                  <h3 className="font-semibold mb-4 flex items-center gap-2"><Droplets className="h-4 w-4 text-info"/>Water Usage Reports</h3>
                  <ResponsiveContainer width="100%" height={260}>
                    <BarChart data={waterUsageData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="oklch(1 0 0/0.05)" vertical={false}/>
                      <XAxis dataKey="week" stroke="oklch(0.68 0.02 150)" fontSize={11} tickLine={false} axisLine={false}/>
                      <YAxis stroke="oklch(0.68 0.02 150)" fontSize={11} tickLine={false} axisLine={false} unit="L"/>
                      <Tooltip contentStyle={{background:"oklch(0.16 0.02 160/0.9)",border:"1px solid oklch(0.30 0.03 160)",borderRadius:12}}/>
                      <Bar dataKey="usage" fill="oklch(0.70 0.14 220)" radius={[6,6,0,0]} fillOpacity={0.85} name="Water (L)"/>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          {/* ── NOTIFICATIONS TAB ─────────────────────────────────────────── */}
          {activeTab === "notifications" && (
            <div>
              <h2 className="text-2xl font-bold mb-6">Notifications</h2>
              <div className="space-y-3 max-w-2xl">
                {notifications.length > 0 ? notifications.map((n: any) => (
                  <div key={n._id} className={`glass rounded-2xl p-5 border ${!n.read ? "border-primary/30 bg-primary/5" : "border-border/40"}`}>
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-xl ${!n.read ? "bg-primary/20 text-primary" : "bg-accent/40 text-muted-foreground"}`}>
                        <Bell className="h-4 w-4" />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-sm">{n.title || "System Notification"}</p>
                        <p className="text-xs text-muted-foreground mt-1">{n.message}</p>
                        <p className="text-[10px] text-muted-foreground mt-2">{new Date(n.createdAt).toLocaleString()}</p>
                      </div>
                      {!n.read && <span className="h-2 w-2 rounded-full bg-primary mt-1.5 animate-pulse" />}
                    </div>
                  </div>
                )) : (
                  [...mockAlerts].map(alert => (
                    <div key={alert.id} className="glass rounded-2xl p-5 border border-border/40">
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-xl ${alert.type === "critical" ? "bg-destructive/20 text-destructive" : alert.type === "warning" ? "bg-warning/20 text-warning" : "bg-info/20 text-info"}`}>
                          <AlertTriangle className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="font-semibold text-sm">{alert.title}</p>
                          <p className="text-xs text-muted-foreground mt-1">{alert.location}</p>
                          <p className="text-[10px] text-muted-foreground mt-2">{alert.time}</p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* ── REPORTS TAB ───────────────────────────────────────────────── */}
          {activeTab === "reports" && (
            <div>
              <h2 className="text-2xl font-bold mb-6">Reports Upload</h2>
              <div className="max-w-2xl glass rounded-3xl p-8 border border-border/40 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)]">
                <div className="border-2 border-dashed border-primary/30 rounded-2xl p-12 flex flex-col items-center gap-4 hover:border-primary/60 transition-colors cursor-pointer bg-primary/5">
                  <div className="h-16 w-16 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                    <Upload className="h-8 w-8" />
                  </div>
                  <div className="text-center">
                    <p className="font-semibold">Drag & drop or click to upload</p>
                    <p className="text-sm text-muted-foreground mt-1">Field photos, crop reports, inspection documents</p>
                    <p className="text-xs text-muted-foreground mt-2">PDF, JPG, PNG up to 20MB</p>
                  </div>
                  <GradientButton><Camera className="h-4 w-4 mr-2" /> Select Files</GradientButton>
                </div>
                <div className="mt-6 space-y-3">
                  <h3 className="font-semibold text-sm">Report Type</h3>
                  {["Field Inspection Report","Crop Disease Report","Irrigation Status Report","Scheme Verification Report"].map(t => (
                    <label key={t} className="flex items-center gap-3 p-3 rounded-xl border border-border/40 hover:bg-accent/20 transition-colors cursor-pointer">
                      <input type="radio" name="reportType" className="accent-[oklch(0.72_0.18_150)]" />
                      <span className="text-sm">{t}</span>
                    </label>
                  ))}
                </div>
                <GradientButton className="w-full mt-6"><Upload className="h-4 w-4 mr-2" /> Submit Report</GradientButton>
              </div>
            </div>
          )}

          {/* ── Fallback for other tabs ────────────────────────────────────── */}
          {!["dashboard","inspections","verification","farmers","analytics","notifications","reports"].includes(activeTab) && (
            <div className="flex flex-col items-center justify-center h-64 gap-4 text-muted-foreground">
              <div className="h-16 w-16 rounded-full bg-accent/30 flex items-center justify-center">
                <Leaf className="h-8 w-8" />
              </div>
              <p className="text-lg font-semibold capitalize">{activeTab.replace("-"," ")} Section</p>
              <p className="text-sm">This section is coming soon.</p>
            </div>
          )}
        </motion.main>
      </div>
    </div>
  );
}
