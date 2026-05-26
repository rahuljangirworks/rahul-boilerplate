import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/trpc";
import { env } from "~/lib/env";

export const emailRouter = createTRPCRouter({
  sendWelcome: protectedProcedure
    .input(z.object({ email: z.string().email(), name: z.string() }))
    .mutation(async ({ input }) => {
      if (!env.RESEND_API_KEY) {
        console.warn("RESEND_API_KEY not set, skipping email");
        return { success: false, message: "Email not configured" };
      }
      const { Resend } = await import("resend");
      const resend = new Resend(env.RESEND_API_KEY);
      await resend.emails.send({
        from: "noreply@your-app.com",
        to: input.email,
        subject: "Welcome to My App!",
        html: `<h1>Welcome, ${input.name}!</h1><p>Thanks for joining.</p>`,
      });
      return { success: true };
    }),
});
