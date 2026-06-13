import { useState } from "react";
import { Link, useSearchParams } from "react-router";
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
import type { Route } from "./+types/auth.reset-password";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Reset Password — Boilerplate" },
    { name: "description", content: "Set your new password" },
  ];
}

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setLoading(true);
    try {
      const result = await authClient.resetPassword({
        newPassword: password,
        token: token ?? "",
      });
      if (result.error) {
        setError(result.error.message ?? "Failed to reset password.");
      } else {
        setSuccess(true);
      }
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4 bg-muted/30">
        <div className="w-full max-w-sm space-y-6">
          <Card>
            <CardContent className="pt-6 text-center space-y-4">
              <div>
                <CardTitle className="text-xl">Invalid Reset Link</CardTitle>
                <CardDescription className="mt-2">
                  This password reset link is invalid or has expired.
                  Please request a new one.
                </CardDescription>
              </div>
              <Button variant="outline" asChild>
                <Link to="/auth/forgot-password">Request New Link</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4 bg-muted/30">
        <div className="w-full max-w-sm space-y-6">
          <Card>
            <CardContent className="pt-6 text-center space-y-4">
              <CheckCircle2 className="size-12 text-green-500 mx-auto" />
              <div>
                <CardTitle className="text-xl">Password reset!</CardTitle>
                <CardDescription className="mt-2">
                  Your password has been updated successfully.
                </CardDescription>
              </div>
              <Button asChild>
                <Link to="/auth/sign-in">Sign In</Link>
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
            <CardTitle className="text-xl">Set new password</CardTitle>
            <CardDescription>
              Enter your new password below.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">New Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  autoComplete="new-password"
                  required
                  minLength={8}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  autoComplete="new-password"
                  required
                  minLength={8}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
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
                Reset Password
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
