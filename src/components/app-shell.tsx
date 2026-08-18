import type { ReactNode } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Mail,
  FileText,
  ListChecks,
  BookOpen,
  MessageSquare,
  Settings,
  LifeBuoy,
  ShieldCheck,
  BrainCircuit,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

const primaryNav = [
  { title: "Dashboard", to: "/", icon: LayoutDashboard },
  { title: "Smart Email", to: "/email", icon: Mail },
  { title: "Meeting Notes", to: "/meetings", icon: FileText },
  { title: "Task Planner", to: "/tasks", icon: ListChecks },
  { title: "Research Assistant", to: "/research", icon: BookOpen },
  { title: "AI Chat", to: "/chat", icon: MessageSquare },
] as const;

const secondaryNav = [
  { title: "Settings", to: "/settings", icon: Settings },
  { title: "Help", to: "/help", icon: LifeBuoy },
  { title: "Responsible AI", to: "/responsible-ai", icon: ShieldCheck },
] as const;

function AppSidebar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  const renderItems = (items: readonly { title: string; to: string; icon: typeof Mail }[]) =>
    items.map((item) => {
      const isActive = pathname === item.to;
      return (
        <SidebarMenuItem key={item.to}>
          <SidebarMenuButton asChild isActive={isActive} tooltip={item.title}>
            <Link to={item.to} aria-current={isActive ? "page" : undefined}>
              <item.icon aria-hidden="true" />
              <span>{item.title}</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      );
    });

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="px-3 py-4">
        <Link to="/" className="flex items-center gap-3 rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring">
          <span className="gradient-primary flex size-9 shrink-0 items-center justify-center rounded-xl shadow-elevated">
            <BrainCircuit className="size-5 text-primary-foreground" aria-hidden="true" />
          </span>
          <span className="flex flex-col group-data-[collapsible=icon]:hidden">
            <span className="text-sm font-semibold text-sidebar-foreground">AI Workplace</span>
            <span className="text-xs text-sidebar-foreground/70">Productivity Assistant</span>
          </span>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Workspace</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>{renderItems(primaryNav)}</SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Support</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>{renderItems(secondaryNav)}</SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="px-3 pb-4 group-data-[collapsible=icon]:hidden">
        <p className="rounded-lg bg-sidebar-accent p-3 text-xs leading-relaxed text-sidebar-accent-foreground/85">
          Review AI-generated content before professional use.
        </p>
      </SidebarFooter>
    </Sidebar>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="bg-background">
        <header className="sticky top-0 z-20 flex h-14 items-center gap-3 border-b border-border bg-background/85 px-4 backdrop-blur md:px-6">
          <SidebarTrigger aria-label="Toggle navigation menu" />
          <span className="text-sm font-medium text-muted-foreground">
            AI Workplace Productivity Assistant
          </span>
        </header>
        <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 md:px-8 md:py-10">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}

export function PageHeader({
  title,
  description,
  icon: Icon,
}: {
  title: string;
  description: string;
  icon: typeof Mail;
}) {
  return (
    <div className="mb-8 flex items-start gap-4">
      <span className="gradient-primary hidden size-12 shrink-0 items-center justify-center rounded-2xl shadow-elevated sm:flex">
        <Icon className="size-6 text-primary-foreground" aria-hidden="true" />
      </span>
      <div>
        <h1 className="text-2xl font-semibold text-foreground md:text-3xl">{title}</h1>
        <p className="mt-1 max-w-2xl text-sm text-muted-foreground md:text-base">{description}</p>
      </div>
    </div>
  );
}
