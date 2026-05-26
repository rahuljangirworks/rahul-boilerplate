import { createTRPCRouter } from "~/server/trpc";
import { userRouter } from "~/server/routers/user";
import { projectRouter } from "~/server/routers/project";
import { chatRouter } from "~/server/routers/chat";
import { uploadRouter } from "~/server/routers/upload";
import { emailRouter } from "~/server/routers/email";

export const appRouter = createTRPCRouter({
  user: userRouter,
  project: projectRouter,
  chat: chatRouter,
  upload: uploadRouter,
  email: emailRouter,
});

export type AppRouter = typeof appRouter;
