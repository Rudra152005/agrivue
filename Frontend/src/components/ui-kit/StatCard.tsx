import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { useEffect, useState } from "react";

export function AnimatedCounter({ value, decimals = 0, suffix = "" }: { value: number; decimals?: number; suffix?: string }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    const start = performance.now();
    const dur = 1200;
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      setN(eased * value);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value]);
  return <>{n.toLocaleString(undefined, { maximumFractionDigits: decimals, minimumFractionDigits: decimals })}{suffix}</>;
}

export function StatCard({
  label, value, icon: Icon, trend, accent = "primary", suffix = "",
}: {
  label: string; value: number; icon: LucideIcon; trend?: string;
  accent?: "primary" | "info" | "warning" | "destructive"; suffix?: string;
}) {
  const accentMap: Record<string, string> = {
    primary: "from-emerald/30 to-transparent text-primary",
    info: "from-info/30 to-transparent text-info",
    warning: "from-warning/30 to-transparent text-warning",
    destructive: "from-destructive/30 to-transparent text-destructive",
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className="glass rounded-2xl p-5 relative overflow-hidden glow-hover"
    >
      <div className={`absolute -top-12 -right-12 h-40 w-40 rounded-full bg-gradient-to-br ${accentMap[accent]} blur-2xl opacity-60`} />
      <div className="relative flex items-start justify-between">
        <div>
          <div className="text-xs uppercase tracking-wider text-muted-foreground">{label}</div>
          <div className="mt-2 text-3xl font-bold text-foreground">
            <AnimatedCounter value={value} suffix={suffix} />
          </div>
          {trend && <div className="mt-1 text-xs text-success">{trend}</div>}
        </div>
        <div className="p-2.5 rounded-xl glass">
          <Icon className={`h-5 w-5 ${accentMap[accent].split(" ").pop()}`} />
        </div>
      </div>
    </motion.div>
  );
}
