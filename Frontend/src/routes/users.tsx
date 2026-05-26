import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/layout/AppLayout";
import { ShieldCheck, MoreHorizontal, Plus, Loader2 } from "lucide-react";
import { GradientButton } from "@/components/ui-kit/GradientButton";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";

export const Route = createFileRoute("/users")({
  head: () => ({ meta: [{ title: "User Management — Agri-TrekOps" }] }),
  component: UsersPage,
});

function UsersPage() {
  const { data: usersResponse, isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const response = await api.get('/users');
      return response.data;
    }
  });

  const users = usersResponse?.data || [];

  return (
    <AppLayout title="User Management">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-2xl font-bold">Team & roles</h2>
          <p className="text-sm text-muted-foreground">Manage access across Admins, Officers and Farmers.</p>
        </div>
        <GradientButton><Plus className="h-4 w-4"/> Invite user</GradientButton>
      </div>

      <div className="glass rounded-2xl p-5">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="text-xs uppercase tracking-wider text-muted-foreground">
              <tr><th className="text-left py-2">User</th><th className="text-left">Email</th><th className="text-left">Role</th><th className="text-left">Status</th><th></th></tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {users.map((u: any) => (
                <tr key={u._id} className="hover:bg-accent/20">
                  <td className="py-3 flex items-center gap-2.5">
                    <div className="h-9 w-9 rounded-full bg-gradient-primary text-primary-foreground text-xs font-bold flex items-center justify-center">
                      {u.name ? u.name.split(" ").map((s: string)=>s[0]).join("").substring(0,2).toUpperCase() : 'U'}
                    </div>
                    {u.name || 'Unknown'}
                  </td>
                  <td>{u.email}</td>
                  <td className="capitalize"><span className="text-xs px-2 py-1 rounded-full bg-info/15 text-info inline-flex items-center gap-1"><ShieldCheck className="h-3 w-3"/>{u.role}</span></td>
                  <td><span className={`text-xs px-2 py-1 rounded-full ${u.role==="farmer"?"bg-success/15 text-success":"bg-warning/15 text-warning"}`}>Active</span></td>
                  <td className="text-right"><button className="p-1.5 rounded-lg hover:bg-accent/30"><MoreHorizontal className="h-4 w-4"/></button></td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-10 text-center text-muted-foreground italic">No users found in the system.</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </AppLayout>
  );
}
