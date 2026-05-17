import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/layout/AppLayout";
import { Gift, Calendar, CheckCircle2, Clock } from "lucide-react";
import { GradientButton } from "@/components/ui-kit/GradientButton";
import { motion } from "framer-motion";

export const Route = createFileRoute("/schemes")({
  head: () => ({ meta: [{ title: "Beneficiary Schemes — Agri-TrekOps" }] }),
  component: SchemesPage,
});

const schemes = [
  { t:"PM-Kisan", d:"Income support for small & marginal farmers", e:true,  p:78, dl:"Mar 31" },
  { t:"Crop Insurance (PMFBY)", d:"Financial cover against crop loss", e:true, p:54, dl:"Apr 12" },
  { t:"Soil Health Card", d:"Personalized soil nutrient advisory", e:true, p:91, dl:"May 02" },
  { t:"Kisan Credit Card", d:"Easy short-term credit access", e:false, p:32, dl:"Apr 28" },
  { t:"Drip Irrigation Subsidy", d:"Subsidy on micro-irrigation systems", e:true, p:48, dl:"May 18" },
  { t:"Solar Pump Yojana", d:"Subsidized solar-powered pumps", e:false, p:21, dl:"Jun 05" },
];

function SchemesPage() {
  return (
    <AppLayout title="Beneficiary Schemes">
      <div className="grid md:grid-cols-3 gap-5 mb-6">
        {[
          { i: Gift, t:"Active schemes", v:"42" },
          { i: CheckCircle2, t:"Approved (this month)", v:"1,248" },
          { i: Clock, t:"Pending applications", v:"312" },
        ].map(s=>(
          <div key={s.t} className="glass rounded-2xl p-5 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-gradient-primary glow"><s.i className="h-5 w-5 text-primary-foreground"/></div>
            <div><div className="text-xs uppercase tracking-wider text-muted-foreground">{s.t}</div><div className="text-2xl font-bold mt-0.5">{s.v}</div></div>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
        {schemes.map((s,i)=>(
          <motion.div key={s.t} initial={{opacity:0,y:10}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:i*0.05}} className="glass rounded-2xl p-6 relative overflow-hidden glow-hover">
            <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-primary/15 blur-2xl" />
            <div className="flex items-center justify-between">
              <Gift className="h-5 w-5 text-primary"/>
              {s.e ? <span className="text-xs px-2 py-1 rounded-full bg-success/15 text-success">Eligible</span>
                   : <span className="text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground">Not eligible</span>}
            </div>
            <h3 className="mt-3 text-lg font-semibold">{s.t}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{s.d}</p>
            <div className="mt-5">
              <div className="flex justify-between text-xs text-muted-foreground"><span>Application progress</span><span>{s.p}%</span></div>
              <div className="mt-1.5 h-2 rounded-full bg-secondary overflow-hidden">
                <motion.div initial={{width:0}} whileInView={{width:`${s.p}%`}} viewport={{once:true}} transition={{duration:1}} className="h-full bg-gradient-primary"/>
              </div>
            </div>
            <div className="mt-5 flex items-center justify-between">
              <span className="text-xs text-muted-foreground flex items-center gap-1"><Calendar className="h-3.5 w-3.5"/> Deadline {s.dl}</span>
              <GradientButton variant={s.e?"primary":"outline"}>{s.e?"Apply":"View"}</GradientButton>
            </div>
          </motion.div>
        ))}
      </div>
    </AppLayout>
  );
}
