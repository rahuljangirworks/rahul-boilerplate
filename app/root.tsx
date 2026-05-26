import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "react-router";

import type { Route } from "./+types/root";
import { ThemeProvider } from "next-themes";
import { TRPCProviderWrapper } from "~/providers/trpc-provider";
import { Toaster } from "~/components/ui/sonner";
import { getColorScheme, setColorScheme } from "~/lib/color-scheme-cookie.server";
import type { ColorScheme } from "~/lib/color-scheme-cookie.server";
import { authMiddleware, optionalAuthContext } from "~/middlewares/auth";
import "./app.css";

export const middleware = [authMiddleware];

export const links: Route.LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

export async function loader({ request, context }: Route.LoaderArgs) {
  const authSession = context.get(optionalAuthContext);
  return {
    colorScheme: getColorScheme(request),
    user: authSession?.user ?? null,
    session: authSession?.session ?? null,
  };
}

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const scheme = formData.get("colorScheme") as string | null;
  const validScheme: ColorScheme =
    scheme && ["light", "dark", "system"].includes(scheme)
      ? (scheme as ColorScheme)
      : "system";
  const cookieHeader = setColorScheme(validScheme);

  return new Response(JSON.stringify({ colorScheme: validScheme }), {
    headers: { "Set-Cookie": cookieHeader },
  });
}

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function(){
                var c=document.cookie.match(/(?:^|;\\s*)color-scheme=([^;]*)/);
                var t=c?c[1]:'system';
                if(t==='system'){t=window.matchMedia('(prefers-color-scheme:dark)').matches?'dark':'light';}
                document.documentElement.classList.add(t);
                try{localStorage.setItem('theme',t);}catch(e){}
              })();
            `,
          }}
        />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  const loaderData = useLoaderData<typeof loader>();
  const colorScheme = loaderData?.colorScheme ?? "system";

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme={colorScheme}
      enableSystem
      disableTransitionOnChange
    >
      <TRPCProviderWrapper>
        <Outlet />
        <Toaster />
      </TRPCProviderWrapper>
    </ThemeProvider>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="pt-16 p-4 container mx-auto">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full p-4 overflow-x-auto">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
