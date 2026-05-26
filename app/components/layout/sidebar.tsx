import { Link, NavLink, useFetcher } from "react-router";
import { LayoutDashboard, FolderKanban, Settings, LogOut, PanelLeftClose, PanelLeft, Zap } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { useSidebar } from "~/stores/use-sidebar";
import { useOptionalAuthUser } from "~/hooks/use-auth-user";
import { cn } from "~/lib/utils";

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/dashboard/projects", label: "Projects", icon: FolderKanban },
  { to: "/dashboard/settings", label: "Settings", icon: Settings },
];

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const { isOpen, toggle } = useSidebar();
  const fetcher = useFetcher();
  const user = useOptionalAuthUser();

  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "?";
  const displayName = user?.name ?? user?.email ?? "User";

  return (
    <aside
      className={cn(
        "flex h-screen flex-col border-r bg-sidebar transition-all duration-200",
        isOpen ? "w-60" : "w-14",
        className
      )}
    >
      <div className="flex h-14 items-center gap-2 border-b px-3">
        <Link to="/dashboard" className="flex items-center gap-2 overflow-hidden">
          <Zap className="size-4 shrink-0 text-sidebar-primary" />
          {isOpen && (
            <span className="truncate text-sm font-semibold text-sidebar-foreground">
              Boilerplate
            </span>
          )}
        </Link>
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={toggle}
          className="ml-auto shrink-0"
        >
          {isOpen ? (
            <PanelLeftClose className="size-4" />
          ) : (
            <PanelLeft className="size-4" />
          )}
        </Button>
      </div>

      <nav className="flex-1 space-y-1 p-2">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/dashboard"}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-lg px-2 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
              )
            }
          >
            <Icon className="size-4 shrink-0" />
            {isOpen && <span className="truncate">{label}</span>}
          </NavLink>
        ))}
      </nav>

      <div className="border-t p-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className={cn(
                "w-full justify-start gap-3 px-2",
                !isOpen && "justify-center px-0"
              )}
            >
              <Avatar className="size-6">
                <AvatarImage src={user?.image ?? undefined} alt={displayName} />
                <AvatarFallback className="text-xs">{initials}</AvatarFallback>
              </Avatar>
              {isOpen && (
                <span className="truncate text-sm">{displayName}</span>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="top" align="start" className="w-56">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-0.5">
                <p className="text-sm font-medium">{displayName}</p>
                {user?.email && (
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                )}
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link to="/dashboard/settings">Settings</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-destructive focus:text-destructive focus:bg-destructive/10"
              onClick={() =>
                fetcher.submit(
                  { intent: "signout" },
                  { method: "POST", action: "/api/auth" }
                )
              }
            >
              <LogOut className="mr-2 size-4" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </aside>
  );
}
