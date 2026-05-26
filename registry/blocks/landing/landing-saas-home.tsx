import * as React from "react"
import { Check, ArrowRight, Star, Sparkles, MessageSquare, Shield, Zap, Globe } from "lucide-react"

import { Button } from "~/components/ui/button"
import { cn } from "~/lib/utils"

export function LandingSaasHome() {
  const [billingPeriod, setBillingPeriod] = React.useState<"monthly" | "annually">("annually")

  const features = [
    {
      icon: Zap,
      title: "Real-time sync",
      description: "Instantly reflect data updates across your client dashboards with Zero latency.",
      color: "from-amber-500/20 to-orange-500/20 text-amber-600 dark:text-amber-400",
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      description: "Your session keys and user logs are encrypted end-to-end under state-of-the-art parameters.",
      color: "from-blue-500/20 to-indigo-500/20 text-blue-600 dark:text-blue-400",
    },
    {
      icon: Globe,
      title: "Global CDN Edge",
      description: "Deployed natively inside Cloudflare Workers to deliver lightning-fast responses from the closest node.",
      color: "from-emerald-500/20 to-teal-500/20 text-emerald-600 dark:text-emerald-400",
    },
  ]

  const pricingPlans = [
    {
      name: "Starter",
      description: "Perfect for indie makers and small experimental projects.",
      monthlyPrice: 19,
      annualPrice: 15,
      features: [
        "Up to 3 active projects",
        "SQLite database (Turso)",
        "Basic tRPC queries",
        "Better Auth core hooks",
        "Community support",
      ],
      cta: "Get Started Free",
      popular: false,
    },
    {
      name: "Pro",
      description: "For professional teams building high-conversion SaaS platforms.",
      monthlyPrice: 49,
      annualPrice: 39,
      features: [
        "Unlimited active projects",
        "Distributed Edge Databases",
        "Workers AI chat streaming integrations",
        "R2 uploads presigned buffers",
        "Premium support channels",
        "Custom domain mapping",
      ],
      cta: "Upgrade to Pro",
      popular: true,
    },
  ]

  const testimonials = [
    {
      content: "This template is the gold standard for full-stack developers. The React Router v7 and Better Auth integration saved me days of setup.",
      author: "Alex Rivers",
      role: "Founder, SaaSFlow",
      rating: 5,
    },
    {
      content: "Absolute masterpiece. The edge database speed with Turso combined with tRPC v11 makes our dashboard experience feel instant.",
      author: "Sarah Jenkins",
      role: "CTO, EdgeLabs",
      rating: 5,
    },
  ]

  return (
    <div className="w-full relative overflow-hidden bg-background text-foreground py-10 space-y-24">
      {/* Ambient Gradient glow overlays */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[500px] bg-gradient-to-b from-primary/10 via-transparent to-transparent blur-3xl pointer-events-none -z-10" />

      {/* 🚀 Hero Section */}
      <section className="max-w-6xl mx-auto px-4 text-center space-y-8 relative">
        <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-xs text-primary font-semibold select-none animate-pulse">
          <Sparkles className="h-3 w-3" />
          Introducing Custom Shadcn Registry
        </div>
        
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-foreground via-foreground to-muted-foreground max-w-3xl mx-auto leading-tight">
          Launch premium full-stack edge products in minutes
        </h1>
        
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          The ultimate boilerplate configured with React Router v7, Tailwind CSS v4, Better Auth, and tRPC v11, running natively on Cloudflare Edge.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <Button size="lg" className="font-semibold shadow-md gap-2 group active:scale-[0.98] transition-transform">
            Get Started
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
          <Button size="lg" variant="outline" className="font-semibold bg-transparent border-muted/50 hover:bg-muted/10">
            View Github
          </Button>
        </div>

        {/* Mock Screen Display */}
        <div className="mt-16 rounded-xl border border-muted/40 bg-muted/5 shadow-2xl p-2 max-w-4xl mx-auto backdrop-blur-[2px]">
          <div className="rounded-lg overflow-hidden border border-muted/30 bg-card aspect-[16/9] flex items-center justify-center relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-muted/20 via-transparent to-primary/5" />
            <div className="space-y-3 text-center z-10 px-4">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary border border-primary/20 shadow-inner">
                <Zap className="h-6 w-6" />
              </div>
              <p className="font-mono text-xs text-muted-foreground select-none">
                npx shadcn add http://localhost:5173/r/auth-login-card.json
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 🧩 Bento Features Grid */}
      <section className="max-w-6xl mx-auto px-4 space-y-12">
        <div className="text-center space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Fully loaded modern stack</h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Vetted architectures ready for production workloads with zero licensing locks.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {features.map((feat, index) => {
            const IconComponent = feat.icon
            return (
              <div
                key={index}
                className="group p-6 rounded-2xl border border-muted/40 bg-card/50 hover:bg-card hover:border-muted-foreground/20 hover:shadow-lg transition-all duration-300 relative overflow-hidden"
              >
                <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${feat.color} mb-4 shadow-sm border border-current/10`}>
                  <IconComponent className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-bold mb-2 tracking-tight group-hover:text-primary transition-colors">{feat.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{feat.description}</p>
              </div>
            )
          })}
        </div>
      </section>

      {/* 📊 Tabbed Pricing Section */}
      <section className="max-w-6xl mx-auto px-4 space-y-12 relative">
        <div className="text-center space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Simple, transparent pricing</h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Choose a plan that fits your business scale. Switch or cancel at any time.
          </p>

          {/* Tab Slider Toggle */}
          <div className="inline-flex p-1 rounded-full bg-muted/20 border border-muted/50 select-none">
            <button
              onClick={() => setBillingPeriod("monthly")}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                billingPeriod === "monthly"
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingPeriod("annually")}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1 ${
                billingPeriod === "annually"
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Annually
              <span className="text-[10px] font-bold text-primary bg-primary/10 border border-primary/20 px-1.5 py-0.5 rounded-full">
                -20%
              </span>
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          {pricingPlans.map((plan, index) => {
            const price = billingPeriod === "annually" ? plan.annualPrice : plan.monthlyPrice
            return (
              <div
                key={index}
                className={`relative rounded-3xl border p-8 flex flex-col justify-between transition-all duration-300 ${
                  plan.popular
                    ? "border-primary/50 shadow-xl bg-card dark:bg-card/80 scale-[1.02] md:scale-105"
                    : "border-muted/40 bg-card/40 hover:bg-card/60"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-primary text-primary-foreground shadow-sm select-none">
                    Most Popular
                  </div>
                )}
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-bold tracking-tight">{plan.name}</h3>
                    <p className="text-xs text-muted-foreground mt-1 min-h-[32px]">{plan.description}</p>
                  </div>
                  
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-extrabold tracking-tight">${price}</span>
                    <span className="text-muted-foreground text-xs">/ user / month</span>
                  </div>

                  <hr className="border-muted/30" />

                  <ul className="space-y-2.5">
                    {plan.features.map((feat, fIdx) => (
                      <li key={fIdx} className="flex items-center gap-2 text-sm">
                        <Check className="h-4 w-4 text-primary shrink-0" />
                        <span className="text-muted-foreground">{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Button
                  className={`w-full mt-8 font-semibold ${
                    plan.popular ? "shadow-md" : "bg-muted/10 border-muted/50 text-foreground hover:bg-muted/20"
                  }`}
                  variant={plan.popular ? "default" : "outline"}
                >
                  {plan.cta}
                </Button>
              </div>
            )
          })}
        </div>
      </section>

      {/* 💬 Testimonial Grid Section */}
      <section className="max-w-6xl mx-auto px-4 space-y-12">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold tracking-tight">Loved by developers</h2>
          <p className="text-muted-foreground max-w-sm mx-auto">
            Indie makers are building and shipping high-end products daily.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {testimonials.map((test, index) => (
            <Card key={index} className="border-muted/40 p-6 space-y-4 shadow-sm bg-card/65 select-none hover:bg-card transition-colors duration-300">
              <div className="flex gap-1 text-primary">
                {Array.from({ length: test.rating }).map((_, rIdx) => (
                  <Star key={rIdx} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <p className="text-sm italic text-muted-foreground leading-relaxed">&ldquo;{test.content}&rdquo;</p>
              <div className="flex items-center gap-2 border-t border-muted/30 pt-3">
                <div className="h-8 w-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center font-bold text-xs text-primary">
                  {test.author[0]}
                </div>
                <div>
                  <h4 className="text-xs font-semibold">{test.author}</h4>
                  <p className="text-[10px] text-muted-foreground">{test.role}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* 📣 CTA Banner */}
      <section className="max-w-4xl mx-auto px-4 pt-10">
        <div className="relative rounded-3xl border border-primary/20 bg-gradient-to-tr from-card via-card to-primary/5 p-8 md:p-12 text-center space-y-6 overflow-hidden shadow-xl">
          <div className="absolute inset-0 bg-grid-pattern opacity-5" />
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Ready to deploy at the Edge?</h2>
          <p className="text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
            Download the boilerplate schema, scaffold your database, and boot your local server in seconds.
          </p>
          <Button size="lg" className="font-semibold shadow-md gap-2 group active:scale-[0.98] transition-transform">
            Start Building Now
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </section>
    </div>
  )
}
export const Card = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("rounded-xl border bg-card text-card-foreground shadow", className)} {...props} />
)
