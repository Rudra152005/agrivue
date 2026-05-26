import { Link, useRouterState } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  LayoutDashboard, Users, MapPin, Sprout, Gift, Plane, Crosshair, Brain,
  BarChart3, Bell, Settings, Leaf, ShieldCheck, LogOut, Briefcase,
  ClipboardCheck, UploadCloud, Droplets, HelpCircle, ThermometerSun
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";

export function Sidebar() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const search = useRouterState({ select: (s) => s.location.search }) as any;

  const { data: user } = useQuery({
    queryKey: ["me"],
    queryFn: async () => {
      const response = await api.get("/auth/me");
      return response.data.data;
    },
  });

  interface SidebarItem {
    to: string;
    search?: { tab: string };
    label: string;
    icon: any;
  }

  const officerItems: SidebarItem[] = [
    { to: "/dashboard", search: { tab: "dashboard" }, label: "Dashboard", icon: LayoutDashboard },
    { to: "/dashboard", search: { tab: "farmers" }, label: "Assigned Farmers", icon: Users },
    { to: "/dashboard", search: { tab: "verification" }, label: "Land Verification", icon: MapPin },
    { to: "/dashboard", search: { tab: "monitoring" }, label: "Crop Monitoring", icon: Sprout },
    { to: "/dashboard", search: { tab: "schemes" }, label: "Scheme Applications", icon: Gift },
    { to: "/dashboard", search: { tab: "inspections" }, label: "Field Inspections", icon: ClipboardCheck },
    { to: "/dashboard", search: { tab: "reports" }, label: "Reports Upload", icon: UploadCloud },
    { to: "/dashboard", search: { tab: "notifications" }, label: "Notifications", icon: Bell },
    { to: "/dashboard", search: { tab: "analytics" }, label: "District Analytics", icon: BarChart3 },
    { to: "/settings", label: "Settings", icon: Settings },
  ];

  const farmerItems: SidebarItem[] = [
    { to: "/dashboard", search: { tab: "dashboard" }, label: "Dashboard", icon: LayoutDashboard },
    { to: "/dashboard", search: { tab: "land" }, label: "My Land", icon: MapPin },
    { to: "/dashboard", search: { tab: "monitoring" }, label: "Crop Monitoring", icon: Sprout },
    { to: "/dashboard", search: { tab: "schemes" }, label: "Scheme Applications", icon: Gift },
    { to: "/dashboard", search: { tab: "weather" }, label: "Weather Updates", icon: ThermometerSun },
    { to: "/dashboard", search: { tab: "ai-suggestions" }, label: "AI Suggestions", icon: Brain },
    { to: "/dashboard", search: { tab: "irrigation" }, label: "Irrigation Status", icon: Droplets },
    { to: "/dashboard", search: { tab: "notifications" }, label: "Notifications", icon: Bell },
    { to: "/dashboard", search: { tab: "support" }, label: "Support Center", icon: HelpCircle },
    { to: "/settings", label: "Profile", icon: Settings },
  ];

  const adminItems: SidebarItem[] = [
    { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "/farmers", label: "Farmers Management", icon: Users },
    { to: "/officers", label: "Officers Management", icon: Briefcase },
    { to: "/land-records", label: "Land Records", icon: MapPin },
    { to: "/schemes", label: "Beneficiary Schemes", icon: Gift },
    { to: "/crop-monitoring", label: "Crop Monitoring", icon: Sprout },
    { to: "/aerial", label: "Aerial Analytics", icon: Plane },
    { to: "/drone-surveillance", label: "Drone Surveillance", icon: Crosshair },
    { to: "/ai-predictions", label: "AI Predictions", icon: Brain },
    { to: "/analytics", label: "Reports & Analytics", icon: BarChart3 },
    { to: "/notifications", label: "Notifications", icon: Bell },
    { to: "/users", label: "User Permissions", icon: ShieldCheck },
    { to: "/settings", label: "Settings", icon: Settings },
  ];

  const role = user?.role || (typeof window !== "undefined" ? localStorage.getItem("userRole") : null);
  const menuItems = role === "officer" ? officerItems : role === "farmer" ? farmerItems : adminItems;

  return (
    <aside className="hidden lg:flex fixed inset-y-0 left-0 w-64 flex-col glass-strong border-r border-border z-40">
      <Link to="/" className="flex items-center gap-3 px-6 h-16 border-b border-border">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-primary blur-md opacity-60" />
          <div className="relative bg-gradient-primary p-2 rounded-xl">
            <Leaf className="h-5 w-5 text-primary-foreground" />
          </div>
        </div>
        <div>
          <div className="font-bold text-foreground leading-tight">Agri-TrekOps</div>
          <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Smart Agriculture</div>
        </div>
      </Link>
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {menuItems.map((it, idx) => {
          // Check if active: path matches AND either it has no search parameter OR the search.tab parameter matches
          const active = path === it.to && (!it.search || search?.tab === it.search.tab || (!search?.tab && it.search.tab === "dashboard"));
          const Icon = it.icon;
          return (
            <Link
              key={idx}
              to={it.to}
              search={it.search}
              className="relative block"
            >
              <div className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all
                ${active
                  ? "text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent/30"}`}>
                {active && (
                  <motion.div
                    layoutId="sidebar-active"
                    className="absolute inset-0 bg-gradient-primary rounded-xl glow"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <Icon className="relative h-4 w-4" />
                <span className="relative font-medium">{it.label}</span>
              </div>
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t border-border">
        {user && (
          <div className="flex items-center gap-3 p-3 rounded-xl glass border border-border/40 mb-3 hover:bg-accent/10 transition-colors group">
            <div className="h-10 w-10 rounded-xl bg-gradient-primary flex items-center justify-center text-primary-foreground font-bold text-base shadow-md relative">
              {user.name?.[0]?.toUpperCase() || 'U'}
              <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-success border-2 border-background" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-foreground truncate">{user.name}</div>
              <div className="text-[10px] text-primary uppercase tracking-wider font-semibold truncate mt-0.5">{user.role}</div>
              <div className="text-[10px] text-muted-foreground truncate">{user.email}</div>
            </div>
          </div>
        )}
        <div className="glass rounded-xl p-3 text-xs mb-3">
          <div className="flex items-center gap-2 mb-1">
            <div className="h-2 w-2 rounded-full bg-success animate-pulse" />
            <span className="text-foreground font-semibold">System Healthy</span>
          </div>
          <p className="text-muted-foreground">All drones online · Sync OK</p>
        </div>
        <button 
          onClick={async () => {
            try {
              await api.post("/auth/logout");
            } catch (err) {
              console.error("Logout request failed", err);
            }
            localStorage.removeItem("token");
            localStorage.removeItem("userRole");
            window.location.href = "/login";
          }}
          className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </div>
    </aside>
  );
}

