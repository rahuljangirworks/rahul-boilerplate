import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/trpc";

export const chatRouter = createTRPCRouter({
  isConfigured: protectedProcedure.query(async () => {
    // Check if AI provider is configured
    return {
      configured: !!process.env.AI_API_KEY || !!process.env.OPENAI_API_KEY,
    };
  }),

  stream: protectedProcedure
    .input(z.object({ message: z.string().min(1) }))
    .mutation(async ({ input }) => {
      // AI streaming will be implemented when provider is configured
      return {
        response: `Echo: ${input.message}`,
      };
    }),
});
