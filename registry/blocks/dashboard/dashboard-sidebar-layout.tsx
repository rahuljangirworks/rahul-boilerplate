import * as React from "react"
import {
  BookOpen,
  Bot,
  ChevronRight,
  ChevronsUpDown,
  Folder,
  Frame,
  LayoutDashboard,
  LogOut,
  Map,
  MoreHorizontal,
  PieChart,
  Plus,
  Settings2,
  Trash2,
  User,
  Search,
  Bell,
  Menu,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarTrigger,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarInset,
} from "~/components/ui/sidebar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "~/components/ui/breadcrumb"
import { Input } from "~/components/ui/input"
import { Button } from "~/components/ui/button"
import { cn } from "~/lib/utils"

// Standard Navigation Data Models
const navMainData = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
    isActive: true,
  },
  {
    title: "Playground",
    url: "#",
    icon: Bot,
    items: [
      {
        title: "History",
        url: "#",
      },
      {
        title: "Starred",
        url: "#",
      },
      {
        title: "Settings",
        url: "#",
      },
    ],
  },
  {
    title: "Documentation",
    url: "#",
    icon: BookOpen,
    items: [
      {
        title: "Introduction",
        url: "#",
      },
      {
        title: "Get Started",
        url: "#",
      },
      {
        title: "Tutorials",
        url: "#",
      },
    ],
  },
  {
    title: "Settings",
    url: "/dashboard/settings",
    icon: Settings2,
    items: [
      {
        title: "General",
        url: "#",
      },
      {
        title: "Team",
        url: "#",
      },
      {
        title: "Billing",
        url: "#",
      },
    ],
  },
]

const projectsData = [
  {
    name: "Marketing Platform",
    url: "#",
    icon: Frame,
  },
  {
    name: "Sales & Analytics",
    url: "#",
    icon: PieChart,
  },
  {
    name: "Design System",
    url: "#",
    icon: Map,
  },
]

interface DashboardSidebarLayoutProps {
  children?: React.ReactNode
  user?: {
    name: string
    email: string
    avatar?: string
  }
  onSignOut?: () => Promise<void>
}

export function DashboardSidebarLayout({
  children,
  user = {
    name: "Rahul Jangir",
    email: "rahul@example.com",
    avatar: "",
  },
  onSignOut,
}: DashboardSidebarLayoutProps) {
  const [openGroups, setOpenGroups] = React.useState<Record<string, boolean>>({
    Playground: false,
    Documentation: false,
    Settings: false,
  })

  const toggleGroup = (title: string) => {
    setOpenGroups((prev) => ({
      ...prev,
      [title]: !prev[title],
    }))
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        
        {/* 🗺️ Left Collapsible Navigation Sidebar */}
        <Sidebar collapsible="icon" className="border-r border-muted/40">
          <SidebarHeader className="border-b border-muted/30 py-3 px-4">
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton size="lg" className="hover:bg-muted/10">
                  <div className="flex aspect-square h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
                    <Folder className="h-4 w-4" />
                  </div>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="font-semibold truncate">Acme Inc</span>
                    <span className="text-[10px] text-muted-foreground truncate font-mono">Boilerplate Enterprise</span>
                  </div>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarHeader>

          <SidebarContent className="py-2">
            <SidebarGroup>
              <SidebarGroupLabel className="px-4 text-[10px] font-bold tracking-wider text-muted-foreground uppercase">Platform</SidebarGroupLabel>
              <SidebarMenu>
                {navMainData.map((item) => {
                  const Icon = item.icon
                  const hasSub = item.items && item.items.length > 0
                  const isOpen = openGroups[item.title]

                  return (
                    <SidebarMenuItem key={item.title}>
                      {hasSub ? (
                        <div className="space-y-0.5">
                          <SidebarMenuButton
                            onClick={() => toggleGroup(item.title)}
                            className="w-full justify-between hover:bg-muted/10 group"
                          >
                            <span className="flex items-center gap-2">
                              <Icon className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                              <span className="font-medium text-sm">{item.title}</span>
                            </span>
                            <ChevronRight
                              className={`h-4 w-4 text-muted-foreground/60 transition-transform ${
                                isOpen ? "rotate-90" : ""
                              }`}
                            />
                          </SidebarMenuButton>
                          
                          {isOpen && (
                            <SidebarMenuSub className="border-l border-muted/50 ml-3.5 pl-3 py-1 space-y-1">
                              {item.items?.map((subItem) => (
                                <SidebarMenuSubItem key={subItem.title}>
                                  <SidebarMenuSubButton asChild>
                                    <a
                                      href={subItem.url}
                                      className="text-xs font-normal text-muted-foreground hover:text-foreground hover:underline transition-colors block py-0.5"
                                    >
                                      {subItem.title}
                                    </a>
                                  </SidebarMenuSubButton>
                                </SidebarMenuSubItem>
                              ))}
                            </SidebarMenuSub>
                          )}
                        </div>
                      ) : (
                        <SidebarMenuButton asChild className="hover:bg-muted/10 group">
                          <a href={item.url} className="flex items-center gap-2">
                            <Icon className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                            <span className="font-medium text-sm">{item.title}</span>
                          </a>
                        </SidebarMenuButton>
                      )}
                    </SidebarMenuItem>
                  )
                })}
              </SidebarMenu>
            </SidebarGroup>

            <SidebarGroup className="mt-2">
              <SidebarGroupLabel className="px-4 text-[10px] font-bold tracking-wider text-muted-foreground uppercase">Projects</SidebarGroupLabel>
              <SidebarMenu>
                {projectsData.map((project) => {
                  const ProjectIcon = project.icon
                  return (
                    <SidebarMenuItem key={project.name}>
                      <SidebarMenuButton asChild className="hover:bg-muted/10 group">
                        <a href={project.url} className="flex items-center gap-2">
                          <ProjectIcon className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                          <span className="font-medium text-sm">{project.name}</span>
                        </a>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )
                })}
                <SidebarMenuItem>
                  <SidebarMenuButton className="text-muted-foreground hover:text-foreground hover:bg-muted/10 font-medium">
                    <Plus className="h-4 w-4" />
                    <span className="text-sm">Create Project</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroup>
          </SidebarContent>

          {/* 👤 Sidebar Footer Profile Dropdown */}
          <SidebarFooter className="border-t border-muted/30 p-4">
            <SidebarMenu>
              <SidebarMenuItem>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <SidebarMenuButton size="lg" className="hover:bg-muted/10 justify-between group">
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center font-bold text-xs text-primary shadow-inner">
                          {user.name[0]}
                        </div>
                        <div className="grid flex-1 text-left text-sm leading-tight">
                          <span className="font-semibold truncate">{user.name}</span>
                          <span className="text-[10px] text-muted-foreground truncate">{user.email}</span>
                        </div>
                      </div>
                      <ChevronsUpDown className="h-4 w-4 text-muted-foreground/60 group-hover:text-foreground transition-colors" />
                    </SidebarMenuButton>
                  </DropdownMenuTrigger>
                  
                  <DropdownMenuContent className="w-56" align="end" side="right" sideOffset={8}>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-semibold leading-none">{user.name}</p>
                        <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-muted/30" />
                    
                    <DropdownMenuGroup>
                      <DropdownMenuItem className="gap-2 cursor-pointer">
                        <User className="h-4 w-4 text-muted-foreground" />
                        Account Settings
                      </DropdownMenuItem>
                      <DropdownMenuItem className="gap-2 cursor-pointer">
                        <Settings2 className="h-4 w-4 text-muted-foreground" />
                        Billing Configuration
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                    
                    <DropdownMenuSeparator className="bg-muted/30" />
                    <DropdownMenuItem
                      onClick={onSignOut}
                      className="gap-2 cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10"
                    >
                      <LogOut className="h-4 w-4" />
                      Log Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
        </Sidebar>

        {/* 💻 Right Application Panel Panel */}
        <SidebarInset className="flex flex-col flex-1 w-full overflow-x-hidden bg-background/50">
          
          {/* 🏷️ Top Header Navigation Bar */}
          <header className="flex h-16 shrink-0 items-center justify-between gap-4 border-b border-muted/30 px-6 backdrop-blur-[2px] bg-background/80">
            <div className="flex items-center gap-2.5">
              <SidebarTrigger className="hover:bg-muted/10 h-8 w-8 rounded-lg" />
              <div className="h-4 w-[1px] bg-muted/40" />
              
              <Breadcrumb className="hidden sm:block">
                <BreadcrumbList className="gap-1.5 text-xs font-medium">
                  <BreadcrumbItem>
                    <BreadcrumbLink href="/dashboard" className="text-muted-foreground hover:text-foreground">Platform</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator className="text-muted-foreground/45" />
                  <BreadcrumbItem>
                    <BreadcrumbPage className="text-foreground">Dashboard Overview</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>

            {/* Top Bar Actions */}
            <div className="flex items-center gap-4">
              <div className="relative w-48 lg:w-64 hidden md:block">
                <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Quick search... (⌘K)"
                  className="pl-8 bg-muted/10 border-muted/50 focus-visible:ring-primary/50 text-xs h-9"
                />
              </div>

              <Button variant="ghost" size="icon" className="hover:bg-muted/10 h-8 w-8 relative text-muted-foreground hover:text-foreground">
                <Bell className="h-4 w-4" />
                <span className="absolute top-1 right-1 h-1.5 w-1.5 rounded-full bg-primary" />
              </Button>
            </div>
          </header>

          {/* 🧩 Dashboard Page Dynamic Child Content */}
          <main className="flex-1 p-6 w-full max-w-7xl mx-auto space-y-6">
            {children}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}
