import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { GradientButton } from "@/components/ui-kit/GradientButton";
import { Search, Plus, Download, MoreHorizontal, X, Filter, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { Farmer } from "@/lib/types";
import { toast } from "sonner";

export const Route = createFileRoute("/farmers")({
  head: () => ({ meta: [{ title: "Farmers — Agri-TrekOps" }] }),
  component: FarmersPage,
});

function FarmersPage() {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(1);
  const per = 8;
  const queryClient = useQueryClient();

  const { data: farmersData, isLoading } = useQuery<{ data: Farmer[], count: number, pagination: any }>({
    queryKey: ["farmers", { page, q }],
    queryFn: async () => {
      const response = await api.get(`/farmers?page=${page}&limit=${per}&name=${q}`);
      return response.data;
    },
  });

  const createMutation = useMutation({
    mutationFn: async (newFarmer: any) => {
      const response = await api.post("/farmers", newFarmer);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["farmers"] });
      toast.success("Farmer added successfully!");
      setOpen(false);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || "Failed to add farmer.");
    }
  });

  const farmers = farmersData?.data || [];
  const total = farmersData?.count || 0;
  const pages = Math.max(1, Math.ceil(total / per));

  const [formData, setFormData] = useState({
    name: "",
    village: "",
    district: "",
    state: "",
    landSize: "",
    aadhaarId: "",
    contactNumber: ""
  });

  const handleAddFarmer = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate({
      ...formData,
      landSize: Number(formData.landSize)
    });
  };

  return (
    <AppLayout title="Farmers">
      <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
        <div>
          <h2 className="text-2xl font-bold">Farmer Management</h2>
          <p className="text-sm text-muted-foreground">{total} total farmers onboarded</p>
        </div>
        <div className="flex gap-2">
          <GradientButton variant="outline"><Download className="h-4 w-4"/> Export CSV</GradientButton>
          <GradientButton onClick={()=>setOpen(true)}><Plus className="h-4 w-4"/> Add farmer</GradientButton>
        </div>
      </div>

      <div className="glass rounded-2xl p-5">
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-2 glass rounded-xl px-3 py-2 flex-1 min-w-64">
            <Search className="h-4 w-4 text-muted-foreground"/>
            <input value={q} onChange={e=>{setQ(e.target.value); setPage(1);}} placeholder="Search farmers by name…" className="bg-transparent outline-none text-sm flex-1 placeholder:text-muted-foreground"/>
          </div>
          <button className="glass rounded-xl px-3 py-2 text-sm flex items-center gap-2"><Filter className="h-4 w-4"/> Filter</button>
        </div>
        
        <div className="mt-4 overflow-x-auto min-h-[300px]">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead className="text-xs uppercase tracking-wider text-muted-foreground">
                <tr><th className="text-left py-2">Farmer</th><th className="text-left">Village</th><th className="text-left">District</th><th className="text-left">Land</th><th className="text-left">Status</th><th></th></tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {farmers.map(f=>(
                  <tr key={f._id} className="hover:bg-accent/20 transition">
                    <td className="py-3 flex items-center gap-2.5">
                      <div className="h-8 w-8 rounded-full bg-gradient-primary text-primary-foreground text-xs font-bold flex items-center justify-center">
                        {typeof f.user === 'object' ? f.user.name[0] : 'F'}
                      </div>
                      {typeof f.user === 'object' ? f.user.name : 'Unknown'}
                    </td>
                    <td>{f.village}</td>
                    <td>{f.district}</td>
                    <td>{f.landSize} acres</td>
                    <td><span className={`text-xs px-2 py-1 rounded-full ${f.beneficiaryStatus==="active"?"bg-success/15 text-success":f.beneficiaryStatus==="pending"?"bg-warning/15 text-warning":"bg-info/15 text-info"}`}>{f.beneficiaryStatus}</span></td>
                    <td className="text-right"><button className="p-1.5 rounded-lg hover:bg-accent/30"><MoreHorizontal className="h-4 w-4"/></button></td>
                  </tr>
                ))}
                {farmers.length === 0 && !isLoading && (
                  <tr>
                    <td colSpan={6} className="py-10 text-center text-muted-foreground italic">No farmers found matching your search.</td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>

        {!isLoading && total > 0 && (
          <div className="mt-4 flex items-center justify-between text-sm">
            <div className="text-muted-foreground">Page {page} of {pages}</div>
            <div className="flex gap-2">
              <button disabled={page === 1} onClick={()=>setPage(p=>Math.max(1,p-1))} className="glass rounded-lg px-3 py-1.5 disabled:opacity-50">Prev</button>
              <button disabled={page === pages} onClick={()=>setPage(p=>Math.min(pages,p+1))} className="glass rounded-lg px-3 py-1.5 disabled:opacity-50">Next</button>
            </div>
          </div>
        )}
      </div>

      <AnimatePresence>
        {open && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 z-50 bg-background/70 backdrop-blur flex items-center justify-center p-4 overflow-y-auto">
            <motion.div initial={{scale:0.95,opacity:0}} animate={{scale:1,opacity:1}} exit={{scale:0.95,opacity:0}} className="glass-strong rounded-3xl w-full max-w-lg p-6 border border-border my-auto" style={{boxShadow:"var(--shadow-elegant)"}}>
              <div className="flex items-center justify-between"><h3 className="text-lg font-semibold">Add new farmer profile</h3><button onClick={()=>setOpen(false)} className="p-1.5 rounded-lg hover:bg-accent/30"><X className="h-4 w-4"/></button></div>
              <form className="mt-4 space-y-3" onSubmit={handleAddFarmer}>
                <div className="grid grid-cols-1 gap-3">
                  <label className="block">
                    <span className="text-xs uppercase tracking-wider text-muted-foreground">Aadhaar ID</span>
                    <input required value={formData.aadhaarId} onChange={e=>setFormData({...formData, aadhaarId: e.target.value})} placeholder="XXXX XXXX XXXX" className="mt-1.5 w-full glass rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/50"/>
                  </label>
                  <label className="block">
                    <span className="text-xs uppercase tracking-wider text-muted-foreground">Contact Number</span>
                    <input required value={formData.contactNumber} onChange={e=>setFormData({...formData, contactNumber: e.target.value})} placeholder="+91 XXXX XXX XXX" className="mt-1.5 w-full glass rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/50"/>
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <label className="block">
                      <span className="text-xs uppercase tracking-wider text-muted-foreground">Village</span>
                      <input required value={formData.village} onChange={e=>setFormData({...formData, village: e.target.value})} placeholder="Village name" className="mt-1.5 w-full glass rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/50"/>
                    </label>
                    <label className="block">
                      <span className="text-xs uppercase tracking-wider text-muted-foreground">District</span>
                      <input required value={formData.district} onChange={e=>setFormData({...formData, district: e.target.value})} placeholder="District" className="mt-1.5 w-full glass rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/50"/>
                    </label>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <label className="block">
                      <span className="text-xs uppercase tracking-wider text-muted-foreground">State</span>
                      <input required value={formData.state} onChange={e=>setFormData({...formData, state: e.target.value})} placeholder="State" className="mt-1.5 w-full glass rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/50"/>
                    </label>
                    <label className="block">
                      <span className="text-xs uppercase tracking-wider text-muted-foreground">Land Size (Acres)</span>
                      <input required type="number" value={formData.landSize} onChange={e=>setFormData({...formData, landSize: e.target.value})} placeholder="5.5" className="mt-1.5 w-full glass rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/50"/>
                    </label>
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-4">
                  <button type="button" onClick={()=>setOpen(false)} className="px-4 py-2 rounded-xl text-sm hover:bg-accent/30">Cancel</button>
                  <GradientButton type="submit" disabled={createMutation.isPending}>
                    {createMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
                    {createMutation.isPending ? "Saving..." : "Save Farmer Profile"}
                  </GradientButton>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AppLayout>
  );
}
