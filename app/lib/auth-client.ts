import { createAuthClient } from "better-auth/react";
import { twoFactorClient, genericOAuthClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  plugins: [
    twoFactorClient(),
    genericOAuthClient(),
  ],
});

export const {
  signIn,
  signUp,
  signOut,
  useSession,
} = authClient;
