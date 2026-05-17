import { createFileRoute, Link } from "@tanstack/react-router";
import { AuthShell, Field } from "./login";
import { GradientButton } from "@/components/ui-kit/GradientButton";

export const Route = createFileRoute("/forgot-password")({
  head: () => ({ meta: [{ title: "Reset password — Agri-TrekOps" }] }),
  component: () => (
    <AuthShell title="Reset your password" subtitle="We'll email you a recovery link"
      footer={<><Link to="/login" className="text-primary font-semibold">Back to sign in</Link></>}>
      <form className="space-y-4" onSubmit={(e)=>e.preventDefault()}>
        <Field label="Email" type="email" placeholder="you@field.gov" />
        <GradientButton className="w-full">Send reset link</GradientButton>
      </form>
    </AuthShell>
  ),
});
