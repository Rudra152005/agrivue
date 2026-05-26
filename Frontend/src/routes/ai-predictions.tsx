import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { GradientButton } from "@/components/ui-kit/GradientButton";
import {
  Brain, TrendingUp, CloudRain, Thermometer, Droplets, Wind,
  AlertTriangle, CheckCircle2, ChevronDown, RefreshCw, Download, Sprout, Loader2,
  Database
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, BarChart, Bar, Cell
} from "recharts";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { AnalyticsData } from "@/lib/types";

export const Route = createFileRoute("/ai-predictions")({
  head: () => ({ meta: [{ title: "AI Predictions — Agri-TrekOps" }] }),
  component: AIPredictionsPage,
});

// ── Static AI-Simulated Data (no real ML model in this project) ─────────────
const yieldForecast = [
  { month: "Jun", wheat: 82, rice: 68 },
  { month: "Jul", wheat: 88, rice: 74 },
  { month: "Aug", wheat: 91, rice: 79 },
  { month: "Sep", wheat: 87, rice: 76 },
  { month: "Oct", wheat: 84, rice: 72 },
  { month: "Nov", wheat: 79, rice: 67 },
];

const cropRadarData = [
  { subject: "Soil pH", wheat: 85, rice: 72, fullMark: 100 },
  { subject: "Moisture", wheat: 70, rice: 90, fullMark: 100 },
  { subject: "Nitrogen", wheat: 88, rice: 75, fullMark: 100 },
  { subject: "Sunlight", wheat: 92, rice: 80, fullMark: 100 },
  { subject: "Temp", wheat: 78, rice: 85, fullMark: 100 },
  { subject: "Pest Risk", wheat: 60, rice: 55, fullMark: 100 },
];

const riskData = [
  { name: "Drought", risk: 72, color: "#f59e0b" },
  { name: "Flooding", risk: 35, color: "#3b82f6" },
  { name: "Frost", risk: 18, color: "#8b5cf6" },
  { name: "Pest Attack", risk: 55, color: "#ef4444" },
  { name: "Heat Stress", risk: 80, color: "#f97316" },
];

const diseaseAlerts = [
  { id: 1, name: "Late Blight (Phytophthora infestans)", crop: "Wheat", sector: "Sector 4, Field B", probability: 87, severity: "critical" },
  { id: 2, name: "Powdery Mildew", crop: "Rice", sector: "Sector 2, Field A", probability: 63, severity: "warning" },
  { id: 3, name: "Rust Fungus", crop: "Corn", sector: "Sector 7", probability: 42, severity: "moderate" },
  { id: 4, name: "Root Rot", crop: "Millet", sector: "Sector 1, Field C", probability: 28, severity: "low" },
];

const weatherForecast = [
  { day: "Today", icon: CloudRain, temp: 24, rain: 80, wind: 18, status: "Heavy Rain" },
  { day: "Tue", icon: CloudRain, temp: 22, rain: 60, wind: 14, status: "Light Rain" },
  { day: "Wed", icon: Thermometer, temp: 28, rain: 15, wind: 10, status: "Warm" },
  { day: "Thu", icon: Thermometer, temp: 31, rain: 5, wind: 8, status: "Hot" },
  { day: "Fri", icon: Wind, temp: 26, rain: 20, wind: 22, status: "Windy" },
  { day: "Sat", icon: Sprout, temp: 25, rain: 30, wind: 12, status: "Ideal" },
];

const recommendations = [
  { id: 1, type: "success", title: "Optimal Sowing Window", desc: "Satellite imagery confirms Sector 2 has ideal moisture levels. Plant wheat within 3 days for peak yield.", action: "Schedule Planting" },
  { id: 2, type: "warning", title: "Pre-Emptive Fungicide", desc: "High blight probability in Sector 4 detected. Apply fungicide within 24h to prevent 35% yield loss.", action: "Issue Advisory" },
  { id: 3, type: "info", title: "Irrigation Optimization", desc: "AI models predict 80mm rainfall this week. Reduce irrigation by 40% across all sectors to conserve water.", action: "Update Schedule" },
  { id: 4, type: "destructive", title: "Pest Migration Alert", desc: "Locust swarm trajectory analysis shows 68% probability of impact on Sector 7 within 72 hours.", action: "Dispatch Drone" },
];

const CROPS = ["All Crops", "Wheat", "Rice", "Corn", "Millet"];

// ── Component ────────────────────────────────────────────────────────────────
function AIPredictionsPage() {
  const [selectedCrop, setSelectedCrop] = useState("All Crops");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [expandedAlert, setExpandedAlert] = useState<number | null>(null);

  // ── Real data from backend ─────────────────────────────────────────────
  const { data: analytics, refetch: refetchAnalytics } = useQuery<AnalyticsData>({
    queryKey: ["analytics"],
    queryFn: async () => (await api.get("/analytics")).data.data,
  });

  const { data: surveysData, refetch: refetchSurveys } = useQuery({
    queryKey: ["aerial"],
    queryFn: async () => (await api.get("/aerial")).data.data,
  });

  const { data: notificationsData, refetch: refetchNotifications } = useQuery({
    queryKey: ["notifications"],
    queryFn: async () => (await api.get("/notifications")).data.data,
  });

  const surveys: any[] = surveysData || [];
  const notifications: any[] = notificationsData || [];

  // Compute real values
  const avgCropHealth = surveys.length > 0
    ? Math.round(surveys.reduce((acc: number, s: any) => acc + (s.cropHealthScore || 0), 0) / surveys.length)
    : analytics?.averageCropHealth ? Math.round(analytics.averageCropHealth) : 0;

  const acresMonitored = analytics?.totalLandArea || 0;
  const totalAlerts = notifications.filter(n => n.type === "alert").length;
  // Disease risk index: derived from cropHealth (lower health = higher risk)
  const diseaseRiskIndex = avgCropHealth > 0 ? Math.max(0, Math.min(10, ((100 - avgCropHealth) / 10))).toFixed(1) : "N/A";
  const yieldConfidence = avgCropHealth > 0 ? `${avgCropHealth}%` : "N/A";

  // Build risk bars from real drone survey data
  const riskData = surveys.length > 0
    ? [
        { name: "Low Health Fields", risk: surveys.filter((s: any) => s.cropHealthScore < 40).length * 10, color: "#ef4444" },
        { name: "Medium Health", risk: surveys.filter((s: any) => s.cropHealthScore >= 40 && s.cropHealthScore < 70).length * 10, color: "#f59e0b" },
        { name: "High Health", risk: surveys.filter((s: any) => s.cropHealthScore >= 70).length * 10, color: "#10b981" },
        { name: "Alert Notifs", risk: totalAlerts * 5, color: "#8b5cf6" },
      ]
    : [
        { name: "Drought", risk: 72, color: "#f59e0b" },
        { name: "Flooding", risk: 35, color: "#3b82f6" },
        { name: "Pest Attack", risk: 55, color: "#ef4444" },
        { name: "Heat Stress", risk: 80, color: "#f97316" },
      ];

  // Real alert notifications for disease section
  const realAlerts = notifications
    .filter(n => n.type === "alert")
    .map((n: any, i: number) => ({
      id: i + 1,
      name: n.title || "System Alert",
      crop: "Field Crop",
      sector: "System",
      probability: 75,
      severity: "warning" as const,
      message: n.message,
      time: new Date(n.createdAt).toLocaleDateString(),
    }));

  // Fall back to illustrative examples if no real alerts exist
  const displayAlerts = realAlerts.length > 0 ? realAlerts : diseaseAlerts;

  const handleRefresh = () => {
    setIsRefreshing(true);
    Promise.all([refetchAnalytics(), refetchSurveys(), refetchNotifications()])
      .finally(() => setIsRefreshing(false));
  };

  const severityStyles: Record<string, string> = {
    critical: "bg-destructive/15 text-destructive border-destructive/30",
    warning: "bg-warning/15 text-warning border-warning/30",
    moderate: "bg-info/15 text-info border-info/30",
    low: "bg-success/15 text-success border-success/30",
  };

  const recStyles: Record<string, { bar: string; badge: string; icon: typeof CheckCircle2 }> = {
    success: { bar: "bg-success", badge: "bg-success/15 text-success border-success/30", icon: CheckCircle2 },
    warning: { bar: "bg-warning", badge: "bg-warning/15 text-warning border-warning/30", icon: AlertTriangle },
    info: { bar: "bg-info", badge: "bg-info/15 text-info border-info/30", icon: Brain },
    destructive: { bar: "bg-destructive", badge: "bg-destructive/15 text-destructive border-destructive/30", icon: AlertTriangle },
  };

  return (
    <AppLayout title="AI Predictions">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Brain className="h-6 w-6 text-primary" /> AI Crop Intelligence
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Satellite + drone data fused with ML models. Updated every 15 minutes.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* Crop Filter */}
          <div className="relative">
            <select
              value={selectedCrop}
              onChange={e => setSelectedCrop(e.target.value)}
              className="appearance-none bg-background/60 border border-border/60 rounded-xl pl-4 pr-9 py-2.5 text-sm focus:outline-none focus:border-primary/60 cursor-pointer"
            >
              {CROPS.map(c => <option key={c}>{c}</option>)}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          </div>
          <GradientButton variant="outline" onClick={handleRefresh} disabled={isRefreshing}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
            {isRefreshing ? "Syncing..." : "Refresh AI"}
          </GradientButton>
          <GradientButton><Download className="h-4 w-4 mr-2" /> Export Report</GradientButton>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Avg Crop Health", value: yieldConfidence, sub: avgCropHealth > 0 ? "From drone surveys" : "No survey data yet", color: "text-success", glow: "shadow-success/20" },
          { label: "Disease Risk Index", value: diseaseRiskIndex === "N/A" ? "N/A" : `${diseaseRiskIndex}/10`, sub: "Derived from crop health", color: "text-warning", glow: "shadow-warning/20" },
          { label: "Drone Surveys", value: String(surveys.length), sub: surveys.length > 0 ? "From database" : "No surveys yet", color: "text-primary", glow: "shadow-primary/20" },
          { label: "Acres Monitored", value: acresMonitored > 0 ? acresMonitored.toLocaleString() : "0", sub: "From land records", color: "text-info", glow: "shadow-info/20" },
        ].map((card, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className={`glass rounded-2xl p-5 shadow-lg ${card.glow}`}
          >
            <p className="text-xs text-muted-foreground uppercase tracking-widest">{card.label}</p>
            <p className={`text-3xl font-bold mt-1 ${card.color}`}>{card.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{card.sub}</p>
          </motion.div>
        ))}
      </div>

      {/* Row 1: Yield Chart + Weather Forecast */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">
        {/* Yield Forecast Chart */}
        <div className="xl:col-span-2 glass rounded-3xl p-6 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)]">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-semibold flex items-center gap-2"><TrendingUp className="h-4 w-4 text-primary" /> 6-Month Yield Forecast</h3>
              <p className="text-xs text-muted-foreground mt-0.5">ML-driven prediction based on historical + satellite data</p>
            </div>
            <div className="flex gap-2 text-[10px]">
              {["wheat", "rice"].map((c, i) => (
                <span key={c} className={`px-2 py-1 rounded font-bold uppercase border ${i === 0 ? "bg-primary/20 text-primary border-primary/30" : "bg-info/20 text-info border-info/30"}`}>{c}</span>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={yieldForecast}>
              <defs>
                <linearGradient id="gW" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="oklch(0.72 0.18 150)" stopOpacity={0.5} />
                  <stop offset="100%" stopColor="oklch(0.72 0.18 150)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gR" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="oklch(0.70 0.14 220)" stopOpacity={0.5} />
                  <stop offset="100%" stopColor="oklch(0.70 0.14 220)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(1 0 0 / 0.05)" vertical={false} />
              <XAxis dataKey="month" stroke="oklch(0.68 0.02 150)" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="oklch(0.68 0.02 150)" fontSize={11} tickLine={false} axisLine={false} unit="%" />
              <Tooltip
                contentStyle={{ background: "oklch(0.16 0.02 160 / 0.9)", border: "1px solid oklch(0.30 0.03 160)", borderRadius: 12, backdropFilter: "blur(10px)" }}
                formatter={(v: any) => [`${v ?? 0}%`]}
              />
              <Area type="monotone" dataKey="wheat" stroke="oklch(0.72 0.18 150)" strokeWidth={3} fill="url(#gW)" />
              <Area type="monotone" dataKey="rice" stroke="oklch(0.70 0.14 220)" strokeWidth={3} fill="url(#gR)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* 6-Day Weather */}
        <div className="glass rounded-3xl p-6 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)]">
          <h3 className="font-semibold mb-4 flex items-center gap-2"><CloudRain className="h-4 w-4 text-info" /> 6-Day AI Weather</h3>
          <div className="space-y-2.5">
            {weatherForecast.map((w, i) => (
              <div key={i} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-accent/20 transition-colors">
                <div className={`h-8 w-8 rounded-full flex items-center justify-center ${i === 0 ? "bg-info/20 text-info" : "bg-accent/50 text-muted-foreground"}`}>
                  <w.icon className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-semibold">{w.day}</p>
                  <p className="text-[10px] text-muted-foreground">{w.status}</p>
                </div>
                <div className="text-right text-xs">
                  <p className="font-bold">{w.temp}°C</p>
                  <p className="text-info">{w.rain}% rain</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Row 2: Risk Chart + Crop Radar */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
        {/* Risk Bar Chart */}
        <div className="glass rounded-3xl p-6 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)]">
          <h3 className="font-semibold mb-5 flex items-center gap-2"><AlertTriangle className="h-4 w-4 text-warning" /> Environmental Risk Index</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={riskData} layout="vertical" margin={{ left: 16 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(1 0 0 / 0.05)" horizontal={false} />
              <XAxis type="number" domain={[0, 100]} stroke="oklch(0.68 0.02 150)" fontSize={10} tickLine={false} axisLine={false} unit="%" />
              <YAxis type="category" dataKey="name" stroke="oklch(0.68 0.02 150)" fontSize={11} tickLine={false} axisLine={false} width={80} />
              <Tooltip
                contentStyle={{ background: "oklch(0.16 0.02 160 / 0.9)", border: "1px solid oklch(0.30 0.03 160)", borderRadius: 12 }}
                formatter={(v: any) => [`${v ?? 0}%`, "Risk"]}
              />
              <Bar dataKey="risk" radius={[0, 6, 6, 0]}>
                {riskData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} fillOpacity={0.85} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Crop Radar */}
        <div className="glass rounded-3xl p-6 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)]">
          <h3 className="font-semibold mb-5 flex items-center gap-2"><Sprout className="h-4 w-4 text-primary" /> Crop Growth Factors</h3>
          <ResponsiveContainer width="100%" height={220}>
            <RadarChart data={cropRadarData}>
              <PolarGrid stroke="oklch(1 0 0 / 0.1)" />
              <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fill: "oklch(0.68 0.02 150)" }} />
              <Radar name="Wheat" dataKey="wheat" stroke="oklch(0.72 0.18 150)" fill="oklch(0.72 0.18 150)" fillOpacity={0.3} strokeWidth={2} />
              <Radar name="Rice" dataKey="rice" stroke="oklch(0.70 0.14 220)" fill="oklch(0.70 0.14 220)" fillOpacity={0.2} strokeWidth={2} />
              <Tooltip contentStyle={{ background: "oklch(0.16 0.02 160 / 0.9)", border: "1px solid oklch(0.30 0.03 160)", borderRadius: 12 }} />
            </RadarChart>
          </ResponsiveContainer>
          <div className="flex justify-center gap-6 mt-2 text-xs">
            <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-primary" /> Wheat</span>
            <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-info" /> Rice</span>
          </div>
        </div>
      </div>

      {/* Row 3: Disease Alerts */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
        <div className="glass rounded-3xl p-6 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)]">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-destructive" /> Disease Detection Alerts
            {realAlerts.length === 0 && (
              <span className="ml-auto text-[10px] text-muted-foreground border border-border/50 rounded px-2 py-0.5 flex items-center gap-1">
                <Database className="h-3 w-3" /> Illustrative — no real alerts
              </span>
            )}
          </h3>
          <div className="space-y-3">
            {displayAlerts.map(alert => (
              <div key={alert.id}>
                <button
                  className={`w-full text-left p-4 rounded-2xl border ${severityStyles[alert.severity]} transition-all hover:scale-[1.01]`}
                  onClick={() => setExpandedAlert(expandedAlert === alert.id ? null : alert.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-bold">{alert.name}</p>
                      <p className="text-xs opacity-75 mt-0.5">{alert.crop} · {alert.sector}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className="text-xs font-black text-lg leading-none">{alert.probability}%</p>
                        <p className="text-[10px] opacity-60">probability</p>
                      </div>
                      <ChevronDown className={`h-4 w-4 transition-transform ${expandedAlert === alert.id ? "rotate-180" : ""}`} />
                    </div>
                  </div>
                  <div className="mt-2 h-1.5 w-full rounded-full bg-black/10 overflow-hidden">
                    <div className="h-full rounded-full bg-current" style={{ width: `${alert.probability}%` }} />
                  </div>
                </button>
                <AnimatePresence>
                  {expandedAlert === alert.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="mt-1 p-4 rounded-2xl bg-accent/30 border border-border/50 text-sm text-muted-foreground">
                        <p><strong className="text-foreground">Recommended Action:</strong> Apply targeted treatment within {alert.probability > 70 ? "24" : "72"} hours. Monitor via drone imagery every 6 hours.</p>
                        <p className="mt-2"><strong className="text-foreground">Detection Method:</strong> Multispectral satellite analysis + AI pattern matching (ResNet-50 model)</p>
                        <GradientButton className="mt-3 text-xs py-1.5" variant="outline">
                          Generate Treatment Plan
                        </GradientButton>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>

        {/* AI Recommendations */}
        <div className="glass rounded-3xl p-6 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)]">
          <h3 className="font-semibold mb-4 flex items-center gap-2"><Brain className="h-4 w-4 text-primary" /> AI Action Recommendations</h3>
          <div className="space-y-3">
            {recommendations.map((rec, i) => {
              const style = recStyles[rec.type];
              const Icon = style.icon;
              return (
                <motion.div
                  key={rec.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="p-4 rounded-2xl border bg-background/30 border-border/50 hover:bg-accent/20 transition-all"
                >
                  <div className="flex items-start gap-3">
                    <div className={`mt-0.5 p-1.5 rounded-lg border ${style.badge}`}>
                      <Icon className="h-3.5 w-3.5" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-bold">{rec.title}</p>
                      <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{rec.desc}</p>
                      <GradientButton className="mt-2.5 text-xs py-1.5 px-3" variant="outline">
                        {rec.action}
                      </GradientButton>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
