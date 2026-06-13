import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Check, Zap, CreditCard } from "lucide-react";

const STARTER_BENEFITS = [
  "Up to 3 Active Projects",
  "Standard R2 Upload speed",
  "Community support",
  "Basic Email notifications",
];

const PRO_BENEFITS = [
  "Unlimited Active Projects",
  "Priority R2 Upload speed",
  "Priority support",
  "Advanced Email notifications",
  "Custom domain support",
  "AI Chat integration",
];

export default function Billing() {
  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Billing & Subscription</h1>
        <p className="text-muted-foreground text-sm">
          Manage your subscription plan and billing details.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <CreditCard className="size-5 text-muted-foreground" />
              <CardTitle>Starter</CardTitle>
            </div>
            <p className="text-2xl font-bold">$0<span className="text-sm font-normal text-muted-foreground">/month</span></p>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="space-y-2">
              {STARTER_BENEFITS.map((benefit) => (
                <li key={benefit} className="flex items-center gap-2 text-sm">
                  <Check className="size-4 text-green-500" />
                  {benefit}
                </li>
              ))}
            </ul>
            <Button variant="outline" className="w-full" disabled>
              Current Plan
            </Button>
          </CardContent>
        </Card>

        <Card className="border-primary">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Zap className="size-5 text-primary" />
              <CardTitle>Pro</CardTitle>
            </div>
            <p className="text-2xl font-bold">$19<span className="text-sm font-normal text-muted-foreground">/month</span></p>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="space-y-2">
              {PRO_BENEFITS.map((benefit) => (
                <li key={benefit} className="flex items-center gap-2 text-sm">
                  <Check className="size-4 text-green-500" />
                  {benefit}
                </li>
              ))}
            </ul>
            <Button className="w-full">
              Upgrade to Pro
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
