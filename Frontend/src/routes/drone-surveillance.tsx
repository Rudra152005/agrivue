import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { GradientButton } from "@/components/ui-kit/GradientButton";
import { Crosshair, Map, Battery, Signal, Zap, Loader2, Plane, X, MapPin, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";

export const Route = createFileRoute("/drone-surveillance")({
  head: () => ({ meta: [{ title: "Drone Surveillance — Agri-TrekOps" }] }),
  component: DroneSurveillancePage,
});

const SECTORS = ["Sector 1 - North Field", "Sector 2 - South Field", "Sector 3 - East Zone", "Sector 4 - West Zone", "Sector 5 - Central Hub", "Sector 6 - Riverside", "Sector 7 - Hilltop", "Sector 8 - Valley Floor"];
const DRONE_UNITS = ["AX-77", "BX-81", "BX-82", "BX-83", "BX-84", "CX-90", "CX-91", "DX-10"];

// Simulated map markers for the aerial map view
const MAP_MARKERS = [
  { id: 1, x: 20, y: 30, label: "Unit AX-77", status: "active", sector: "Sector 1" },
  { id: 2, x: 55, y: 18, label: "Unit BX-81", status: "active", sector: "Sector 2" },
  { id: 3, x: 70, y: 55, label: "Unit BX-82", status: "active", sector: "Sector 3" },
  { id: 4, x: 35, y: 70, label: "Unit BX-83", status: "standby", sector: "Sector 4" },
  { id: 5, x: 80, y: 28, label: "Unit CX-90", status: "active", sector: "Sector 5" },
  { id: 6, x: 15, y: 62, label: "Unit DX-10", status: "alert", sector: "Sector 6" },
];

function DispatchModal({ onClose }: { onClose: () => void }) {
  const queryClient = useQueryClient();
  const [form, setForm] = useState({
    droneId: DRONE_UNITS[0],
    sector: SECTORS[0],
    cropHealthScore: 75,
    notes: "",
  });
  const [success, setSuccess] = useState(false);

  const { mutate: dispatch, isPending, error: dispatchError } = useMutation({
    mutationFn: async () => {
      return api.post("/aerial", {
        droneId: form.droneId,
        cropHealthScore: form.cropHealthScore,
        logs: [`Dispatched to ${form.sector}. Notes: ${form.notes || "None"}`],
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["aerial"] });
      setSuccess(true);
      setTimeout(() => onClose(), 1800);
    },
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.92 }}
        className="glass rounded-3xl p-8 w-full max-w-lg shadow-[0_25px_60px_-10px_rgba(0,0,0,0.7)] border border-primary/30 relative"
      >
        <button onClick={onClose} className="absolute top-5 right-5 text-muted-foreground hover:text-foreground transition-colors p-1 rounded-full hover:bg-accent/50">
          <X className="h-5 w-5" />
        </button>

        <AnimatePresence mode="wait">
          {success ? (
            <motion.div key="success" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-8 gap-4">
              <div className="h-16 w-16 rounded-full bg-success/20 flex items-center justify-center text-success border border-success/40 shadow-[0_0_30px_var(--color-success)]">
                <Check className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold text-success">Mission Dispatched!</h3>
              <p className="text-sm text-muted-foreground text-center">Unit <span className="text-foreground font-semibold">{form.droneId}</span> is now en route to <span className="text-foreground font-semibold">{form.sector}</span>.</p>
            </motion.div>
          ) : (
            <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="flex items-center gap-3 mb-6">
                <div className="h-10 w-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary border border-primary/30">
                  <Zap className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold">Dispatch Aerial Unit</h2>
                  <p className="text-xs text-muted-foreground">Configure and launch a new drone mission</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-xs text-muted-foreground uppercase tracking-widest mb-1.5 block">Select Drone Unit</label>
                  <select
                    value={form.droneId}
                    onChange={e => setForm(f => ({ ...f, droneId: e.target.value }))}
                    className="w-full bg-background/60 border border-border/60 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/30"
                  >
                    {DRONE_UNITS.map(d => <option key={d} value={d}>Unit {d}</option>)}
                  </select>
                </div>

                <div>
                  <label className="text-xs text-muted-foreground uppercase tracking-widest mb-1.5 block">Target Sector</label>
                  <select
                    value={form.sector}
                    onChange={e => setForm(f => ({ ...f, sector: e.target.value }))}
                    className="w-full bg-background/60 border border-border/60 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/30"
                  >
                    {SECTORS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>

                <div>
                  <label className="text-xs text-muted-foreground uppercase tracking-widest mb-1.5 block">
                    Expected Crop Health Score — <span className="text-primary font-bold">{form.cropHealthScore}%</span>
                  </label>
                  <input
                    type="range" min={0} max={100}
                    value={form.cropHealthScore}
                    onChange={e => setForm(f => ({ ...f, cropHealthScore: parseInt(e.target.value) }))}
                    className="w-full accent-[oklch(0.72_0.18_150)]"
                  />
                </div>

                <div>
                  <label className="text-xs text-muted-foreground uppercase tracking-widest mb-1.5 block">Mission Notes (optional)</label>
                  <textarea
                    rows={3}
                    value={form.notes}
                    onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                    placeholder="e.g. Inspect irrigation channels in north-west..."
                    className="w-full bg-background/60 border border-border/60 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/30 resize-none"
                  />
                </div>
              </div>

              {dispatchError && <p className="text-destructive text-xs mt-3">{(dispatchError as any)?.response?.data?.error || (dispatchError as Error)?.message || "Failed to dispatch unit."}</p>}

              <div className="flex gap-3 mt-6">
                <button onClick={onClose} className="flex-1 px-4 py-2.5 rounded-xl border border-border/60 text-sm font-medium hover:bg-accent/30 transition-colors">Cancel</button>
                <GradientButton className="flex-1" onClick={() => dispatch()} disabled={isPending}>
                  {isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Zap className="h-4 w-4 mr-2" />}
                  {isPending ? "Launching..." : "Launch Mission"}
                </GradientButton>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

function MapViewPanel() {
  const [selectedMarker, setSelectedMarker] = useState<number | null>(null);
  return (
    <div className="glass rounded-3xl p-6 mb-6 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)] border border-primary/20">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold flex items-center gap-2"><MapPin className="h-4 w-4 text-primary"/> Aerial Fleet Map — Live Positions</h3>
        <div className="flex items-center gap-3 text-[10px] uppercase tracking-widest">
          <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-success"/>Active</span>
          <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-warning"/>Standby</span>
          <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-destructive"/>Alert</span>
        </div>
      </div>
      <div className="relative w-full h-72 rounded-2xl bg-[#050a0d] border border-primary/20 overflow-hidden">
        {/* Satellite grid bg */}
        <div className="absolute inset-0 grid-bg opacity-20"/>
        <div className="absolute inset-0" style={{ backgroundImage: "radial-gradient(circle at 50% 50%, rgba(16,185,80,0.04) 0%, transparent 70%)" }}/>
        {/* Grid lines */}
        {[25, 50, 75].map(p => (
          <div key={p}>
            <div className="absolute inset-y-0 border-l border-primary/10" style={{ left: `${p}%` }}/>
            <div className="absolute inset-x-0 border-t border-primary/10" style={{ top: `${p}%` }}/>
          </div>
        ))}
        {/* Drone markers */}
        {MAP_MARKERS.map(m => (
          <div
            key={m.id}
            className="absolute cursor-pointer group"
            style={{ left: `${m.x}%`, top: `${m.y}%`, transform: "translate(-50%, -50%)" }}
            onClick={() => setSelectedMarker(selectedMarker === m.id ? null : m.id)}
          >
            <div className={`h-4 w-4 rounded-full border-2 flex items-center justify-center shadow-lg transition-transform group-hover:scale-125
              ${m.status === "active" ? "bg-success/30 border-success shadow-success/50" : m.status === "standby" ? "bg-warning/30 border-warning shadow-warning/50" : "bg-destructive/30 border-destructive shadow-destructive/50"}
            `}>
              <span className={`h-1.5 w-1.5 rounded-full animate-pulse ${m.status === "active" ? "bg-success" : m.status === "standby" ? "bg-warning" : "bg-destructive"}`}/>
            </div>
            {/* Tooltip */}
            {selectedMarker === m.id && (
              <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-background/95 border border-border rounded-xl px-3 py-2 text-[10px] whitespace-nowrap z-10 shadow-xl">
                <p className="font-bold text-foreground">{m.label}</p>
                <p className="text-muted-foreground">{m.sector}</p>
                <p className={`uppercase font-bold tracking-wider mt-0.5 ${m.status === "active" ? "text-success" : m.status === "standby" ? "text-warning" : "text-destructive"}`}>{m.status}</p>
              </div>
            )}
          </div>
        ))}
        {/* Corner labels */}
        <span className="absolute top-2 left-3 text-[9px] font-mono text-primary/40">34.07°N 118.25°W</span>
        <span className="absolute bottom-2 right-3 text-[9px] font-mono text-primary/40">33.98°N 118.18°W</span>
      </div>
      <p className="text-xs text-muted-foreground mt-3 text-center">Click any drone marker to inspect its status · Real-time position updates every 5s</p>
    </div>
  );
}

function DroneSurveillancePage() {
  const [showMap, setShowMap] = useState(false);
  const [showDispatch, setShowDispatch] = useState(false);

  const { data: surveysData, isLoading } = useQuery({
    queryKey: ["aerial"],
    queryFn: async () => {
      const response = await api.get("/aerial");
      return response.data;
    },
  });

  const surveys = surveysData?.data || [];
  const activeDronesCount = surveys.length > 0 ? surveys.length : 12;

  return (
    <AppLayout title="Drone Surveillance">
      <AnimatePresence>
        {showDispatch && <DispatchModal onClose={() => setShowDispatch(false)} />}
      </AnimatePresence>

      <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
        <div>
          <h2 className="text-2xl font-bold">Drone Fleet Surveillance</h2>
          <p className="text-sm text-muted-foreground">{activeDronesCount} active aerial units deployed across sectors.</p>
        </div>
        <div className="flex gap-2">
          <GradientButton onClick={() => setShowMap(v => !v)} variant={showMap ? "primary" : "outline"}>
            <Map className="h-4 w-4 mr-2"/> {showMap ? "Hide Map" : "Map View"}
          </GradientButton>
          <GradientButton onClick={() => setShowDispatch(true)}>
            <Zap className="h-4 w-4 mr-2"/> Dispatch Unit
          </GradientButton>
        </div>
      </div>

      {/* Map View Panel */}
      <AnimatePresence>
        {showMap && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            style={{ overflow: "hidden" }}
          >
            <MapViewPanel />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">
        {/* Main Live Feed */}
        <div className="xl:col-span-2 glass rounded-3xl p-6 relative overflow-hidden flex flex-col shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)] border border-primary/20">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold flex items-center gap-2"><Crosshair className="h-4 w-4 text-primary"/> Main Sector Feed — Unit AX-77</h3>
            <span className="flex items-center gap-1.5 text-xs font-bold text-destructive"><span className="h-2 w-2 rounded-full bg-destructive animate-pulse shadow-[0_0_8px_var(--color-destructive)]"/> REC</span>
          </div>
          <div className="flex-1 rounded-2xl bg-[#050a08] border border-primary/30 relative overflow-hidden group min-h-[400px]">
            <div className="absolute inset-0 grid-bg opacity-30" />
            <motion.div
              className="absolute inset-x-0 h-40 bg-gradient-to-b from-primary/30 to-transparent border-t border-primary/80"
              animate={{ y: ["-100%", "300%"] }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            />
            <motion.div
              className="absolute w-32 h-32 border-2 border-dashed border-primary/60 rounded-full flex items-center justify-center"
              style={{ top: '40%', left: '45%' }}
              animate={{ rotate: 360 }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            >
              <Crosshair className="h-8 w-8 text-primary/50" />
            </motion.div>
            <div className="absolute inset-x-0 top-0 p-4 flex justify-between text-xs font-mono text-primary drop-shadow-[0_0_5px_var(--color-primary)]">
              <div>
                <p>ALTITUDE: 154.2m</p>
                <p>SPEED: 38km/h</p>
                <p>PITCH: +2.4°</p>
              </div>
              <div className="text-right">
                <p>LAT: 34.0522 N</p>
                <p>LNG: -118.2437 W</p>
                <p>HDG: 104° (ESE)</p>
              </div>
            </div>
            <div className="absolute inset-x-0 bottom-0 p-4 flex justify-between items-end text-xs font-mono text-primary">
              <div className="flex items-center gap-4">
                <div className="flex flex-col gap-1">
                  <Battery className="h-5 w-5 text-success" />
                  <span>84%</span>
                </div>
                <div className="flex flex-col gap-1">
                  <Signal className="h-5 w-5 text-info" />
                  <span>STRONG</span>
                </div>
              </div>
              <div className="text-right">
                <span className="bg-primary/20 text-primary border border-primary/50 px-2 py-1 rounded">AUTO-PILOT</span>
              </div>
            </div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_40%,rgba(0,10,5,0.7)_100%)] pointer-events-none" />
          </div>
        </div>

        {/* Side Panel */}
        <div className="flex flex-col gap-6">
          <div className="glass rounded-3xl p-6 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)]">
            <h3 className="font-semibold mb-4 text-primary">System Status</h3>
            <div className="space-y-4">
              {[
                { label: "Fleet Integrity", value: "98%", width: "98%", color: "bg-success", shadow: "success" },
                { label: "Network Latency", value: "14ms", width: "85%", color: "bg-info", shadow: "info" },
                { label: "Anomaly Detection", value: "Active", width: "100%", color: "bg-warning", shadow: "warning" },
              ].map(item => (
                <div key={item.label}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-muted-foreground">{item.label}</span>
                    <span className={`text-${item.shadow} font-bold`}>{item.value}</span>
                  </div>
                  <div className="h-1.5 w-full bg-accent/50 rounded-full overflow-hidden">
                    <div className={`h-full ${item.color} shadow-[0_0_10px_var(--color-${item.shadow})]`} style={{ width: item.width }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="glass rounded-3xl p-6 flex-1 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col">
            <h3 className="font-semibold mb-4">Active Flights</h3>
            <div className="flex-1 overflow-y-auto pr-2 space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="p-3 rounded-xl border border-primary/20 bg-background/40 flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                    <Plane className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <div className="text-xs font-bold">Unit BX-{80 + i}</div>
                    <div className="text-[10px] text-muted-foreground">Sector {i} Patrol</div>
                  </div>
                  <span className="h-2 w-2 rounded-full bg-success animate-pulse" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Survey Data Table */}
      <div className="glass rounded-3xl p-6 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)]">
        <h3 className="font-semibold mb-5">Recent Survey Logs</h3>
        <div className="overflow-x-auto rounded-2xl border border-border/60 bg-background/20 min-h-[200px]">
          {isLoading ? (
            <div className="flex items-center justify-center py-10">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <table className="w-full text-sm text-left">
              <thead className="text-[10px] uppercase tracking-widest text-muted-foreground bg-accent/30 border-b border-border/60">
                <tr>
                  <th className="px-5 py-4 font-semibold">Survey ID</th>
                  <th className="px-5 py-4 font-semibold">Drone Unit</th>
                  <th className="px-5 py-4 font-semibold">Date</th>
                  <th className="px-5 py-4 font-semibold">Crop Health</th>
                  <th className="px-5 py-4 text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {surveys.map((s: any) => (
                  <tr key={s._id} className="hover:bg-accent/20 transition-colors">
                    <td className="px-5 py-3.5 font-mono text-xs">{s._id.substring(0, 8)}</td>
                    <td className="px-5 py-3.5 font-medium">{s.droneId || 'Auto-Fleet'}</td>
                    <td className="px-5 py-3.5 text-muted-foreground">{new Date(s.surveyDate).toLocaleDateString()}</td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-16 bg-accent rounded-full overflow-hidden">
                          <div className={`h-full ${s.cropHealthScore > 80 ? 'bg-success' : s.cropHealthScore > 50 ? 'bg-warning' : 'bg-destructive'}`} style={{ width: `${s.cropHealthScore || 0}%` }} />
                        </div>
                        <span className="text-xs">{s.cropHealthScore || 0}%</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <button className="text-primary hover:underline text-xs">View Log</button>
                    </td>
                  </tr>
                ))}
                {surveys.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-muted-foreground italic text-sm">No drone surveys recorded yet. Dispatch a unit to begin!</td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
