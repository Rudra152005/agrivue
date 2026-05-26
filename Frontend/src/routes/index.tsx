import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { motion } from "framer-motion";
import {
  Leaf, Plane, Users, Activity, ShieldCheck, Sprout, MapPin, Gift,
  ArrowRight, ChevronRight, Zap, BarChart3, Cpu, Github, Twitter, Linkedin,
} from "lucide-react";
import { GradientButton } from "@/components/ui-kit/GradientButton";
import { AnimatedCounter } from "@/components/ui-kit/StatCard";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Agri-TrekOps — Smart Agriculture Powered by AI & DevOps" },
      { name: "description", content: "Enterprise smart-agriculture SaaS: aerial drone monitoring, farmer management, beneficiary schemes, and live crop analytics." },
      { property: "og:title", content: "Agri-TrekOps" },
      { property: "og:description", content: "Smart Agriculture Powered by AI & DevOps" },
    ],
  }),
  component: Landing,
});

function Nav() {
  const { data: user } = useQuery({
    queryKey: ["me"],
    queryFn: async () => {
      const response = await api.get("/auth/me");
      return response.data.data;
    },
    retry: false,
    enabled: typeof window !== "undefined" && !!localStorage.getItem("token"),
  });

  return (
    <nav className="sticky top-0 z-50 glass-strong border-b border-border">
      <div className="max-w-7xl mx-auto h-16 px-4 sm:px-8 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="bg-gradient-primary p-2 rounded-xl glow"><Leaf className="h-4 w-4 text-primary-foreground" /></div>
          <span className="font-bold text-lg">Agri-TrekOps</span>
        </Link>
        <div className="hidden md:flex items-center gap-7 text-sm text-muted-foreground">
          <a href="#features" className="hover:text-foreground">Features</a>
          <a href="#showcase" className="hover:text-foreground">Drone</a>
          <a href="#schemes" className="hover:text-foreground">Schemes</a>
          <a href="#tech" className="hover:text-foreground">Technology</a>
        </div>
        <div className="flex items-center gap-3">
          {user ? (
            <Link to="/dashboard" className="flex items-center gap-2.5 focus:outline-none hover:opacity-90 transition-opacity">
              <div className="h-9 w-9 rounded-full bg-gradient-primary flex items-center justify-center text-primary-foreground font-bold text-sm shadow-md relative">
                {user.name?.[0]?.toUpperCase() || 'U'}
                <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-success border-2 border-background animate-pulse" />
              </div>
              <span className="hidden sm:inline-block text-sm font-semibold text-foreground hover:text-primary transition-colors">{user.name}</span>
            </Link>
          ) : (
            <>
              <Link to="/login"><GradientButton variant="ghost">Log in</GradientButton></Link>
              <Link to="/dashboard"><GradientButton>Launch app <ArrowRight className="h-4 w-4" /></GradientButton></Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-50" />
      <div className="absolute top-1/3 -left-32 h-96 w-96 rounded-full bg-primary/20 blur-3xl" />
      <div className="absolute top-10 right-0 h-96 w-96 rounded-full bg-info/15 blur-3xl" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-8 py-20 lg:py-28 grid lg:grid-cols-2 gap-12 items-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
          <div className="inline-flex items-center gap-2 glass rounded-full px-3 py-1.5 text-xs">
            <span className="h-2 w-2 rounded-full bg-success animate-pulse" />
            Live monitoring · 248 drones online
          </div>
          <h1 className="mt-5 text-5xl lg:text-6xl font-bold leading-[1.05]">
            Smart Agriculture <br />
            <span className="text-gradient">Powered by AI & DevOps</span>
          </h1>
          <p className="mt-5 text-lg text-muted-foreground max-w-xl">
            A unified command center for farmers, officers, and policy-makers — combining
            aerial intelligence, scheme distribution, and real-time crop analytics.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/dashboard"><GradientButton>Explore Platform <ArrowRight className="h-4 w-4" /></GradientButton></Link>
            <Link to="/aerial"><GradientButton variant="outline"><Plane className="h-4 w-4" /> Live Monitoring</GradientButton></Link>
          </div>
          <div className="mt-10 grid grid-cols-3 gap-4 max-w-md">
            {[
              { v: 12450, l: "Farmers" },
              { v: 248, l: "Drones" },
              { v: 99.8, l: "Uptime %", d: 1 },
            ].map((s) => (
              <div key={s.l} className="glass rounded-xl p-3">
                <div className="text-2xl font-bold text-gradient"><AnimatedCounter value={s.v} decimals={s.d || 0} /></div>
                <div className="text-xs text-muted-foreground mt-1">{s.l}</div>
              </div>
            ))}
          </div>
        </motion.div>
        <HeroVisual />
      </div>
    </section>
  );
}

function HeroVisual() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, delay: 0.1 }}
      className="relative aspect-[5/4]"
    >
      {/* dashboard preview card */}
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute inset-4 glass-strong rounded-3xl p-5 border border-border overflow-hidden"
        style={{ boxShadow: "var(--shadow-elegant)" }}
      >
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Aerial Trajectory · Sector 7</span>
          <span className="flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />Live</span>
        </div>
        <div className="mt-3 relative h-44 rounded-2xl overflow-hidden bg-gradient-to-br from-emerald/20 via-info/10 to-transparent border border-border">
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 200">
            <defs>
              <linearGradient id="path" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="oklch(0.85 0.20 145)" />
                <stop offset="100%" stopColor="oklch(0.70 0.14 195)" />
              </linearGradient>
            </defs>
            <motion.path
              d="M20,160 C80,40 180,180 230,90 S360,40 380,140"
              stroke="url(#path)" strokeWidth="2.5" fill="none"
              initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
              transition={{ duration: 3, repeat: Infinity, repeatType: "reverse" }}
            />
            {[ [60,120],[140,90],[220,110],[300,80],[360,130] ].map(([x,y],i)=>(
              <circle key={i} cx={x} cy={y} r="4" fill="oklch(0.85 0.20 145)">
                <animate attributeName="r" values="3;6;3" dur="2s" begin={`${i*0.3}s`} repeatCount="indefinite" />
              </circle>
            ))}
          </svg>
          <motion.div
            className="absolute -top-2 left-1/4 text-primary"
            animate={{ x: [0, 240, 0], y: [0, 30, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          >
            <Plane className="h-6 w-6" />
          </motion.div>
        </div>
        <div className="mt-3 grid grid-cols-3 gap-2">
          {[
            { l: "Crop Health", v: "94%" },
            { l: "Soil Moisture", v: "67%" },
            { l: "Coverage", v: "12.4 ha" },
          ].map((s) => (
            <div key={s.l} className="glass rounded-xl p-2.5">
              <div className="text-[10px] text-muted-foreground uppercase tracking-wider">{s.l}</div>
              <div className="text-base font-bold text-foreground">{s.v}</div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* floating cards */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -left-2 bottom-10 glass-strong rounded-2xl p-3 w-44 border border-border"
        style={{ boxShadow: "var(--shadow-glow)" }}
      >
        <div className="flex items-center gap-2 text-xs">
          <Sprout className="h-4 w-4 text-success" /> Crop Alert
        </div>
        <div className="mt-1 text-sm font-semibold">Wheat field +2.4%</div>
        <div className="text-[10px] text-muted-foreground">Sector 4 · 4h ago</div>
      </motion.div>
      <motion.div
        animate={{ y: [0, -12, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -right-2 top-12 glass-strong rounded-2xl p-3 w-48 border border-border"
        style={{ boxShadow: "var(--shadow-glow)" }}
      >
        <div className="flex items-center gap-2 text-xs">
          <Activity className="h-4 w-4 text-info" /> Drone-A12
        </div>
        <div className="mt-1 text-sm font-semibold">Survey complete</div>
        <div className="text-[10px] text-muted-foreground">Battery 78% · ETA 4m</div>
      </motion.div>
    </motion.div>
  );
}

function Features() {
  const items = [
    { icon: Plane, t: "Aerial Drone Trajectories", d: "Real-time tracking, geofencing, and replay of drone surveys across sectors." },
    { icon: Users, t: "Farmer Management", d: "Centralized farmer profiles, KYC, land ownership, and scheme eligibility." },
    { icon: Sprout, t: "Crop Health AI", d: "NDVI heatmaps, disease detection, and yield prediction at field level." },
    { icon: Gift, t: "Beneficiary Schemes", d: "Application tracking, deadlines, and automated eligibility checks." },
    { icon: BarChart3, t: "Analytics & Reports", d: "Interactive dashboards, exports, and policy-grade insights." },
    { icon: ShieldCheck, t: "Role-based Access", d: "Admin, Officer, and Farmer roles with audit-ready security." },
  ];
  return (
    <section id="features" className="max-w-7xl mx-auto px-4 sm:px-8 py-20">
      <div className="max-w-2xl">
        <div className="text-xs uppercase tracking-widest text-primary">Platform</div>
        <h2 className="mt-2 text-4xl font-bold">Built for the field, designed for the cloud</h2>
        <p className="mt-3 text-muted-foreground">Modular capabilities engineered for nationwide rollouts.</p>
      </div>
      <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {items.map((it, i) => (
          <motion.div
            key={it.t}
            initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.05 }} viewport={{ once: true }}
            whileHover={{ y: -4 }}
            className="glass rounded-2xl p-6 glow-hover"
          >
            <div className="inline-flex p-2.5 rounded-xl bg-gradient-primary glow">
              <it.icon className="h-5 w-5 text-primary-foreground" />
            </div>
            <h3 className="mt-4 text-lg font-semibold">{it.t}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{it.d}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function Showcase() {
  return (
    <section id="showcase" className="relative max-w-7xl mx-auto px-4 sm:px-8 py-20">
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <div className="text-xs uppercase tracking-widest text-primary">Aerial Showcase</div>
          <h2 className="mt-2 text-4xl font-bold">Drones that see what eyes can't</h2>
          <p className="mt-3 text-muted-foreground">
            Multispectral imaging, edge inference, and live trajectory replay — all in one operations cockpit.
          </p>
          <ul className="mt-6 space-y-3 text-sm">
            {["Live geofenced flight paths", "Per-field crop heatmaps", "Battery & signal telemetry", "Auto-generated survey reports"].map(t => (
              <li key={t} className="flex items-center gap-2"><ChevronRight className="h-4 w-4 text-primary" />{t}</li>
            ))}
          </ul>
          <Link to="/aerial" className="mt-8 inline-block"><GradientButton>Open Aerial Console <ArrowRight className="h-4 w-4" /></GradientButton></Link>
        </div>
        <div className="glass-strong rounded-3xl p-6 relative overflow-hidden border border-border" style={{boxShadow:"var(--shadow-elegant)"}}>
          <div className="aspect-square rounded-2xl bg-gradient-to-br from-emerald/30 via-info/10 to-transparent relative overflow-hidden">
            <div className="absolute inset-0 grid-bg opacity-60" />
            {/* heatmap blobs */}
            {[
              { c: "oklch(0.78 0.20 75 / 0.5)", x: "20%", y: "30%", s: 180 },
              { c: "oklch(0.72 0.18 150 / 0.55)", x: "60%", y: "55%", s: 220 },
              { c: "oklch(0.62 0.22 25 / 0.45)", x: "75%", y: "20%", s: 140 },
            ].map((b, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full blur-2xl"
                style={{ background: b.c, left: b.x, top: b.y, width: b.s, height: b.s }}
                animate={{ scale: [1, 1.15, 1] }}
                transition={{ duration: 4 + i, repeat: Infinity }}
              />
            ))}
            {/* scanning sweep */}
            <motion.div
              className="absolute inset-x-0 h-24 bg-gradient-to-b from-primary/30 to-transparent"
              animate={{ y: ["-20%", "120%"] }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            />
            <motion.div
              animate={{ x: [0, 200, 0], y: [0, 80, 0] }}
              transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-6 left-6 text-primary"
            >
              <Plane className="h-7 w-7" />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

function FarmersPreview() {
  const farmers = [
    { n: "R. Kumar", l: "Sector 12 · 4.2 ha", s: "Eligible · PM-Kisan" },
    { n: "S. Devi", l: "Sector 4 · 1.8 ha", s: "Active · Soil Health" },
    { n: "M. Rao", l: "Sector 9 · 6.5 ha", s: "Pending · Crop Insurance" },
  ];
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-8 py-20">
      <div className="text-xs uppercase tracking-widest text-primary">Farmer Network</div>
      <h2 className="mt-2 text-4xl font-bold">Every farmer, one source of truth</h2>
      <div className="mt-10 grid md:grid-cols-3 gap-5">
        {farmers.map((f, i) => (
          <motion.div key={f.n}
            initial={{opacity:0, y:12}} whileInView={{opacity:1, y:0}} viewport={{once:true}}
            transition={{delay:i*0.08}}
            className="glass rounded-2xl p-5 glow-hover"
          >
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-2xl bg-gradient-primary flex items-center justify-center text-primary-foreground font-bold">{f.n.split(" ").map(s=>s[0]).join("")}</div>
              <div>
                <div className="font-semibold">{f.n}</div>
                <div className="text-xs text-muted-foreground">{f.l}</div>
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Status</span>
              <span className="text-success font-medium">{f.s}</span>
            </div>
            <div className="mt-3 h-1.5 rounded-full bg-secondary overflow-hidden">
              <motion.div initial={{width:0}} whileInView={{width:`${60+i*15}%`}} transition={{duration:1.2}} viewport={{once:true}} className="h-full bg-gradient-primary" />
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function Schemes() {
  const items = [
    { t: "PM-Kisan", d: "Income support for small & marginal farmers", p: 78 },
    { t: "Crop Insurance", d: "Financial protection against crop loss", p: 54 },
    { t: "Soil Health", d: "Nutrient cards & targeted recommendations", p: 91 },
  ];
  return (
    <section id="schemes" className="max-w-7xl mx-auto px-4 sm:px-8 py-20">
      <div className="flex items-end justify-between flex-wrap gap-3">
        <div>
          <div className="text-xs uppercase tracking-widest text-primary">Beneficiary Schemes</div>
          <h2 className="mt-2 text-4xl font-bold">Government schemes, simplified</h2>
        </div>
        <Link to="/schemes"><GradientButton variant="outline">View all schemes</GradientButton></Link>
      </div>
      <div className="mt-10 grid md:grid-cols-3 gap-5">
        {items.map((s, i) => (
          <motion.div key={s.t}
            initial={{opacity:0, y:12}} whileInView={{opacity:1, y:0}} viewport={{once:true}}
            transition={{delay:i*0.08}}
            className="glass rounded-2xl p-6 glow-hover relative overflow-hidden"
          >
            <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-primary/20 blur-2xl" />
            <Gift className="h-5 w-5 text-primary" />
            <h3 className="mt-3 text-lg font-semibold">{s.t}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{s.d}</p>
            <div className="mt-5">
              <div className="flex justify-between text-xs text-muted-foreground"><span>Adoption</span><span>{s.p}%</span></div>
              <div className="mt-1.5 h-2 rounded-full bg-secondary overflow-hidden">
                <motion.div initial={{width:0}} whileInView={{width:`${s.p}%`}} viewport={{once:true}} transition={{duration:1.2}} className="h-full bg-gradient-primary" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function Testimonials() {
  const t = [
    { q: "Agri-TrekOps replaced six tools across three departments. Survey turnaround dropped 70%.", a: "K. Mehta", r: "District Agriculture Officer" },
    { q: "The drone trajectory replay is genuinely magical — and the reports almost write themselves.", a: "P. Singh", r: "Field Supervisor" },
    { q: "For the first time, every farmer in our block has a verified digital profile.", a: "A. Iyer", r: "State Coordinator" },
  ];
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-8 py-20">
      <h2 className="text-4xl font-bold">Trusted in the field</h2>
      <div className="mt-10 grid md:grid-cols-3 gap-5">
        {t.map((it, i) => (
          <motion.blockquote key={i}
            initial={{opacity:0, y:12}} whileInView={{opacity:1, y:0}} viewport={{once:true}}
            transition={{delay:i*0.08}}
            className="glass rounded-2xl p-6">
            <p className="text-sm">"{it.q}"</p>
            <footer className="mt-4 text-xs text-muted-foreground">— {it.a}, {it.r}</footer>
          </motion.blockquote>
        ))}
      </div>
    </section>
  );
}

function TechStack() {
  const items = ["React", "TanStack", "Tailwind v4", "Framer Motion", "Recharts", "Cloudflare Edge", "AI Gateway", "PostgreSQL", "Drone SDK", "GIS"];
  return (
    <section id="tech" className="max-w-7xl mx-auto px-4 sm:px-8 py-20">
      <div className="glass-strong rounded-3xl p-10 text-center relative overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-40" />
        <div className="relative">
          <Cpu className="h-7 w-7 text-primary mx-auto" />
          <h2 className="mt-3 text-3xl font-bold">Engineered on a modern stack</h2>
          <p className="mt-2 text-sm text-muted-foreground">Edge-native, type-safe, and built for scale.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-2">
            {items.map(t => (
              <span key={t} className="glass rounded-full px-4 py-1.5 text-xs">{t}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-8 py-16">
      <div className="glass-strong rounded-3xl p-10 lg:p-14 text-center relative overflow-hidden">
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 h-80 w-80 rounded-full bg-primary/30 blur-3xl" />
        <Zap className="h-7 w-7 text-primary mx-auto" />
        <h2 className="relative mt-3 text-4xl font-bold">Ready to digitize your district?</h2>
        <p className="relative mt-3 text-muted-foreground max-w-lg mx-auto">Spin up the platform in minutes. No card required.</p>
        <div className="relative mt-8 flex justify-center gap-3 flex-wrap">
          <Link to="/register"><GradientButton>Get started <ArrowRight className="h-4 w-4" /></GradientButton></Link>
          <Link to="/dashboard"><GradientButton variant="outline">Open dashboard</GradientButton></Link>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border mt-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10 grid md:grid-cols-4 gap-8 text-sm">
        <div>
          <div className="flex items-center gap-2"><Leaf className="h-4 w-4 text-primary" /><span className="font-bold">Agri-TrekOps</span></div>
          <p className="mt-3 text-muted-foreground text-xs">Smart agriculture command center for the next decade.</p>
          <div className="mt-4 flex gap-3 text-muted-foreground">
            <a href="#" className="hover:text-foreground"><Twitter className="h-4 w-4"/></a>
            <a href="#" className="hover:text-foreground"><Github className="h-4 w-4"/></a>
            <a href="#" className="hover:text-foreground"><Linkedin className="h-4 w-4"/></a>
          </div>
        </div>
        {[
          { t: "Product", l: ["Dashboard","Aerial","Schemes","Analytics"] },
          { t: "Company", l: ["About","Careers","Press","Contact"] },
          { t: "Legal", l: ["Privacy","Terms","Security","Status"] },
        ].map(c => (
          <div key={c.t}>
            <div className="font-semibold">{c.t}</div>
            <ul className="mt-3 space-y-1.5 text-muted-foreground">
              {c.l.map(x => <li key={x}><a href="#" className="hover:text-foreground">{x}</a></li>)}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-border py-5 text-center text-xs text-muted-foreground">© {new Date().getFullYear()} Agri-TrekOps. All rights reserved.</div>
    </footer>
  );
}

function Landing() {
  return (
    <div>
      <Nav />
      <Hero />
      <Features />
      <Showcase />
      <FarmersPreview />
      <Schemes />
      <Testimonials />
      <TechStack />
      <CTA />
      <Footer />
    </div>
  );
}
