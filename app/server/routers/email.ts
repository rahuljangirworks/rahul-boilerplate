import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/trpc";
import { env } from "~/lib/env";

export const emailRouter = createTRPCRouter({
  getPreviews: protectedProcedure.query(async () => {
    const { render } = await import("@react-email/components");
    const React = await import("react");
    const { WelcomeEmail } = await import("~/emails/welcome");
    const { NotificationEmail } = await import("~/emails/notification");

    const welcomeHtml = await render(React.createElement(WelcomeEmail, { name: "John Doe" }));
    const notificationHtml = await render(
      React.createElement(NotificationEmail, {
        title: "Security Alert: New Sign-in",
        message: "We detected a sign-in to your account from a new device in San Francisco, CA. If this was you, no action is needed.",
        actionLabel: "Review Device Activity",
        actionUrl: "https://your-app.com/settings/security",
      })
    );

    return {
      welcome: welcomeHtml,
      notification: notificationHtml,
      hasApiKey: !!env.RESEND_API_KEY,
    };
  }),

  sendWelcome: protectedProcedure
    .input(z.object({ email: z.string().email(), name: z.string() }))
    .mutation(async ({ input }) => {
      if (!env.RESEND_API_KEY) {
        console.warn("RESEND_API_KEY not set, skipping email");
        return { success: false, message: "Email not configured. Missing RESEND_API_KEY." };
      }
      const { Resend } = await import("resend");
      const { render } = await import("@react-email/components");
      const React = await import("react");
      const { WelcomeEmail } = await import("~/emails/welcome");

      const html = await render(
        React.createElement(WelcomeEmail, {
          name: input.name,
        })
      );

      const resend = new Resend(env.RESEND_API_KEY);
      await resend.emails.send({
        from: "noreply@your-app.com",
        to: input.email,
        subject: "Welcome to Boilerplate!",
        html,
      });
      return { success: true };
    }),

  sendNotification: protectedProcedure
    .input(
      z.object({
        email: z.string().email(),
        title: z.string(),
        message: z.string(),
        actionLabel: z.string().optional(),
        actionUrl: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      if (!env.RESEND_API_KEY) {
        console.warn("RESEND_API_KEY not set, skipping email");
        return { success: false, message: "Email not configured. Missing RESEND_API_KEY." };
      }
      const { Resend } = await import("resend");
      const { render } = await import("@react-email/components");
      const React = await import("react");
      const { NotificationEmail } = await import("~/emails/notification");

      const html = await render(
        React.createElement(NotificationEmail, {
          title: input.title,
          message: input.message,
          actionLabel: input.actionLabel || undefined,
          actionUrl: input.actionUrl || undefined,
        })
      );

      const resend = new Resend(env.RESEND_API_KEY);
      await resend.emails.send({
        from: "noreply@your-app.com",
        to: input.email,
        subject: input.title,
        html,
      });
      return { success: true };
    }),
});

