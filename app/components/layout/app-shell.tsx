import { Outlet } from "react-router";
import { SidebarProvider, SidebarInset } from "~/components/ui/sidebar";
import { AppSidebar } from "~/components/layout/app-sidebar";
import { Header } from "~/components/layout/header";
import { Toaster } from "~/components/ui/sonner";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <Header />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {children}
        </main>
      </SidebarInset>
      <Toaster />
    </SidebarProvider>
  );
}

export default function AppShellLayout() {
  return (
    <AppShell>
      <Outlet />
    </AppShell>
  );
}
