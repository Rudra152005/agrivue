import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/layout/AppLayout";
import { ResponsiveContainer, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from "recharts";

export const Route = createFileRoute("/analytics")({
  head: () => ({ meta: [{ title: "Analytics — Agri-TrekOps" }] }),
  component: AnalyticsPage,
});

const growth = Array.from({length:12}).map((_,i)=>({m:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][i],a:60+i*2.5,b:55+i*2}));
const dist = [
  { name: "PM-Kisan", value: 38, color: "oklch(0.78 0.20 145)" },
  { name: "Crop Insurance", value: 24, color: "oklch(0.70 0.14 220)" },
  { name: "Soil Health", value: 18, color: "oklch(0.78 0.16 75)" },
  { name: "KCC", value: 12, color: "oklch(0.65 0.18 280)" },
  { name: "Others", value: 8, color: "oklch(0.55 0.10 160)" },
];
const utilization = [
  { s: "S1", u: 78 },{ s: "S2", u: 84 },{ s: "S3", u: 62 },{ s: "S4", u: 91 },
  { s: "S5", u: 70 },{ s: "S6", u: 88 },{ s: "S7", u: 95 },{ s: "S8", u: 72 },
];

function AnalyticsPage() {
  return (
    <AppLayout title="Analytics">
      <div className="grid lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 glass rounded-2xl p-5">
          <h3 className="font-semibold">Crop growth & yield · 12 months</h3>
          <div className="h-80 mt-3">
            <ResponsiveContainer>
              <AreaChart data={growth}>
                <defs>
                  <linearGradient id="ga" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="oklch(0.78 0.20 145)" stopOpacity={0.6}/><stop offset="100%" stopColor="oklch(0.78 0.20 145)" stopOpacity={0}/></linearGradient>
                  <linearGradient id="gb" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="oklch(0.70 0.14 220)" stopOpacity={0.5}/><stop offset="100%" stopColor="oklch(0.70 0.14 220)" stopOpacity={0}/></linearGradient>
                </defs>
                <CartesianGrid stroke="oklch(1 0 0 / 0.05)" vertical={false}/>
                <XAxis dataKey="m" stroke="oklch(0.68 0.02 150)" fontSize={11} tickLine={false} axisLine={false}/>
                <YAxis stroke="oklch(0.68 0.02 150)" fontSize={11} tickLine={false} axisLine={false}/>
                <Tooltip contentStyle={{ background:"oklch(0.16 0.02 160)", border:"1px solid oklch(0.30 0.03 160)", borderRadius: 12 }}/>
                <Area dataKey="a" stroke="oklch(0.78 0.20 145)" strokeWidth={2.5} fill="url(#ga)"/>
                <Area dataKey="b" stroke="oklch(0.70 0.14 220)" strokeWidth={2.5} fill="url(#gb)"/>
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="glass rounded-2xl p-5">
          <h3 className="font-semibold">Scheme distribution</h3>
          <div className="h-80">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={dist} dataKey="value" nameKey="name" innerRadius={60} outerRadius={95} paddingAngle={3}>
                  {dist.map((d,i)=><Cell key={i} fill={d.color}/>)}
                </Pie>
                <Tooltip contentStyle={{ background:"oklch(0.16 0.02 160)", border:"1px solid oklch(0.30 0.03 160)", borderRadius: 12 }}/>
                <Legend wrapperStyle={{fontSize:11}}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="mt-6 grid lg:grid-cols-2 gap-5">
        <div className="glass rounded-2xl p-5">
          <h3 className="font-semibold">Land utilization · by sector</h3>
          <div className="h-72 mt-3">
            <ResponsiveContainer>
              <BarChart data={utilization}>
                <CartesianGrid stroke="oklch(1 0 0 / 0.05)" vertical={false}/>
                <XAxis dataKey="s" stroke="oklch(0.68 0.02 150)" fontSize={11} tickLine={false} axisLine={false}/>
                <YAxis stroke="oklch(0.68 0.02 150)" fontSize={11} tickLine={false} axisLine={false}/>
                <Tooltip contentStyle={{ background:"oklch(0.16 0.02 160)", border:"1px solid oklch(0.30 0.03 160)", borderRadius: 12 }}/>
                <Bar dataKey="u" radius={[8,8,0,0]} fill="oklch(0.72 0.18 150)"/>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="glass rounded-2xl p-5">
          <h3 className="font-semibold">Revenue analytics</h3>
          <div className="mt-4 grid grid-cols-2 gap-3">
            {[
              {l:"Total disbursed",v:"₹ 14.8 Cr",t:"+12%"},
              {l:"Avg per farmer",v:"₹ 11,840",t:"+4.1%"},
              {l:"Insurance claims",v:"₹ 2.3 Cr",t:"-2.4%"},
              {l:"Subsidy efficiency",v:"92%",t:"+1.6%"},
            ].map(x=>(
              <div key={x.l} className="glass rounded-xl p-4">
                <div className="text-xs uppercase tracking-wider text-muted-foreground">{x.l}</div>
                <div className="mt-1 text-xl font-bold">{x.v}</div>
                <div className="text-xs text-success mt-0.5">{x.t}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
