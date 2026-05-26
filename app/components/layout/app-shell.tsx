import { Outlet } from "react-router";
import { Sidebar } from "~/components/layout/sidebar";
import { ColorSchemeToggle } from "~/components/layout/color-scheme-toggle";
import { UserNav } from "~/components/layout/user-nav";
import { Toaster } from "~/components/ui/sonner";
import { Button } from "~/components/ui/button";
import { Menu, Search } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "~/components/ui/sheet";
import { useSidebar } from "~/stores/use-sidebar";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden">
      {/* Desktop sidebar */}
      <div className="hidden md:flex">
        <Sidebar />
      </div>

      {/* Mobile sidebar via sheet */}
      <MobileSidebar />

      <div className="flex flex-1 flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {children}
        </main>
      </div>

      <Toaster />
    </div>
  );
}

function MobileSidebar() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden absolute top-3 left-3 z-50">
          <Menu className="size-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-60 p-0">
        <Sidebar />
      </SheetContent>
    </Sheet>
  );
}


function Header() {
  return (
    <header className="flex h-14 items-center gap-4 border-b bg-background px-4 md:px-6">
      <div className="flex flex-1 items-center gap-2">
        <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground">
          <span>Workspace</span>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Search className="size-4" />
        </Button>
        <ColorSchemeToggle />
        <UserNav />
      </div>
    </header>
  );
}

export default function AppShellLayout() {
  return (
    <AppShell>
      <Outlet />
    </AppShell>
  );
}
