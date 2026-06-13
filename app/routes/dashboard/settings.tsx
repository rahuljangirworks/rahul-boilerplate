import { useState, useEffect, useCallback, type FormEvent } from "react";
import { useTheme } from "next-themes";
import { useFetcher } from "react-router";
import { useAuthUser } from "~/hooks/use-auth-user";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Avatar, AvatarImage, AvatarFallback } from "~/components/ui/avatar";
import {
  Loader2,
  User,
  Image as ImageIcon,
  Check,
  Sun,
  Moon,
  Monitor,
} from "lucide-react";
import type { Route } from "./+types/settings";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Profile Settings | Boilerplate" }];
}

export async function loader({}: Route.LoaderArgs) {
  return {};
}

export default function SettingsPage() {
  const user = useAuthUser();
  const fetcher = useFetcher();
  const { theme, setTheme } = useTheme();

  const [name, setName] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name ?? "");
      setImageUrl(user.image ?? "");
      setPreviewUrl(user.image ?? "");
    }
  }, [user]);

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

  const handleSaveSettings = async (e: FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    // Simulate save delay
    await new Promise((r) => setTimeout(r, 500));
    setIsSaving(false);
  };

  const initials = user.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U";

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="flex flex-col gap-2 border-b pb-6">
        <h1 className="text-3xl font-extrabold tracking-tight">
          Account Settings
        </h1>
        <p className="text-muted-foreground text-sm">
          Customize your workspace configuration, change theme settings, and update your personal info.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <Card>
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
                  />
                </div>

                <div className="flex justify-end pt-2">
                  <Button type="submit" disabled={isSaving}>
                    {isSaving && <Loader2 className="mr-2 size-4 animate-spin" />}
                    Save Profile Changes
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-bold">Preferences</CardTitle>
              <CardDescription>Personalize the visuals and display of your boilerplate dashboard.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <Label className="text-sm font-semibold">Color Scheme Theme</Label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: "light", label: "Light", icon: Sun },
                    { id: "dark", label: "Dark", icon: Moon },
                    { id: "system", label: "System", icon: Monitor },
                  ].map((item) => {
                    const isActive = theme === item.id;
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.id}
                        onClick={() => syncThemeWithServer(item.id)}
                        className={`flex flex-col items-center justify-center p-4 rounded-xl border text-center transition-all cursor-pointer hover:bg-muted/30 ${
                          isActive
                            ? "border-primary bg-primary/5 ring-2 ring-primary/10"
                            : "border-border bg-transparent"
                        }`}
                      >
                        <div className={`p-2 rounded-full mb-2.5 ${
                          isActive ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                        }`}>
                          <Icon className="size-5" />
                        </div>
                        <span className="text-sm font-semibold">{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-1 space-y-6">
          <Card>
            <CardHeader className="text-center pb-2">
              <CardTitle className="text-lg font-bold">Profile Picture</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center space-y-4">
              <Avatar className="size-28">
                <AvatarImage src={previewUrl} className="object-cover" />
                <AvatarFallback className="text-2xl font-bold">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <p className="text-xs text-muted-foreground text-center">
                Click &quot;Save Profile Changes&quot; after updating the URL above.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
