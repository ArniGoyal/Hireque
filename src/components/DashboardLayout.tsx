import { ReactNode } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarTrigger, useSidebar,
} from "@/components/ui/sidebar";
import { NavLink } from "@/components/NavLink";
import { Button } from "@/components/ui/button";
import {
  GraduationCap, LayoutDashboard, User, Briefcase, FileText, CalendarDays,
  Building2, Users, BarChart3, Settings, LogOut, ClipboardList, PlusCircle, UserCheck,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useAuth } from "@/auth/AuthProvider";

interface NavItem { title: string; url: string; icon: LucideIcon; }

const studentNav: NavItem[] = [
  { title: "Dashboard", url: "/dashboard/student", icon: LayoutDashboard },
  { title: "My Profile", url: "/dashboard/student/profile", icon: User },
  { title: "Browse Jobs", url: "/dashboard/student/jobs", icon: Briefcase },
  { title: "Applications", url: "/dashboard/student/applications", icon: FileText },
  { title: "Interviews", url: "/dashboard/student/interviews", icon: CalendarDays },
];

const recruiterNav: NavItem[] = [
  { title: "Dashboard", url: "/dashboard/recruiter", icon: LayoutDashboard },
  { title: "Applicants", url: "/dashboard/recruiter/applicants", icon: Users },
  { title: "Shortlisted", url: "/dashboard/recruiter/shortlisted", icon: UserCheck },
  { title: "Schedule", url: "/dashboard/recruiter/schedule", icon: CalendarDays },
];

const adminNav: NavItem[] = [
  { title: "Dashboard", url: "/dashboard/admin", icon: LayoutDashboard },
  { title: "Students", url: "/dashboard/admin/students", icon: Users },
  { title: "Companies", url: "/dashboard/admin/companies", icon: Building2 },
  { title: "Job Postings", url: "/dashboard/admin/postings", icon: ClipboardList },
  { title: "Analytics", url: "/dashboard/admin/analytics", icon: BarChart3 },
  { title: "Settings", url: "/dashboard/admin/settings", icon: Settings },
];

const navMap: Record<string, { items: NavItem[]; label: string }> = {
  student: { items: studentNav, label: "Student" },
  recruiter: { items: recruiterNav, label: "Recruiter" },
  admin: { items: adminNav, label: "Admin" },
};

function AppSidebar({ role }: { role: string }) {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const nav = navMap[role] || navMap.student;
  const navigate = useNavigate();
  const { signOut } = useAuth();

  return (
    <Sidebar collapsible="icon" className="border-r-0">
      <div className="flex items-center gap-2.5 px-4 h-16 border-b border-sidebar-border">
        <div className="w-8 h-8 rounded-lg bg-sidebar-primary flex items-center justify-center shrink-0">
          <GraduationCap className="w-4 h-4 text-sidebar-primary-foreground" />
        </div>
        {!collapsed && <span className="font-serif font-bold text-sidebar-foreground">Hireque</span>}
      </div>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="uppercase tracking-widest text-[10px] font-semibold">{nav.label} Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {nav.items.map((item, i) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end
                      className="hover:bg-sidebar-accent/50 transition-all duration-200 rounded-lg"
                      activeClassName="bg-sidebar-accent text-sidebar-primary font-medium"
                    >
                      <item.icon className="mr-2 h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <div className="mt-auto p-3 border-t border-sidebar-border">
        <Button
          variant="ghost"
          className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent rounded-lg"
          onClick={async () => {
            await signOut();
            navigate("/");
          }}
        >
          <LogOut className="mr-2 h-4 w-4" />
          {!collapsed && "Log out"}
        </Button>
      </div>
    </Sidebar>
  );
}

interface DashboardLayoutProps { children: ReactNode; role: string; }

const DashboardLayout = ({ children, role }: DashboardLayoutProps) => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar role={role} />
        <div className="flex-1 flex flex-col">
          <header className="h-14 flex items-center border-b px-4 bg-card/80 backdrop-blur-lg">
            <SidebarTrigger className="mr-4" />
            <h2 className="font-serif font-bold text-foreground capitalize">{role} Portal</h2>
          </header>
          <main className="flex-1 p-6 bg-background overflow-auto">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              {children}
            </motion.div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default DashboardLayout;
