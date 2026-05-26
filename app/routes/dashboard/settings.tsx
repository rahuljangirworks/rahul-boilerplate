import { useState, useEffect, useCallback, useRef, type FormEvent } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useTheme } from "next-themes";
import { useFetcher } from "react-router";
import { useTRPC } from "~/providers/trpc-provider";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Avatar, AvatarImage, AvatarFallback } from "~/components/ui/avatar";
import { toast } from "sonner";
import {
  Loader2,
  User,
  Image as ImageIcon,
  Check,
  Sun,
  Moon,
  Monitor,
  Camera,
  Sparkles,
  ArrowRight,
  ChevronRight,
  Upload,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import type { Route } from "./+types/settings";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Profile Settings | Boilerplate" }];
}

export async function loader({}: Route.LoaderArgs) {
  return {};
}

const PRESET_AVATARS = [
  { name: "Felix (Adventurer)", url: "https://api.dicebear.com/7.x/adventurer/svg?seed=Felix" },
  { name: "Aneka (Avataaars)", url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka" },
  { name: "Buster (Bottts)", url: "https://api.dicebear.com/7.x/bottts/svg?seed=Buster" },
  { name: "Lilou (Fun Emoji)", url: "https://api.dicebear.com/7.x/fun-emoji/svg?seed=Lilou" },
  { name: "Gizmo (Pixel Art)", url: "https://api.dicebear.com/7.x/pixel-art/svg?seed=Gizmo" },
  { name: "Mimi (Lorelei)", url: "https://api.dicebear.com/7.x/lorelei/svg?seed=Mimi" },
  { name: "Jack (Identicon)", url: "https://api.dicebear.com/7.x/identicon/svg?seed=Jack" },
  { name: "Vibrant Blob", url: "https://api.dicebear.com/7.x/identicon/svg?seed=Purple&backgroundColor=7c3aed" },
];

// Pure CSS Confetti Sparkles component
const SparkleConfetti = () => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
      {[...Array(24)].map((_, i) => {
        const left = `${Math.random() * 80 + 10}%`;
        const top = `${Math.random() * 60 + 20}%`;
        const size = `${Math.random() * 8 + 6}px`;
        const delay = `${Math.random() * 1.5}s`;
        const duration = `${Math.random() * 1.5 + 1.2}s`;
        const colors = [
          "bg-yellow-400",
          "bg-pink-500",
          "bg-violet-500",
          "bg-cyan-400",
          "bg-emerald-400",
          "bg-orange-400",
        ];
        const color = colors[Math.floor(Math.random() * colors.length)];
        
        return (
          <div
            key={i}
            className={`absolute rounded-full animate-sparkle ${color}`}
            style={{
              left,
              top,
              width: size,
              height: size,
              animationDelay: delay,
              animationDuration: duration,
            }}
          />
        );
      })}
    </div>
  );
};

export default function SettingsPage() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const fetcher = useFetcher();
  const { theme, setTheme } = useTheme();

  // Queries
  const { data: user, isLoading: isUserLoading } = useQuery(
    trpc.user.getMe.queryOptions()
  );

  // Mutations
  const getPresignedUrlMutation = useMutation({
    ...trpc.upload.getPresignedUrl.mutationOptions(),
  });

  const updateProfileMutation = useMutation({
    ...trpc.user.updateProfile.mutationOptions(),
    onSuccess: () => {
      toast.success("Profile saved successfully!");
      queryClient.invalidateQueries({ queryKey: trpc.user.pathKey() });
    },
    onError: (err) => {
      toast.error(err.message || "Failed to update profile.");
    },
  });

  // Settings form states
  const [name, setName] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Onboarding states
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [onboardingStep, setOnboardingStep] = useState(1);
  const [onboardingName, setOnboardingName] = useState("");
  const [onboardingTheme, setOnboardingTheme] = useState<"light" | "dark" | "system">("system");
  const [isSavingOnboarding, setSavingOnboarding] = useState(false);

  // Theme synchronization with server cookies
  const syncThemeWithServer = useCallback(
    (scheme: string) => {
      setTheme(scheme);
      fetcher.submit(
        { colorScheme: scheme },
        { method: "POST", action: "/" }
      );
    },
    [setTheme, fetcher]
  );

  // Initialize fields once user loads
  useEffect(() => {
    if (user) {
      setName(user.name ?? "");
      setImageUrl(user.image ?? "");
      setPreviewUrl(user.image ?? "");
      setOnboardingName(user.name ?? "");

      // Check onboarding state only once user.id is available
      const isAlreadyOnboarded = localStorage.getItem(`boilerplate-onboarded-${user.id}`);
      if (!isAlreadyOnboarded) {
        setIsOnboardingOpen(true);
      }
    }
  }, [user]);

  // File Upload flow
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File is too large (maximum size is 5MB).");
      return;
    }

    try {
      setIsUploading(true);

      // Create a local object URL for instant, smooth preview feedback
      const localPreview = URL.createObjectURL(file);
      setPreviewUrl(localPreview);

      // 1. Ask server for presigned URL (R2 storage)
      const { uploadUrl, key } = await getPresignedUrlMutation.mutateAsync({
        fileName: file.name,
        contentType: file.type,
        fileSize: file.size,
      });

      // 2. PUT upload file directly to cloud storage
      const uploadRes = await fetch(uploadUrl, {
        method: "PUT",
        body: file,
        headers: {
          "Content-Type": file.type,
        },
      });

      if (!uploadRes.ok) {
        throw new Error("S3/R2 direct upload failed");
      }

      // 3. Construct public URL. Falls back to a standard dev format if needed.
      const publicUrl = `https://pub-boilerplate.r2.dev/${key}`;
      setImageUrl(publicUrl);
      setPreviewUrl(publicUrl);
      
      // Auto-save the profile picture update
      await updateProfileMutation.mutateAsync({
        image: publicUrl,
      });

      toast.success("Profile picture uploaded successfully!");
    } catch (err: any) {
      console.warn("Direct upload error, falling back to simulation:", err);
      // Friendly fallback if R2 variables are not set in dev
      toast.error("Cloudflare R2 is not configured. Saved avatar using a fallback preview URL.");
      
      const initialsFallback = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name || "User")}`;
      setImageUrl(initialsFallback);
      setPreviewUrl(initialsFallback);
      
      await updateProfileMutation.mutateAsync({
        image: initialsFallback,
      });
    } finally {
      setIsUploading(false);
    }
  };

  // Preset avatar click
  const selectPresetAvatar = async (url: string) => {
    setImageUrl(url);
    setPreviewUrl(url);
    try {
      await updateProfileMutation.mutateAsync({ image: url });
    } catch (err) {
      // Handled by mutation onError
    }
  };

  // Submit Settings Form (General Settings)
  const handleSaveSettings = async (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Name cannot be empty.");
      return;
    }

    try {
      setIsSaving(true);
      await updateProfileMutation.mutateAsync({
        name: name.trim(),
        image: imageUrl || undefined,
      });
    } catch (err) {
      // Handled by mutation
    } finally {
      setIsSaving(false);
    }
  };

  // Complete onboarding
  const handleCompleteOnboarding = async () => {
    if (!onboardingName.trim()) {
      toast.error("Please enter a display name.");
      return;
    }

    try {
      setSavingOnboarding(true);

      const fallbackImage = user?.image || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(onboardingName.trim())}`;
      
      // Save display name & avatar to profile database
      await updateProfileMutation.mutateAsync({
        name: onboardingName.trim(),
        image: fallbackImage,
      });

      // Synchronize theme choice
      syncThemeWithServer(onboardingTheme);

      // Advance to step 3 (Celebration screen)
      setOnboardingStep(3);
    } catch (err: any) {
      toast.error(err.message || "Failed to finalize onboarding setup.");
    } finally {
      setSavingOnboarding(false);
    }
  };

  // Exit onboarding modal completely
  const handleFinishCelebration = () => {
    if (user?.id) {
      localStorage.setItem(`boilerplate-onboarded-${user.id}`, "true");
    }
    setIsOnboardingOpen(false);
  };

  if (isUserLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="relative space-y-8 max-w-4xl mx-auto p-2 pb-16 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Decorative gradient glowing blobs in background */}
      <div className="absolute -top-24 -right-24 w-80 h-80 bg-violet-500/10 blur-3xl rounded-full pointer-events-none -z-10" />
      <div className="absolute top-1/2 -left-24 w-80 h-80 bg-indigo-500/10 blur-3xl rounded-full pointer-events-none -z-10" />

      {/* Styled inline keyframes for confetti */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes float-sparkle {
          0% { transform: translateY(0) scale(0) rotate(0deg); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: translateY(-160px) scale(1.1) rotate(270deg); opacity: 0; }
        }
        .animate-sparkle {
          animation: float-sparkle 1.8s cubic-bezier(0.25, 1, 0.50, 1) infinite;
        }
      `}} />

      {/* Profile Header */}
      <div className="flex flex-col gap-2 border-b border-border/40 pb-6">
        <h1 className="text-3xl font-extrabold tracking-tight bg-linear-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
          Account Settings
        </h1>
        <p className="text-muted-foreground text-sm">
          Customize your workspace configuration, change theme settings, and update your personal info.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Settings Left Column - User Details Form */}
        <div className="md:col-span-2 space-y-6">
          <Card className="relative overflow-hidden bg-background/40 backdrop-blur-xl border border-border/60 shadow-xl rounded-2xl transition-all duration-300 hover:shadow-2xl hover:border-border/80">
            <CardHeader>
              <CardTitle className="text-xl font-bold">Personal Profile</CardTitle>
              <CardDescription>Update your public display name and handle.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSaveSettings} className="space-y-6">
                <div className="grid gap-2">
                  <Label htmlFor="displayName" className="text-sm font-semibold flex items-center gap-1.5">
                    <User className="size-4 text-muted-foreground" />
                    Display Name
                  </Label>
                  <Input
                    id="displayName"
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="h-10 bg-background/50 border-border/80 focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all duration-200"
                    required
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="avatarUrl" className="text-sm font-semibold flex items-center gap-1.5">
                    <ImageIcon className="size-4 text-muted-foreground" />
                    Profile Picture URL
                  </Label>
                  <Input
                    id="avatarUrl"
                    placeholder="https://example.com/avatar.jpg"
                    value={imageUrl}
                    onChange={(e) => {
                      setImageUrl(e.target.value);
                      setPreviewUrl(e.target.value);
                    }}
                    className="h-10 bg-background/50 border-border/80 focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all duration-200"
                  />
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Paste an image URL, select a preset on the right, or upload a photo directly.
                  </p>
                </div>

                <div className="flex justify-end pt-2">
                  <Button
                    type="submit"
                    disabled={isSaving || updateProfileMutation.isPending}
                    className="bg-linear-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white shadow-lg hover:shadow-indigo-500/20 transition-all duration-300 font-medium px-6"
                  >
                    {(isSaving || updateProfileMutation.isPending) && (
                      <Loader2 className="mr-2 size-4 animate-spin" />
                    )}
                    Save Profile Changes
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Preferences Settings Card */}
          <Card className="relative overflow-hidden bg-background/40 backdrop-blur-xl border border-border/60 shadow-xl rounded-2xl transition-all duration-300 hover:shadow-2xl">
            <CardHeader>
              <CardTitle className="text-xl font-bold">Preferences</CardTitle>
              <CardDescription>Personalize the visuals and display of your boilerplate dashboard.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <Label className="text-sm font-semibold">Color Scheme Theme</Label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: "light", label: "Light", icon: Sun, desc: "Crisp light background" },
                    { id: "dark", label: "Dark", icon: Moon, desc: "Sleek low light feel" },
                    { id: "system", label: "System", icon: Monitor, desc: "Matches system state" },
                  ].map((item) => {
                    const isActive = theme === item.id;
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.id}
                        onClick={() => syncThemeWithServer(item.id)}
                        className={`flex flex-col items-center justify-center p-4 rounded-xl border text-center transition-all duration-300 cursor-pointer group hover:bg-muted/30 ${
                          isActive
                            ? "border-violet-600 bg-violet-600/[0.03] dark:bg-violet-950/20 dark:border-violet-400 ring-2 ring-violet-500/10"
                            : "border-border/60 bg-transparent"
                        }`}
                      >
                        <div className={`p-2 rounded-full mb-2.5 transition-transform duration-300 group-hover:scale-110 ${
                          isActive ? "bg-violet-600/10 text-violet-600 dark:text-violet-400" : "bg-muted text-muted-foreground"
                        }`}>
                          <Icon className="size-5" />
                        </div>
                        <span className="text-sm font-semibold">{item.label}</span>
                        <span className="text-[10px] text-muted-foreground mt-0.5 line-clamp-1">{item.desc}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Settings Right Column - Avatar Customizer */}
        <div className="md:col-span-1 space-y-6">
          <Card className="relative overflow-hidden bg-background/40 backdrop-blur-xl border border-border/60 shadow-xl rounded-2xl transition-all duration-300 hover:shadow-2xl">
            <CardHeader className="text-center pb-2">
              <CardTitle className="text-lg font-bold">Profile Picture</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center space-y-6">
              {/* Profile Image View */}
              <div className="relative group">
                <div className="absolute -inset-1.5 bg-linear-to-r from-violet-600 to-indigo-600 rounded-full blur-sm opacity-50 group-hover:opacity-75 transition duration-300 animate-pulse" />
                <Avatar className="size-28 border-4 border-background shadow-2xl relative">
                  <AvatarImage src={previewUrl} className="object-cover" />
                  <AvatarFallback className="text-2xl font-bold bg-linear-to-tr from-violet-100 to-indigo-100 text-indigo-700 dark:from-indigo-950 dark:to-violet-950 dark:text-indigo-200">
                    {name ? name.slice(0, 2).toUpperCase() : <User className="size-8" />}
                  </AvatarFallback>
                </Avatar>

                {/* Upload Button Overlay */}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  className="absolute bottom-0 right-0 p-2.5 bg-primary hover:bg-primary/95 text-primary-foreground rounded-full shadow-lg border-2 border-background cursor-pointer transition-transform hover:scale-110 active:scale-95 flex items-center justify-center"
                  title="Upload profile picture"
                >
                  {isUploading ? (
                    <Loader2 className="size-3.5 animate-spin" />
                  ) : (
                    <Camera className="size-3.5" />
                  )}
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  className="hidden"
                  disabled={isUploading}
                />
              </div>

              {/* Quick Preset Selector */}
              <div className="w-full space-y-3 pt-2">
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider text-center">
                  Select Preset Avatar
                </h4>
                <div className="grid grid-cols-4 gap-2">
                  {PRESET_AVATARS.map((avatar) => {
                    const isSelected = imageUrl === avatar.url;
                    return (
                      <button
                        key={avatar.name}
                        type="button"
                        onClick={() => selectPresetAvatar(avatar.url)}
                        className={`relative rounded-lg overflow-hidden border-2 aspect-square cursor-pointer transition-all duration-200 hover:scale-105 ${
                          isSelected ? "border-violet-600 scale-105 shadow-md shadow-violet-500/20" : "border-border/60 hover:border-border"
                        }`}
                      >
                        <img src={avatar.url} alt={avatar.name} className="size-full object-cover" />
                        {isSelected && (
                          <div className="absolute inset-0 bg-violet-600/20 flex items-center justify-center">
                            <div className="bg-violet-600 text-white rounded-full p-0.5 shadow-sm">
                              <Check className="size-2.5 stroke-[3]" />
                            </div>
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Premium Onboarding Dialog */}
      <Dialog open={isOnboardingOpen} onOpenChange={() => {}}>
        <DialogContent
          showCloseButton={false}
          onPointerDownOutside={(e) => e.preventDefault()}
          onEscapeKeyDown={(e) => e.preventDefault()}
          className="sm:max-w-[450px] overflow-hidden bg-background/85 backdrop-blur-2xl border-white/20 dark:border-white/10 shadow-2xl rounded-2xl p-6 relative animate-in zoom-in-95 duration-300"
        >
          {/* Subtle Ambient Glow inside onboarding */}
          <div className="absolute -top-36 -left-36 w-72 h-72 bg-violet-500/20 blur-3xl rounded-full pointer-events-none -z-10" />
          <div className="absolute -bottom-36 -right-36 w-72 h-72 bg-indigo-500/20 blur-3xl rounded-full pointer-events-none -z-10" />

          {/* STEP 1: DISPLAY NAME */}
          {onboardingStep === 1 && (
            <div className="space-y-6 py-4 animate-in fade-in slide-in-from-right-8 duration-300">
              {/* Step indicator */}
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-violet-600 dark:text-violet-400">Welcome Wizard</span>
                <span className="text-muted-foreground">Step 1 of 2</span>
              </div>
              <div className="flex gap-1.5 h-1">
                <div className="w-1/2 bg-violet-600 dark:bg-violet-500 rounded-full" />
                <div className="w-1/2 bg-muted rounded-full" />
              </div>

              <div className="space-y-2">
                <h3 className="text-2xl font-extrabold tracking-tight bg-linear-to-r from-violet-600 to-indigo-600 dark:from-violet-400 dark:to-indigo-400 bg-clip-text text-transparent">
                  Let&apos;s personalize your space!
                </h3>
                <p className="text-muted-foreground text-sm">
                  Welcome to Boilerplate. First, what should we call you? This will be your public display name.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="onboardName" className="text-sm font-semibold">Your Display Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <Input
                    id="onboardName"
                    placeholder="e.g. John Doe"
                    value={onboardingName}
                    onChange={(e) => setOnboardingName(e.target.value)}
                    className="pl-9 h-11 bg-background/50 border-border/80 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/10 transition-all duration-200"
                    autoFocus
                  />
                </div>
              </div>

              <Button
                onClick={() => setOnboardingStep(2)}
                disabled={!onboardingName.trim()}
                className="w-full h-11 bg-linear-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-semibold shadow-lg hover:shadow-indigo-500/25 transition-all duration-300 group cursor-pointer"
              >
                Continue Setup
                <ChevronRight className="ml-1.5 size-4 transition-transform group-hover:translate-x-0.5" />
              </Button>
            </div>
          )}

          {/* STEP 2: CHOOSE THEME */}
          {onboardingStep === 2 && (
            <div className="space-y-6 py-4 animate-in fade-in slide-in-from-right-8 duration-300">
              {/* Step indicator */}
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-violet-600 dark:text-violet-400">Theme Selector</span>
                <span className="text-muted-foreground">Step 2 of 2</span>
              </div>
              <div className="flex gap-1.5 h-1">
                <div className="w-1/2 bg-violet-600 dark:bg-violet-500 rounded-full" />
                <div className="w-1/2 bg-violet-600 dark:bg-violet-500 rounded-full" />
              </div>

              <div className="space-y-2">
                <h3 className="text-2xl font-extrabold tracking-tight bg-linear-to-r from-violet-600 to-indigo-600 dark:from-violet-400 dark:to-indigo-400 bg-clip-text text-transparent">
                  Choose your look
                </h3>
                <p className="text-muted-foreground text-sm">
                  Select your preferred dashboard color style. You can adjust this anytime in preferences.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-3 py-1">
                {[
                  { id: "light", label: "Light", icon: Sun },
                  { id: "dark", label: "Dark", icon: Moon },
                  { id: "system", label: "System", icon: Monitor },
                ].map((item) => {
                  const isActive = onboardingTheme === item.id;
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setOnboardingTheme(item.id as "light" | "dark" | "system");
                        // Instant theme changes right behind the dialog for premium feedback
                        setTheme(item.id);
                      }}
                      className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all duration-300 cursor-pointer group hover:bg-muted/40 ${
                        isActive
                          ? "border-violet-600 bg-violet-600/[0.03] dark:bg-violet-950/20 dark:border-violet-400 ring-2 ring-violet-500/10"
                          : "border-border/60 bg-transparent"
                      }`}
                    >
                      <div className={`p-2 rounded-full mb-1.5 transition-transform duration-300 group-hover:scale-110 ${
                        isActive ? "bg-violet-600/10 text-violet-600 dark:text-violet-400" : "bg-muted text-muted-foreground"
                      }`}>
                        <Icon className="size-4" />
                      </div>
                      <span className="text-xs font-semibold">{item.label}</span>
                    </button>
                  );
                })}
              </div>

              <div className="flex gap-3 pt-2">
                <Button
                  variant="outline"
                  onClick={() => setOnboardingStep(1)}
                  className="flex-1 h-11 border-border/80 text-muted-foreground hover:bg-muted/40 cursor-pointer"
                  disabled={isSavingOnboarding}
                >
                  Back
                </Button>
                <Button
                  onClick={handleCompleteOnboarding}
                  disabled={isSavingOnboarding}
                  className="flex-3 h-11 bg-linear-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-semibold shadow-lg hover:shadow-indigo-500/25 transition-all duration-300 cursor-pointer"
                >
                  {isSavingOnboarding ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    "Complete Setup"
                  )}
                </Button>
              </div>
            </div>
          )}

          {/* STEP 3: CELEBRATION */}
          {onboardingStep === 3 && (
            <div className="space-y-6 py-6 text-center animate-in fade-in zoom-in-95 duration-500 relative flex flex-col items-center">
              <SparkleConfetti />

              <div className="relative mb-2">
                <div className="absolute -inset-3 bg-violet-500/20 rounded-full blur-md animate-ping duration-1000" />
                <div className="relative size-16 rounded-full bg-linear-to-r from-violet-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
                  <Sparkles className="size-8 text-white animate-pulse" />
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-2xl font-extrabold tracking-tight bg-linear-to-r from-violet-600 to-indigo-600 dark:from-violet-400 dark:to-indigo-400 bg-clip-text text-transparent">
                  You&apos;re all set!
                </h3>
                <p className="text-muted-foreground text-sm max-w-xs mx-auto">
                  Awesome! Your profile has been configured successfully. Let&apos;s jump in and explore your dashboard.
                </p>
              </div>

              <Button
                onClick={handleFinishCelebration}
                className="w-full h-11 bg-linear-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-semibold shadow-lg hover:shadow-indigo-500/25 transition-all duration-300 cursor-pointer mt-4"
              >
                Let&apos;s Go!
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
