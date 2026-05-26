export type ColorScheme = "light" | "dark" | "system";

const COOKIE_NAME = "color-scheme";
const MAX_AGE = 365 * 24 * 60 * 60;

const validSchemes: ColorScheme[] = ["light", "dark", "system"];

export function getColorScheme(request: Request): ColorScheme {
  const cookieHeader = request.headers.get("cookie") ?? "";
  const match = cookieHeader.match(
    new RegExp(`(?:^|;\\s*)${COOKIE_NAME}=([^;]*)`)
  );
  const value = match?.[1] as ColorScheme | undefined;
  if (value && validSchemes.includes(value)) return value;
  return "system";
}

export function setColorScheme(scheme: ColorScheme): string {
  return `${COOKIE_NAME}=${scheme}; Max-Age=${MAX_AGE}; Path=/; SameSite=Lax`;
}
