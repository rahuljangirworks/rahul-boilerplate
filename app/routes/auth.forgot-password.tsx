import { useState } from "react";
import { Link } from "react-router";
import { authClient } from "~/lib/auth-client";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Zap, Loader2, CheckCircle2 } from "lucide-react";
import type { Route } from "./+types/auth.forgot-password";

export function meta({: Route.MetaArgs}) {
  return [
    { title: "Forgot Password — Boilerplate" },
    { name: "description", content: "Reset your password" },
  ];
}

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const result = await authClient.forgetPassword({
        email,
        redirectTo: "/auth/reset-password",
      });
      if (result.error) {
        setError(result.error.message ?? "Failed to send reset email.");
      } else {
        setSent(true);
      }
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4 bg-muted/30">
        <div className="w-full max-w-sm space-y-6">
          <Card>
            <CardContent className="pt-6 text-center space-y-4">
              <CheckCircle2 className="size-12 text-green-500 mx-auto" />
              <div>
                <CardTitle className="text-xl">Check your email</CardTitle>
                <CardDescription className="mt-2">
                  We&apos;ve sent a password reset link to <strong>{email}</strong>.
                  Check your inbox and follow the instructions.
                </CardDescription>
              </div>
              <Button variant="outline" asChild>
                <Link to="/auth/sign-in">Back to Sign In</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4 bg-muted/30">
      <div className="w-full max-w-sm space-y-6">
        <div className="flex flex-col items-center gap-2">
          <Link to="/" className="flex items-center gap-2 font-semibold text-sm">
            <Zap className="size-4 text-primary" />
            Boilerplate
          </Link>
        </div>

        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-xl">Forgot password?</CardTitle>
            <CardDescription>
              Enter your email and we&apos;ll send you a reset link.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              {error && (
                <p className="text-sm text-destructive bg-destructive/10 rounded-md px-3 py-2">
                  {error}
                </p>
              )}

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <Loader2 className="mr-2 size-4 animate-spin" />
                ) : null}
                Send Reset Link
              </Button>
            </form>
          </CardContent>
        </Card>

        <p className="text-center text-sm text-muted-foreground">
          Remember your password?{" "}
          <Link
            to="/auth/sign-in"
            className="text-primary underline-offset-4 hover:underline font-medium"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
