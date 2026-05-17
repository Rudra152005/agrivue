import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Eye, EyeOff, Leaf, Github, Mail, ShieldCheck, Sprout, UserCog, Loader2 } from "lucide-react";
import { useState } from "react";
import { GradientButton } from "@/components/ui-kit/GradientButton";
import api from "@/lib/api";
import { toast } from "sonner";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Log in — Agri-TrekOps" }, { name: "description", content: "Sign in to Agri-TrekOps." }] }),
  component: LoginPage,
});

function AuthShell({ title, subtitle, children, footer }: { title: string; subtitle: string; children: React.ReactNode; footer: React.ReactNode }) {
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* visual */}
      <div className="relative hidden lg:flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-50" />
        <div className="absolute -top-20 -left-20 h-96 w-96 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-info/20 blur-3xl" />
        <div className="relative max-w-md p-10">
          <div className="flex items-center gap-2"><div className="bg-gradient-primary p-2 rounded-xl glow"><Leaf className="h-5 w-5 text-primary-foreground" /></div><span className="font-bold text-lg">Agri-TrekOps</span></div>
          <h2 className="mt-8 text-4xl font-bold leading-tight">Cultivate intelligence, <span className="text-gradient">harvest insights</span>.</h2>
          <p className="mt-4 text-muted-foreground">Join thousands of officers and farmers running their fields with AI-powered command tools.</p>
          <div className="mt-8 grid grid-cols-2 gap-3">
            {[{i:Sprout, t:"94% crop accuracy"},{i:ShieldCheck, t:"Audit-ready"},{i:UserCog, t:"Role-based"},{i:Mail, t:"24/7 support"}].map(it=>(
              <div key={it.t} className="glass rounded-xl p-3 flex items-center gap-2 text-xs"><it.i className="h-4 w-4 text-primary"/>{it.t}</div>
            ))}
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center p-6 lg:p-10">
        <motion.div initial={{opacity:0, y:12}} animate={{opacity:1, y:0}} className="glass-strong rounded-3xl w-full max-w-md p-8" style={{boxShadow:"var(--shadow-elegant)"}}>
          <Link to="/" className="lg:hidden flex items-center gap-2 mb-6"><Leaf className="h-5 w-5 text-primary"/><span className="font-bold">Agri-TrekOps</span></Link>
          <h1 className="text-2xl font-bold">{title}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
          <div className="mt-6">{children}</div>
          <div className="mt-6 text-sm text-muted-foreground text-center">{footer}</div>
        </motion.div>
      </div>
    </div>
  );
}

export function Field({ label, type = "text", placeholder, right, value, onChange }: { label: string; type?: string; placeholder?: string; right?: React.ReactNode; value?: string; onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void }) {
  return (
    <label className="block">
      <span className="text-xs uppercase tracking-wider text-muted-foreground">{label}</span>
      <div className="mt-1.5 relative">
        <input type={type} placeholder={placeholder} value={value} onChange={onChange}
          className="w-full glass rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/50 transition" />
        {right && <div className="absolute right-2 top-1/2 -translate-y-1/2">{right}</div>}
      </div>
    </label>
  );
}

export function RoleSelect({ role, setRole }: { role: string; setRole: (role: string) => void }) {
  const roles = ["Admin", "Officer", "Farmer"];
  return (
    <div>
      <span className="text-xs uppercase tracking-wider text-muted-foreground">Sign in as</span>
      <div className="mt-1.5 grid grid-cols-3 gap-2">
        {roles.map(r => (
          <button key={r} type="button" onClick={()=>setRole(r)}
            className={`relative rounded-xl px-3 py-2 text-xs font-semibold border transition
              ${role===r ? "border-primary text-primary-foreground bg-gradient-primary glow" : "border-border text-muted-foreground hover:text-foreground"}`}>
            {r}
          </button>
        ))}
      </div>
    </div>
  );
}

function LoginPage() {
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Officer");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await api.post("/auth/login", { email, password });
      localStorage.setItem("token", response.data.token);
      toast.success("Login successful!");
      navigate({ to: "/dashboard" });
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell title="Welcome back" subtitle="Sign in to continue to your dashboard"
      footer={<>Don't have an account? <Link to="/register" className="text-primary font-semibold">Sign up</Link></>}>
      <form className="space-y-4" onSubmit={handleLogin}>
        <RoleSelect role={role} setRole={setRole} />
        <Field label="Email" type="email" placeholder="you@field.gov" value={email} onChange={(e)=>setEmail(e.target.value)} />
        <Field label="Password" type={show?"text":"password"} placeholder="••••••••" value={password} onChange={(e)=>setPassword(e.target.value)}
          right={<button type="button" onClick={()=>setShow(s=>!s)} className="p-1.5 text-muted-foreground hover:text-foreground">{show? <EyeOff className="h-4 w-4"/> : <Eye className="h-4 w-4"/>}</button>}
        />
        <div className="flex justify-between items-center text-xs">
          <label className="flex items-center gap-2"><input type="checkbox" className="accent-primary"/> Remember me</label>
          <Link to="/forgot-password" className="text-primary">Forgot password?</Link>
        </div>
        <GradientButton className="w-full" type="submit" disabled={loading}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
          {loading ? "Signing in..." : "Sign in"}
        </GradientButton>
        <div className="relative my-2"><div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border"/></div><div className="relative flex justify-center text-xs"><span className="bg-background px-2 text-muted-foreground">or continue with</span></div></div>
        <div className="grid grid-cols-2 gap-2">
          <button type="button" className="glass rounded-xl py-2 text-sm font-medium flex items-center justify-center gap-2 hover:bg-accent/30"><Mail className="h-4 w-4"/> Google</button>
          <button type="button" className="glass rounded-xl py-2 text-sm font-medium flex items-center justify-center gap-2 hover:bg-accent/30"><Github className="h-4 w-4"/> GitHub</button>
        </div>
      </form>
    </AuthShell>
  );
}

export { AuthShell };
