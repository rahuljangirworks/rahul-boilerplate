import { useFetcher } from "react-router";
import { useTheme } from "next-themes";
import { Sun, Moon, Monitor } from "lucide-react";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { useCallback } from "react";

const schemes = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
  { value: "system", label: "System", icon: Monitor },
] as const;

export function ColorSchemeToggle() {
  const fetcher = useFetcher();
  const { theme, setTheme, resolvedTheme } = useTheme();

  const currentScheme =
    schemes.find((s) => s.value === theme) ?? schemes[2];
  const Icon = currentScheme.icon;

  const handleSchemeChange = useCallback(
    (scheme: string) => {
      setTheme(scheme);
      fetcher.submit(
        { colorScheme: scheme },
        { method: "POST", action: "/" }
      );
    },
    [setTheme, fetcher]
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Icon className="size-4" />
          <span className="sr-only">Toggle color scheme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {schemes.map(({ value, label, icon: ItemIcon }) => (
          <DropdownMenuItem
            key={value}
            onClick={() => handleSchemeChange(value)}
            className={value === theme ? "bg-accent" : undefined}
          >
            <ItemIcon className="mr-2 size-4" />
            {label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
