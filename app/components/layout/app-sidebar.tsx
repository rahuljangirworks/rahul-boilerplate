import {
  LayoutDashboard,
  Users,
  Settings,
  MessageSquare,
  UploadCloud,
  Mail,
  CreditCard,
  Zap,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "~/components/ui/sidebar";
import { NavGroup, type NavGroup as NavGroupType } from "~/components/layout/nav-group";
import { NavUser } from "~/components/layout/nav-user";
import { Link } from "react-router";

const navData: NavGroupType[] = [
  {
    title: "Platform",
    items: [
      { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
      { title: "Users", url: "/dashboard/users", icon: Users },
    ],
  },
  {
    title: "Tools",
    items: [
      { title: "AI Chat", url: "/dashboard/chat", icon: MessageSquare },
      { title: "R2 Uploads", url: "/dashboard/uploads", icon: UploadCloud },
      { title: "Emails", url: "/dashboard/emails", icon: Mail },
      { title: "Billing", url: "/dashboard/billing", icon: CreditCard },
    ],
  },
  {
    title: "System",
    items: [
      { title: "Settings", url: "/dashboard/settings", icon: Settings },
    ],
  },
];

export function AppSidebar() {
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <Link
          to="/dashboard"
          className="flex items-center gap-2 px-2 py-1.5 text-sm font-semibold text-sidebar-foreground hover:opacity-80 transition-opacity"
        >
          <Zap className="size-4 shrink-0 text-sidebar-primary" />
          <span className="group-data-[collapsible=icon]:hidden truncate">
            Boilerplate
          </span>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        {navData.map((group) => (
          <NavGroup key={group.title} {...group} />
        ))}
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
