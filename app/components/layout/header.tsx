import { cn } from "~/lib/utils";
import { Separator } from "~/components/ui/separator";
import { SidebarTrigger } from "~/components/ui/sidebar";
import { ColorSchemeToggle } from "~/components/layout/color-scheme-toggle";
import { UserNav } from "~/components/layout/user-nav";

type HeaderProps = React.HTMLAttributes<HTMLElement>;

export function Header({ className, children, ...props }: HeaderProps) {
  return (
    <header
      className={cn(
        "flex h-14 shrink-0 items-center gap-2 border-b bg-background px-4 md:px-6",
        className
      )}
      {...props}
    >
      <SidebarTrigger variant="outline" className="md:hidden" />
      <Separator orientation="vertical" className="h-6 hidden md:block" />
      <div className="flex flex-1 items-center gap-2">
        {children}
      </div>
      <div className="flex items-center gap-1">
        <ColorSchemeToggle />
        <UserNav />
      </div>
    </header>
  );
}
