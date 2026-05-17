import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/layout/AppLayout";
import { ShieldCheck, MoreHorizontal, Plus } from "lucide-react";
import { GradientButton } from "@/components/ui-kit/GradientButton";

export const Route = createFileRoute("/users")({
  head: () => ({ meta: [{ title: "User Management — Agri-TrekOps" }] }),
  component: UsersPage,
});

const users = [
  { n: "Admin User", e: "admin@agritrek.gov", r: "Admin", s: "Active" },
  { n: "Priya Singh", e: "priya@agritrek.gov", r: "Officer", s: "Active" },
  { n: "Karan Mehta", e: "karan@agritrek.gov", r: "Officer", s: "Invited" },
  { n: "Asha Iyer", e: "asha@agritrek.gov", r: "Auditor", s: "Active" },
  { n: "Ravi Kumar", e: "ravi@field.gov", r: "Farmer", s: "Suspended" },
];

function UsersPage() {
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
        <table className="w-full text-sm">
          <thead className="text-xs uppercase tracking-wider text-muted-foreground">
            <tr><th className="text-left py-2">User</th><th className="text-left">Email</th><th className="text-left">Role</th><th className="text-left">Status</th><th></th></tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {users.map(u=>(
              <tr key={u.e} className="hover:bg-accent/20">
                <td className="py-3 flex items-center gap-2.5">
                  <div className="h-9 w-9 rounded-full bg-gradient-primary text-primary-foreground text-xs font-bold flex items-center justify-center">{u.n.split(" ").map(s=>s[0]).join("")}</div>
                  {u.n}
                </td>
                <td>{u.e}</td>
                <td><span className="text-xs px-2 py-1 rounded-full bg-info/15 text-info inline-flex items-center gap-1"><ShieldCheck className="h-3 w-3"/>{u.r}</span></td>
                <td><span className={`text-xs px-2 py-1 rounded-full ${u.s==="Active"?"bg-success/15 text-success":u.s==="Invited"?"bg-warning/15 text-warning":"bg-destructive/15 text-destructive"}`}>{u.s}</span></td>
                <td className="text-right"><button className="p-1.5 rounded-lg hover:bg-accent/30"><MoreHorizontal className="h-4 w-4"/></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AppLayout>
  );
}
