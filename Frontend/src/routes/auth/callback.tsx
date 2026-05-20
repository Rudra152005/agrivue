import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { Loader2, Leaf } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/auth/callback")({
  head: () => ({ meta: [{ title: "Signing in… — Agri-TrekOps" }] }),
  component: AuthCallbackPage,
});

function AuthCallbackPage() {
  const navigate = useNavigate();

  useEffect(() => {
    // The backend redirects back with ?token=xxx after OAuth
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    const error = params.get("error");

    if (token) {
      localStorage.setItem("token", token);
      toast.success("Signed in successfully!");
      navigate({ to: "/dashboard" });
    } else if (error) {
      toast.error(decodeURIComponent(error) || "OAuth login failed. Please try again.");
      navigate({ to: "/login" });
    } else {
      toast.error("Something went wrong during sign-in.");
      navigate({ to: "/login" });
    }
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <div className="bg-gradient-primary p-3 rounded-2xl glow">
        <Leaf className="h-7 w-7 text-primary-foreground" />
      </div>
      <Loader2 className="h-6 w-6 animate-spin text-primary" />
      <p className="text-sm text-muted-foreground">Completing sign-in…</p>
    </div>
  );
}
