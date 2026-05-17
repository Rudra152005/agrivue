import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/layout/AppLayout";
import { Plane, Battery, Signal, Clock } from "lucide-react";
import { motion } from "framer-motion";
import { StatCard } from "@/components/ui-kit/StatCard";

export const Route = createFileRoute("/aerial")({
  head: () => ({ meta: [{ title: "Aerial Monitoring — Agri-TrekOps" }] }),
  component: AerialPage,
});

function AerialPage() {
  return (
    <AppLayout title="Aerial Monitoring">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Drones online" value={248} icon={Plane}/>
        <StatCard label="Surveys today" value={84} icon={Clock} accent="info"/>
        <StatCard label="Avg battery" value={72} suffix="%" icon={Battery} accent="warning"/>
        <StatCard label="Signal strength" value={94} suffix="%" icon={Signal}/>
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 glass rounded-2xl p-5">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Live trajectory map</h3>
            <span className="flex items-center gap-1.5 text-xs"><span className="h-2 w-2 rounded-full bg-success animate-pulse"/>Streaming</span>
          </div>
          <div className="mt-4 relative h-[28rem] rounded-2xl overflow-hidden bg-gradient-to-br from-emerald/15 via-info/10 to-transparent border border-border">
            <div className="absolute inset-0 grid-bg opacity-50"/>
            {[
              {c:"oklch(0.78 0.20 75 / 0.5)",x:"10%",y:"20%",s:200},
              {c:"oklch(0.72 0.18 150 / 0.5)",x:"55%",y:"45%",s:240},
              {c:"oklch(0.62 0.22 25 / 0.4)",x:"75%",y:"15%",s:160},
              {c:"oklch(0.70 0.14 220 / 0.4)",x:"25%",y:"70%",s:200},
            ].map((b,i)=>(<motion.div key={i} className="absolute rounded-full blur-2xl" style={{background:b.c,left:b.x,top:b.y,width:b.s,height:b.s}} animate={{scale:[1,1.15,1]}} transition={{duration:4+i,repeat:Infinity}}/>))}
            <motion.div className="absolute inset-x-0 h-32 bg-gradient-to-b from-primary/30 to-transparent" animate={{y:["-20%","120%"]}} transition={{duration:5,repeat:Infinity,ease:"linear"}}/>
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 800 500">
              <motion.path d="M40,440 C160,80 360,460 460,200 S720,80 760,360" stroke="oklch(0.85 0.20 145)" strokeWidth="3" fill="none" initial={{pathLength:0}} animate={{pathLength:1}} transition={{duration:5,repeat:Infinity,repeatType:"reverse"}}/>
              {[[120,300],[260,180],[420,260],[580,140],[700,300]].map(([x,y],i)=>(
                <circle key={i} cx={x} cy={y} r="6" fill="oklch(0.85 0.20 145)"><animate attributeName="r" values="4;9;4" dur="2s" begin={`${i*0.3}s`} repeatCount="indefinite"/></circle>
              ))}
            </svg>
            {[0,1,2].map(i=>(
              <motion.div key={i} className="absolute text-primary" animate={{x:[0,500-i*100,0],y:[0,200+i*40,0]}} transition={{duration:10+i*2,repeat:Infinity,ease:"easeInOut"}} style={{top:`${10+i*20}%`,left:"5%"}}>
                <Plane className="h-6 w-6"/>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="glass rounded-2xl p-5">
          <h3 className="font-semibold">Drone activity log</h3>
          <ul className="mt-4 space-y-3 text-sm">
            {[
              {n:"A12",s:"Survey complete · Sector 7",t:"2m"},
              {n:"B07",s:"En route · Sector 12",t:"6m"},
              {n:"C03",s:"Charging · Base Alpha",t:"14m"},
              {n:"A09",s:"Battery low · returning",t:"18m"},
              {n:"B11",s:"Heatmap uploaded",t:"32m"},
              {n:"D02",s:"Survey complete · Sector 4",t:"48m"},
            ].map((d,i)=>(
              <motion.li key={i} initial={{opacity:0,x:-8}} animate={{opacity:1,x:0}} transition={{delay:i*0.04}} className="glass rounded-xl p-3 flex items-center gap-3">
                <div className="h-9 w-9 rounded-xl bg-gradient-primary text-primary-foreground text-xs font-bold flex items-center justify-center">{d.n}</div>
                <div className="flex-1"><div className="text-sm">{d.s}</div><div className="text-xs text-muted-foreground">{d.t} ago</div></div>
              </motion.li>
            ))}
          </ul>
        </div>
      </div>
    </AppLayout>
  );
}
