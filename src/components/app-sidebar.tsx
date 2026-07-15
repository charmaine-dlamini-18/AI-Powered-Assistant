import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  FilePlus2,
  Map,
  Bell,
  MessagesSquare,
  Phone,
  Vote,
  BarChart3,
  ShieldCheck,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const primary = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Report Issue", url: "/report", icon: FilePlus2 },
  { title: "Community Map", url: "/map", icon: Map },
  { title: "Alerts", url: "/alerts", icon: Bell },
];

const community = [
  { title: "Discussion Forum", url: "/forum", icon: MessagesSquare },
  { title: "Petitions", url: "/petitions", icon: Vote },
  { title: "Directory", url: "/directory", icon: Phone },
];

const officials = [
  { title: "Analytics", url: "/analytics", icon: BarChart3 },
];

export function AppSidebar() {
  const pathname = useRouterState({ select: (r) => r.location.pathname });
  const isActive = (p: string) => (p === "/" ? pathname === "/" : pathname.startsWith(p));

  const renderGroup = (label: string, items: typeof primary) => (
    <SidebarGroup>
      <SidebarGroupLabel>{label}</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.url}>
              <SidebarMenuButton asChild isActive={isActive(item.url)}>
                <Link to={item.url} className="flex items-center gap-3">
                  <item.icon className="h-4 w-4 shrink-0" />
                  <span className="truncate">{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2 py-3">
          <div
            className="grid h-9 w-9 shrink-0 place-items-center rounded-xl text-primary-foreground"
            style={{ background: "var(--gradient-hero)" }}
          >
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <div className="truncate font-display text-sm font-bold text-sidebar-foreground">
              CommunityConnect
            </div>
            <div className="truncate text-[11px] text-sidebar-foreground/70">
              Mvutshini · KZN
            </div>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        {renderGroup("Residents", primary)}
        {renderGroup("Community", community)}
        {renderGroup("Officials", officials)}
      </SidebarContent>

      <SidebarFooter>
        <div className="px-3 py-2 text-[10px] leading-relaxed text-sidebar-foreground/60">
          AI features assist reporting. Verify important information with your ward councillor.
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
