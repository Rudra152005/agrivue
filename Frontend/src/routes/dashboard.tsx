import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  Users, MapPin, Gift, Plane, AlertTriangle, Sprout,
  ArrowUpRight, Activity, Plus, Download, MoreHorizontal, Loader2
} from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
  RadialBarChart, RadialBar, PolarAngleAxis, BarChart, Bar, CartesianGrid,
} from "recharts";
import { AppLayout } from "@/components/layout/AppLayout";
import { StatCard } from "@/components/ui-kit/StatCard";
import { GradientButton } from "@/components/ui-kit/GradientButton";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { AnalyticsData, Farmer } from "@/lib/types";

export const Route = createFileRoute("/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — Agri-TrekOps" }] }),
  component: Dashboard,
});

const cropData = [
  { m: "Jan", h: 72, y: 65 }, { m: "Feb", h: 78, y: 70 }, { m: "Mar", h: 81, y: 75 },
  { m: "Apr", h: 85, y: 80 }, { m: "May", h: 88, y: 84 }, { m: "Jun", h: 92, y: 89 },
  { m: "Jul", h: 94, y: 91 }, { m: "Aug", h: 90, y: 87 },
];
const surveyData = [
  { d: "Mon", s: 24 }, { d: "Tue", s: 32 }, { d: "Wed", s: 28 },
  { d: "Thu", s: 40 }, { d: "Fri", s: 36 }, { d: "Sat", s: 22 }, { d: "Sun", s: 18 },
];

function Dashboard() {
  const { data: analytics, isLoading: isAnalyticsLoading } = useQuery<AnalyticsData>({
    queryKey: ["analytics"],
    queryFn: async () => {
      const response = await api.get("/analytics");
      return response.data.data;
    },
  });

  const { data: farmers, isLoading: isFarmersLoading } = useQuery<Farmer[]>({
    queryKey: ["farmers", { limit: 5 }],
    queryFn: async () => {
      const response = await api.get("/farmers?limit=5");
      return response.data.data;
    },
  });

  const stats = [
    { label: "Total Farmers", value: analytics?.totalFarmers || 0, icon: Users, trend: "+8.2% MoM" },
    { label: "Land Records", value: analytics?.totalLandArea || 0, icon: MapPin, trend: "+3.4%", accent: "info" as const },
    { label: "Active Schemes", value: analytics?.applicationsByStatus?.find(a => a._id === 'approved')?.count || 0, icon: Gift, trend: "+2 new", accent: "warning" as const },
    { label: "Aerial Surveys", value: 1284, icon: Plane, trend: "+12% wk", accent: "info" as const },
    { label: "Active Alerts", value: 17, icon: AlertTriangle, trend: "3 critical", accent: "destructive" as const },
    { label: "Crop Health", value: Math.round(analytics?.averageCropHealth || 0), suffix: "%", icon: Sprout, trend: "+1.2%" },
  ];

  if (isAnalyticsLoading || isFarmersLoading) {
    return (
      <AppLayout title="Dashboard">
        <div className="flex items-center justify-center h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout title="Dashboard">
      <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
        <div>
          <h2 className="text-2xl font-bold">Operations Overview</h2>
          <p className="text-sm text-muted-foreground">Real-time field intelligence across all sectors.</p>
        </div>
        <div className="flex gap-2">
          <GradientButton variant="outline"><Download className="h-4 w-4"/> Export</GradientButton>
          <GradientButton><Plus className="h-4 w-4"/> Quick Action</GradientButton>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {stats.map((stat, i) => (
          <StatCard key={i} {...stat} />
        ))}
      </div>

      <div className="mt-6 grid grid-cols-1 xl:grid-cols-3 gap-5">
        <div className="xl:col-span-2 glass rounded-2xl p-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold">Crop health & yield trend</h3>
              <p className="text-xs text-muted-foreground">Last 8 months · Sector avg</p>
            </div>
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-primary"/>Health</span>
              <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-info"/>Yield</span>
            </div>
          </div>
          <div className="mt-4 h-72">
            <ResponsiveContainer>
              <AreaChart data={cropData}>
                <defs>
                  <linearGradient id="g1" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="oklch(0.78 0.20 145)" stopOpacity={0.6} />
                    <stop offset="100%" stopColor="oklch(0.78 0.20 145)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="g2" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="oklch(0.70 0.14 220)" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="oklch(0.70 0.14 220)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="oklch(1 0 0 / 0.05)" vertical={false}/>
                <XAxis dataKey="m" stroke="oklch(0.68 0.02 150)" fontSize={11} tickLine={false} axisLine={false}/>
                <YAxis stroke="oklch(0.68 0.02 150)" fontSize={11} tickLine={false} axisLine={false}/>
                <Tooltip contentStyle={{ background:"oklch(0.16 0.02 160)", border:"1px solid oklch(0.30 0.03 160)", borderRadius: 12 }}/>
                <Area dataKey="h" stroke="oklch(0.78 0.20 145)" strokeWidth={2.5} fill="url(#g1)" />
                <Area dataKey="y" stroke="oklch(0.70 0.14 220)" strokeWidth={2.5} fill="url(#g2)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass rounded-2xl p-5">
          <h3 className="font-semibold">Crop health score</h3>
          <p className="text-xs text-muted-foreground">Weighted across all fields</p>
          <div className="h-60 -mt-2">
            <ResponsiveContainer>
              <RadialBarChart innerRadius="65%" outerRadius="95%" data={[{ v: 94, fill: "oklch(0.78 0.20 145)" }]} startAngle={90} endAngle={-270}>
                <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
                <RadialBar dataKey="v" cornerRadius={20} background={{ fill: "oklch(0.24 0.03 160 / 0.5)" }} />
              </RadialBarChart>
            </ResponsiveContainer>
            <div className="-mt-44 text-center">
              <div className="text-4xl font-bold text-gradient">94<span className="text-xl">%</span></div>
              <div className="text-xs text-muted-foreground mt-1">Excellent</div>
            </div>
          </div>
          <div className="mt-20 grid grid-cols-3 gap-2 text-center">
            {[{l:"Wheat",v:"96%"},{l:"Rice",v:"91%"},{l:"Cotton",v:"89%"}].map(x=>(
              <div key={x.l} className="glass rounded-xl p-2"><div className="text-sm font-bold">{x.v}</div><div className="text-[10px] text-muted-foreground">{x.l}</div></div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 xl:grid-cols-3 gap-5">
        <div className="xl:col-span-2 glass rounded-2xl p-5">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Aerial trajectory · Sector 7 (live)</h3>
            <span className="flex items-center gap-1.5 text-xs"><span className="h-2 w-2 rounded-full bg-success animate-pulse"/>Streaming</span>
          </div>
          <div className="mt-4 relative h-72 rounded-2xl overflow-hidden bg-gradient-to-br from-emerald/15 via-info/10 to-transparent border border-border">
            <div className="absolute inset-0 grid-bg opacity-50" />
            {[
              {c:"oklch(0.78 0.20 75 / 0.5)",x:"15%",y:"30%",s:160},
              {c:"oklch(0.72 0.18 150 / 0.5)",x:"55%",y:"50%",s:200},
              {c:"oklch(0.62 0.22 25 / 0.45)",x:"75%",y:"15%",s:130},
              {c:"oklch(0.70 0.14 220 / 0.45)",x:"30%",y:"70%",s:170},
            ].map((b,i)=>(
              <motion.div key={i} className="absolute rounded-full blur-2xl" style={{background:b.c,left:b.x,top:b.y,width:b.s,height:b.s}} animate={{scale:[1,1.15,1]}} transition={{duration:4+i,repeat:Infinity}}/>
            ))}
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 600 300">
              <motion.path d="M30,260 C120,40 280,280 340,140 S540,40 580,220" stroke="oklch(0.85 0.20 145)" strokeWidth="2.5" fill="none" initial={{pathLength:0}} animate={{pathLength:1}} transition={{duration:4,repeat:Infinity,repeatType:"reverse"}}/>
              {[[80,200],[180,120],[280,180],[400,100],[520,200]].map(([x,y],i)=>(
                <circle key={i} cx={x} cy={y} r="5" fill="oklch(0.85 0.20 145)"><animate attributeName="r" values="3;7;3" dur="2s" begin={`${i*0.3}s`} repeatCount="indefinite"/></circle>
              ))}
            </svg>
            <motion.div className="absolute top-4 left-4 text-primary" animate={{x:[0,460,0],y:[0,140,0]}} transition={{duration:10,repeat:Infinity,ease:"easeInOut"}}>
              <Plane className="h-6 w-6" />
            </motion.div>
          </div>
        </div>

        <div className="glass rounded-2xl p-5">
          <h3 className="font-semibold">Weekly aerial surveys</h3>
          <p className="text-xs text-muted-foreground">Drone deployments</p>
          <div className="mt-4 h-60">
            <ResponsiveContainer>
              <BarChart data={surveyData}>
                <CartesianGrid stroke="oklch(1 0 0 / 0.05)" vertical={false}/>
                <XAxis dataKey="d" stroke="oklch(0.68 0.02 150)" fontSize={11} tickLine={false} axisLine={false}/>
                <YAxis stroke="oklch(0.68 0.02 150)" fontSize={11} tickLine={false} axisLine={false}/>
                <Tooltip contentStyle={{ background:"oklch(0.16 0.02 160)", border:"1px solid oklch(0.30 0.03 160)", borderRadius: 12 }}/>
                <Bar dataKey="s" radius={[8,8,0,0]} fill="oklch(0.72 0.18 150)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 xl:grid-cols-3 gap-5">
        <div className="xl:col-span-2 glass rounded-2xl p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold">Recent farmer records</h3>
            <Link to="/farmers" className="text-xs text-primary inline-flex items-center gap-1">View all <ArrowUpRight className="h-3 w-3"/></Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-xs uppercase tracking-wider text-muted-foreground">
                <tr><th className="text-left py-2">Farmer</th><th className="text-left">Village</th><th className="text-left">Land</th><th className="text-left">Status</th><th></th></tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {farmers?.map((f)=>(
                  <tr key={f._id} className="hover:bg-accent/20 transition">
                    <td className="py-3 flex items-center gap-2.5">
                      <div className="h-8 w-8 rounded-full bg-gradient-primary text-primary-foreground text-xs font-bold flex items-center justify-center">
                        {typeof f.user === 'object' ? f.user.name[0] : 'F'}
                      </div>
                      {typeof f.user === 'object' ? f.user.name : 'Unknown'}
                    </td>
                    <td>{f.village}</td>
                    <td>{f.landSize} acres</td>
                    <td>
                      <span className={`text-xs px-2 py-1 rounded-full ${f.beneficiaryStatus==="active"?"bg-success/15 text-success":f.beneficiaryStatus==="pending"?"bg-warning/15 text-warning":"bg-info/15 text-info"}`}>
                        {f.beneficiaryStatus}
                      </span>
                    </td>
                    <td className="text-right"><MoreHorizontal className="h-4 w-4 text-muted-foreground inline"/></td>
                  </tr>
                ))}
                {farmers?.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-10 text-center text-muted-foreground italic">No farmer records found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="glass rounded-2xl p-5">
          <h3 className="font-semibold">Recent notifications</h3>
          <ul className="mt-4 space-y-3">
            {[
              {i:Activity,t:"Drone A12 returned to base",d:"2m ago",c:"info"},
              {i:Sprout,t:"Crop health spike in Sector 4",d:"18m ago",c:"success"},
              {i:AlertTriangle,t:"Soil moisture critical · Sector 9",d:"1h ago",c:"warning"},
              {i:Gift,t:"PM-Kisan deadline in 3 days",d:"3h ago",c:"info"},
              {i:Users,t:"42 farmers onboarded today",d:"5h ago",c:"success"},
            ].map((n,i)=>(
              <li key={i} className="flex items-start gap-3">
                <div className={`p-2 rounded-xl glass`}><n.i className={`h-4 w-4 ${n.c==="success"?"text-success":n.c==="warning"?"text-warning":"text-info"}`}/></div>
                <div className="flex-1">
                  <div className="text-sm">{n.t}</div>
                  <div className="text-xs text-muted-foreground">{n.d}</div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </AppLayout>
  );
}
