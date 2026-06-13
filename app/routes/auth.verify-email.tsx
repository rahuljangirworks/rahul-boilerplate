import { Link } from "react-router";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Zap, Mail } from "lucide-react";
import type { Route } from "./+types/auth.verify-email";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Verify Email — Boilerplate" },
    { name: "description", content: "Check your email to verify your account" },
  ];
}

export default function VerifyEmailPage() {
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
          <CardContent className="pt-6 text-center space-y-4">
            <Mail className="size-12 text-primary mx-auto" />
            <div>
              <CardTitle className="text-xl">Verify your email</CardTitle>
              <CardDescription className="mt-2">
                We&apos;ve sent a verification link to your email address.
                Please check your inbox and click the link to verify your account.
              </CardDescription>
            </div>
            <div className="space-y-2">
              <Button variant="outline" asChild className="w-full">
                <Link to="/auth/sign-in">Back to Sign In</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
