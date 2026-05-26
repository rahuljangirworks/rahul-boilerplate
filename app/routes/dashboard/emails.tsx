import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useTRPC } from "~/providers/trpc-provider";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { Label } from "~/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import {
  Mail,
  Send,
  Eye,
  Code,
  Laptop,
  Smartphone,
  AlertTriangle,
  CheckCircle2,
  Copy,
  Check,
  Loader2,
  ExternalLink,
} from "lucide-react";
import { toast } from "sonner";
import type { Route } from "./+types/emails";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Email Administration | Boilerplate" }];
}

export async function loader({}: Route.LoaderArgs) {
  return {};
}

type TemplateId = "welcome" | "notification";

interface PreviewData {
  welcome: string;
  notification: string;
  hasApiKey: boolean;
}

export default function EmailsDashboard() {
  const trpc = useTRPC();
  
  // Get current user for auto-filling test form
  const { data: user } = useQuery(trpc.user.getMe.queryOptions());

  // Fetch previews
  const { data: previews, isLoading: isLoadingPreviews, error: previewError } = useQuery(
    trpc.email.getPreviews.queryOptions()
  );

  // States
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateId>("welcome");
  const [previewMode, setPreviewMode] = useState<"desktop" | "mobile" | "html">("desktop");
  const [copied, setCopied] = useState(false);

  // Test form states
  const [recipientEmail, setRecipientEmail] = useState("");
  const [welcomeName, setWelcomeName] = useState("");
  const [notifTitle, setNotifTitle] = useState("Security Alert: New Sign-in");
  const [notifMessage, setNotifMessage] = useState(
    "We detected a sign-in to your account from a new device in San Francisco, CA. If this was you, no action is needed."
  );
  const [notifActionLabel, setNotifActionLabel] = useState("Review Device Activity");
  const [notifActionUrl, setNotifActionUrl] = useState("https://your-app.com/settings/security");

  // Autofill email/name once user query returns
  useEffect(() => {
    if (user?.email) {
      setRecipientEmail(user.email);
    }
    if (user?.name) {
      setWelcomeName(user.name.split(" ")[0]);
    }
  }, [user]);

  // Copy HTML to clipboard
  const handleCopyHtml = () => {
    if (!previews) return;
    const htmlContent = previews[selectedTemplate];
    navigator.clipboard.writeText(htmlContent);
    setCopied(true);
    toast.success("HTML copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  // Mutations for sending
  const sendWelcomeMutation = useMutation({
    ...trpc.email.sendWelcome.mutationOptions(),
    onSuccess: (res) => {
      if (res.success) {
        toast.success(`Test welcome email sent to ${recipientEmail}!`);
      } else {
        toast.error(res.message || "Failed to send welcome email.");
      }
    },
    onError: (err) => {
      toast.error(err.message || "An error occurred while sending.");
    },
  });

  const sendNotificationMutation = useMutation({
    ...trpc.email.sendNotification.mutationOptions(),
    onSuccess: (res) => {
      if (res.success) {
        toast.success(`Test notification email sent to ${recipientEmail}!`);
      } else {
        toast.error(res.message || "Failed to send notification email.");
      }
    },
    onError: (err) => {
      toast.error(err.message || "An error occurred while sending.");
    },
  });

  const handleSendWelcome = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipientEmail) {
      toast.error("Please enter a recipient email");
      return;
    }
    sendWelcomeMutation.mutate({
      email: recipientEmail,
      name: welcomeName || "User",
    });
  };

  const handleSendNotification = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipientEmail) {
      toast.error("Please enter a recipient email");
      return;
    }
    if (!notifTitle || !notifMessage) {
      toast.error("Title and message are required");
      return;
    }
    sendNotificationMutation.mutate({
      email: recipientEmail,
      title: notifTitle,
      message: notifMessage,
      actionLabel: notifActionLabel || undefined,
      actionUrl: notifActionUrl || undefined,
    });
  };

  const isSending = sendWelcomeMutation.isPending || sendNotificationMutation.isPending;
  const isConfigured = previews?.hasApiKey ?? false;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            Email System
          </h1>
          <p className="text-muted-foreground text-sm">
            Inspect React Email templates, view real-time previews, and send test transactionals.
          </p>
        </div>

        {/* API Key Status Indicator */}
        {!isLoadingPreviews && (
          <div>
            {isConfigured ? (
              <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 px-3 py-1 flex items-center gap-1.5 self-start md:self-auto">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                Resend API Key Configured
              </Badge>
            ) : (
              <Badge variant="outline" className="bg-amber-500/10 text-amber-500 border-amber-500/20 px-3 py-1 flex items-center gap-1.5 self-start md:self-auto">
                <AlertTriangle className="size-3.5" />
                Missing RESEND_API_KEY
              </Badge>
            )}
          </div>
        )}
      </div>

      {/* Fallback Warning */}
      {!isLoadingPreviews && !isConfigured && (
        <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-4 text-amber-600 dark:text-amber-400 flex items-start gap-3 shadow-sm animate-pulse-slow">
          <AlertTriangle className="size-5 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="font-semibold text-sm">Testing Mode Active</h4>
            <p className="text-xs text-amber-600/90 dark:text-amber-400/90 leading-relaxed">
              No <strong>RESEND_API_KEY</strong> has been found in your environment.
              When you trigger a test send, the payload and rendered HTML will be outputted to the server console log, but no email will be delivered to the recipient.
              Add <code className="bg-amber-500/10 px-1 py-0.5 rounded font-mono text-[11px] text-foreground">RESEND_API_KEY=re_yourkey...</code> to your 
              local <code className="bg-amber-500/10 px-1 py-0.5 rounded font-mono text-[11px] text-foreground">.env.local</code> file to enable actual sending.
            </p>
          </div>
        </div>
      )}

      {isLoadingPreviews ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Loader2 className="size-8 animate-spin text-indigo-500" />
          <p className="text-sm text-muted-foreground">Rendering email templates...</p>
        </div>
      ) : previewError ? (
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-6 text-destructive flex flex-col gap-2">
          <div className="flex items-center gap-2 font-semibold">
            <AlertTriangle className="size-5" />
            <h3>Failed to Render Previews</h3>
          </div>
          <p className="text-sm text-muted-foreground">
            {previewError.message || "An unexpected error occurred while processing React Email templates."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* LEFT COLUMN: Template selection & Sending controls */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* List Templates */}
            <Card className="border-muted bg-card shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <Mail className="size-4 text-indigo-500" />
                  Select Template
                </CardTitle>
                <CardDescription>
                  Select the template to view live preview and send a test.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                
                {/* Welcome Template item */}
                <button
                  onClick={() => {
                    setSelectedTemplate("welcome");
                    setPreviewMode("desktop");
                  }}
                  className={`w-full text-left p-4 rounded-xl border transition-all flex flex-col gap-1.5 ${
                    selectedTemplate === "welcome"
                      ? "border-indigo-500/40 bg-indigo-500/5 ring-1 ring-indigo-500/20"
                      : "border-border hover:bg-muted/40"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-sm">Welcome Email</span>
                    <Badge variant="outline" className="text-[10px] bg-indigo-500/10 text-indigo-500 hover:bg-indigo-500/10 border-indigo-500/20">
                      Premium Layout
                    </Badge>
                  </div>
                  <span className="text-xs text-muted-foreground leading-relaxed">
                    A colorful welcoming format equipped with a 3-step checklist, visual logo, and main Call-To-Action button.
                  </span>
                </button>

                {/* Notification Template item */}
                <button
                  onClick={() => {
                    setSelectedTemplate("notification");
                    setPreviewMode("desktop");
                  }}
                  className={`w-full text-left p-4 rounded-xl border transition-all flex flex-col gap-1.5 ${
                    selectedTemplate === "notification"
                      ? "border-indigo-500/40 bg-indigo-500/5 ring-1 ring-indigo-500/20"
                      : "border-border hover:bg-muted/40"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-sm">Transactional Alert</span>
                    <Badge variant="outline" className="text-[10px] bg-blue-500/10 text-blue-500 hover:bg-blue-500/10 border-blue-500/20">
                      Notification
                    </Badge>
                  </div>
                  <span className="text-xs text-muted-foreground leading-relaxed">
                    A standard transactional notification layout complete with a left-accented blue alert message box and customizable links.
                  </span>
                </button>

              </CardContent>
            </Card>

            {/* Test Form */}
            <Card className="border-muted bg-card shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <Send className="size-4 text-purple-500" />
                  Test Delivery
                </CardTitle>
                <CardDescription>
                  Deliver a test version of this template to any inbox.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form
                  onSubmit={selectedTemplate === "welcome" ? handleSendWelcome : handleSendNotification}
                  className="space-y-4"
                >
                  {/* Common Recipient Field */}
                  <div className="space-y-1.5">
                    <Label htmlFor="test-email" className="text-xs font-semibold">
                      Recipient Email Address
                    </Label>
                    <Input
                      id="test-email"
                      type="email"
                      placeholder="e.g., test@example.com"
                      value={recipientEmail}
                      onChange={(e) => setRecipientEmail(e.target.value)}
                      required
                      className="h-9"
                    />
                  </div>

                  {/* Welcome Template Options */}
                  {selectedTemplate === "welcome" && (
                    <div className="space-y-1.5 animate-fadeIn">
                      <Label htmlFor="welcome-name" className="text-xs font-semibold">
                        Recipient Name
                      </Label>
                      <Input
                        id="welcome-name"
                        type="text"
                        placeholder="e.g., Jane"
                        value={welcomeName}
                        onChange={(e) => setWelcomeName(e.target.value)}
                        className="h-9"
                      />
                    </div>
                  )}

                  {/* Notification Template Options */}
                  {selectedTemplate === "notification" && (
                    <div className="space-y-4 animate-fadeIn">
                      <div className="space-y-1.5">
                        <Label htmlFor="notif-title" className="text-xs font-semibold">
                          Subject / Alert Title
                        </Label>
                        <Input
                          id="notif-title"
                          type="text"
                          placeholder="e.g., Payment Successful"
                          value={notifTitle}
                          onChange={(e) => setNotifTitle(e.target.value)}
                          required
                          className="h-9"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <Label htmlFor="notif-message" className="text-xs font-semibold">
                          Message Body
                        </Label>
                        <Textarea
                          id="notif-message"
                          placeholder="Type your notification description..."
                          value={notifMessage}
                          onChange={(e) => setNotifMessage(e.target.value)}
                          required
                          className="min-h-[80px] text-xs resize-none"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                          <Label htmlFor="notif-action-label" className="text-xs font-semibold">
                            Button Label (Optional)
                          </Label>
                          <Input
                            id="notif-action-label"
                            type="text"
                            placeholder="e.g., View Invoice"
                            value={notifActionLabel}
                            onChange={(e) => setNotifActionLabel(e.target.value)}
                            className="h-9 text-xs"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <Label htmlFor="notif-action-url" className="text-xs font-semibold">
                            Button Link (Optional)
                          </Label>
                          <Input
                            id="notif-action-url"
                            type="text"
                            placeholder="e.g., https://..."
                            value={notifActionUrl}
                            onChange={(e) => setNotifActionUrl(e.target.value)}
                            className="h-9 text-xs"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    disabled={isSending}
                    className="w-full h-10 mt-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 font-semibold"
                  >
                    {isSending ? (
                      <>
                        <Loader2 className="mr-2 size-4 animate-spin" />
                        Delivering...
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 size-4" />
                        Send Test Email
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* RIGHT COLUMN: Real-time iframe sandbox */}
          <div className="lg:col-span-7">
            <Card className="border-muted bg-card shadow-sm h-full flex flex-col min-h-[680px]">
              
              {/* Preview Header controls */}
              <div className="p-4 border-b flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between shrink-0">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-foreground uppercase tracking-wider">
                    Preview:
                  </span>
                  <span className="text-sm font-medium capitalize text-indigo-500">
                    {selectedTemplate} email
                  </span>
                </div>

                {/* Tabs selection */}
                <div className="flex items-center gap-1 bg-muted p-1 rounded-lg shrink-0 max-w-fit self-end sm:self-auto">
                  <Button
                    variant={previewMode === "desktop" ? "secondary" : "ghost"}
                    size="sm"
                    className="h-7 text-xs px-2.5 gap-1.5"
                    onClick={() => setPreviewMode("desktop")}
                  >
                    <Laptop className="size-3.5" />
                    Desktop
                  </Button>
                  <Button
                    variant={previewMode === "mobile" ? "secondary" : "ghost"}
                    size="sm"
                    className="h-7 text-xs px-2.5 gap-1.5"
                    onClick={() => setPreviewMode("mobile")}
                  >
                    <Smartphone className="size-3.5" />
                    Mobile
                  </Button>
                  <Button
                    variant={previewMode === "html" ? "secondary" : "ghost"}
                    size="sm"
                    className="h-7 text-xs px-2.5 gap-1.5"
                    onClick={() => setPreviewMode("html")}
                  >
                    <Code className="size-3.5" />
                    HTML Source
                  </Button>
                </div>
              </div>

              {/* Preview Content Container */}
              <CardContent className="p-4 flex-1 flex flex-col items-center justify-center bg-muted/20 min-h-[500px]">
                {previewMode === "desktop" && previews && (
                  <div className="w-full h-[600px] border border-border rounded-xl bg-white overflow-hidden shadow-inner">
                    <iframe
                      title="Desktop Email Preview"
                      srcDoc={previews[selectedTemplate]}
                      className="w-full h-full border-0"
                    />
                  </div>
                )}

                {previewMode === "mobile" && previews && (
                  <div className="relative mx-auto w-full max-w-[360px] h-[550px] border-8 border-slate-800 dark:border-slate-700 rounded-[32px] bg-slate-900 overflow-hidden shadow-2xl flex flex-col">
                    {/* Speaker/Camera Mock Bar */}
                    <div className="absolute top-0 inset-x-0 h-4 bg-slate-800 dark:border-slate-700 flex justify-center items-center z-10">
                      <div className="w-12 h-1 bg-slate-600 rounded-full"></div>
                    </div>
                    {/* Screen Content */}
                    <div className="flex-1 w-full h-full bg-white pt-4 overflow-hidden">
                      <iframe
                        title="Mobile Email Preview"
                        srcDoc={previews[selectedTemplate]}
                        className="w-full h-full border-0"
                      />
                    </div>
                  </div>
                )}

                {previewMode === "html" && previews && (
                  <div className="w-full h-[600px] flex flex-col gap-3">
                    <div className="flex items-center justify-between shrink-0">
                      <span className="text-xs text-muted-foreground font-mono">
                        Generated HTML ({previews[selectedTemplate].length.toLocaleString()} bytes)
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-7 text-xs gap-1.5"
                        onClick={handleCopyHtml}
                      >
                        {copied ? <Check className="size-3.5 text-emerald-500" /> : <Copy className="size-3.5" />}
                        {copied ? "Copied!" : "Copy Code"}
                      </Button>
                    </div>
                    <div className="flex-1 w-full border border-border rounded-xl bg-slate-950 p-4 font-mono text-[11px] text-slate-300 overflow-auto shadow-inner select-all">
                      <pre>{previews[selectedTemplate]}</pre>
                    </div>
                  </div>
                )}
              </CardContent>

            </Card>
          </div>

        </div>
      )}
    </div>
  );
}
