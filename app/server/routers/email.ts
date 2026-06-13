import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/trpc";
import { env } from "~/lib/env";

async function sendEmail(to: string, subject: string, html: string) {
  if (!env.RESEND_API_KEY) {
    console.log(`[Email] Would send to ${to}: ${subject}`);
    return { success: true, simulated: true };
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "Boilerplate <onboarding@resend.dev>",
      to,
      subject,
      html,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to send email");
  }

  return { success: true, simulated: false };
}

export const emailRouter = createTRPCRouter({
  sendWelcome: protectedProcedure
    .input(z.object({ email: z.string().email(), name: z.string() }))
    .mutation(async ({ input }) => {
      return sendEmail(
        input.email,
        "Welcome to Boilerplate!",
        `<h1>Welcome, ${input.name}!</h1><p>Thanks for signing up.</p>`
      );
    }),

  sendNotification: protectedProcedure
    .input(
      z.object({
        email: z.string().email(),
        subject: z.string(),
        body: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      return sendEmail(input.email, input.subject, input.body);
    }),

  getPreviews: protectedProcedure.query(async () => {
    return {
      welcome: { subject: "Welcome to Boilerplate!", html: "<h1>Welcome!</h1>" },
      notification: { subject: "Notification", html: "<p>You have a new notification.</p>" },
    };
  }),
});
