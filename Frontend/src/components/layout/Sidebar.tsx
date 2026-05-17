import { Link, useRouterState } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  LayoutDashboard, Users, MapPin, Sprout, Gift, Plane,
  BarChart3, Bell, Settings, Leaf, ShieldCheck,
} from "lucide-react";

const items = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/farmers", label: "Farmers", icon: Users },
  { to: "/land-records", label: "Land Records", icon: MapPin },
  { to: "/crop-monitoring", label: "Crop Monitoring", icon: Sprout },
  { to: "/schemes", label: "Beneficiary Schemes", icon: Gift },
  { to: "/aerial", label: "Aerial Analytics", icon: Plane },
  { to: "/analytics", label: "Reports", icon: BarChart3 },
  { to: "/notifications", label: "Notifications", icon: Bell },
  { to: "/users", label: "User Management", icon: ShieldCheck },
  { to: "/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  const path = useRouterState({ select: (s) => s.location.pathname });
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
        {items.map((it) => {
          const active = path === it.to;
          const Icon = it.icon;
          return (
            <Link
              key={it.to}
              to={it.to}
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
        <div className="glass rounded-xl p-3 text-xs">
          <div className="flex items-center gap-2 mb-1">
            <div className="h-2 w-2 rounded-full bg-success animate-pulse" />
            <span className="text-foreground font-semibold">System Healthy</span>
          </div>
          <p className="text-muted-foreground">All drones online · Sync OK</p>
        </div>
      </div>
    </aside>
  );
}
