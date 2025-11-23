import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  BookOpen,
  Calendar,
  FileText,
  UserCheck,
  Send,
  MessageSquare,
  Bell,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const navItems = [
  { path: "", label: "Dashboard", icon: LayoutDashboard },
  { path: "courses", label: "Courses", icon: BookOpen },
  { path: "timetable", label: "Timetable", icon: Calendar },
  { path: "exams", label: "Exams & Notes", icon: FileText },
  { path: "attendance", label: "Attendance", icon: UserCheck },
  { path: "requests", label: "Requests", icon: Send },
  { path: "messages", label: "Messages", icon: MessageSquare },
  { path: "notifications", label: "Notifications", icon: Bell },
];

export function StudentSidebar() {
  const location = useLocation();
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  return (
    <Sidebar collapsible="icon" className="border-r transition-all duration-300 ease-in-out">
      <SidebarHeader className="h-16 border-b border-border/50 bg-gradient-to-br from-sidebar to-sidebar/80 transition-all duration-300 flex items-center">
         <Link
                  to="/Student/"
                  className={`flex items-center w-full transition-all duration-200 ${
                    isCollapsed ? "justify-center px-3" : "gap-3 px-4"
                  }`}
                >
                  {/* FIXED PERFECT COLLAPSED LOGO */}
               <div
          className={`
            flex items-center justify-center 
            rounded-xl shadow-lg 
            bg-gradient-to-br from-primary to-secondary
            transition-all duration-200
            w-9 h-9 flex-shrink-0
          `}
        >
          <span className="text-base font-bold text-white select-none">E</span>
        </div>
        
                 
        
                  {!isCollapsed && (
                    <div className="flex flex-col transition-opacity duration-200">
                      <span className="text-base font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                        EduNex
                      </span>
                      <span className="text-[10px] text-muted-foreground">
                        student Portal
                      </span>
                    </div>
                  )}
                </Link>
      </SidebarHeader>

      <SidebarContent className={`py-4 transition-all duration-300 ${isCollapsed ? 'px-1' : 'px-2'}`}>
        <SidebarGroup>
          {!isCollapsed && (
            <SidebarGroupLabel className="px-4 mb-2 transition-all duration-300">
              Menu
            </SidebarGroupLabel>
          )}
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === `/student${item.path ? `/${item.path}` : ''}`;

                return (
                  <SidebarMenuItem key={item.path}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={item.label}
                      className={`transition-all duration-200 hover:bg-accent/50 ${
                        isCollapsed
                          ? 'h-11 w-11 p-0 justify-center mx-auto'
                          : 'h-11'
                      } ${
                        isActive
                          ? 'bg-gradient-to-r from-primary/15 to-secondary/15 border-l-4 border-primary shadow-sm'
                          : ''
                      }`}
                    >
                      <Link to={item.path} className={`flex items-center w-full ${isCollapsed ? 'justify-center' : 'gap-3 px-4'}`}>
                        <Icon className={`h-5 w-5 flex-shrink-0 transition-all duration-200 ${isActive ? 'text-primary' : ''}`} />
                        {!isCollapsed && (
                          <span className="font-medium whitespace-nowrap">
                            {item.label}
                          </span>
                        )}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className={`border-t border-border/50 transition-all duration-300 ${isCollapsed ? 'p-2' : 'p-4'}`}>
        <div className={`flex items-center rounded-lg hover:bg-accent/50 transition-all duration-200 cursor-pointer overflow-hidden ${
          isCollapsed ? 'justify-center p-2' : 'gap-3 px-2 py-2'
        }`}>
          <Avatar className="h-9 w-9 border-2 border-primary/20 flex-shrink-0 transition-all duration-300">
            <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-white font-semibold">
              JD
            </AvatarFallback>
          </Avatar>
          {!isCollapsed && (
            <div className="flex flex-col flex-1 min-w-0">
              <span className="text-sm font-semibold truncate whitespace-nowrap">John Doe</span>
              <span className="text-xs text-muted-foreground truncate whitespace-nowrap">student@edunex.com</span>
            </div>
          )}
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}