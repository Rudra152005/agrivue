import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { AuthShell, Field, RoleSelect } from "./login";
import { GradientButton } from "@/components/ui-kit/GradientButton";
import { useState } from "react";
import api from "@/lib/api";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export const Route = createFileRoute("/register")({
  head: () => ({ meta: [{ title: "Sign up — Agri-TrekOps" }] }),
  component: RegisterPage,
});

function RegisterPage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Farmer");
  const [landSize, setLandSize] = useState("");
  const [crops, setCrops] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await api.post("/auth/register", { 
        name: `${firstName} ${lastName}`, 
        email, 
        password, 
        role: role.toLowerCase(),
        landSize: role.toLowerCase() === "farmer" && landSize ? Number(landSize) : undefined,
        crops: role.toLowerCase() === "farmer" && crops ? crops : undefined
      });
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("userRole", role.toLowerCase());
      toast.success("Account created successfully!");
      navigate({ to: "/dashboard" });
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Registration failed. Please check your details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell title="Create your account" subtitle="Start managing your fields in minutes"
      footer={<>Already have an account? <Link to="/login" className="text-primary font-semibold">Sign in</Link></>}>
      <form className="space-y-4" onSubmit={handleRegister}>
        <RoleSelect role={role} setRole={setRole} />
        <div className="grid grid-cols-2 gap-3">
          <Field label="First name" placeholder="Ravi" value={firstName} onChange={(e)=>setFirstName(e.target.value)} />
          <Field label="Last name" placeholder="Kumar" value={lastName} onChange={(e)=>setLastName(e.target.value)} />
        </div>
        <Field label="Email" type="email" placeholder="you@field.gov" value={email} onChange={(e)=>setEmail(e.target.value)} />
        <Field label="Password" type="password" placeholder="••••••••" value={password} onChange={(e)=>setPassword(e.target.value)} />
        {role.toLowerCase() === "farmer" && (
          <div className="grid grid-cols-2 gap-3">
            <Field 
              label="Land size (acres)" 
              type="number" 
              placeholder="e.g. 5" 
              value={landSize} 
              onChange={(e) => setLandSize(e.target.value)} 
            />
            <Field 
              label="Crop types" 
              placeholder="e.g. Wheat, Rice" 
              value={crops} 
              onChange={(e) => setCrops(e.target.value)} 
            />
          </div>
        )}
        <label className="flex items-start gap-2 text-xs text-muted-foreground"><input type="checkbox" className="mt-0.5 accent-primary" required/> I agree to the Terms and Privacy Policy.</label>
        <GradientButton className="w-full" type="submit" disabled={loading}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
          {loading ? "Creating account..." : "Create account"}
        </GradientButton>
      </form>
    </AuthShell>
  );
}
