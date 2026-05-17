import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/layout/AppLayout";
import { Activity, AlertTriangle, CheckCircle2, Sprout, Users, Gift } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";

export const Route = createFileRoute("/notifications")({
  head: () => ({ meta: [{ title: "Notifications — Agri-TrekOps" }] }),
  component: NotificationsPage,
});

const initial = [
  { i: AlertTriangle, t: "Soil moisture critical · Sector 9", d: "5m ago", c: "destructive", read: false },
  { i: CheckCircle2, t: "Drone A12 deployment successful", d: "12m ago", c: "success", read: false },
  { i: Sprout, t: "NDVI spike detected · Sector 4", d: "32m ago", c: "info", read: false },
  { i: Activity, t: "Aerial survey scheduled at 14:00", d: "1h ago", c: "info", read: true },
  { i: Gift, t: "PM-Kisan deadline in 3 days", d: "3h ago", c: "warning", read: true },
  { i: Users, t: "42 farmers onboarded today", d: "5h ago", c: "success", read: true },
];

function NotificationsPage() {
  const [items, setItems] = useState(initial);
  const [tab, setTab] = useState<"all" | "unread">("all");
  const view = tab === "all" ? items : items.filter(i => !i.read);
  return (
    <AppLayout title="Notifications">
      <div className="flex items-center justify-between mb-5">
        <div className="flex gap-2">
          {(["all","unread"] as const).map(t => (
            <button key={t} onClick={()=>setTab(t)} className={`px-4 py-2 rounded-xl text-sm font-medium ${tab===t?"bg-gradient-primary text-primary-foreground glow":"glass text-muted-foreground hover:text-foreground"}`}>
              {t === "all" ? "All" : "Unread"}
            </button>
          ))}
        </div>
        <button onClick={()=>setItems(items.map(i=>({...i,read:true})))} className="text-sm text-primary">Mark all as read</button>
      </div>

      <ul className="space-y-3">
        {view.map((n, i) => (
          <motion.li key={i} initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} transition={{delay:i*0.04}}
            className={`glass rounded-2xl p-4 flex items-start gap-4 ${!n.read?"border-l-4 border-primary":""}`}>
            <div className="p-2.5 rounded-xl glass">
              <n.i className={`h-4 w-4 ${n.c==="success"?"text-success":n.c==="warning"?"text-warning":n.c==="destructive"?"text-destructive":"text-info"}`}/>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-medium">{n.t}</span>
                {!n.read && <span className="h-2 w-2 rounded-full bg-primary"/>}
              </div>
              <div className="text-xs text-muted-foreground mt-1">{n.d}</div>
            </div>
            <span className={`text-xs px-2 py-1 rounded-full ${n.c==="success"?"bg-success/15 text-success":n.c==="warning"?"bg-warning/15 text-warning":n.c==="destructive"?"bg-destructive/15 text-destructive":"bg-info/15 text-info"}`}>{n.c}</span>
          </motion.li>
        ))}
      </ul>
    </AppLayout>
  );
}
