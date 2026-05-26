import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Eye, EyeOff, Loader2 } from "lucide-react"

import { Button } from "~/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card"
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"
import { cn } from "~/lib/utils"

const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
})

type LoginFormValues = z.infer<typeof loginSchema>

interface AuthLoginCardProps extends React.HTMLAttributes<HTMLDivElement> {
  onSignInWithCredentials?: (values: LoginFormValues) => Promise<void>
  onSignInWithProvider?: (provider: "google" | "github") => Promise<void>
}

export function AuthLoginCard({
  className,
  onSignInWithCredentials,
  onSignInWithProvider,
  ...props
}: AuthLoginCardProps) {
  const [showPassword, setShowPassword] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(false)
  const [activeProvider, setActiveProvider] = React.useState<"credentials" | "google" | "github" | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  async function onSubmit(data: LoginFormValues) {
    if (!onSignInWithCredentials) return
    setIsLoading(true)
    setActiveProvider("credentials")
    try {
      await onSignInWithCredentials(data)
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
      setActiveProvider(null)
    }
  }

  async function handleProviderLogin(provider: "google" | "github") {
    if (!onSignInWithProvider) return
    setIsLoading(true)
    setActiveProvider(provider)
    try {
      await onSignInWithProvider(provider)
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
      setActiveProvider(null)
    }
  }

  return (
    <div className={cn("grid gap-6 w-full max-w-md mx-auto", className)} {...props}>
      <Card className="border-muted/40 shadow-xl backdrop-blur-[2px] bg-card/90">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold tracking-tight">Create an account</CardTitle>
          <CardDescription className="text-muted-foreground">
            Enter your email below to sign in or register your workspace
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email" className={cn(errors.email && "text-destructive")}>Email</Label>
                <Input
                  id="email"
                  placeholder="name@example.com"
                  type="email"
                  autoCapitalize="none"
                  autoComplete="email"
                  autoCorrect="off"
                  disabled={isLoading}
                  className={cn(
                    "bg-muted/10 border-muted/50 focus-visible:ring-primary/50",
                    errors.email && "border-destructive focus-visible:ring-destructive/50"
                  )}
                  {...register("email")}
                />
                {errors.email && (
                  <p className="text-[12px] font-medium text-destructive mt-0.5">
                    {errors.email.message}
                  </p>
                )}
              </div>
              <div className="grid gap-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className={cn(errors.password && "text-destructive")}>Password</Label>
                  <a
                    href="/auth/forgot-password"
                    className="text-xs text-muted-foreground hover:text-primary underline underline-offset-4"
                  >
                    Forgot password?
                  </a>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoCapitalize="none"
                    autoComplete="current-password"
                    disabled={isLoading}
                    className={cn(
                      "bg-muted/10 border-muted/50 focus-visible:ring-primary/50 pr-10",
                      errors.password && "border-destructive focus-visible:ring-destructive/50"
                    )}
                    {...register("password")}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-muted-foreground hover:text-foreground"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" aria-hidden="true" />
                    ) : (
                      <Eye className="h-4 w-4" aria-hidden="true" />
                    )}
                  </Button>
                </div>
                {errors.password && (
                  <p className="text-[12px] font-medium text-destructive mt-0.5">
                    {errors.password.message}
                  </p>
                )}
              </div>
              <Button type="submit" disabled={isLoading} className="w-full font-semibold shadow-sm transition-transform active:scale-[0.98]">
                {isLoading && activeProvider === "credentials" && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Sign In with Email
              </Button>
            </div>
          </form>
          
          <div className="relative my-2">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-muted/50" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              type="button"
              disabled={isLoading}
              onClick={() => handleProviderLogin("github")}
              className="bg-muted/10 border-muted/50 hover:bg-muted/20 font-medium transition-all"
            >
              {isLoading && activeProvider === "github" ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <svg className="mr-2 h-4 w-4 fill-current" viewBox="0 0 24 24">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.577.688.479C19.138 20.162 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
                </svg>
              )}
              Github
            </Button>
            <Button
              variant="outline"
              type="button"
              disabled={isLoading}
              onClick={() => handleProviderLogin("google")}
              className="bg-muted/10 border-muted/50 hover:bg-muted/20 font-medium transition-all"
            >
              {isLoading && activeProvider === "google" ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
              )}
              Google
            </Button>
          </div>
        </CardContent>
        <CardFooter className="flex flex-wrap items-center justify-center gap-1 border-t border-muted/30 py-4 bg-muted/5 rounded-b-xl">
          <span className="text-xs text-muted-foreground">Don&apos;t have an account?</span>
          <a
            href="/auth/sign-up"
            className="text-xs text-primary font-semibold hover:underline underline-offset-4"
          >
            Create account
          </a>
        </CardFooter>
      </Card>
    </div>
  )
}
