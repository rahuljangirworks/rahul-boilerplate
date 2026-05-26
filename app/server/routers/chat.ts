import { z } from "zod";
import { eq } from "drizzle-orm";
import { createTRPCRouter, protectedProcedure } from "~/server/trpc";
import { projects } from "~/../drizzle/schema";

export const chatRouter = createTRPCRouter({
  isConfigured: protectedProcedure
    .query(async () => {
      const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
      const apiToken = process.env.CLOUDFLARE_API_TOKEN;
      return !!(accountId && apiToken);
    }),

  stream: protectedProcedure
    .input(z.object({
      messages: z.array(z.object({
        role: z.enum(["user", "assistant", "system"]),
        content: z.string(),
      })),
    }))
    .subscription(async function* ({ ctx, input }) {
      const { streamText, tool } = await import("ai");
      const { createWorkersAI } = await import("workers-ai-provider");

      const workersai = createWorkersAI({ binding: undefined });
      const model = workersai("@cf/meta/llama-3.1-8b-instruct");

      const result = streamText({
        model,
        messages: input.messages,
        tools: {
          getProject: tool<{ id: string }, object>({
            description: "Get a project by ID from the database",
            inputSchema: z.object({ id: z.string() }),
            execute: async ({ id }) => {
              const project = await ctx.db.query.projects.findFirst({
                where: eq(projects.id, id),
              });
              return project ?? {};
            },
          }),
        },
      });

      for await (const chunk of result.textStream) {
        yield { type: "delta" as const, text: chunk };
      }
      yield { type: "done" as const };
    }),
});
