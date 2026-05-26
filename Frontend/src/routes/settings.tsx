import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/layout/AppLayout";
import { useState } from "react";
import { Bell, Lock, User, Plug, Palette, Save, Loader2 } from "lucide-react";
import { GradientButton } from "@/components/ui-kit/GradientButton";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";

export const Route = createFileRoute("/settings")({
  head: () => ({ meta: [{ title: "Settings — Agri-TrekOps" }] }),
  component: SettingsPage,
});

const tabs = [
  { id: "profile", l: "Profile", i: User },
  { id: "security", l: "Security", i: Lock },
  { id: "notifications", l: "Notifications", i: Bell },
  { id: "appearance", l: "Appearance", i: Palette },
  { id: "integrations", l: "API & Integrations", i: Plug },
];

function Toggle({ label, defaultOn = false }: { label: string; defaultOn?: boolean }) {
  const [on, setOn] = useState(defaultOn);
  return (
    <div className="flex items-center justify-between glass rounded-xl px-4 py-3">
      <span className="text-sm">{label}</span>
      <button onClick={()=>setOn(o=>!o)} className={`relative w-11 h-6 rounded-full transition ${on?"bg-gradient-primary":"bg-secondary"}`}>
        <span className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-background transition-transform ${on?"translate-x-5":""}`}/>
      </button>
    </div>
  );
}

function SettingsPage() {
  const [tab, setTab] = useState("profile");

  const { data: user, isLoading } = useQuery({
    queryKey: ["me"],
    queryFn: async () => {
      const res = await api.get("/auth/me");
      return res.data.data;
    }
  });

  return (
    <AppLayout title="Settings">
      <div className="grid lg:grid-cols-[240px_1fr] gap-6">
        <aside className="space-y-1">
          {tabs.map(t=>(
            <button key={t.id} onClick={()=>setTab(t.id)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm transition
                ${tab===t.id?"bg-gradient-primary text-primary-foreground glow":"text-muted-foreground hover:text-foreground hover:bg-accent/30"}`}>
              <t.i className="h-4 w-4"/> {t.l}
            </button>
          ))}
        </aside>

        <div className="glass rounded-2xl p-6 space-y-5 min-h-[400px]">
          {tab==="profile" && (
            <>
              <h3 className="font-semibold text-lg">Profile</h3>
              {isLoading ? (
                <div className="flex items-center justify-center py-10">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-4">
                    <div className="h-16 w-16 rounded-2xl bg-gradient-primary flex items-center justify-center text-primary-foreground font-bold text-xl uppercase">
                      {user?.name ? user.name.split(" ").map((s:string)=>s[0]).join("").substring(0,2) : "U"}
                    </div>
                    <div><div className="font-semibold capitalize">{user?.name || "Unknown"}</div><div className="text-xs text-muted-foreground capitalize">{user?.role}</div></div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    {[
                      ["Full name", user?.name || ""],
                      ["Email", user?.email || ""],
                      ["Role", (user?.role || "").toUpperCase()],
                      ["Account Created", new Date(user?.createdAt).toLocaleDateString()]
                    ].map(([l,v])=>(
                      <label key={l} className="block">
                        <span className="text-xs uppercase tracking-wider text-muted-foreground">{l}</span>
                        <input defaultValue={v} disabled className="mt-1.5 w-full glass rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/50 opacity-80 cursor-not-allowed"/>
                      </label>
                    ))}
                  </div>
                  <GradientButton><Save className="h-4 w-4"/> Save changes</GradientButton>
                </>
              )}
            </>
          )}
          {tab==="security" && (
            <>
              <h3 className="font-semibold text-lg">Security</h3>
              {["Current password","New password","Confirm new password"].map(l=>(
                <label key={l} className="block">
                  <span className="text-xs uppercase tracking-wider text-muted-foreground">{l}</span>
                  <input type="password" placeholder="••••••••" className="mt-1.5 w-full glass rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/50"/>
                </label>
              ))}
              <Toggle label="Enable two-factor authentication" defaultOn/>
              <Toggle label="Require re-auth for sensitive ops" defaultOn/>
              <GradientButton>Update security</GradientButton>
            </>
          )}
          {tab==="notifications" && (
            <>
              <h3 className="font-semibold text-lg">Notifications</h3>
              <Toggle label="Email · drone alerts" defaultOn/>
              <Toggle label="Email · scheme deadlines" defaultOn/>
              <Toggle label="Push · crop health spikes"/>
              <Toggle label="SMS · critical alerts" defaultOn/>
              <Toggle label="Weekly summary digest"/>
            </>
          )}
          {tab==="appearance" && (
            <>
              <h3 className="font-semibold text-lg">Appearance</h3>
              <div>
                <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Theme</div>
                <div className="grid grid-cols-3 gap-3">
                  {["Dark Forest","Midnight","System"].map((t,i)=>(
                    <button key={t} className={`glass rounded-2xl p-4 text-sm text-left ${i===0?"border border-primary glow":""}`}>
                      <div className={`h-10 rounded-lg mb-2 ${i===0?"bg-gradient-primary":i===1?"bg-secondary":"bg-muted"}`}/>
                      {t}
                    </button>
                  ))}
                </div>
              </div>
              <Toggle label="Reduce motion"/>
              <Toggle label="High contrast mode"/>
            </>
          )}
          {tab==="integrations" && (
            <>
              <h3 className="font-semibold text-lg">API & Integrations</h3>
              <div className="glass rounded-xl p-4">
                <div className="text-xs uppercase tracking-wider text-muted-foreground">API key</div>
                <div className="mt-2 font-mono text-sm flex items-center justify-between">sk_live_•••••••••••••••••••••••• <button className="text-primary text-xs">Rotate</button></div>
              </div>
              {["Drone Telemetry SDK","GIS Map Provider","SMS Gateway","Govt Scheme API"].map(n=>(
                <Toggle key={n} label={n} defaultOn={n!=="Govt Scheme API"}/>
              ))}
            </>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
