import React, { useState, useEffect } from "react";
import { Outlet, Link, useNavigate } from "react-router-dom";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { TeacherSidebar } from "@/components/Sidebars/TeacherSidebar";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Menu, User, Bell, Sun, Moon, LogOut, Settings, Loader2 } from "lucide-react";
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
import { getUserAuth } from "@/services/userService";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const TeacherLayout = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [loggingOut, setLoggingOut] = useState(false);
  const [teacher, setTeacher] = useState(null);
  const [notifications] = useState([
    { id: 1, message: "New assignment submitted", unread: true },
    { id: 2, message: "Grade submission deadline approaching", unread: true },
    { id: 3, message: "Class schedule updated", unread: false },
  ]);

  const unreadCount = notifications.filter(n => n.unread).length;

  // Fetch connected teacher info
  useEffect(() => {
    const fetchTeacher = async () => {
      try {
        const response = await getUserAuth();
        const userData = response.data || response;
        setTeacher(userData);
      } catch (error) {
        console.error("Error fetching teacher data:", error);
      }
    };
    fetchTeacher();
  }, []);

  const getInitials = () => {
    if (!teacher) return "TC";
    const first = teacher.prenom?.[0]?.toUpperCase() || "";
    const last = teacher.nom?.[0]?.toUpperCase() || "";
    return first + last || "TC";
  };

  const getFullName = () => {
    if (!teacher) return "Teacher User";
    return `${teacher.prenom || ""} ${teacher.nom || ""}`.trim() || "Teacher User";
  };

  const handleLogout = async () => {
    try {
      setLoggingOut(true);
      
      // Call logout API
      const response = await fetch(`${API_BASE_URL}/users/logout`, {
        method: 'POST',
        credentials: 'include',
      });

      if (response.ok) {
        // Clear local storage
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        
        // Redirect to login
        navigate('/login');
      } else {
        console.error('Logout failed');
        // Still redirect even if API fails
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        navigate('/login');
      }
    } catch (error) {
      console.error('Error during logout:', error);
      // Clear local data and redirect anyway
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      navigate('/login');
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <TeacherSidebar />

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
                  EduNex Teacher Portal
                </h1>
              </div>
            </div>

            {/* Right side */}
            <div className="flex items-center gap-2">
              {/* Theme toggle */}
              <Button variant="ghost" size="icon" onClick={toggleTheme} className="h-9 w-9">
                {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
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
                          <div className={`h-3 w-3 rounded-full ${notification.unread ? "bg-primary animate-pulse" : "bg-muted"}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm ${notification.unread ? "font-medium" : "text-muted-foreground"}`}>
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
                    <Link to="/teacher/notifications">
                      <Button variant="ghost" className="w-full text-sm hover:bg-primary/10">
                        View All Notifications
                      </Button>
                    </Link>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* User menu - Connected Teacher Info */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-9 w-9 rounded-full p-0">
                    <Avatar className="h-9 w-9 border-2 border-primary/20">
                      {teacher?.image_User ? (
                        <AvatarImage 
                          src={`${API_BASE_URL}/images/${teacher.image_User}`}
                          alt={getFullName()}
                        />
                      ) : null}
                      <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-white font-semibold">
                        {getInitials()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {getFullName()}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {teacher?.email || "teacher@edunex.com"}
                      </p>
                    </div>
                  </DropdownMenuLabel>

                  <DropdownMenuSeparator />

                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>

                  <DropdownMenuItem asChild>
                    <Link to="/teacher/profile" className="flex items-center">
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />

                  <DropdownMenuItem 
                    className="text-red-600 cursor-pointer"
                    onClick={handleLogout}
                    disabled={loggingOut}
                  >
                    {loggingOut ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        <span>Logging out...</span>
                      </>
                    ) : (
                      <>
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Log out</span>
                      </>
                    )}
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

export default TeacherLayout;
