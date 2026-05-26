import { useNavigate } from "react-router";
import { authClient } from "~/lib/auth-client";
import { useOptionalAuthUser } from "~/hooks/use-auth-user";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Button } from "~/components/ui/button";
import { LogOut, User, Settings, FolderKanban } from "lucide-react";
import { useCallback } from "react";

export function UserNav() {
  const user = useOptionalAuthUser();
  const navigate = useNavigate();

  const handleSignOut = useCallback(async () => {
    try {
      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            navigate("/");
          },
        },
      });
    } catch (error) {
      console.error("Error signing out user:", error);
    }
  }, [navigate]);

  if (!user) {
    return (
      <Button variant="outline" size="sm" onClick={() => navigate("/auth/sign-in")}>
        Sign In
      </Button>
    );
  }

  const initials = user.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.image ?? undefined} alt={user.name} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.name}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => navigate("/dashboard")}>
            <FolderKanban className="mr-2 h-4 w-4" />
            <span>Dashboard</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => navigate("/dashboard/projects")}>
            <FolderKanban className="mr-2 h-4 w-4" />
            <span>Projects</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut} className="text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950/20">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
