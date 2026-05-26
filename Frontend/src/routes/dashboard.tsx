import { useState, useEffect } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users, MapPin, Gift, Plane, AlertTriangle, Sprout, 
  ArrowUpRight, Activity, Plus, Download, Loader2,
  Crosshair, Brain, ShieldCheck, ThermometerSun, Droplets, Wind,
  UploadCloud, CheckCircle2, XCircle, Compass, Search, Filter, 
  Calendar, Map, FileText, Check, AlertCircle, Navigation, Upload,
  Clock, ShieldAlert, CheckSquare, FileUp, TrendingUp, Sparkles, Globe, ChevronDown, CheckCircle,
  ClipboardCheck, Bell, HelpCircle, Sun
} from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  BarChart, Bar, PieChart, Pie, Cell, Legend
} from "recharts";
import { AppLayout } from "@/components/layout/AppLayout";
import { StatCard } from "@/components/ui-kit/StatCard";
import { GradientButton } from "@/components/ui-kit/GradientButton";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { AnalyticsData, Farmer } from "@/lib/types";
import { toast } from "sonner";

export const Route = createFileRoute("/dashboard")({
  validateSearch: (search: Record<string, unknown>) => {
    return {
      tab: (search.tab as string) || "dashboard",
    };
  },
  head: () => ({ meta: [{ title: "Command Center — Agri-TrekOps" }] }),
  component: Dashboard,
});

// Mock Data for new Advanced Analytics
const yieldData = [
  { m: "Jan", wheat: 65, rice: 45, corn: 30 }, { m: "Feb", wheat: 70, rice: 48, corn: 35 },
  { m: "Mar", wheat: 75, rice: 52, corn: 40 }, { m: "Apr", wheat: 80, rice: 58, corn: 45 },
  { m: "May", wheat: 84, rice: 65, corn: 50 }, { m: "Jun", wheat: 89, rice: 72, corn: 58 },
  { m: "Jul", wheat: 91, rice: 78, corn: 65 }, { m: "Aug", wheat: 87, rice: 75, corn: 62 },
];

const aiAlerts = [
  { id: 1, type: 'critical', title: 'Late Blight Detected', location: 'Sector 4, Field B', time: 'Just now' },
  { id: 2, type: 'warning', title: 'Low Soil Moisture', location: 'Sector 9, Field A', time: '12m ago' },
  { id: 3, type: 'info', title: 'Optimal Harvest Window', location: 'Sector 2', time: '1h ago' },
  { id: 4, type: 'critical', title: 'Unauthorized Drone Access', location: 'Sector 7', time: '2h ago' },
];

function AdminDashboard() {
  const { data: analytics, isLoading: isAnalyticsLoading } = useQuery<AnalyticsData>({
    queryKey: ["analytics"],
    queryFn: async () => (await api.get("/analytics")).data.data,
  });

  const { data: farmers, isLoading: isFarmersLoading } = useQuery<Farmer[]>({
    queryKey: ["farmers", { limit: 5 }],
    queryFn: async () => (await api.get("/farmers?limit=5")).data.data,
  });

  const stats = [
    { label: "Total Farmers", value: analytics?.totalFarmers || 0, icon: Users, trend: "+8.2% MoM" },
    { label: "Total Officers", value: analytics?.totalOfficers || 0, icon: ShieldCheck, trend: "Active field units", accent: "info" as const },
    { label: "Active Schemes", value: analytics?.applicationsByStatus?.find(a => a._id === 'approved')?.count || 0, icon: Gift, trend: "Approved", accent: "warning" as const },
    { label: "Agri Lands (Acres)", value: analytics?.totalLandArea || 0, icon: MapPin, trend: "Verified area", accent: "success" as const },
    { label: "Drone Fleet", value: analytics?.totalDrones || 0, icon: Crosshair, trend: "Registered drones", accent: "primary" as const },
    { label: "AI Crop Alerts", value: analytics?.totalAlerts || 0, icon: Brain, trend: "Total notifications", accent: "destructive" as const },
    { label: "Active Districts", value: analytics?.activeDistricts || 0, icon: Activity, trend: "Operational zones", accent: "info" as const },
    { label: "Pending Verifications", value: analytics?.pendingVerifications || 0, icon: AlertTriangle, trend: "Requires action", accent: "warning" as const },
  ];

  if (isAnalyticsLoading || isFarmersLoading) {
    return (
      <AppLayout title="Command Center">
        <div className="flex items-center justify-center h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout title="Command Center">
      {/* Top Actions */}
      <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Global Operations Dashboard</h2>
          <p className="text-sm text-muted-foreground mt-1">Real-time agricultural intelligence across all sectors.</p>
        </div>
        <div className="flex gap-3">
          <GradientButton variant="outline" className="shadow-lg"><Download className="h-4 w-4 mr-2"/> Export Data</GradientButton>
          <Link to="/drone-surveillance">
            <GradientButton className="shadow-lg"><Plus className="h-4 w-4 mr-2"/> Deploy Aerial Unit</GradientButton>
          </Link>
        </div>
      </div>

      {/* 8 Premium Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((stat, i) => (
          <StatCard key={i} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">
        {/* Advanced Analytics - Yield Prediction */}
        <div className="xl:col-span-2 glass rounded-3xl p-6 relative overflow-hidden shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)]">
          <div className="absolute top-0 right-0 p-32 bg-primary/10 rounded-full blur-[100px]" />
          <div className="flex items-center justify-between mb-6 relative">
            <div>
              <h3 className="font-semibold text-lg flex items-center gap-2"><Brain className="h-4 w-4 text-primary"/> AI Yield Predictions</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Multi-crop forecast powered by satellite & drone imagery</p>
            </div>
            <div className="flex gap-2">
              <span className="px-2 py-1 text-[10px] uppercase font-bold rounded bg-primary/20 text-primary border border-primary/30">Wheat</span>
              <span className="px-2 py-1 text-[10px] uppercase font-bold rounded bg-info/20 text-info border border-info/30">Rice</span>
            </div>
          </div>
          <div className="h-[280px] relative">
            <ResponsiveContainer>
              <AreaChart data={yieldData}>
                <defs>
                  <linearGradient id="gWheat" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="oklch(0.72 0.18 150)" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="oklch(0.72 0.18 150)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gRice" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="oklch(0.70 0.14 220)" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="oklch(0.70 0.14 220)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(1 0 0 / 0.05)" vertical={false}/>
                <XAxis dataKey="m" stroke="oklch(0.68 0.02 150)" fontSize={11} tickLine={false} axisLine={false}/>
                <YAxis stroke="oklch(0.68 0.02 150)" fontSize={11} tickLine={false} axisLine={false}/>
                <Tooltip contentStyle={{ background:"oklch(0.16 0.02 160 / 0.8)", border:"1px solid oklch(0.30 0.03 160)", borderRadius: 12, backdropFilter: "blur(10px)" }}/>
                <Area type="monotone" dataKey="wheat" stroke="oklch(0.72 0.18 150)" strokeWidth={3} fill="url(#gWheat)" />
                <Area type="monotone" dataKey="rice" stroke="oklch(0.70 0.14 220)" strokeWidth={3} fill="url(#gRice)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Real-time Drone Feed Panel */}
        <div className="glass rounded-3xl p-6 relative overflow-hidden flex flex-col shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold flex items-center gap-2"><Crosshair className="h-4 w-4 text-primary"/> Live Aerial Feed</h3>
            <span className="flex items-center gap-1.5 text-xs font-bold text-destructive"><span className="h-2 w-2 rounded-full bg-destructive animate-pulse shadow-[0_0_8px_var(--color-destructive)]"/> LIVE</span>
          </div>
          <div className="flex-1 rounded-2xl bg-[#0a0f12] border border-border/50 relative overflow-hidden group min-h-[220px]">
            {/* Simulated Drone Feed UI */}
            <div className="absolute inset-0 grid-bg opacity-20" />
            
            {/* Scanning radar line */}
            <motion.div 
              className="absolute inset-x-0 h-40 bg-gradient-to-b from-primary/30 to-transparent border-t border-primary/80"
              animate={{ y: ["-100%", "300%"] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
            />

            {/* Target locking */}
            <motion.div 
              className="absolute w-14 h-14 border-2 border-dashed border-destructive/80 rounded-full"
              style={{ top: '35%', left: '40%' }}
              animate={{ scale: [1, 1.1, 1], rotate: 180 }}
              transition={{ duration: 3, repeat: Infinity }}
            >
               <span className="absolute -top-5 -left-4 text-[9px] text-destructive whitespace-nowrap bg-background/90 px-1.5 py-0.5 rounded font-bold tracking-widest border border-destructive/30">ANOMALY DETECTED</span>
               <span className="absolute top-1/2 left-1/2 w-1 h-1 bg-destructive rounded-full -translate-x-1/2 -translate-y-1/2 animate-ping" />
            </motion.div>

            {/* Drone HUD overlay */}
            <div className="absolute inset-x-0 top-0 p-3 flex justify-between text-[10px] font-mono text-primary/90">
              <div>ALT: 142.5m<br/>SPD: 42km/h</div>
              <div className="text-right">LAT: 34.0522<br/>LNG: -118.2437</div>
            </div>
            
            <div className="absolute inset-x-0 bottom-0 p-3 flex justify-center gap-8 text-[10px] font-mono text-primary/70">
               <span>BAT: 78%</span>
               <span>SIG: STRONG</span>
            </div>

            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_40%,rgba(0,0,0,0.6)_100%)] pointer-events-none" />
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3">
             <GradientButton className="w-full text-xs py-2 shadow-lg" variant="outline"><Crosshair className="h-3.5 w-3.5 mr-1.5"/> Override</GradientButton>
             <GradientButton className="w-full text-xs py-2 shadow-lg"><Download className="h-3.5 w-3.5 mr-1.5"/> Capture</GradientButton>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">
        {/* AI Crop Disease Alerts */}
        <div className="glass rounded-3xl p-6 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)]">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold flex items-center gap-2"><ThermometerSun className="h-4 w-4 text-warning"/> Field Alerts</h3>
            <span className="text-[10px] uppercase tracking-widest text-muted-foreground border border-border rounded px-2 py-0.5">Real-time</span>
          </div>
          <div className="space-y-3">
            <AnimatePresence>
              {aiAlerts.map((alert, i) => (
                <motion.div 
                  key={alert.id}
                  initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
                  className={`p-3 rounded-2xl border ${alert.type === 'critical' ? 'bg-destructive/10 border-destructive/30' : alert.type === 'warning' ? 'bg-warning/10 border-warning/30' : 'bg-info/10 border-info/30'} flex items-start gap-3 backdrop-blur-md`}
                >
                  <div className={`mt-0.5 p-1.5 rounded-lg ${alert.type === 'critical' ? 'bg-destructive/20 text-destructive' : alert.type === 'warning' ? 'bg-warning/20 text-warning' : 'bg-info/20 text-info'}`}>
                    <AlertTriangle className="h-3.5 w-3.5" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-bold text-foreground">{alert.title}</h4>
                    <p className="text-[11px] text-muted-foreground mt-0.5 font-medium">{alert.location}</p>
                  </div>
                  <span className="text-[10px] text-muted-foreground whitespace-nowrap">{alert.time}</span>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Professional Data Tables - Farmers & Officers */}
        <div className="xl:col-span-2 glass rounded-3xl p-6 flex flex-col shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)]">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-semibold text-lg">Central Database Network</h3>
            <div className="flex gap-1 p-1 rounded-xl bg-background/40 border border-border/50">
              <button className="px-4 py-1.5 text-xs font-bold bg-glass rounded-lg shadow-sm text-foreground">Farmers</button>
              <button className="px-4 py-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors">Officers</button>
            </div>
          </div>
          <div className="flex-1 overflow-x-auto rounded-2xl border border-border/60 bg-background/20">
            <table className="w-full text-sm text-left">
              <thead className="text-[10px] uppercase tracking-widest text-muted-foreground bg-accent/30 border-b border-border/60">
                <tr>
                  <th className="px-5 py-4 font-semibold">Profile</th>
                  <th className="px-5 py-4 font-semibold">Location</th>
                  <th className="px-5 py-4 font-semibold">Land Assets</th>
                  <th className="px-5 py-4 font-semibold">System Status</th>
                  <th className="px-5 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {farmers?.map((f)=>(
                  <tr key={f._id} className="hover:bg-accent/20 transition-colors group">
                    <td className="px-5 py-3.5 flex items-center gap-3">
                      <div className="h-9 w-9 rounded-xl bg-gradient-primary flex items-center justify-center text-primary-foreground text-sm font-bold shadow-md">
                        {typeof f.user === 'object' ? f.user.name[0] : 'F'}
                      </div>
                      <span className="font-semibold text-foreground">{typeof f.user === 'object' ? f.user.name : 'Unknown'}</span>
                    </td>
                    <td className="px-5 py-3.5 text-muted-foreground">{f.village}</td>
                    <td className="px-5 py-3.5 font-medium">{f.landSize} <span className="text-muted-foreground font-normal text-xs">acres</span></td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] uppercase font-bold tracking-wider shadow-sm ${f.beneficiaryStatus==="active"?"bg-success/15 text-success border border-success/30":f.beneficiaryStatus==="pending"?"bg-warning/15 text-warning border border-warning/30":"bg-info/15 text-info border border-info/30"}`}>
                        {f.beneficiaryStatus}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <button className="text-muted-foreground hover:text-primary transition-colors opacity-0 group-hover:opacity-100 p-2 rounded-lg hover:bg-primary/10">
                        <ArrowUpRight className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
                {farmers?.length === 0 && (
                  <tr>
                     <td colSpan={5} className="py-12 text-center text-muted-foreground italic text-sm">No records found in database.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

    </AppLayout>
  );
}

function FarmerDashboard({ activeTab }: { activeTab: string }) {
  const { data: user } = useQuery({ 
    queryKey: ["me"], 
    queryFn: async () => (await api.get("/auth/me")).data.data 
  });

  const { data: landsData } = useQuery({
    queryKey: ["my-lands"],
    queryFn: async () => (await api.get("/lands")).data.data,
  });

  const { data: farmerProfile } = useQuery({
    queryKey: ["farmer-profile", user?._id],
    queryFn: async () => {
      if (!user?._id) return null;
      const res = await api.get(`/farmers?user=${user._id}`);
      return res.data.data?.[0] || null;
    },
    enabled: !!user?._id,
  });

  // Local State
  const [landArea, setLandArea] = useState(0);
  const [activeCrops, setActiveCrops] = useState("None");
  const [schemeStatus, setSchemeStatus] = useState("PM-KISAN: Active");
  const [waterAvailability, setWaterAvailability] = useState(85);
  const [cropHealth, setCropHealth] = useState(94);
  const [weatherAlerts, setWeatherAlerts] = useState(1);
  const [aiSuggestionsCount, setAiSuggestionsCount] = useState(3);
  const [upcomingCount, setUpcomingCount] = useState(2);

  const [lands, setLands] = useState([
    { id: "L-1", surveyNumber: "SRV-442/B", area: 8.2, soilType: "Alluvial", crop: "Wheat", status: "Verified", Nitrogen: 120, Phosphorus: 45, Potassium: 80 },
    { id: "L-2", surveyNumber: "SRV-109/A", area: 4.3, soilType: "Sandy Loam", crop: "Maize", status: "Pending Verification", Nitrogen: 90, Phosphorus: 30, Potassium: 65 }
  ]);

  const [schemes, setSchemes] = useState([
    { id: "SCH-01", name: "PM-KISAN Subsidies", appliedDate: "2026-05-10", status: "Approved", description: "Direct financial assistance of ₹6,000 per year." },
    { id: "SCH-02", name: "Weather-based Insurance", appliedDate: "2026-05-24", status: "Pending", description: "Protects against crop loss due to weather anomalies." }
  ]);

  const [activities, setActivities] = useState([
    { id: 1, title: "Scheduled Irrigation", description: "Apply water to Sector 6 Wheat field.", time: "Today, 06:00 PM", status: "Pending" },
    { id: 2, title: "Fertilizer Application", description: "Apply NPK (19-19-19) to Maize crop.", time: "Tomorrow, 08:30 AM", status: "Pending" }
  ]);

  const [notifications, setNotifications] = useState([
    { id: 1, text: "Favourable weather for harvesting next week.", time: "2 hrs ago" },
    { id: 2, text: "Weather insurance application received by the district office.", time: "1 day ago" }
  ]);

  useEffect(() => {
    if (landsData && landsData.length > 0) {
      setLands(landsData.map((l: any, idx: number) => ({
        id: `L-${idx + 1}`,
        surveyNumber: l.surveyNumber,
        area: l.area || 0,
        soilType: l.soilType || "Alluvial",
        crop: l.soilType || "Wheat",
        status: l.verified ? "Verified" : "Pending Verification",
        Nitrogen: l.Nitrogen || 120,
        Phosphorus: l.Phosphorus || 45,
        Potassium: l.Potassium || 80
      })));
      const totalArea = landsData.reduce((acc: number, curr: any) => acc + (curr.area || 0), 0);
      setLandArea(totalArea);
      
      const crops = Array.from(new Set(landsData.map((l: any) => l.soilType || "Wheat"))).join(", ");
      setActiveCrops(crops);
    } else if (farmerProfile) {
      setLandArea(farmerProfile.landSize || 0);
      setActiveCrops(farmerProfile.crops && farmerProfile.crops.length > 0 ? farmerProfile.crops.join(", ") : "None");
      setLands([
        {
          id: "L-1",
          surveyNumber: "SRV-Pending",
          area: farmerProfile.landSize || 0,
          soilType: "Alluvial",
          crop: farmerProfile.crops?.[0] || "Wheat",
          status: "Pending Verification",
          Nitrogen: 120,
          Phosphorus: 45,
          Potassium: 80
        }
      ]);
    }
  }, [landsData, farmerProfile]);

  // Leaf Scanner
  const [isScanningLeaf, setIsScanningLeaf] = useState(false);
  const [leafScanProgress, setLeafScanProgress] = useState(0);
  const [leafScanResult, setLeafScanResult] = useState<string | null>(null);

  // Scheme Modal
  const [showApplyModal, setShowApplyModal] = useState<string | null>(null);
  const [applyingProgress, setApplyingProgress] = useState(0);
  const [isApplying, setIsApplying] = useState(false);

  // Inspection Modal
  const [showInspectionModal, setShowInspectionModal] = useState(false);
  const [inspectionSurvey, setInspectionSurvey] = useState("SRV-109/A");
  const [inspectionNotes, setInspectionNotes] = useState("");

  // AI Fertilizer Generator
  const [aiCrop, setAiCrop] = useState("Wheat");
  const [aiSoil, setAiSoil] = useState("Alluvial");
  const [fertilizerResult, setFertilizerResult] = useState<string | null>(null);

  // Auto Irrigation
  const [autoIrrigation, setAutoIrrigation] = useState(false);

  // Support Form
  const [supportForm, setSupportForm] = useState({ subject: "", message: "" });

  const handleRequestInspection = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success(`Field inspection requested for survey ${inspectionSurvey}!`);
    setShowInspectionModal(false);
    setUpcomingCount(prev => prev + 1);
  };

  const handleApplyScheme = (schemeName: string) => {
    setIsApplying(true);
    setApplyingProgress(0);
    const interval = setInterval(() => {
      setApplyingProgress(p => {
        if (p >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsApplying(false);
            setShowApplyModal(null);
            setSchemes(prev => [
              ...prev,
              { id: `SCH-0${prev.length + 1}`, name: schemeName, appliedDate: new Date().toISOString().split('T')[0], status: "Pending", description: "Government subsidy program." }
            ]);
            toast.success(`Application submitted for ${schemeName}!`);
          }, 600);
          return 100;
        }
        return p + 10;
      });
    }, 100);
  };

  const handleScanLeaf = () => {
    setIsScanningLeaf(true);
    setLeafScanProgress(0);
    setLeafScanResult(null);
    const interval = setInterval(() => {
      setLeafScanProgress(p => {
        if (p >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsScanningLeaf(false);
            setLeafScanResult("Late Blight detected on Wheat leaf. Action required: Spray Copper Oxychloride (3g/L) immediately to prevent spreading.");
            setCropHealth(84);
            toast.error("AI Scan completed: Potential Crop Blight Detected!");
          }, 600);
          return 100;
        }
        return p + 5;
      });
    }, 100);
  };

  const handleGenerateFertilizer = (e: React.FormEvent) => {
    e.preventDefault();
    let npk = "NPK 120-60-40 kg/ha";
    let advise = "Apply Urea in split doses (1/3rd at sowing, 1/3rd at first irrigation, 1/3rd at jointing stage).";
    if (aiCrop === "Maize") {
      npk = "NPK 150-75-50 kg/ha";
      advise = "Apply Zinc Sulphate @ 25 kg/ha if soil is Zinc deficient.";
    }
    setFertilizerResult(`Recommended Dosage: ${npk}. ${advise}`);
    toast.success("AI Fertilizer recommendation generated!");
  };

  const handleSupportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Support ticket submitted! Our team will contact you shortly.");
    setSupportForm({ subject: "", message: "" });
  };

  const stats = [
    { label: "Total Land Area", value: `${landArea} ac`, icon: MapPin, accent: "primary" as const, trend: "Verified bounds" },
    { label: "Active Crops", value: activeCrops, icon: Sprout, accent: "success" as const, trend: "Registered crops" },
    { label: "Subsidies Status", value: schemeStatus, icon: Gift, accent: "info" as const, trend: "All Sync OK" },
    { label: "Water Availability", value: `${waterAvailability}%`, icon: Droplets, accent: "primary" as const, trend: "Soil sensor telemetry" },
    { label: "Crop Health Index", value: `${cropHealth}%`, icon: Activity, accent: "success" as const, trend: "Optimal density" },
    { label: "Weather Warnings", value: weatherAlerts, icon: ThermometerSun, accent: "destructive" as const, trend: "Frost warning" },
    { label: "AI Suggestions", value: aiSuggestionsCount, icon: Brain, accent: "info" as const, trend: "Actionable crop advice" },
    { label: "Upcoming Tasks", value: upcomingCount, icon: ClipboardCheck, accent: "warning" as const, trend: "Daily scheduler" },
  ];

  const cropGrowthData = [
    { week: "Wk 1", health: 70, height: 10 },
    { week: "Wk 2", health: 78, height: 22 },
    { week: "Wk 3", health: 85, height: 35 },
    { week: "Wk 4", health: 94, height: 48 },
  ];

  return (
    <AppLayout title="Farmer Workspace">
      {/* Weather Banner Alert */}
      {weatherAlerts > 0 && (
        <div className="mb-6 p-4 rounded-2xl bg-destructive/10 border border-destructive/20 text-foreground flex items-center justify-between backdrop-blur-md animate-pulse">
          <div className="flex items-center gap-3">
            <span className="p-2 rounded-xl bg-destructive/20 text-destructive">
              <AlertTriangle className="h-5 w-5" />
            </span>
            <div>
              <h4 className="font-bold text-sm">Frost Alert Warning</h4>
              <p className="text-xs text-muted-foreground mt-0.5">District meteorological services predict a sharp temperature drop below 4°C tonight. Protect vulnerable crops.</p>
            </div>
          </div>
          <button onClick={() => setWeatherAlerts(0)} className="text-xs font-semibold text-destructive hover:underline bg-destructive/10 px-3 py-1 rounded-xl">Dismiss</button>
        </div>
      )}

      {/* 8 Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((stat, i) => (
          <StatCard key={i} {...stat} />
        ))}
      </div>

      {/* -------------------- TAB 1: OVERVIEW -------------------- */}
      {activeTab === "dashboard" && (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2 space-y-6">
            {/* Crop Growth Trend */}
            <div className="glass rounded-3xl p-6 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)]">
              <h3 className="font-semibold flex items-center gap-2 mb-4"><Sprout className="h-4 w-4 text-success" /> Active Crop Growth Timeline</h3>
              <div className="h-[240px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={cropGrowthData}>
                    <defs>
                      <linearGradient id="growthColor" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="oklch(0.72 0.18 150)" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="oklch(0.72 0.18 150)" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="oklch(1 0 0 / 0.05)" vertical={false} />
                    <XAxis dataKey="week" stroke="oklch(0.68 0.02 150)" fontSize={11} tickLine={false} axisLine={false} />
                    <YAxis stroke="oklch(0.68 0.02 150)" fontSize={11} tickLine={false} axisLine={false} />
                    <Tooltip contentStyle={{ background:"oklch(0.16 0.02 160 / 0.8)", border:"1px solid oklch(0.30 0.03 160)", borderRadius: 12 }} />
                    <Area type="monotone" dataKey="health" name="NDVI Health %" stroke="oklch(0.72 0.18 150)" fillOpacity={1} fill="url(#growthColor)" strokeWidth={2.5} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* AI Recommendations */}
            <div className="glass rounded-3xl p-6 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)]">
              <h3 className="font-semibold flex items-center gap-2 mb-4"><Brain className="h-4 w-4 text-info" /> AI Smart Farming Suggestions</h3>
              <div className="space-y-3">
                <div className="p-3.5 rounded-xl border border-border/30 bg-background/25 flex items-start gap-3">
                  <span className="p-2 rounded-lg bg-success/15 text-success"><Sprout className="h-4 w-4" /></span>
                  <div>
                    <h4 className="text-sm font-bold">NPK Fertilization Window</h4>
                    <p className="text-xs text-muted-foreground mt-0.5 font-medium">Maize crop is in knee-high vegetative stage. Apply secondary Nitrogen dosage now.</p>
                  </div>
                </div>
                <div className="p-3.5 rounded-xl border border-border/30 bg-background/25 flex items-start gap-3">
                  <span className="p-2 rounded-lg bg-info/15 text-info"><Droplets className="h-4 w-4" /></span>
                  <div>
                    <h4 className="text-sm font-bold">Soil Moisture Management</h4>
                    <p className="text-xs text-muted-foreground mt-0.5 font-medium">Average moisture in Sector 4 is 42%. Scheduled drip-irrigation cycle recommended.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Weather & Activities */}
          <div className="space-y-6">
            {/* Live Weather Forecast */}
            <div className="glass rounded-3xl p-6 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)]">
              <h3 className="font-semibold flex items-center gap-2 mb-4"><ThermometerSun className="h-4 w-4 text-warning" /> Weather & Moisture</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center bg-background/20 p-3 rounded-xl border border-border/30">
                  <div className="flex items-center gap-2"><Sun className="h-5 w-5 text-warning" /><div><div className="text-xs text-muted-foreground">Temperature</div><div className="text-sm font-bold">24°C</div></div></div>
                  <div className="flex items-center gap-2"><Droplets className="h-5 w-5 text-info" /><div><div className="text-xs text-muted-foreground">Humidity</div><div className="text-sm font-bold">62%</div></div></div>
                </div>
                <div className="text-xs text-muted-foreground border-t border-border/30 pt-3">
                  <div className="flex justify-between mb-1"><span>Rain Probability:</span><span className="font-semibold text-foreground">10%</span></div>
                  <div className="flex justify-between"><span>Wind Speed:</span><span className="font-semibold text-foreground">12 km/h</span></div>
                </div>
              </div>
            </div>

            {/* Upcoming Activities */}
            <div className="glass rounded-3xl p-6 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)]">
              <h3 className="font-semibold flex items-center gap-2 mb-4"><ClipboardCheck className="h-4 w-4 text-primary" /> Daily Activities Planner</h3>
              <div className="space-y-3">
                {activities.map(act => (
                  <div key={act.id} className="p-3 rounded-xl border border-border/40 bg-background/25 flex flex-col justify-between gap-2">
                    <div>
                      <h4 className="text-sm font-bold text-foreground">{act.title}</h4>
                      <p className="text-xs text-muted-foreground mt-0.5">{act.description}</p>
                    </div>
                    <div className="flex justify-between items-center text-xs text-muted-foreground pt-2 border-t border-border/20">
                      <span>{act.time}</span>
                      {act.status === "Pending" ? (
                        <button 
                          onClick={() => {
                            setActivities(prev => prev.map(a => a.id === act.id ? { ...a, status: "Done" } : a));
                            setUpcomingCount(prev => Math.max(0, prev - 1));
                            toast.success(`Task "${act.title}" marked as completed!`);
                          }}
                          className="text-[10px] bg-primary/10 hover:bg-primary/20 text-primary px-2.5 py-1 rounded font-bold transition"
                        >
                          Complete
                        </button>
                      ) : (
                        <span className="text-success font-bold flex items-center gap-1"><CheckCircle className="h-3.5 w-3.5" /> Done</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* -------------------- TAB 2: MY LAND RECORDS -------------------- */}
      {activeTab === "land" && (
        <div className="glass rounded-3xl p-6 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)]">
          <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
            <div>
              <h3 className="text-xl font-bold">My Land Records</h3>
              <p className="text-sm text-muted-foreground mt-1">Review official survey credentials, soil compositions, and verification tags.</p>
            </div>
            <GradientButton onClick={() => setShowInspectionModal(true)} className="text-xs py-2 px-3 shadow-lg">
              Request Field Inspection
            </GradientButton>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {lands.map(land => (
              <div key={land.id} className="p-5 rounded-2xl border border-border/60 bg-background/25 space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-mono tracking-widest text-muted-foreground">{land.id}</span>
                    <h4 className="font-bold text-base text-foreground mt-0.5">Survey: {land.surveyNumber}</h4>
                    <p className="text-xs text-muted-foreground mt-0.5">Soil Type: <span className="font-semibold text-foreground">{land.soilType}</span></p>
                  </div>
                  <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${land.status === 'Verified' ? 'bg-success/15 text-success border border-success/30' : 'bg-warning/15 text-warning border border-warning/30'}`}>
                    {land.status}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-xs text-muted-foreground border-t border-border/30 pt-3">
                  <div>Area: <span className="font-semibold text-foreground block mt-0.5">{land.area} ac</span></div>
                  <div>Crop: <span className="font-semibold text-foreground block mt-0.5">{land.crop}</span></div>
                  <div>Sync State: <span className="text-success font-semibold block mt-0.5">Online</span></div>
                </div>

                {/* Soil Nutrient Progress Bars */}
                <div className="border-t border-border/30 pt-3 space-y-2">
                  <h5 className="text-xs font-bold text-foreground">Soil Nutrient Analytics</h5>
                  <div className="space-y-1.5 text-[10px] font-medium text-muted-foreground">
                    <div>
                      <div className="flex justify-between"><span>Nitrogen (N) - {land.Nitrogen} kg/ha</span><span className="text-success">Optimal</span></div>
                      <div className="w-full bg-background/50 h-1.5 rounded-full overflow-hidden border border-border/30 mt-1">
                        <div className="bg-success h-full" style={{ width: `${(land.Nitrogen / 150) * 100}%` }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between"><span>Phosphorus (P) - {land.Phosphorus} kg/ha</span><span className="text-warning">Moderate</span></div>
                      <div className="w-full bg-background/50 h-1.5 rounded-full overflow-hidden border border-border/30 mt-1">
                        <div className="bg-warning h-full" style={{ width: `${(land.Phosphorus / 60) * 100}%` }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between"><span>Potassium (K) - {land.Potassium} kg/ha</span><span className="text-success">Optimal</span></div>
                      <div className="w-full bg-background/50 h-1.5 rounded-full overflow-hidden border border-border/30 mt-1">
                        <div className="bg-success h-full" style={{ width: `${(land.Potassium / 100) * 100}%` }} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* -------------------- TAB 3: CROP MONITORING -------------------- */}
      {activeTab === "monitoring" && (
        <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
          {/* Timeline and Charts */}
          <div className="xl:col-span-3 glass rounded-3xl p-6 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)]">
            <h3 className="font-semibold text-lg flex items-center gap-2 mb-2"><Sprout className="h-4 w-4 text-success" /> NDVI Crop Health Curve</h3>
            <p className="text-xs text-muted-foreground mb-6">Normalized Difference Vegetation Index tracks crop chlorophyll content weekly.</p>
            <div className="h-[260px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={cropGrowthData}>
                  <defs>
                    <linearGradient id="ndviColorCurve" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="oklch(0.72 0.18 150)" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="oklch(0.72 0.18 150)" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="oklch(1 0 0 / 0.05)" vertical={false} />
                  <XAxis dataKey="week" stroke="oklch(0.68 0.02 150)" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="oklch(0.68 0.02 150)" fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ background:"oklch(0.16 0.02 160 / 0.8)", border:"1px solid oklch(0.30 0.03 160)", borderRadius: 12 }} />
                  <Area type="monotone" dataKey="health" name="NDVI Health Score" stroke="oklch(0.72 0.18 150)" fill="url(#ndviColorCurve)" strokeWidth={2.5} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Leaf Pathogen Scanner */}
          <div className="xl:col-span-2 glass rounded-3xl p-6 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)] flex flex-col justify-between">
            <div>
              <h3 className="font-semibold flex items-center gap-2 mb-2"><Brain className="h-4 w-4 text-info" /> AI Leaf Disease Diagnoser</h3>
              <p className="text-xs text-muted-foreground mb-4">Select and upload a crop leaf image to run automated disease scans.</p>
            </div>

            <div 
              onClick={() => { if (!isScanningLeaf) handleScanLeaf(); }}
              className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition flex flex-col items-center justify-center py-8 ${isScanningLeaf ? 'bg-primary/5 border-primary/50' : 'border-border/60 hover:bg-accent/10 hover:border-primary/55'}`}
            >
              <Upload className="h-8 w-8 text-muted-foreground mb-3" />
              <h4 className="font-semibold text-sm">Select leaf snapshot</h4>
              <p className="text-xs text-muted-foreground mt-1 max-w-[180px]">Browse or drop file (JPG, PNG)</p>

              {isScanningLeaf && (
                <div className="mt-5 w-full space-y-2">
                  <div className="flex justify-between text-[10px] font-mono text-primary font-bold">
                    <span>AI PATHOGEN SCAN</span>
                    <span>{leafScanProgress}%</span>
                  </div>
                  <div className="w-full bg-background/50 h-1.5 rounded-full overflow-hidden border border-border/30">
                    <motion.div 
                      className="bg-gradient-primary h-full"
                      style={{ width: `${leafScanProgress}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            {leafScanResult && (
              <div className="p-3.5 rounded-xl bg-destructive/10 border border-destructive/30 text-destructive text-xs space-y-1 backdrop-blur-sm animate-fade-in mt-4">
                <div className="flex items-center gap-1.5 font-bold mb-1">
                  <AlertCircle className="h-4 w-4" /> AI ANALYSIS: ANOMALY DETECTED
                </div>
                <p className="leading-relaxed font-medium">{leafScanResult}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* -------------------- TAB 4: SCHEME APPLICATIONS -------------------- */}
      {activeTab === "schemes" && (
        <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
          {/* Available Subsidies */}
          <div className="xl:col-span-3 glass rounded-3xl p-6 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)]">
            <h3 className="font-semibold flex items-center gap-2 mb-4"><Gift className="h-4 w-4 text-primary" /> Eligible Benefits Programs</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[{ n: "PM-KISAN Subsidies", desc: "Annual financial support of ₹6,000 to landholding farmers." },
                { n: "Solar Pump Subsidy Program", desc: "Get 90% government subsidy to install automated solar pumps." },
                { n: "Weather-based Crop Insurance", desc: "Premium insurance covering localized weather crop damage." }].map(sch => (
                  <div key={sch.n} className="p-4 rounded-xl border border-border/50 bg-background/25 flex flex-col justify-between gap-3 shadow-sm">
                    <div>
                      <h4 className="font-bold text-sm text-foreground">{sch.n}</h4>
                      <p className="text-xs text-muted-foreground mt-1 font-medium">{sch.desc}</p>
                    </div>
                    {schemes.find(s => s.name === sch.n) ? (
                      <span className="text-[10px] text-muted-foreground font-bold uppercase py-1 px-3 border border-border/30 rounded-lg text-center bg-background/10">Applied</span>
                    ) : (
                      <GradientButton onClick={() => setShowApplyModal(sch.n)} className="text-xs py-1.5 shadow-sm">
                        Apply Now
                      </GradientButton>
                    )}
                  </div>
              ))}
            </div>
          </div>

          {/* Scheme Application History */}
          <div className="xl:col-span-2 glass rounded-3xl p-6 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)] flex flex-col justify-between">
            <div>
              <h3 className="font-semibold flex items-center gap-2 mb-4"><Clock className="h-4 w-4 text-info" /> Application History</h3>
              <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                {schemes.map(s => (
                  <div key={s.id} className="p-3.5 rounded-xl border border-border/40 bg-background/25 flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-sm text-foreground">{s.name}</h4>
                      <span className="text-[10px] text-muted-foreground">Applied: <span className="font-mono">{s.appliedDate}</span></span>
                    </div>
                    <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${s.status === 'Approved' ? 'bg-success/20 text-success' : 'bg-warning/20 text-warning'}`}>
                      {s.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* -------------------- TAB 5: WEATHER UPDATES -------------------- */}
      {activeTab === "weather" && (
        <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
          <div className="xl:col-span-3 glass rounded-3xl p-6 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)] space-y-6">
            <h3 className="font-semibold text-lg flex items-center gap-2 mb-2"><ThermometerSun className="h-4 w-4 text-warning" /> Weather & Rain Predictions</h3>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="glass p-3 rounded-lg border border-border/40">
                <span className="text-[10px] font-bold text-muted-foreground uppercase block">Temperature</span>
                <span className="text-xl font-bold text-warning block mt-1">24°C</span>
              </div>
              <div className="glass p-3 rounded-lg border border-border/40">
                <span className="text-[10px] font-bold text-muted-foreground uppercase block">Soil Moisture</span>
                <span className="text-xl font-bold text-info block mt-1">45%</span>
              </div>
              <div className="glass p-3 rounded-lg border border-border/40">
                <span className="text-[10px] font-bold text-muted-foreground uppercase block">Air Humidity</span>
                <span className="text-xl font-bold text-success block mt-1">62%</span>
              </div>
              <div className="glass p-3 rounded-lg border border-border/40">
                <span className="text-[10px] font-bold text-muted-foreground uppercase block">Rain Forecast</span>
                <span className="text-xl font-bold text-primary block mt-1">Light Rain</span>
              </div>
            </div>

            <div className="border-t border-border/30 pt-4 space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-bold text-sm text-foreground">Smart Automated Irrigation</h4>
                  <p className="text-xs text-muted-foreground mt-0.5">Toggle automated drip-valves activated by soil telemetry sensors.</p>
                </div>
                <button 
                  onClick={() => {
                    setAutoIrrigation(!autoIrrigation);
                    toast.success(autoIrrigation ? "Auto Irrigation Disabled" : "Auto Irrigation Activated. Moisture target set to 65%.");
                  }}
                  className={`w-12 h-6 rounded-full p-1 transition-colors outline-none border border-border/60 ${autoIrrigation ? 'bg-primary' : 'bg-background'}`}
                >
                  <div className={`w-4 h-4 rounded-full bg-white transition-transform ${autoIrrigation ? 'translate-x-6' : 'translate-x-0'}`} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* -------------------- TAB 6: AI SUGGESTIONS -------------------- */}
      {activeTab === "ai-suggestions" && (
        <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
          <div className="xl:col-span-3 glass rounded-3xl p-6 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)]">
            <h3 className="font-semibold text-lg flex items-center gap-2 mb-4"><Brain className="h-4 w-4 text-info" /> AI Soil Nutrient Calculator</h3>
            <form onSubmit={handleGenerateFertilizer} className="space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-1">Select Crop</label>
                  <select 
                    value={aiCrop} 
                    onChange={e => setAiCrop(e.target.value)}
                    className="w-full glass rounded-xl px-4 py-2.5 text-sm outline-none border border-border bg-background text-foreground"
                  >
                    <option value="Wheat">Wheat</option>
                    <option value="Maize">Maize</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-1">Soil Class</label>
                  <select 
                    value={aiSoil} 
                    onChange={e => setAiSoil(e.target.value)}
                    className="w-full glass rounded-xl px-4 py-2.5 text-sm outline-none border border-border bg-background text-foreground"
                  >
                    <option value="Alluvial">Alluvial</option>
                    <option value="Sandy Loam">Sandy Loam</option>
                  </select>
                </div>
              </div>
              <GradientButton type="submit" className="w-full py-2 shadow-lg">Calculate Dosage Recommendation</GradientButton>
            </form>

            {fertilizerResult && (
              <div className="p-4 rounded-xl bg-primary/10 border border-primary/30 text-xs mt-5 space-y-1 animate-fade-in">
                <h4 className="font-bold flex items-center gap-1.5 mb-1"><Sparkles className="h-4 w-4 text-primary" /> AI SOIL RECOMMENDATION</h4>
                <p className="leading-relaxed font-medium">{fertilizerResult}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* -------------------- TAB 7: IRRIGATION -------------------- */}
      {activeTab === "irrigation" && (
        <div className="glass rounded-3xl p-6 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)] space-y-4">
          <h3 className="font-semibold flex items-center gap-2 mb-2"><Droplets className="h-4 w-4 text-info" /> Sub-Surface Irrigation Controls</h3>
          <p className="text-xs text-muted-foreground">Manage moisture target levels and review real-time sensor node data feeds.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-border/50 bg-background/25 flex justify-between items-center shadow-sm">
              <div>
                <h4 className="font-bold text-sm text-foreground">Sector 6 Valve (Wheat)</h4>
                <span className="text-xs text-muted-foreground">Flow State: <span className="text-success font-semibold">Active (4.2 L/m)</span></span>
              </div>
              <span className="text-[10px] bg-success/20 text-success border border-success/30 px-2 py-0.5 rounded font-bold uppercase">Open</span>
            </div>
            <div className="p-4 rounded-xl border border-border/50 bg-background/25 flex justify-between items-center shadow-sm">
              <div>
                <h4 className="font-bold text-sm text-foreground">Sector 4 Valve (Maize)</h4>
                <span className="text-xs text-muted-foreground">Flow State: <span className="text-muted-foreground font-semibold">Offline</span></span>
              </div>
              <span className="text-[10px] bg-background/50 border border-border/30 px-2 py-0.5 rounded font-bold uppercase text-muted-foreground">Closed</span>
            </div>
          </div>
        </div>
      )}

      {/* -------------------- TAB 8: NOTIFICATIONS -------------------- */}
      {activeTab === "notifications" && (
        <div className="glass rounded-3xl p-6 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)]">
          <h3 className="font-semibold flex items-center gap-2 mb-4"><Bell className="h-4 w-4 text-info" /> Farmer Notifications</h3>
          <div className="space-y-3">
            {notifications.map(n => (
              <div key={n.id} className="p-4 rounded-xl border border-border/30 bg-background/25 flex items-start justify-between gap-3">
                <div className="flex gap-3">
                  <span className="p-2 rounded-lg bg-info/10 text-info"><AlertCircle className="h-4 w-4" /></span>
                  <div>
                    <p className="text-sm font-medium text-foreground">{n.text}</p>
                    <span className="text-[10px] text-muted-foreground block mt-1">{n.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* -------------------- TAB 9: SUPPORT CENTER -------------------- */}
      {activeTab === "support" && (
        <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
          <div className="xl:col-span-3 glass rounded-3xl p-6 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)]">
            <h3 className="font-semibold text-lg flex items-center gap-2 mb-4"><HelpCircle className="h-4 w-4 text-primary" /> Contact Agri-Trek Support</h3>
            <form onSubmit={handleSupportSubmit} className="space-y-4 text-sm font-medium">
              <div>
                <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-1">Subject</label>
                <input 
                  required 
                  value={supportForm.subject} 
                  onChange={e => setSupportForm({ ...supportForm, subject: e.target.value })}
                  className="w-full glass rounded-xl px-4 py-2.5 text-sm outline-none border border-border focus:ring-2 focus:ring-primary/50 text-foreground"
                  placeholder="e.g. Subsidy Claim Issue"
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-1">Message</label>
                <textarea 
                  required 
                  rows={4}
                  value={supportForm.message} 
                  onChange={e => setSupportForm({ ...supportForm, message: e.target.value })}
                  className="w-full glass rounded-xl px-4 py-2.5 text-sm outline-none border border-border focus:ring-2 focus:ring-primary/50 text-foreground"
                  placeholder="Enter details of your query..."
                />
              </div>
              <GradientButton type="submit" className="w-full py-2 shadow-lg">Submit Support Ticket</GradientButton>
            </form>
          </div>
        </div>
      )}

      {/* -------------------- MODALS -------------------- */}
      
      {/* 1. Request Inspection Modal */}
      <AnimatePresence>
        {showInspectionModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-background/70 backdrop-blur flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="glass-strong rounded-3xl w-full max-w-md p-6 border border-border">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-base">Request Field Inspection</h3>
                <button onClick={() => setShowInspectionModal(false)} className="p-1 text-muted-foreground hover:text-foreground hover:bg-accent/40 rounded-lg"><XCircle className="h-5 w-5" /></button>
              </div>
              <form onSubmit={handleRequestInspection} className="space-y-4 text-sm font-medium">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-1">Select Land Record</label>
                  <select 
                    value={inspectionSurvey} 
                    onChange={e => setInspectionSurvey(e.target.value)}
                    className="w-full glass rounded-xl px-4 py-2.5 text-sm outline-none border border-border bg-background text-foreground"
                  >
                    {lands.map(l => (
                      <option key={l.id} value={l.surveyNumber}>{l.surveyNumber} ({l.crop})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-1">Reason / Notes</label>
                  <textarea 
                    value={inspectionNotes} 
                    onChange={e => setInspectionNotes(e.target.value)}
                    className="w-full glass rounded-xl px-4 py-2.5 text-sm outline-none border border-border focus:ring-2 focus:ring-primary/50 text-foreground"
                    placeholder="Describe any anomalies or assistance needed..."
                  />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button type="button" onClick={() => setShowInspectionModal(false)} className="px-4 py-2 rounded-xl text-xs hover:bg-accent/40 text-muted-foreground">Cancel</button>
                  <GradientButton type="submit" className="text-xs">Request Audit</GradientButton>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. Scheme Application Upload Modal */}
      <AnimatePresence>
        {showApplyModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-background/80 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="glass-strong rounded-3xl max-w-sm w-full p-6 border border-border text-center space-y-6">
              <div className="flex justify-center">
                <div className="relative">
                  <div className="absolute inset-0 bg-primary/20 blur-md rounded-full animate-ping" />
                  <div className="h-16 w-16 rounded-full bg-primary/10 border-2 border-primary flex items-center justify-center text-primary"><UploadCloud className="h-8 w-8" /></div>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-base text-foreground">Applying for {showApplyModal}</h4>
                <p className="text-xs text-muted-foreground max-w-[240px] mx-auto leading-relaxed">
                  Uploading land title deeds & survey verification signature certificates to government benefits registry...
                </p>
                
                {isApplying && (
                  <div className="w-full pt-4 space-y-2">
                    <div className="flex justify-between text-[10px] font-mono text-primary font-bold">
                      <span>UPLOADING CERTIFICATES</span>
                      <span>{applyingProgress}%</span>
                    </div>
                    <div className="w-full bg-background/50 h-1.5 rounded-full overflow-hidden border border-border/30">
                      <motion.div 
                        className="bg-gradient-primary h-full"
                        style={{ width: `${applyingProgress}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-2 pt-2">
                <button type="button" disabled={isApplying} onClick={() => setShowApplyModal(null)} className="w-full py-2 rounded-xl text-xs hover:bg-accent/40 text-muted-foreground border border-border">Cancel</button>
                <GradientButton disabled={isApplying} onClick={() => handleApplyScheme(showApplyModal)} className="w-full py-2 text-xs">
                  {isApplying ? "Submitting..." : "Upload & Apply"}
                </GradientButton>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AppLayout>
  );
}


function OfficerDashboard({ activeTab }: { activeTab: string }) {
  const { data: user } = useQuery({ 
    queryKey: ["me"], 
    queryFn: async () => (await api.get("/auth/me")).data.data 
  });

  // Fetch real data from the database
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

  // Local state for interactive features
  const [farmersCount, setFarmersCount] = useState(45);
  const [pendingCount, setPendingCount] = useState(12);
  const [verifiedArea, setVerifiedArea] = useState(340.5);
  const [referralsCount, setReferralsCount] = useState(8);
  const [weatherAlerts, setWeatherAlerts] = useState(2);
  const [inspectionsCount, setInspectionsCount] = useState(5);
  const [reportsCount, setReportsCount] = useState(3);
  const [performanceIndex, setPerformanceIndex] = useState(94.2);

  // Notifications state
  const [notifications, setNotifications] = useState([
    { id: 1, type: "alert", text: "Heavy rain alert in Sector 6. Risk of waterlogging.", time: "10m ago" },
    { id: 2, type: "request", text: "Farmer Harpreet Singh requested land verification for SRV-442/B.", time: "1h ago" },
    { id: 3, type: "system", text: "AI satellite scan flagged potential anomaly (Late Blight) in Sector 4.", time: "2h ago" },
    { id: 4, type: "task", text: "Scheduled field inspection at Sector 9 assigned to you.", time: "4h ago" },
  ]);

  // Tasks checklist state
  const [taskList, setTaskList] = useState([
    { id: 1, text: "Verify Land Survey SRV-442/B", done: false },
    { id: 2, text: "Perform GPS Field Check-In at Sector 9", done: false },
    { id: 3, text: "Review & approve Village Pradhan yield report", done: false },
    { id: 4, text: "Synchronize local offline data with main registry", done: true },
  ]);

  // Farmers list state
  const [farmersSearch, setFarmersSearch] = useState("");
  const [farmersFilter, setFarmersFilter] = useState("all");
  const [farmersList, setFarmersList] = useState([
    { id: 1, name: "Rajesh Kumar", village: "Sector 6 - Riverside", crop: "Wheat", status: "Active", contact: "+91 98765 43210", landSize: 12.5, registered: "2026-02-14" },
    { id: 2, name: "Harpreet Singh", village: "Sector 4 - North Plains", crop: "Rice", status: "Pending", contact: "+91 98123 45678", landSize: 8.2, registered: "2026-03-01" },
    { id: 3, name: "Ramesh Patel", village: "Sector 2 - West Valley", crop: "Sugarcane", status: "Active", contact: "+91 99012 34567", landSize: 15.0, registered: "2026-01-20" },
    { id: 4, name: "Srinivas Rao", village: "Sector 9 - South Hills", crop: "Cotton", status: "Pending", contact: "+91 97654 32109", landSize: 6.8, registered: "2026-03-10" },
    { id: 5, name: "Amit Sharma", village: "Sector 6 - Riverside", crop: "Wheat", status: "Active", contact: "+91 94567 89012", landSize: 10.4, registered: "2026-02-28" },
    { id: 6, name: "Gurnam Singh", village: "Sector 4 - North Plains", crop: "Wheat", status: "Active", contact: "+91 96543 21098", landSize: 18.2, registered: "2026-01-15" },
  ]);

  // Land Verification Queue
  const [verificationQueue, setVerificationQueue] = useState([
    { id: "L-2041", surveyNumber: "SRV-442/B", farmer: "Harpreet Singh", area: 8.2, crop: "Rice", village: "Sector 4 - North Plains", soil: "Alluvial", status: "Pending" },
    { id: "L-3092", surveyNumber: "SRV-109/A", farmer: "Srinivas Rao", area: 6.8, crop: "Cotton", village: "Sector 9 - South Hills", soil: "Red Soil", status: "Pending" },
    { id: "L-1153", surveyNumber: "SRV-773/C", farmer: "Vikram Reddy", area: 11.2, crop: "Maize", village: "Sector 3 - Clay Ridge", soil: "Clay Loam", status: "Pending" },
    { id: "L-5821", surveyNumber: "SRV-221/D", farmer: "Sanjay Dutta", area: 5.5, crop: "Wheat", village: "Sector 7 - East Delta", soil: "Sandy Loam", status: "Pending" },
  ]);

  // Route calculation simulation
  const [isComputingRoute, setIsComputingRoute] = useState(false);
  const [showRoute, setShowRoute] = useState(false);

  useEffect(() => {
    if (farmersData && farmersData.length > 0) {
      setFarmersCount(farmersData.length);
      setFarmersList(farmersData.map((f: any, idx: number) => ({
        id: idx + 1,
        name: typeof f.user === 'object' ? f.user.name : f.name || "Farmer",
        village: f.village || "Sector 6",
        crop: f.crops?.join(", ") || "Wheat",
        status: f.beneficiaryStatus === "active" ? "Active" : "Pending",
        contact: f.contactNumber || "Unspecified",
        landSize: f.landSize || 0,
        registered: f.createdAt ? f.createdAt.split('T')[0] : "2026-05-25"
      })));
    }
  }, [farmersData]);

  useEffect(() => {
    if (landsData && landsData.length > 0) {
      const pending = landsData.filter((l: any) => !l.verified);
      const verified = landsData.filter((l: any) => l.verified);
      const totalArea = verified.reduce((acc: number, curr: any) => acc + (curr.area || 0), 0);
      
      setPendingCount(pending.length);
      setVerifiedArea(totalArea);
      setVerificationQueue(pending.map((l: any) => ({
        id: l._id,
        surveyNumber: l.surveyNumber,
        farmer: typeof l.farmer === 'object' ? l.farmer?.name : "Farmer",
        area: l.area || 0,
        crop: l.soilType || "Wheat",
        village: l.village || "Sector 4",
        soil: l.soilType || "Alluvial",
        status: "Pending"
      })));
    }
  }, [landsData]);

  useEffect(() => {
    if (analytics) {
      setReferralsCount(analytics.applicationsByStatus?.find((a: any) => a._id === 'pending')?.count || 0);
    }
  }, [analytics]);

  // Crop Monitoring layers
  const [activeLayer, setActiveLayer] = useState("ndvi"); // ndvi, thermal, moisture
  const [selectedSector, setSelectedSector] = useState("sec-4");
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanResult, setScanResult] = useState<string | null>(null);

  const sectors = [
    { id: "sec-4", name: "Sector 4 - North Plains", crop: "Rice", ndvi: 0.76, moisture: 42, temp: 24, points: "80,40 220,20 200,100 90,110", status: "Pending Verification" },
    { id: "sec-6", name: "Sector 6 - Riverside", crop: "Wheat", ndvi: 0.88, moisture: 65, temp: 21, points: "220,20 350,30 320,120 200,100", status: "Verified" },
    { id: "sec-2", name: "Sector 2 - West Valley", crop: "Sugarcane", ndvi: 0.82, moisture: 58, temp: 23, points: "50,110 90,110 130,220 40,190", status: "Verified" },
    { id: "sec-9", name: "Sector 9 - South Hills", crop: "Cotton", ndvi: 0.54, moisture: 31, temp: 28, points: "90,110 200,100 160,230 130,220", status: "Critical Anomaly" },
    { id: "sec-7", name: "Sector 7 - East Delta", crop: "Wheat", ndvi: 0.79, moisture: 50, temp: 22, points: "200,100 320,120 280,240 160,230", status: "Pending Verification" },
  ];

  // Referrals
  const [referrals, setReferrals] = useState([
    { id: "REF-091", farmer: "Rajesh Kumar", scheme: "PM-KISAN Benefits", status: "Approved", date: "2026-05-10" },
    { id: "REF-092", farmer: "Ramesh Patel", scheme: "Agri-Infrastructure Fund", status: "Under Review", date: "2026-05-18" },
    { id: "REF-093", farmer: "Gurnam Singh", scheme: "Weather-based Insurance", status: "Pending Approval", date: "2026-05-22" },
    { id: "REF-094", farmer: "Harpreet Singh", scheme: "PM-KISAN Benefits", status: "Pending Approval", date: "2026-05-24" },
  ]);
  const [showReferralModal, setShowReferralModal] = useState(false);
  const [referralForm, setReferralForm] = useState({ farmer: "", scheme: "PM-KISAN Benefits" });

  // Inspections
  const [inspections, setInspections] = useState([
    { id: "ISP-402", farmer: "Harpreet Singh", survey: "SRV-442/B", village: "Sector 4", date: "Today, 10:30 AM", status: "Scheduled" },
    { id: "ISP-403", farmer: "Srinivas Rao", survey: "SRV-109/A", village: "Sector 9", date: "Today, 02:15 PM", status: "Scheduled" },
    { id: "ISP-404", farmer: "Vikram Reddy", survey: "SRV-773/C", village: "Sector 3", date: "Tomorrow, 09:00 AM", status: "Scheduled" },
    { id: "ISP-405", farmer: "Sanjay Dutta", survey: "SRV-221/D", village: "Sector 7", date: "May 28, 11:00 AM", status: "Scheduled" },
  ]);
  const [checkingInId, setCheckingInId] = useState<string | null>(null);
  const [checkInStep, setCheckInStep] = useState(0); // 0: idle, 1: connecting, 2: gps lock, 3: success
  const [showInspectionModal, setShowInspectionModal] = useState(false);
  const [inspectionForm, setInspectionForm] = useState({ farmer: "", survey: "", date: "" });

  // Reports
  const [reportsList, setReportsList] = useState([
    { id: "REP-901", title: "Rabi Crop Yield - Sector 6", author: "Rajesh Kumar (Pradhan)", date: "2026-05-24", status: "Pending" },
    { id: "REP-902", title: "Soil Erosion Assessment", author: "Amit Sharma (Lead)", date: "2026-05-23", status: "Pending" },
    { id: "REP-903", title: "Insecticide Efficiency Report", author: "Gurnam Singh", date: "2026-05-21", status: "Pending" },
  ]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Handlers
  const handleVerifyLand = async (id: string, survey: string, area: number) => {
    try {
      await api.put(`/lands/${id}/verify`);
      setVerificationQueue(prev => prev.map(item => item.id === id ? { ...item, status: "Verified" } : item));
      setPendingCount(prev => Math.max(0, prev - 1));
      setVerifiedArea(prev => prev + area);
      setTaskList(prev => prev.map(t => t.text.includes(survey) ? { ...t, done: true } : t));
      toast.success(`Land Record ${survey} verified successfully!`);
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Verification failed");
    }
  };

  const handleRejectLand = (id: string, survey: string) => {
    setVerificationQueue(prev => prev.map(item => item.id === id ? { ...item, status: "Rejected" } : item));
    setPendingCount(prev => Math.max(0, prev - 1));
    toast.error(`Land Record ${survey} rejected.`);
  };

  const handleLaunchRoute = () => {
    setIsComputingRoute(true);
    setTimeout(() => {
      setIsComputingRoute(false);
      setShowRoute(true);
      toast.success("Optimized route for pending inspections generated!");
    }, 1500);
  };

  const handleTriggerAIScan = () => {
    setIsScanning(true);
    setScanProgress(0);
    setScanResult(null);
    const interval = setInterval(() => {
      setScanProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsScanning(false);
            setScanResult("Late Blight disease risk detected in Sector 4 (North Plains). NDVI health score dropped to 0.52.");
            setWeatherAlerts(prevCount => prevCount + 1);
            toast.error("AI Alert: Potential Crop Disease Detected in Sector 4!");
          }, 500);
          return 100;
        }
        return prev + 10;
      });
    }, 150);
  };

  const handleApproveReport = (id: string, title: string) => {
    setReportsList(prev => prev.map(rep => rep.id === id ? { ...rep, status: "Approved" } : rep));
    setReportsCount(prev => Math.max(0, prev - 1));
    toast.success(`Report "${title}" approved!`);
  };

  const handleRejectReport = (id: string, title: string) => {
    setReportsList(prev => prev.map(rep => rep.id === id ? { ...rep, status: "Rejected" } : rep));
    setReportsCount(prev => Math.max(0, prev - 1));
    toast.error(`Report "${title}" rejected.`);
  };

  const handleApproveReferral = (id: string, name: string) => {
    setReferrals(prev => prev.map(r => r.id === id ? { ...r, status: "Approved" } : r));
    setReferralsCount(prev => Math.max(0, prev - 1));
    toast.success(`Referral approved for ${name}! Program benefits activated.`);
  };

  const handleStartCheckIn = (id: string) => {
    setCheckingInId(id);
    setCheckInStep(1);
    setTimeout(() => {
      setCheckInStep(2);
      setTimeout(() => {
        setCheckInStep(3);
      }, 1200);
    }, 1000);
  };

  const handleCompleteCheckIn = () => {
    if (checkingInId) {
      setInspections(prev => prev.map(isp => isp.id === checkingInId ? { ...isp, status: "Checked-In" } : isp));
      setInspectionsCount(prev => Math.max(0, prev - 1));
      toast.success("Check-In verified. Telemetry synced with district server.");
    }
    setCheckingInId(null);
    setCheckInStep(0);
  };

  const handleAddReferral = (e: React.FormEvent) => {
    e.preventDefault();
    if (!referralForm.farmer) return;
    const newRef = {
      id: `REF-${Math.floor(Math.random() * 900) + 100}`,
      farmer: referralForm.farmer,
      scheme: referralForm.scheme,
      status: "Pending Approval",
      date: new Date().toISOString().split('T')[0]
    };
    setReferrals(prev => [newRef, ...prev]);
    setReferralsCount(prev => prev + 1);
    setShowReferralModal(false);
    toast.success(`Referral created for ${referralForm.farmer}!`);
  };

  const handleAddInspection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inspectionForm.farmer || !inspectionForm.survey) return;
    const newIsp = {
      id: `ISP-${Math.floor(Math.random() * 900) + 100}`,
      farmer: inspectionForm.farmer,
      survey: inspectionForm.survey,
      village: "Sector " + (Math.floor(Math.random() * 9) + 1),
      date: inspectionForm.date || "Tomorrow, 10:00 AM",
      status: "Scheduled"
    };
    setInspections(prev => [newIsp, ...prev]);
    setInspectionsCount(prev => prev + 1);
    setShowInspectionModal(false);
    toast.success(`Inspection scheduled for ${inspectionForm.farmer}!`);
  };

  const handleFileUploadSimulate = () => {
    setIsUploading(true);
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsUploading(false);
            setReportsList(prevList => [
              { id: `REP-${Math.floor(Math.random() * 900) + 100}`, title: "Crop_Health_Analysis_May_2026.pdf", author: user?.name || "Officer", date: new Date().toISOString().split('T')[0], status: "Pending" },
              ...prevList
            ]);
            setReportsCount(prevCount => prevCount + 1);
            toast.success("Report document uploaded and parsed. Added to verification queue.");
          }, 600);
          return 100;
        }
        return prev + 8;
      });
    }, 100);
  };

  const activeSect = sectors.find(s => s.id === selectedSector) || sectors[0];

  // Helper for stats card accent colors
  const getAccentClass = (accent?: "primary" | "secondary" | "success" | "warning" | "destructive" | "info") => {
    switch (accent) {
      case "success": return "text-success bg-success/15 border border-success/30";
      case "warning": return "text-warning bg-warning/15 border border-warning/30";
      case "destructive": return "text-destructive bg-destructive/15 border border-destructive/30";
      case "info": return "text-info bg-info/15 border border-info/30";
      default: return "text-primary bg-primary/15 border border-primary/30";
    }
  };

  const getSectFillColor = (s: typeof sectors[0]) => {
    if (activeLayer === "ndvi") {
      if (s.id === "sec-4" && scanResult) return "rgba(220, 38, 38, 0.45)"; // showing disease drop
      if (s.ndvi >= 0.8) return "rgba(34, 197, 94, 0.4)";
      if (s.ndvi >= 0.7) return "rgba(132, 204, 22, 0.4)";
      if (s.ndvi >= 0.6) return "rgba(234, 179, 8, 0.4)";
      return "rgba(239, 68, 68, 0.4)";
    } else if (activeLayer === "thermal") {
      if (s.temp >= 26) return "rgba(239, 68, 68, 0.4)";
      if (s.temp >= 23) return "rgba(249, 115, 22, 0.4)";
      return "rgba(147, 51, 234, 0.4)";
    } else {
      if (s.moisture >= 60) return "rgba(59, 130, 246, 0.5)";
      if (s.moisture >= 45) return "rgba(96, 165, 250, 0.4)";
      return "rgba(234, 179, 8, 0.4)";
    }
  };

  const getSectStrokeColor = (s: typeof sectors[0]) => {
    if (activeLayer === "ndvi") {
      if (s.id === "sec-4" && scanResult) return "oklch(0.62 0.22 25)";
      if (s.ndvi >= 0.8) return "oklch(0.72 0.18 150)";
      if (s.ndvi >= 0.7) return "oklch(0.75 0.15 130)";
      if (s.ndvi >= 0.6) return "oklch(0.78 0.16 75)";
      return "oklch(0.62 0.22 25)";
    } else if (activeLayer === "thermal") {
      if (s.temp >= 26) return "oklch(0.62 0.22 25)";
      if (s.temp >= 23) return "oklch(0.78 0.16 75)";
      return "oklch(0.65 0.18 280)";
    } else {
      if (s.moisture >= 60) return "oklch(0.70 0.14 220)";
      if (s.moisture >= 45) return "oklch(0.70 0.14 195)";
      return "oklch(0.78 0.16 75)";
    }
  };

  // Stats definition for stat cards
  const stats = [
    { label: "Assigned Farmers", value: farmersCount, icon: Users, accent: "primary" as const, trend: "Active list" },
    { label: "Pending Verifications", value: pendingCount, icon: AlertTriangle, accent: "warning" as const, trend: "Needs review" },
    { label: "Verified Lands (Acres)", value: verifiedArea.toFixed(1), icon: MapPin, accent: "success" as const, trend: "Total area" },
    { label: "Scheme Referrals", value: referralsCount, icon: Gift, accent: "info" as const, trend: "Active referrals" },
    { label: "Weather Anomalies", value: weatherAlerts, icon: ThermometerSun, accent: "destructive" as const, trend: "Sector warnings" },
    { label: "Scheduled Inspections", value: inspectionsCount, icon: ClipboardCheck, accent: "primary" as const, trend: "Next 48 hrs" },
    { label: "Reports to Approve", value: reportsCount, icon: UploadCloud, accent: "warning" as const, trend: "Review queue" },
    { label: "District Index", value: `${performanceIndex}%`, icon: Activity, accent: "success" as const, trend: "Target 95%" },
  ];

  // Recharts data
  const cropDistribution = [
    { name: "Sector 4", Wheat: 340, Rice: 560, Sugarcane: 120 },
    { name: "Sector 6", Wheat: 620, Rice: 240, Sugarcane: 450 },
    { name: "Sector 2", Wheat: 150, Rice: 310, Sugarcane: 890 },
    { name: "Sector 9", Wheat: 450, Rice: 120, Sugarcane: 200 },
    { name: "Sector 7", Wheat: 580, Rice: 390, Sugarcane: 610 },
  ];

  const seasonalHealth = [
    { month: "Jan", ndvi: 0.62, moisture: 68 },
    { month: "Feb", ndvi: 0.65, moisture: 64 },
    { month: "Mar", ndvi: 0.70, moisture: 60 },
    { month: "Apr", ndvi: 0.78, moisture: 54 },
    { month: "May", ndvi: 0.81, moisture: 49 },
    { month: "Jun", ndvi: 0.84, moisture: 58 },
  ];

  const schemeDistribution = [
    { name: "Approved", value: referrals.filter(r => r.status === "Approved").length },
    { name: "Under Review", value: referrals.filter(r => r.status === "Under Review").length },
    { name: "Pending Approval", value: referrals.filter(r => r.status === "Pending Approval").length },
  ];

  const COLORS = ["oklch(0.72 0.18 150)", "oklch(0.70 0.14 220)", "oklch(0.78 0.16 75)"];

  return (
    <AppLayout title="Field Officer Workspace">
      {/* Weather Banner Alert */}
      {weatherAlerts > 0 && (
        <div className="mb-6 p-4 rounded-2xl bg-destructive/10 border border-destructive/20 text-foreground flex items-center justify-between backdrop-blur-md animate-pulse">
          <div className="flex items-center gap-3">
            <span className="p-2 rounded-xl bg-destructive/20 text-destructive">
              <AlertTriangle className="h-5 w-5" />
            </span>
            <div>
              <h4 className="font-bold text-sm">Critical Weather Anomalies Detected</h4>
              <p className="text-xs text-muted-foreground mt-0.5">Heavy rainfall & temperature drop warning for Riverside sectors. Drone patrols on standby.</p>
            </div>
          </div>
          <button onClick={() => setWeatherAlerts(0)} className="text-xs font-semibold text-destructive hover:underline bg-destructive/10 px-3 py-1 rounded-xl">Dismiss</button>
        </div>
      )}

      {/* 8 Premium Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((stat, i) => (
          <StatCard key={i} {...stat} />
        ))}
      </div>

      {/* -------------------- TAB 1: OVERVIEW -------------------- */}
      {activeTab === "dashboard" && (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2 space-y-6">
            {/* Interactive Tasks Checklist */}
            <div className="glass rounded-3xl p-6 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)]">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold flex items-center gap-2"><Clock className="h-4 w-4 text-primary" /> Daily Tasks Summary</h3>
                <span className="text-xs text-muted-foreground font-medium">{taskList.filter(t => t.done).length}/{taskList.length} Tasks Completed</span>
              </div>
              <div className="space-y-3">
                {taskList.map(task => (
                  <div 
                    key={task.id} 
                    onClick={() => setTaskList(prev => prev.map(t => t.id === task.id ? { ...t, done: !t.done } : t))}
                    className="flex items-center gap-3 p-3.5 rounded-xl border border-border/40 hover:bg-accent/10 transition cursor-pointer"
                  >
                    <div className={`h-5 w-5 rounded-md border flex items-center justify-center transition-all ${task.done ? 'bg-primary border-primary text-primary-foreground' : 'border-border/80'}`}>
                      {task.done && <Check className="h-3 w-3" />}
                    </div>
                    <span className={`text-sm font-medium transition ${task.done ? 'line-through text-muted-foreground' : 'text-foreground'}`}>{task.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Live Notifications Feed */}
            <div className="glass rounded-3xl p-6 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)]">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold flex items-center gap-2"><Bell className="h-4 w-4 text-info" /> Real-time Field Notifications</h3>
                <button onClick={() => setNotifications([])} className="text-xs text-muted-foreground hover:text-foreground">Clear All</button>
              </div>
              {notifications.length > 0 ? (
                <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                  {notifications.map(n => (
                    <div key={n.id} className="p-3.5 rounded-xl border border-border/30 bg-background/25 flex items-start justify-between gap-3 group">
                      <div className="flex gap-3">
                        <span className={`p-1.5 rounded-lg mt-0.5 ${n.type === 'alert' ? 'bg-destructive/10 text-destructive' : n.type === 'request' ? 'bg-warning/10 text-warning' : 'bg-info/10 text-info'}`}>
                          <AlertCircle className="h-4 w-4" />
                        </span>
                        <div>
                          <p className="text-sm font-medium text-foreground">{n.text}</p>
                          <span className="text-[10px] text-muted-foreground block mt-1">{n.time}</span>
                        </div>
                      </div>
                      <button 
                        onClick={(e) => { e.stopPropagation(); setNotifications(prev => prev.filter(x => x.id !== n.id)); }} 
                        className="text-xs text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-accent/40"
                      >
                        Dismiss
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10 text-muted-foreground italic text-sm">No new alerts or telemetry requests.</div>
              )}
            </div>
          </div>

          {/* Right Column: Today's Scheduled Inspections */}
          <div className="glass rounded-3xl p-6 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)]">
            <h3 className="font-semibold flex items-center gap-2 mb-4"><Calendar className="h-4 w-4 text-warning" /> Today's Field Inspections</h3>
            <div className="space-y-3">
              {inspections.slice(0, 3).map(isp => (
                <div key={isp.id} className="p-4 rounded-xl border border-border/50 bg-background/20 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-sm text-foreground">{isp.farmer}</h4>
                      <p className="text-xs text-muted-foreground mt-0.5">Survey: {isp.survey} • {isp.village}</p>
                    </div>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${isp.status === 'Checked-In' ? 'bg-success/20 text-success' : 'bg-primary/20 text-primary'}`}>
                      {isp.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {isp.date}</span>
                    {isp.status === 'Scheduled' && (
                      <GradientButton onClick={() => handleStartCheckIn(isp.id)} className="text-[11px] py-1 px-3 h-8 shadow-sm">
                        Check-In
                      </GradientButton>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <Link to="/dashboard" search={{ tab: "inspections" }} className="mt-4 block text-center text-xs text-primary font-medium hover:underline">
              View All Scheduled Inspections →
            </Link>
          </div>
        </div>
      )}

      {/* -------------------- TAB 2: FARMERS DIRECTORY -------------------- */}
      {activeTab === "farmers" && (
        <div className="glass rounded-3xl p-6 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)]">
          <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
            <div>
              <h3 className="text-xl font-bold">Assigned Farmers Directory</h3>
              <p className="text-sm text-muted-foreground mt-1">Manage profiles and active beneficiary scheme links for registered district farmers.</p>
            </div>
            <div className="flex gap-2">
              <GradientButton variant="outline" className="text-xs py-2 px-3 shadow-lg"><Download className="h-3.5 w-3.5 mr-1.5" /> Export PDF</GradientButton>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-wrap mb-6">
            <div className="flex items-center gap-2 glass rounded-xl px-3 py-2 flex-1 min-w-[280px]">
              <Search className="h-4 w-4 text-muted-foreground" />
              <input 
                value={farmersSearch} 
                onChange={e => setFarmersSearch(e.target.value)} 
                placeholder="Search farmers by name or sector..." 
                className="bg-transparent outline-none text-sm flex-1 placeholder:text-muted-foreground" 
              />
            </div>
            <div className="flex items-center gap-2 glass rounded-xl px-3 py-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <select 
                value={farmersFilter} 
                onChange={e => setFarmersFilter(e.target.value)} 
                className="bg-transparent outline-none text-sm text-foreground pr-4 cursor-pointer"
              >
                <option value="all" className="bg-background text-foreground">All Farmers</option>
                <option value="active" className="bg-background text-foreground">Active Status</option>
                <option value="pending" className="bg-background text-foreground">Pending verification</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {farmersList
              .filter(f => f.name.toLowerCase().includes(farmersSearch.toLowerCase()) || f.village.toLowerCase().includes(farmersSearch.toLowerCase()))
              .filter(f => farmersFilter === "all" || f.status.toLowerCase() === farmersFilter.toLowerCase())
              .map(farmer => (
                <div key={farmer.id} className="p-4 rounded-2xl border border-border/50 bg-background/25 flex flex-col justify-between hover:bg-accent/10 transition shadow-sm">
                  <div>
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-gradient-primary flex items-center justify-center font-bold text-primary-foreground text-sm shadow-md">
                          {farmer.name[0]}
                        </div>
                        <div>
                          <h4 className="font-bold text-sm text-foreground">{farmer.name}</h4>
                          <span className="text-xs text-muted-foreground">{farmer.contact}</span>
                        </div>
                      </div>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${farmer.status === 'Active' ? 'bg-success/15 text-success border border-success/30' : 'bg-warning/15 text-warning border border-warning/30'}`}>
                        {farmer.status}
                      </span>
                    </div>
                    <div className="space-y-1.5 text-xs text-muted-foreground border-t border-border/30 pt-3 mb-4">
                      <div className="flex justify-between"><span className="font-medium">Sector:</span><span className="text-foreground">{farmer.village}</span></div>
                      <div className="flex justify-between"><span className="font-medium">Land Size:</span><span className="text-foreground">{farmer.landSize} Acres</span></div>
                      <div className="flex justify-between"><span className="font-medium">Primary Crop:</span><span className="text-foreground">{farmer.crop}</span></div>
                      <div className="flex justify-between"><span className="font-medium">Onboarded:</span><span>{farmer.registered}</span></div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {farmer.status === "Pending" ? (
                      <GradientButton 
                        onClick={() => {
                          setFarmersList(prev => prev.map(f => f.id === farmer.id ? { ...f, status: "Active" } : f));
                          setFarmersCount(prev => prev + 1);
                          toast.success(`Farmer profile for ${farmer.name} approved and activated.`);
                        }} 
                        className="w-full text-xs py-1.5 shadow-sm"
                      >
                        Approve Profile
                      </GradientButton>
                    ) : (
                      <GradientButton 
                        variant="outline" 
                        onClick={() => {
                          setReferralForm({ farmer: farmer.name, scheme: "PM-KISAN Benefits" });
                          setShowReferralModal(true);
                        }} 
                        className="w-full text-xs py-1.5 shadow-sm"
                      >
                        Refer to Scheme
                      </GradientButton>
                    )}
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* -------------------- TAB 3: LAND VERIFICATION MAP & QUEUE -------------------- */}
      {activeTab === "verification" && (
        <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
          {/* Interactive GIS Sector Map */}
          <div className="xl:col-span-3 glass rounded-3xl p-6 flex flex-col justify-between shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)]">
            <div>
              <h3 className="font-semibold flex items-center gap-2 mb-2"><Map className="h-4 w-4 text-primary" /> District GIS Mapping & Inspection Sectors</h3>
              <p className="text-xs text-muted-foreground mb-4">Live telemetry showing crop sectors and pending verification bounds.</p>
            </div>
            
            <div className="flex-1 min-h-[300px] bg-[#090e11] border border-border/40 rounded-2xl relative overflow-hidden group mb-4 flex items-center justify-center">
              <div className="absolute inset-0 grid-bg opacity-15" />
              
              {/* Radar sweep */}
              <motion.div 
                className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(34,197,94,0.05)_0%,transparent_60%)] pointer-events-none"
                animate={{ scale: [0.8, 1.3, 0.8] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              />

              {/* Loading overlay when calculating route */}
              {isComputingRoute && (
                <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-10 flex flex-col items-center justify-center text-center p-4">
                  <Loader2 className="h-8 w-8 animate-spin text-primary mb-3" />
                  <h4 className="font-bold text-sm">Computing Optimal Telemetry Route</h4>
                  <p className="text-xs text-muted-foreground mt-1 max-w-[240px]">Calculating route path through survey boundaries using AI satellite vector maps...</p>
                </div>
              )}

              {/* Map SVG */}
              <svg viewBox="0 0 400 300" className="w-full h-full max-w-[450px] relative z-2 text-foreground font-mono">
                {sectors.map(s => {
                  const queueItem = verificationQueue.find(q => q.village.includes(s.name.split(" - ")[0]));
                  const status = queueItem ? queueItem.status : "Verified";
                  
                  let fill = "rgba(34, 197, 94, 0.25)";
                  let stroke = "oklch(0.72 0.18 150)";
                  if (status === "Pending") {
                    fill = "rgba(234, 179, 8, 0.25)";
                    stroke = "oklch(0.78 0.16 75)";
                  } else if (status === "Rejected") {
                    fill = "rgba(220, 38, 38, 0.25)";
                    stroke = "oklch(0.62 0.22 25)";
                  }
                  
                  return (
                    <polygon 
                      key={s.id} 
                      points={s.points} 
                      fill={fill} 
                      stroke={stroke} 
                      strokeWidth={selectedSector === s.id ? "3" : "1.5"}
                      className="cursor-pointer hover:opacity-85 transition-opacity"
                      onClick={() => setSelectedSector(s.id)}
                    />
                  );
                })}

                {/* Animated Navigation Route */}
                {showRoute && (
                  <motion.path
                    d="M 150,75 L 260,60 L 240,170 L 140,165 Z"
                    fill="none"
                    stroke="oklch(0.70 0.14 220)"
                    strokeWidth="3.5"
                    strokeDasharray="6, 6"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 2.2, ease: "easeInOut" }}
                  />
                )}

                {/* Markers */}
                <circle cx="150" cy="75" r="4" fill="oklch(0.72 0.18 150)" className="animate-ping" />
                <circle cx="150" cy="75" r="2.5" fill="oklch(0.72 0.18 150)" />

                <circle cx="260" cy="60" r="4" fill="oklch(0.78 0.16 75)" className="animate-ping" />
                <circle cx="260" cy="60" r="2.5" fill="oklch(0.78 0.16 75)" />

                <circle cx="240" cy="170" r="4" fill="oklch(0.70 0.14 220)" className="animate-ping" />
                <circle cx="240" cy="170" r="2.5" fill="oklch(0.70 0.14 220)" />

                {/* Coordinates grid labels */}
                <text x="10" y="290" fill="oklch(0.72 0.18 150 / 0.5)" fontSize="8">LAT: 28.5355 / LON: 77.3910</text>
              </svg>

              <div className="absolute top-3 left-3 flex flex-wrap gap-2 text-[10px] bg-background/85 backdrop-blur border border-border/40 px-2.5 py-1.5 rounded-xl font-medium">
                <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-success/80" /> Verified</span>
                <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-warning/80" /> Pending</span>
                <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-destructive/80" /> Rejected</span>
                {showRoute && <span className="flex items-center gap-1"><span className="h-2 w-1 border-t-2 border-dashed border-info" /> GPS Route</span>}
              </div>
            </div>

            <div className="flex gap-2">
              <GradientButton onClick={handleLaunchRoute} disabled={isComputingRoute} className="w-full py-2 shadow-lg">
                <Navigation className="h-4 w-4 mr-2" /> {showRoute ? "Re-calculate Optimized Route" : "Launch Verification Route"}
              </GradientButton>
              {showRoute && (
                <GradientButton variant="outline" onClick={() => setShowRoute(false)} className="py-2 px-3 shadow-lg">
                  Clear Route
                </GradientButton>
              )}
            </div>
          </div>

          {/* Pending Verification Queue */}
          <div className="xl:col-span-2 glass rounded-3xl p-6 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)] flex flex-col">
            <h3 className="font-semibold flex items-center gap-2 mb-4"><ShieldAlert className="h-4 w-4 text-warning" /> Land Inspection Queue</h3>
            <div className="flex-1 space-y-3 overflow-y-auto max-h-[420px] pr-1">
              {verificationQueue.map(item => (
                <div key={item.id} className={`p-4 rounded-xl border transition ${item.status === 'Verified' ? 'bg-success/5 border-success/30' : item.status === 'Rejected' ? 'bg-destructive/5 border-destructive/30' : 'bg-background/25 border-border/50'} space-y-3`}>
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] uppercase font-mono tracking-widest text-muted-foreground">{item.id}</span>
                      <h4 className="font-bold text-sm text-foreground mt-0.5">Survey: {item.surveyNumber}</h4>
                      <p className="text-xs text-muted-foreground mt-0.5">Farmer: {item.farmer} · {item.village}</p>
                    </div>
                    <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${item.status === 'Verified' ? 'bg-success/20 text-success' : item.status === 'Rejected' ? 'bg-destructive/20 text-destructive' : 'bg-warning/20 text-warning'}`}>
                      {item.status}
                    </span>
                  </div>
                  
                  <div className="flex justify-between text-xs text-muted-foreground border-t border-border/30 pt-3">
                    <div>Area: <span className="font-semibold text-foreground">{item.area} Acres</span></div>
                    <div>Soil: <span className="font-semibold text-foreground">{item.soil}</span></div>
                    <div>Crop: <span className="font-semibold text-foreground">{item.crop}</span></div>
                  </div>

                  {item.status === "Pending" && (
                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <GradientButton variant="outline" onClick={() => handleRejectLand(item.id, item.surveyNumber)} className="text-xs py-1">
                        Reject
                      </GradientButton>
                      <GradientButton onClick={() => handleVerifyLand(item.id, item.surveyNumber, item.area)} className="text-xs py-1">
                        Verify bounds
                      </GradientButton>
                    </div>
                  )}
                </div>
              ))}
              {verificationQueue.length === 0 && (
                <div className="text-center py-12 text-muted-foreground italic text-sm">No pending verification records. All survey items cleared!</div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* -------------------- TAB 4: CROP MONITORING -------------------- */}
      {activeTab === "monitoring" && (
        <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
          {/* NDVI Heatmap */}
          <div className="xl:col-span-3 glass rounded-3xl p-6 flex flex-col justify-between shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)]">
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold flex items-center gap-2"><Sprout className="h-4 w-4 text-success" /> NDVI Multispectral Visualizer</h3>
                <span className="text-[10px] font-bold text-primary uppercase tracking-widest bg-primary/10 border border-primary/20 rounded px-2.5 py-0.5">Satellite Sync</span>
              </div>
              <p className="text-xs text-muted-foreground mb-4">Toggle indices to visualize crop density, moisture stress indices, and localized canopy temperature.</p>
            </div>

            <div className="flex gap-1.5 p-1 rounded-xl bg-background/50 border border-border/40 mb-4 max-w-md">
              <button 
                onClick={() => { setActiveLayer("ndvi"); setScanResult(null); }} 
                className={`flex-1 text-center py-1.5 text-xs font-semibold rounded-lg transition ${activeLayer === 'ndvi' ? 'bg-primary text-primary-foreground font-bold shadow' : 'text-muted-foreground hover:text-foreground'}`}
              >
                NDVI Density
              </button>
              <button 
                onClick={() => { setActiveLayer("thermal"); setScanResult(null); }} 
                className={`flex-1 text-center py-1.5 text-xs font-semibold rounded-lg transition ${activeLayer === 'thermal' ? 'bg-primary text-primary-foreground font-bold shadow' : 'text-muted-foreground hover:text-foreground'}`}
              >
                Thermal Heat
              </button>
              <button 
                onClick={() => { setActiveLayer("moisture"); setScanResult(null); }} 
                className={`flex-1 text-center py-1.5 text-xs font-semibold rounded-lg transition ${activeLayer === 'moisture' ? 'bg-primary text-primary-foreground font-bold shadow' : 'text-muted-foreground hover:text-foreground'}`}
              >
                Soil Moisture
              </button>
            </div>

            <div className="flex-1 min-h-[300px] bg-[#090e11] border border-border/40 rounded-2xl relative overflow-hidden group mb-4 flex items-center justify-center">
              <div className="absolute inset-0 grid-bg opacity-15" />
              
              {/* Radar sweep scan line */}
              {isScanning && (
                <motion.div 
                  className="absolute inset-x-0 h-40 bg-gradient-to-b from-primary/30 to-transparent border-t border-primary/80 z-2"
                  animate={{ y: ["-100%", "300%"] }}
                  transition={{ duration: 2.2, repeat: Infinity, ease: "linear" }}
                />
              )}

              {/* Interactive SVG Layer Map */}
              <svg viewBox="0 0 400 300" className="w-full h-full max-w-[450px] relative z-1 text-foreground">
                {sectors.map(s => {
                  const fillColor = getSectFillColor(s);
                  const strokeColor = getSectStrokeColor(s);
                  return (
                    <polygon 
                      key={s.id} 
                      points={s.points} 
                      fill={fillColor} 
                      stroke={strokeColor} 
                      strokeWidth={selectedSector === s.id ? "3.5" : "1.5"}
                      className="cursor-pointer hover:opacity-85 transition-all"
                      onClick={() => { setSelectedSector(s.id); setScanResult(null); }}
                    />
                  );
                })}
              </svg>

              {/* Layer Index Legend */}
              <div className="absolute bottom-3 left-3 bg-background/90 border border-border/40 px-3 py-2 rounded-xl text-[10px] space-y-1.5 font-mono">
                <div className="font-bold uppercase tracking-wider text-muted-foreground border-b border-border/30 pb-1 mb-1">
                  {activeLayer === "ndvi" ? "NDVI Range" : activeLayer === "thermal" ? "Thermal Range" : "Moisture Range"}
                </div>
                {activeLayer === "ndvi" && (
                  <>
                    <div className="flex items-center gap-1.5"><span className="h-2 w-2.5 rounded bg-green-500/80" /> 0.8 - 1.0 (Optimal)</div>
                    <div className="flex items-center gap-1.5"><span className="h-2 w-2.5 rounded bg-lime-500/80" /> 0.6 - 0.8 (Moderate)</div>
                    <div className="flex items-center gap-1.5"><span className="h-2 w-2.5 rounded bg-yellow-500/80" /> 0.4 - 0.6 (Stressed)</div>
                    <div className="flex items-center gap-1.5"><span className="h-2 w-2.5 rounded bg-red-500/80" /> &lt; 0.4 (Anomaly/Blight)</div>
                  </>
                )}
                {activeLayer === "thermal" && (
                  <>
                    <div className="flex items-center gap-1.5"><span className="h-2 w-2.5 rounded bg-red-500/80" /> &gt; 25°C (High Stress)</div>
                    <div className="flex items-center gap-1.5"><span className="h-2 w-2.5 rounded bg-orange-500/80" /> 22°C - 25°C (Warm)</div>
                    <div className="flex items-center gap-1.5"><span className="h-2 w-2.5 rounded bg-purple-500/80" /> &lt; 22°C (Cool/Wet)</div>
                  </>
                )}
                {activeLayer === "moisture" && (
                  <>
                    <div className="flex items-center gap-1.5"><span className="h-2 w-2.5 rounded bg-blue-600/80" /> &gt; 60% (Saturated)</div>
                    <div className="flex items-center gap-1.5"><span className="h-2 w-2.5 rounded bg-blue-400/80" /> 45% - 60% (Optimal)</div>
                    <div className="flex items-center gap-1.5"><span className="h-2 w-2.5 rounded bg-yellow-500/80" /> &lt; 45% (Moisture Deficit)</div>
                  </>
                )}
              </div>
            </div>

            <div className="flex gap-2">
              <GradientButton onClick={handleTriggerAIScan} disabled={isScanning} className="w-full py-2 shadow-lg">
                {isScanning ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" /> Scanning Satellite Telemetry ({scanProgress}%)
                  </>
                ) : (
                  <>
                    <Brain className="h-4 w-4 mr-2" /> Trigger AI Crop Health Scan
                  </>
                )}
              </GradientButton>
            </div>
          </div>

          {/* Sector Intelligence Panel */}
          <div className="xl:col-span-2 glass rounded-3xl p-6 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)] flex flex-col justify-between">
            <div>
              <h3 className="font-semibold flex items-center gap-2 mb-4"><Compass className="h-4 w-4 text-info" /> Sector Intelligence</h3>
              
              <div className="p-4 rounded-xl border border-border/50 bg-background/25 space-y-4 mb-4">
                <div className="border-b border-border/30 pb-3">
                  <h4 className="font-bold text-foreground text-base">{activeSect.name}</h4>
                  <span className="text-xs text-muted-foreground mt-0.5">Primary Cultivation: <span className="font-semibold text-foreground">{activeSect.crop}</span></span>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="glass p-2.5 rounded-lg border border-border/40">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase block">NDVI Score</span>
                    <span className={`text-lg font-bold block mt-1 ${activeSect.id === 'sec-4' && scanResult ? 'text-destructive' : 'text-success'}`}>
                      {activeSect.id === 'sec-4' && scanResult ? '0.52 (Risk)' : activeSect.ndvi}
                    </span>
                  </div>
                  <div className="glass p-2.5 rounded-lg border border-border/40">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase block">Soil Moisture</span>
                    <span className="text-lg font-bold text-info block mt-1">{activeSect.moisture}%</span>
                  </div>
                  <div className="glass p-2.5 rounded-lg border border-border/40">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase block">Temperature</span>
                    <span className="text-lg font-bold text-warning block mt-1">{activeSect.temp}°C</span>
                  </div>
                  <div className="glass p-2.5 rounded-lg border border-border/40">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase block">System Status</span>
                    <span className={`text-[10px] font-bold uppercase tracking-wider block mt-2 ${activeSect.id === 'sec-4' && scanResult ? 'text-destructive' : 'text-success'}`}>
                      {activeSect.id === 'sec-4' && scanResult ? 'Anomaly Alert' : activeSect.status}
                    </span>
                  </div>
                </div>
              </div>

              {scanResult && (
                <div className="p-3.5 rounded-xl bg-destructive/10 border border-destructive/30 text-destructive text-xs space-y-1 backdrop-blur-sm animate-fade-in">
                  <div className="flex items-center gap-1.5 font-bold mb-1">
                    <AlertCircle className="h-4 w-4" /> CRITICAL CROP STRESS ANOMALY
                  </div>
                  <p className="leading-relaxed font-medium">{scanResult}</p>
                  <p className="text-[10px] text-muted-foreground mt-2 font-mono">Telemetry flagged field inspection to verify pathogen presence.</p>
                </div>
              )}
            </div>

            <div className="border-t border-border/30 pt-4 mt-4">
              <GradientButton 
                variant="outline" 
                onClick={() => {
                  setInspectionForm({ farmer: "Srinivas Rao", survey: "SRV-109/A", date: "Today, 4:00 PM" });
                  setShowInspectionModal(true);
                }} 
                className="w-full text-xs py-2 shadow-sm"
              >
                Schedule Field inspection
              </GradientButton>
            </div>
          </div>
        </div>
      )}

      {/* -------------------- TAB 5: SCHEME APPLICATIONS -------------------- */}
      {activeTab === "schemes" && (
        <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
          {/* Applications Analytics */}
          <div className="xl:col-span-2 glass rounded-3xl p-6 flex flex-col justify-between shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)]">
            <div>
              <h3 className="font-semibold flex items-center gap-2 mb-2"><Gift className="h-4 w-4 text-primary" /> Scheme Application Distribution</h3>
              <p className="text-xs text-muted-foreground mb-4">Pie chart showing referrals processing states in district registry.</p>
            </div>

            <div className="h-[240px] flex items-center justify-center relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={schemeDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {schemeDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ background:"oklch(0.16 0.02 160 / 0.8)", border:"1px solid oklch(0.30 0.03 160)", borderRadius: 12 }}/>
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="border-t border-border/30 pt-4">
              <div className="text-xs text-muted-foreground flex justify-between">
                <span>Total Active Referrals:</span>
                <span className="font-bold text-foreground">{referrals.length} Applications</span>
              </div>
            </div>
          </div>

          {/* Scheme Referrals Queue */}
          <div className="xl:col-span-3 glass rounded-3xl p-6 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)] flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-semibold flex items-center gap-2"><Users className="h-4 w-4 text-info" /> Scheme Referrals Board</h3>
                <p className="text-xs text-muted-foreground mt-0.5">Onboard eligible farmers onto central government benefits programs.</p>
              </div>
              <GradientButton onClick={() => setShowReferralModal(true)} className="text-xs py-1.5 px-3 shadow-md">
                + Onboard Referral
              </GradientButton>
            </div>

            <div className="flex-1 overflow-x-auto rounded-xl border border-border/50 bg-background/20 mb-4 max-h-[300px]">
              <table className="w-full text-xs text-left">
                <thead className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground bg-accent/30 border-b border-border/50">
                  <tr>
                    <th className="px-4 py-3">Farmer</th>
                    <th className="px-4 py-3">Benefit Program</th>
                    <th className="px-4 py-3">Date</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/30">
                  {referrals.map(ref => (
                    <tr key={ref.id} className="hover:bg-accent/10 transition">
                      <td className="px-4 py-3 font-semibold text-foreground">{ref.farmer}</td>
                      <td className="px-4 py-3 text-muted-foreground">{ref.scheme}</td>
                      <td className="px-4 py-3 text-muted-foreground font-mono">{ref.date}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${ref.status === 'Approved' ? 'bg-success/15 text-success' : ref.status === 'Under Review' ? 'bg-info/15 text-info' : 'bg-warning/15 text-warning'}`}>
                          {ref.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        {ref.status !== "Approved" && (
                          <button 
                            onClick={() => handleApproveReferral(ref.id, ref.farmer)} 
                            className="text-xs text-primary font-semibold hover:underline bg-primary/10 hover:bg-primary/20 px-2.5 py-1 rounded-lg transition"
                          >
                            Approve
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}


      {/* -------------------- TAB 6: FIELD INSPECTIONS -------------------- */}
      {activeTab === "inspections" && (
        <div className="glass rounded-3xl p-6 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)]">
          <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
            <div>
              <h3 className="text-xl font-bold flex items-center gap-2"><Calendar className="h-5 w-5 text-warning" /> Field Inspections & GPS Auditing</h3>
              <p className="text-sm text-muted-foreground mt-1">Audit farm lands using GPS check-in locks to authorize subsidies and scheme clearances.</p>
            </div>
            <GradientButton onClick={() => setShowInspectionModal(true)} className="text-xs py-2 px-4 shadow-lg">
              + Schedule Inspection Visit
            </GradientButton>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {inspections.map(isp => (
              <div key={isp.id} className={`p-5 rounded-2xl border transition ${isp.status === 'Checked-In' ? 'bg-success/5 border-success/30' : 'bg-background/25 border-border/50'} flex flex-col justify-between shadow-sm`}>
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] font-mono tracking-widest text-muted-foreground">{isp.id}</span>
                      <h4 className="font-bold text-sm text-foreground mt-0.5">{isp.farmer}</h4>
                      <p className="text-xs text-muted-foreground">Location Sector: {isp.village}</p>
                    </div>
                    <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${isp.status === 'Checked-In' ? 'bg-success/20 text-success' : 'bg-primary/20 text-primary'}`}>
                      {isp.status}
                    </span>
                  </div>

                  <div className="space-y-1.5 text-xs text-muted-foreground border-t border-border/30 pt-3 mb-4">
                    <div className="flex justify-between"><span className="font-medium">Land Survey No:</span><span className="text-foreground font-mono">{isp.survey}</span></div>
                    <div className="flex justify-between"><span className="font-medium">Scheduled Time:</span><span className="text-foreground flex items-center gap-1"><Clock className="h-3 w-3" /> {isp.date}</span></div>
                  </div>
                </div>

                <div className="pt-2 border-t border-border/20 mt-2">
                  {isp.status === "Scheduled" ? (
                    <GradientButton onClick={() => handleStartCheckIn(isp.id)} className="w-full text-xs py-1.5 shadow-sm">
                      <Compass className="h-3.5 w-3.5 mr-1.5" /> Check-In (Verify GPS Lock)
                    </GradientButton>
                  ) : (
                    <div className="flex items-center justify-center gap-1.5 text-xs text-success font-bold py-1.5 bg-success/10 border border-success/20 rounded-xl">
                      <CheckCircle className="h-4 w-4" /> Inspection Audited & Verified
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* -------------------- TAB 7: REPORTS UPLOADER -------------------- */}
      {activeTab === "reports" && (
        <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
          {/* Document Approvals Queue */}
          <div className="xl:col-span-3 glass rounded-3xl p-6 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)] flex flex-col justify-between">
            <div>
              <h3 className="font-semibold flex items-center gap-2 mb-2"><FileText className="h-4 w-4 text-primary" /> Reports Approval Queue</h3>
              <p className="text-xs text-muted-foreground mb-4">Approve localized crop reports and district surveys uploaded by cooperative representatives.</p>
            </div>

            <div className="flex-1 space-y-3 overflow-y-auto max-h-[360px] pr-1">
              {reportsList.map(rep => (
                <div key={rep.id} className={`p-4 rounded-xl border transition ${rep.status === 'Approved' ? 'bg-success/5 border-success/30' : rep.status === 'Rejected' ? 'bg-destructive/5 border-destructive/30' : 'bg-background/25 border-border/50'} flex justify-between items-center`}>
                  <div>
                    <h4 className="font-bold text-sm text-foreground">{rep.title}</h4>
                    <p className="text-xs text-muted-foreground mt-0.5">Author: {rep.author} · Date: <span className="font-mono">{rep.date}</span></p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${rep.status === 'Approved' ? 'bg-success/20 text-success' : rep.status === 'Rejected' ? 'bg-destructive/20 text-destructive' : 'bg-warning/20 text-warning'}`}>
                      {rep.status}
                    </span>
                    {rep.status === "Pending" && (
                      <div className="flex gap-1">
                        <button onClick={() => handleRejectReport(rep.id, rep.title)} className="p-1.5 rounded-lg border border-destructive/30 hover:bg-destructive/15 text-destructive transition-colors"><XCircle className="h-4 w-4" /></button>
                        <button onClick={() => handleApproveReport(rep.id, rep.title)} className="p-1.5 rounded-lg border border-success/30 hover:bg-success/15 text-success transition-colors"><CheckCircle2 className="h-4 w-4" /></button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Cryptographic Report Uploader */}
          <div className="xl:col-span-2 glass rounded-3xl p-6 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)] flex flex-col justify-between">
            <div>
              <h3 className="font-semibold flex items-center gap-2 mb-2"><UploadCloud className="h-4 w-4 text-info" /> District Report Upload</h3>
              <p className="text-xs text-muted-foreground mb-4">Select and upload yield telemetry documents to sync with the smart agricultural data registry.</p>
            </div>

            <div 
              onClick={() => { if (!isUploading) handleFileUploadSimulate(); }}
              className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition flex flex-col items-center justify-center py-10 ${isUploading ? 'bg-primary/5 border-primary/50' : 'border-border/60 hover:bg-accent/10 hover:border-primary/55'}`}
            >
              <Upload className="h-8 w-8 text-muted-foreground mb-3 group-hover:animate-bounce" />
              <h4 className="font-semibold text-sm">Select yield report file</h4>
              <p className="text-xs text-muted-foreground mt-1 max-w-[200px]">Click to browse or drop files here (PDF, XLSX up to 10MB)</p>

              {isUploading && (
                <div className="mt-5 w-full space-y-2">
                  <div className="flex justify-between text-[10px] font-mono text-primary font-bold">
                    <span>UPLOADING CROP_REPORT.PDF</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="w-full bg-background/50 h-1.5 rounded-full overflow-hidden border border-border/30">
                    <motion.div 
                      className="bg-gradient-primary h-full"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="text-[10px] text-muted-foreground text-center mt-3 font-mono">
              Files are audited for security signatures before uploading.
            </div>
          </div>
        </div>
      )}

      {/* -------------------- TAB 8: DISTRICT ANALYTICS -------------------- */}
      {activeTab === "analytics" && (
        <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
          {/* Crop yields bar chart */}
          <div className="xl:col-span-3 glass rounded-3xl p-6 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)]">
            <h3 className="font-semibold text-lg flex items-center gap-2 mb-2"><TrendingUp className="h-4 w-4 text-primary" /> Yield Comparison by Sectors</h3>
            <p className="text-xs text-muted-foreground mb-6">Compare season yield forecasts (in Metric Tons) for primary district crops.</p>

            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={cropDistribution}>
                  <CartesianGrid strokeDasharray="3 3" stroke="oklch(1 0 0 / 0.05)" vertical={false} />
                  <XAxis dataKey="name" stroke="oklch(0.68 0.02 150)" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="oklch(0.68 0.02 150)" fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ background:"oklch(0.16 0.02 160 / 0.8)", border:"1px solid oklch(0.30 0.03 160)", borderRadius: 12 }} />
                  <Legend />
                  <Bar dataKey="Wheat" fill="oklch(0.72 0.18 150)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Rice" fill="oklch(0.70 0.14 220)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Sugarcane" fill="oklch(0.78 0.16 75)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Seasonal Health Area Chart */}
          <div className="xl:col-span-2 glass rounded-3xl p-6 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)]">
            <h3 className="font-semibold text-lg flex items-center gap-2 mb-2"><Activity className="h-4 w-4 text-info" /> Seasonal Climate & NDVI Index</h3>
            <p className="text-xs text-muted-foreground mb-6">NDVI Vegetation index growth plotted against average soil moisture %.</p>

            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={seasonalHealth}>
                  <defs>
                    <linearGradient id="ndviColor" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="oklch(0.72 0.18 150)" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="oklch(0.72 0.18 150)" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="moistColor" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="oklch(0.70 0.14 220)" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="oklch(0.70 0.14 220)" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="oklch(1 0 0 / 0.05)" vertical={false} />
                  <XAxis dataKey="month" stroke="oklch(0.68 0.02 150)" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="oklch(0.68 0.02 150)" fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ background:"oklch(0.16 0.02 160 / 0.8)", border:"1px solid oklch(0.30 0.03 160)", borderRadius: 12 }} />
                  <Legend />
                  <Area type="monotone" dataKey="ndvi" name="NDVI Health" stroke="oklch(0.72 0.18 150)" fillOpacity={1} fill="url(#ndviColor)" strokeWidth={2} />
                  <Area type="monotone" dataKey="moisture" name="Soil Moisture Index (norm)" stroke="oklch(0.70 0.14 220)" fillOpacity={1} fill="url(#moistColor)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* -------------------- MOCK MODALS & INTERACTIVE OVERLAYS -------------------- */}
      
      {/* 1. GPS Check-In Overlay Modal */}
      <AnimatePresence>
        {checkingInId && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-background/80 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="glass-strong rounded-3xl max-w-sm w-full p-6 border border-border text-center space-y-6">
              <div className="flex justify-center">
                {checkInStep === 1 && (
                  <div className="relative">
                    <div className="absolute inset-0 bg-primary/20 blur-md rounded-full animate-ping" />
                    <div className="h-16 w-16 rounded-full bg-primary/10 border-2 border-primary flex items-center justify-center"><Loader2 className="h-8 w-8 text-primary animate-spin" /></div>
                  </div>
                )}
                {checkInStep === 2 && (
                  <div className="relative">
                    <div className="absolute inset-0 bg-warning/20 blur-md rounded-full animate-ping" />
                    <div className="h-16 w-16 rounded-full bg-warning/10 border-2 border-warning flex items-center justify-center text-warning"><Compass className="h-8 w-8 animate-bounce" /></div>
                  </div>
                )}
                {checkInStep === 3 && (
                  <div className="relative">
                    <div className="absolute inset-0 bg-success/20 blur-md rounded-full" />
                    <div className="h-16 w-16 rounded-full bg-success/10 border-2 border-success flex items-center justify-center text-success"><CheckCircle2 className="h-8 w-8" /></div>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-lg text-foreground">
                  {checkInStep === 1 && "Accessing GPS Satellites..."}
                  {checkInStep === 2 && "Acquiring Coordinates..."}
                  {checkInStep === 3 && "Verification Complete"}
                </h4>
                <p className="text-xs text-muted-foreground max-w-[250px] mx-auto leading-relaxed">
                  {checkInStep === 1 && "Verifying cryptographic telemetry tokens and mobile base station handshake..."}
                  {checkInStep === 2 && "GPS Lock Established: Lat 28.535, Long 77.391. Accuracy: 2.1 meters. Comparing bounds..."}
                  {checkInStep === 3 && "GPS check-in verified successfully. Location matches Survey SRV bounds. Cryptographic audit signed."}
                </p>
              </div>

              {checkInStep === 3 && (
                <GradientButton onClick={handleCompleteCheckIn} className="w-full py-2">
                  Complete Verification & Check-In
                </GradientButton>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. Referral Modal */}
      <AnimatePresence>
        {showReferralModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-background/70 backdrop-blur flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="glass-strong rounded-3xl w-full max-w-md p-6 border border-border">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-base">New Scheme Referral</h3>
                <button onClick={() => setShowReferralModal(false)} className="p-1 text-muted-foreground hover:text-foreground hover:bg-accent/40 rounded-lg"><XCircle className="h-5 w-5" /></button>
              </div>
              <form onSubmit={handleAddReferral} className="space-y-4 text-sm">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-1">Farmer Name</label>
                  <input 
                    required 
                    value={referralForm.farmer} 
                    onChange={e => setReferralForm({ ...referralForm, farmer: e.target.value })}
                    className="w-full glass rounded-xl px-4 py-2.5 text-sm outline-none border border-border focus:ring-2 focus:ring-primary/50 text-foreground"
                    placeholder="Enter farmer name"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-1">Beneficiary Scheme</label>
                  <select 
                    value={referralForm.scheme} 
                    onChange={e => setReferralForm({ ...referralForm, scheme: e.target.value })}
                    className="w-full glass rounded-xl px-4 py-2.5 text-sm outline-none border border-border focus:ring-2 focus:ring-primary/50 bg-background text-foreground"
                  >
                    <option value="PM-KISAN Benefits">PM-KISAN Subsidies</option>
                    <option value="Agri-Infrastructure Fund">Agri-Infrastructure Fund</option>
                    <option value="Weather-based Insurance">Weather-based Crop Insurance</option>
                  </select>
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button type="button" onClick={() => setShowReferralModal(false)} className="px-4 py-2 rounded-xl text-xs hover:bg-accent/40 text-muted-foreground">Cancel</button>
                  <GradientButton type="submit" className="text-xs">Submit Referral</GradientButton>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3. Inspection Scheduler Modal */}
      <AnimatePresence>
        {showInspectionModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-background/70 backdrop-blur flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="glass-strong rounded-3xl w-full max-w-md p-6 border border-border">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-base">Schedule Field Inspection</h3>
                <button onClick={() => setShowInspectionModal(false)} className="p-1 text-muted-foreground hover:text-foreground hover:bg-accent/40 rounded-lg"><XCircle className="h-5 w-5" /></button>
              </div>
              <form onSubmit={handleAddInspection} className="space-y-4 text-sm">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-1">Farmer Name</label>
                  <input 
                    required 
                    value={inspectionForm.farmer} 
                    onChange={e => setInspectionForm({ ...inspectionForm, farmer: e.target.value })}
                    className="w-full glass rounded-xl px-4 py-2.5 text-sm outline-none border border-border focus:ring-2 focus:ring-primary/50 text-foreground"
                    placeholder="Enter farmer name"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-1">Land Survey Number</label>
                  <input 
                    required 
                    value={inspectionForm.survey} 
                    onChange={e => setInspectionForm({ ...inspectionForm, survey: e.target.value })}
                    className="w-full glass rounded-xl px-4 py-2.5 text-sm outline-none border border-border focus:ring-2 focus:ring-primary/50 text-foreground font-mono"
                    placeholder="e.g. SRV-109/A"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-1">Schedule Date & Time</label>
                  <input 
                    type="text"
                    value={inspectionForm.date} 
                    onChange={e => setInspectionForm({ ...inspectionForm, date: e.target.value })}
                    className="w-full glass rounded-xl px-4 py-2.5 text-sm outline-none border border-border focus:ring-2 focus:ring-primary/50 text-foreground"
                    placeholder="e.g. Today, 04:30 PM"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button type="button" onClick={() => setShowInspectionModal(false)} className="px-4 py-2 rounded-xl text-xs hover:bg-accent/40 text-muted-foreground">Cancel</button>
                  <GradientButton type="submit" className="text-xs">Schedule Visit</GradientButton>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AppLayout>
  );
}

function Dashboard() {
  const navigate = useNavigate();
  const { data: user, isLoading } = useQuery({
    queryKey: ["me"],
    queryFn: async () => {
      const response = await api.get("/auth/me");
      return response.data.data;
    },
    retry: false,
  });

  const search = Route.useSearch() as any;
  const activeTab = search.tab || "dashboard";

  useEffect(() => {
    if (!isLoading && !user) {
      navigate({ to: "/login" });
    } else if (user) {
      localStorage.setItem("userRole", user.role);
    }
  }, [user, isLoading, navigate]);

  if (isLoading) {
    return (
      <AppLayout title="Dashboard">
        <div className="flex items-center justify-center h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </AppLayout>
    );
  }

  if (!user) {
    return null;
  }

  const role = user.role;

  if (role === "farmer") {
    return <FarmerDashboard activeTab={activeTab} />;
  }

  if (role === "officer") {
    return <OfficerDashboard activeTab={activeTab} />;
  }

  return <AdminDashboard />;
}

