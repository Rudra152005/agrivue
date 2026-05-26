import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { GradientButton } from "@/components/ui-kit/GradientButton";
import { Search, Download, ShieldCheck, Loader2, Mail } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";

export const Route = createFileRoute("/officers")({
  head: () => ({ meta: [{ title: "Officers Management — Agri-TrekOps" }] }),
  component: OfficersPage,
});

function OfficersPage() {
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const per = 8;

  const { data: usersData, isLoading } = useQuery<{ data: any[], count: number }>({
    queryKey: ["users", { role: "officer", page, q }],
    queryFn: async () => {
      const response = await api.get(`/users?role=officer&page=${page}&limit=${per}&name=${q}`);
      return response.data;
    },
  });

  const officers = usersData?.data || [];
  const total = usersData?.count || 0;
  const pages = Math.max(1, Math.ceil(total / per));

  const exportCSV = () => {
    // Export CSV Logic
  };

  return (
    <AppLayout title="Officers Management">
      <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
        <div>
          <h2 className="text-2xl font-bold">Officers Management</h2>
          <p className="text-sm text-muted-foreground">{total} total field officers</p>
        </div>
        <div className="flex gap-2">
          <GradientButton variant="outline" onClick={exportCSV}><Download className="h-4 w-4 mr-2"/> Export CSV</GradientButton>
        </div>
      </div>

      <div className="glass rounded-3xl p-6 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)]">
        <div className="flex items-center gap-2 flex-wrap mb-4">
          <div className="flex items-center gap-2 glass rounded-xl px-4 py-2 flex-1 min-w-64 border border-border/50">
            <Search className="h-4 w-4 text-muted-foreground"/>
            <input value={q} onChange={e=>{setQ(e.target.value); setPage(1);}} placeholder="Search officers by name or email…" className="bg-transparent outline-none text-sm flex-1 placeholder:text-muted-foreground"/>
          </div>
        </div>
        
        <div className="overflow-x-auto rounded-2xl border border-border/60 bg-background/20 min-h-[300px]">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <table className="w-full text-sm text-left">
              <thead className="text-[10px] uppercase tracking-widest text-muted-foreground bg-accent/30 border-b border-border/60">
                <tr>
                  <th className="px-5 py-4 font-semibold">Officer Profile</th>
                  <th className="px-5 py-4 font-semibold">Email</th>
                  <th className="px-5 py-4 font-semibold">Role Level</th>
                  <th className="px-5 py-4 font-semibold">Status</th>
                  <th className="px-5 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {officers.map(o => (
                  <tr key={o._id} className="hover:bg-accent/20 transition-colors group">
                    <td className="px-5 py-3.5 flex items-center gap-3">
                      <div className="h-9 w-9 rounded-xl bg-gradient-primary flex items-center justify-center text-primary-foreground text-sm font-bold shadow-md">
                        {o.name ? o.name[0] : 'O'}
                      </div>
                      <span className="font-semibold text-foreground">{o.name || 'Unknown Officer'}</span>
                    </td>
                    <td className="px-5 py-3.5 text-muted-foreground flex items-center gap-2">
                       <Mail className="h-3 w-3" /> {o.email}
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="inline-flex items-center px-2 py-1 rounded bg-info/20 text-info text-[10px] font-bold uppercase tracking-wider border border-info/30">
                        {o.role}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                       <div className="flex items-center gap-1.5">
                         <div className="h-1.5 w-1.5 rounded-full bg-success"></div>
                         <span className="text-xs font-medium text-success">Active</span>
                       </div>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <button className="text-primary hover:text-primary/80 transition-colors opacity-0 group-hover:opacity-100 p-2 rounded-lg hover:bg-primary/10">
                        <ShieldCheck className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
                {officers.length === 0 && !isLoading && (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-muted-foreground italic text-sm">No officers found matching your search.</td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>

        {!isLoading && total > 0 && (
          <div className="mt-5 flex items-center justify-between text-sm">
            <div className="text-muted-foreground font-medium">Page {page} of {pages}</div>
            <div className="flex gap-2">
              <button disabled={page === 1} onClick={()=>setPage(p=>Math.max(1,p-1))} className="glass rounded-lg px-4 py-2 disabled:opacity-50 font-semibold hover:bg-accent/30 transition">Previous</button>
              <button disabled={page === pages} onClick={()=>setPage(p=>Math.min(pages,p+1))} className="glass rounded-lg px-4 py-2 disabled:opacity-50 font-semibold hover:bg-accent/30 transition">Next</button>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
