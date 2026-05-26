import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Gift, Calendar, CheckCircle2, Clock, Loader2 } from "lucide-react";
import { GradientButton } from "@/components/ui-kit/GradientButton";
import { motion } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { toast } from "sonner";

export const Route = createFileRoute("/schemes")({
  head: () => ({ meta: [{ title: "Beneficiary Schemes — Agri-TrekOps" }] }),
  component: SchemesPage,
});

function SchemesPage() {
  const queryClient = useQueryClient();

  const { data: user } = useQuery({ 
    queryKey: ["me"], 
    queryFn: async () => (await api.get("/auth/me")).data.data 
  });

  const { data: schemes, isLoading: isLoadingSchemes } = useQuery({
    queryKey: ["schemes"],
    queryFn: async () => {
      const res = await api.get("/schemes");
      return res.data.data;
    }
  });

  const { data: applications, isLoading: isLoadingApps } = useQuery({
    queryKey: ["my-schemes"],
    queryFn: async () => {
      const res = await api.get("/schemes/status");
      return res.data.data;
    },
    enabled: user?.role === 'farmer'
  });

  const applyMutation = useMutation({
    mutationFn: async (schemeId: string) => {
      const res = await api.post("/schemes/apply", { scheme: schemeId });
      return res.data;
    },
    onSuccess: () => {
      toast.success("Successfully applied for scheme!");
      queryClient.invalidateQueries({ queryKey: ["my-schemes"] });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.error || "Failed to apply for scheme.");
    }
  });

  const [addSchemeOpen, setAddSchemeOpen] = useState(false);
  const [newSchemeData, setNewSchemeData] = useState({
    title: "",
    description: "",
    eligibilityCriteria: "",
    benefits: "",
    deadline: ""
  });

  const createSchemeMutation = useMutation({
    mutationFn: async (data: any) => {
      const formattedData = {
        ...data,
        eligibilityCriteria: data.eligibilityCriteria.split(",").map((s:string) => s.trim()).filter((s:string) => s)
      };
      const res = await api.post("/schemes", formattedData);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Scheme created successfully!");
      queryClient.invalidateQueries({ queryKey: ["schemes"] });
      setAddSchemeOpen(false);
      setNewSchemeData({
        title: "",
        description: "",
        eligibilityCriteria: "",
        benefits: "",
        deadline: ""
      });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.error || "Failed to create scheme.");
    }
  });

  const [selectedScheme, setSelectedScheme] = useState<any>(null);

  if (isLoadingSchemes || (user?.role === 'farmer' && isLoadingApps)) {
    return (
      <AppLayout title="Beneficiary Schemes">
        <div className="flex items-center justify-center h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </AppLayout>
    );
  }

  const activeCount = schemes?.length || 0;
  const pendingCount = applications?.filter((a: any) => a.status === 'pending').length || 0;
  const approvedCount = applications?.filter((a: any) => a.status === 'approved').length || 0;

  return (
    <AppLayout title="Beneficiary Schemes">
      <div className="flex items-center justify-between mb-6">
        <div className="grid md:grid-cols-3 gap-5 flex-1 mr-4">
          {[
            { i: Gift, t:"Active schemes", v: activeCount.toString() },
            { i: CheckCircle2, t:"Approved (your apps)", v: approvedCount.toString() },
            { i: Clock, t:"Pending applications", v: pendingCount.toString() },
          ].map(s=>(
            <div key={s.t} className="glass rounded-2xl p-5 flex items-center gap-4">
              <div className="p-3 rounded-xl bg-gradient-primary glow"><s.i className="h-5 w-5 text-primary-foreground"/></div>
              <div><div className="text-xs uppercase tracking-wider text-muted-foreground">{s.t}</div><div className="text-2xl font-bold mt-0.5">{s.v}</div></div>
            </div>
          ))}
        </div>
        {user?.role === 'admin' && (
          <GradientButton onClick={() => setAddSchemeOpen(true)}>
            Add New Scheme
          </GradientButton>
        )}
      </div>

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
        {schemes?.map((s: any, i: number)=>{
          const app = applications?.find((a: any) => a.scheme?._id === s._id || a.scheme === s._id);
          const hasApplied = !!app;
          const isExpired = new Date(s.deadline) < new Date();
          
          return (
          <motion.div key={s._id} initial={{opacity:0,y:10}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:i*0.05}} className="glass rounded-2xl p-6 relative overflow-hidden glow-hover">
            <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-primary/15 blur-2xl" />
            <div className="flex items-center justify-between">
              <Gift className="h-5 w-5 text-primary"/>
              {hasApplied ? <span className={`text-xs px-2 py-1 rounded-full capitalize ${app.status === 'approved' ? 'bg-success/15 text-success' : app.status === 'rejected' ? 'bg-destructive/15 text-destructive' : 'bg-warning/15 text-warning'}`}>{app.status}</span>
                   : isExpired ? <span className="text-xs px-2 py-1 rounded-full bg-destructive/15 text-destructive">Expired</span>
                   : <span className="text-xs px-2 py-1 rounded-full bg-success/15 text-success">Eligible</span>}
            </div>
            <h3 className="mt-3 text-lg font-semibold">{s.title}</h3>
            <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{s.description}</p>
            <div className="mt-5 flex items-center justify-between">
              <span className={`text-xs flex items-center gap-1 ${isExpired ? 'text-destructive font-medium' : 'text-muted-foreground'}`}><Calendar className="h-3.5 w-3.5"/> Deadline: {new Date(s.deadline).toLocaleDateString()}</span>
              
              {user?.role === 'farmer' && !hasApplied ? (
                <GradientButton 
                  onClick={() => applyMutation.mutate(s._id)} 
                  disabled={applyMutation.isPending || isExpired}
                >
                  {isExpired ? 'Closed' : 'Apply'}
                </GradientButton>
              ) : (
                <GradientButton variant="outline" onClick={() => setSelectedScheme(s)}>View Details</GradientButton>
              )}
            </div>
          </motion.div>
        )})}
        {schemes?.length === 0 && (
          <div className="col-span-full py-12 text-center text-muted-foreground italic">No active schemes found.</div>
        )}
      </div>

      {/* View Details Modal */}
      {selectedScheme && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
          <motion.div initial={{opacity:0, scale: 0.95}} animate={{opacity:1, scale:1}} className="glass-strong rounded-3xl p-6 md:p-8 max-w-2xl w-full relative">
            <button onClick={() => setSelectedScheme(null)} className="absolute top-4 right-4 p-2 hover:bg-accent/30 rounded-xl transition">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            </button>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 rounded-2xl bg-gradient-primary text-primary-foreground">
                <Gift className="h-6 w-6"/>
              </div>
              <div>
                <h2 className="text-xl font-bold">{selectedScheme.title}</h2>
                <div className="text-sm text-muted-foreground mt-1 flex items-center gap-4">
                  <span className="flex items-center gap-1"><Calendar className="h-4 w-4"/> Deadline: {new Date(selectedScheme.deadline).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-2">Description</h4>
                <p className="text-sm leading-relaxed">{selectedScheme.description}</p>
              </div>
              
              {selectedScheme.criteria && (
                <div>
                  <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-2">Eligibility Criteria</h4>
                  <ul className="list-disc pl-5 text-sm space-y-1">
                    {selectedScheme.criteria.map((c: string, idx: number) => (
                      <li key={idx}>{c}</li>
                    ))}
                  </ul>
                </div>
              )}

              {selectedScheme.benefits && (
                <div>
                  <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-2">Benefits</h4>
                  <p className="text-sm">{selectedScheme.benefits}</p>
                </div>
              )}
            </div>

            <div className="mt-8 flex justify-end">
              <GradientButton variant="outline" onClick={() => setSelectedScheme(null)}>Close</GradientButton>
            </div>
          </motion.div>
        </div>
      )}

      {/* Add Scheme Modal */}
      {addSchemeOpen && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
          <motion.div initial={{opacity:0, scale: 0.95}} animate={{opacity:1, scale:1}} className="glass-strong rounded-3xl p-6 md:p-8 max-w-2xl w-full relative">
            <button onClick={() => setAddSchemeOpen(false)} className="absolute top-4 right-4 p-2 hover:bg-accent/30 rounded-xl transition">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            </button>
            <h2 className="text-xl font-bold mb-6">Create New Scheme</h2>
            
            <form onSubmit={(e) => { e.preventDefault(); createSchemeMutation.mutate(newSchemeData); }} className="space-y-4">
              <label className="block">
                <span className="text-xs uppercase tracking-wider text-muted-foreground">Scheme Title</span>
                <input required value={newSchemeData.title} onChange={e=>setNewSchemeData({...newSchemeData, title: e.target.value})} className="mt-1.5 w-full glass rounded-xl px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/50" />
              </label>
              
              <label className="block">
                <span className="text-xs uppercase tracking-wider text-muted-foreground">Description</span>
                <textarea required value={newSchemeData.description} onChange={e=>setNewSchemeData({...newSchemeData, description: e.target.value})} rows={3} className="mt-1.5 w-full glass rounded-xl px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/50" />
              </label>
              
              <label className="block">
                <span className="text-xs uppercase tracking-wider text-muted-foreground">Benefits</span>
                <input required value={newSchemeData.benefits} onChange={e=>setNewSchemeData({...newSchemeData, benefits: e.target.value})} className="mt-1.5 w-full glass rounded-xl px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/50" />
              </label>

              <label className="block">
                <span className="text-xs uppercase tracking-wider text-muted-foreground">Eligibility Criteria (comma separated)</span>
                <input required value={newSchemeData.eligibilityCriteria} onChange={e=>setNewSchemeData({...newSchemeData, eligibilityCriteria: e.target.value})} placeholder="E.g., Small scale farmers, Annual income < 2L" className="mt-1.5 w-full glass rounded-xl px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/50" />
              </label>
              
              <label className="block">
                <span className="text-xs uppercase tracking-wider text-muted-foreground">Deadline</span>
                <input type="date" required value={newSchemeData.deadline} onChange={e=>setNewSchemeData({...newSchemeData, deadline: e.target.value})} className="mt-1.5 w-full glass rounded-xl px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/50" />
              </label>

              <div className="mt-8 flex justify-end gap-3">
                <GradientButton type="button" variant="outline" onClick={() => setAddSchemeOpen(false)}>Cancel</GradientButton>
                <GradientButton type="submit" disabled={createSchemeMutation.isPending}>
                  {createSchemeMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                  Create Scheme
                </GradientButton>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AppLayout>
  );
}
