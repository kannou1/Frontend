import React, { useState } from "react";
import { Outlet, Link } from "react-router-dom";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { StudentSidebar } from "@/components/Sidebars/StudentSidebar";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Menu, User, Bell, Sun, Moon, LogOut, Settings } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useTheme } from "@/contexts/ThemeContext";

const StudentLayout = ({ children }) => {
  const { theme, toggleTheme } = useTheme();
  const [notifications] = useState([
    { id: 1, message: "New assignment posted", unread: true },
    { id: 2, message: "Exam results available", unread: true },
    { id: 3, message: "Class schedule reminder", unread: false },
  ]);

  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <StudentSidebar />

        <SidebarInset>
          <header className="sticky top-0 z-50 flex h-16 items-center justify-between border-b bg-background/95 backdrop-blur px-6 shadow-sm">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="-ml-2">
                <Button variant="ghost" size="icon" className="h-9 w-9">
                  <Menu className="h-5 w-5" />
                </Button>
              </SidebarTrigger>

              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                  <span className="text-sm font-bold text-white">E</span>
                </div>
                <h1 className="text-lg font-semibold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  EduNex Student Portal
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Theme Toggle */}
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className="h-9 w-9"
              >
                {theme === 'dark' ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
              </Button>

              {/* Notifications */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10 relative rounded-full hover:bg-primary/10 transition-all duration-200 hover:scale-105 group"
                  >
                    <Bell className="h-5 w-5 group-hover:text-primary transition-colors" />
                    {unreadCount > 0 && (
                      <Badge
                        variant="destructive"
                        className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs animate-pulse"
                      >
                        {unreadCount}
                      </Badge>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80 p-0 shadow-lg border-0 bg-background/95 backdrop-blur-sm">
                  <div className="p-4 border-b">
                    <h3 className="font-semibold text-lg bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                      Notifications
                    </h3>
                    <p className="text-sm text-muted-foreground">You have {unreadCount} unread notifications</p>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className="flex items-start gap-3 p-4 hover:bg-muted/50 transition-colors border-b border-border/50 last:border-b-0"
                      >
                        <div className="flex-shrink-0 mt-1">
                          <div className={`h-3 w-3 rounded-full ${notification.unread ? 'bg-primary animate-pulse' : 'bg-muted'}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm ${notification.unread ? 'font-medium' : 'text-muted-foreground'}`}>
                            {notification.message}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">2 hours ago</p>
                        </div>
                        {notification.unread && (
                          <div className="flex-shrink-0">
                            <div className="h-2 w-2 bg-primary rounded-full" />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="p-3 border-t">
                    <Link to="/student/notifications">
                      <Button variant="ghost" className="w-full text-sm hover:bg-primary/10">
                        View All Notifications
                      </Button>
                    </Link>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src="/placeholder-avatar.jpg" alt="Student" />
                      <AvatarFallback>ST</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">Student User</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        student@edunex.com
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-red-600">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>

          <main className="flex-1">
            <Outlet />
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default StudentLayout;
