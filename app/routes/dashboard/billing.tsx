import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "~/providers/trpc-provider";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
  Check,
  Zap,
  CreditCard,
  Download,
  ShieldCheck,
  Sparkles,
  Loader2,
} from "lucide-react";
import type { Route } from "./+types/billing";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Billing & Subscription | Boilerplate" }];
}

export async function loader({}: Route.LoaderArgs) {
  return {};
}

const STARTER_BENEFITS = [
  "Up to 3 Active Projects",
  "Standard R2 Upload speed",
  "Community support",
  "Basic Email notifications",
];

const PRO_BENEFITS = [
  "Unlimited Active Projects",
  "Priority AI Chat access",
  "10 GB R2 Storage Uploads",
  "Dedicated Resend Email delivery",
  "Hourly Cron triggers enabled",
  "Premium 24/7 priority support",
];

const MOCK_INVOICES = [
  { id: "INV-2026-003", date: "2026-05-20", amount: "$19.00", status: "Paid" },
  { id: "INV-2026-002", date: "2026-04-20", amount: "$19.00", status: "Paid" },
  { id: "INV-2026-001", date: "2026-03-20", amount: "$19.00", status: "Paid" },
];

export default function BillingPage() {
  const trpc = useTRPC();
  const { data: user, isLoading } = useQuery(trpc.user.getMe.queryOptions());

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    );
  }

  const currentTier = user?.subscriptionTier ?? "Starter";
  const isPro = currentTier === "Pro";

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-16 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex flex-col gap-2 border-b border-border/40 pb-6">
        <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
          Subscription & Billing
        </h1>
        <p className="text-muted-foreground text-sm">
          Manage your subscription tier, billing methods, and invoice history.
        </p>
      </div>

      {/* Overview Card */}
      <Card className="relative overflow-hidden bg-background/40 backdrop-blur-xl border border-border/60 shadow-xl rounded-2xl">
        <div className="absolute top-0 right-0 p-6 opacity-10">
          <CreditCard className="size-36 text-indigo-500" />
        </div>
        <CardHeader>
          <div className="flex items-center gap-3">
            <CardTitle className="text-xl font-bold">Current Subscription</CardTitle>
            <Badge
              variant={isPro ? "default" : "secondary"}
              className={
                isPro
                  ? "bg-indigo-500 hover:bg-indigo-600 text-white font-semibold"
                  : "bg-muted text-muted-foreground font-medium"
              }
            >
              {currentTier} Plan
            </Badge>
          </div>
          <CardDescription>
            You are currently on the {currentTier} plan.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <p className="text-sm font-semibold text-foreground">
                {isPro ? "Pro Plan Yearly Billing" : "Starter Free Plan"}
              </p>
              <p className="text-xs text-muted-foreground">
                {isPro
                  ? "Your next billing cycle updates automatically."
                  : "Upgrade to premium to unlock advanced AI, R2 uploading, and emails."}
              </p>
            </div>
            {!isPro && (
              <Button
                asChild
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 font-semibold shadow-lg hover:shadow-indigo-500/20"
              >
                <a
                  href="https://checkout.stripe.com/pay/stub_checkout_session"
                  target="_blank"
                  rel="noreferrer"
                >
                  Upgrade to Pro Now
                </a>
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Pricing Plans & Benefits */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Starter Plan */}
        <Card className="bg-card border border-border/50 hover:border-border transition-all flex flex-col justify-between">
          <CardHeader>
            <CardTitle className="text-lg font-bold flex items-center justify-between">
              Starter
              <Badge variant="outline" className="text-xs font-normal">Free</Badge>
            </CardTitle>
            <CardDescription>Perfect for personal developer test spaces.</CardDescription>
            <div className="mt-4">
              <span className="text-3xl font-extrabold">$0</span>
              <span className="text-muted-foreground text-sm font-medium"> / month</span>
            </div>
          </CardHeader>
          <CardContent className="space-y-6 flex-grow">
            <div className="border-t border-border/40 pt-4" />
            <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              Starter Plan Benefits
            </h4>
            <ul id="starter-benefits-list" className="space-y-3">
              {STARTER_BENEFITS.map((benefit) => (
                <li key={benefit} className="flex items-start gap-2 text-sm text-foreground">
                  <Check className="size-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          </CardContent>
          <div className="p-6 pt-0">
            <Button variant="outline" className="w-full" disabled={!isPro}>
              {isPro ? "Downgrade to Free" : "Current Plan"}
            </Button>
          </div>
        </Card>

        {/* Pro Plan */}
        <Card className="relative overflow-hidden bg-card border-indigo-500/40 hover:border-indigo-500/80 transition-all flex flex-col justify-between shadow-md">
          <div className="absolute top-0 right-0 bg-indigo-500 text-white text-[10px] font-bold px-3 py-1 rounded-bl-lg flex items-center gap-1">
            <Sparkles className="size-3" /> RECOMMENDED
          </div>
          <CardHeader>
            <CardTitle className="text-lg font-bold flex items-center justify-between">
              Pro Plan
              <Badge className="bg-indigo-500 text-white text-xs hover:bg-indigo-600">Popular</Badge>
            </CardTitle>
            <CardDescription>Unleash premium modules, storage, and notifications.</CardDescription>
            <div className="mt-4">
              <span className="text-3xl font-extrabold">$19</span>
              <span className="text-muted-foreground text-sm font-medium"> / month</span>
            </div>
          </CardHeader>
          <CardContent className="space-y-6 flex-grow">
            <div className="border-t border-border/40 pt-4" />
            <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              Pro Plan Benefits
            </h4>
            <ul id="pro-benefits-list" className="space-y-3">
              {PRO_BENEFITS.map((benefit) => (
                <li key={benefit} className="flex items-start gap-2 text-sm text-foreground">
                  <Zap className="size-4 text-indigo-500 shrink-0 mt-0.5 fill-indigo-500" />
                  <span className="font-medium">{benefit}</span>
                </li>
              ))}
            </ul>
          </CardContent>
          <div className="p-6 pt-0">
            {isPro ? (
              <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold gap-1.5 cursor-default">
                <ShieldCheck className="size-4" /> Active Subscription
              </Button>
            ) : (
              <Button asChild className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-md">
                <a href="https://checkout.stripe.com/pay/stub_checkout_session" target="_blank" rel="noreferrer">
                  Upgrade to Pro Now
                </a>
              </Button>
            )}
          </div>
        </Card>
      </div>

      {/* Invoice History */}
      <Card className="border border-border/60 shadow-lg rounded-2xl overflow-hidden">
        <CardHeader>
          <CardTitle className="text-xl font-bold">Billing Invoice History</CardTitle>
          <CardDescription>View and download past invoices on your account.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table id="billing-invoices-table" className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border bg-muted/30 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  <th className="p-4 pl-6">Invoice ID</th>
                  <th className="p-4">Date</th>
                  <th className="p-4">Amount</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 pr-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60 text-sm">
                {MOCK_INVOICES.map((invoice) => (
                  <tr key={invoice.id} className="hover:bg-muted/10 transition-colors">
                    <td className="p-4 pl-6 font-mono font-medium text-foreground">{invoice.id}</td>
                    <td className="p-4 text-muted-foreground">{invoice.date}</td>
                    <td className="p-4 text-foreground font-semibold">{invoice.amount}</td>
                    <td className="p-4">
                      <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/10 border-emerald-500/20 px-2 py-0.5">
                        {invoice.status}
                      </Badge>
                    </td>
                    <td className="p-4 pr-6 text-right">
                      <Button variant="ghost" size="sm" className="h-8 gap-1 text-xs">
                        <Download className="size-3.5" /> Download
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
