import React, { useState } from "react";
import { Outlet, Link, useNavigate } from "react-router-dom";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/Sidebars/AdminSidebar";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Menu, User, Bell, Sun, Moon, LogOut, Loader2, CheckCircle } from "lucide-react";
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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useTheme } from "@/contexts/ThemeContext";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const exampleNotifications = [
  { id: 1, message: "New student <b>Sara Johnson</b> enrolled", date: "Just now", unread: true },
  { id: 2, message: "Class <b>3A Informatique</b> schedule updated", date: "10 min ago", unread: true },
  { id: 3, message: "Course completion report is ready", date: "Today, 09:05", unread: false },
  { id: 4, message: "System maintenance scheduled on 26 Nov", date: "Yesterday", unread: false },
];

const AdminLayout = ({ children }) => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [loggingOut, setLoggingOut] = useState(false);
  const [showLogoutSuccess, setShowLogoutSuccess] = useState(false);

  // Use the static example notifications array
  const [notifications] = useState(exampleNotifications);
  const unreadCount = notifications.filter((n) => n.unread).length;

  // Get user from localStorage
  const storedUser = typeof window !== "undefined"
    ? JSON.parse(localStorage.getItem("user") || "{}")
    : {};
  const userName = storedUser.prenom
    ? `${storedUser.prenom} ${storedUser.nom ?? ""}`.trim()
    : storedUser.nom ?? "";
  const userEmail = storedUser.email ?? "";
  // CORRECTED - Use real user image if exists
  const avatarSrc = storedUser.image_User
    ? `${API_BASE_URL}/images/${storedUser.image_User}`
    : "/placeholder-avatar.jpg";
  const avatarFallback = (storedUser.prenom?.[0] ?? "U") + (storedUser.nom?.[0] ?? "");

  const handleLogout = async () => {
    try {
      setLoggingOut(true);
      await fetch(`${API_BASE_URL}/users/logout`, {
        method: "POST",
        credentials: "include",
      });

      localStorage.removeItem("user");
      localStorage.removeItem("token");
      setShowLogoutSuccess(true);

      setTimeout(() => {
        navigate("/login", { replace: true });
      }, 1500);
    } catch (error) {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      setShowLogoutSuccess(true);
      setTimeout(() => {
        navigate("/login", { replace: true });
      }, 1500);
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AdminSidebar />
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
                  EduNex Admin Portal
                </h1>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" onClick={toggleTheme} className="h-9 w-9">
                {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </Button>
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
                <DropdownMenuContent align="end" className="w-80 max-h-96 overflow-y-auto p-0 shadow-lg border-0 bg-background/95 backdrop-blur-sm">
                  <div className="px-4 py-3 border-b sticky top-0 z-10 bg-background bg-opacity-80">
                    <span className="font-bold text-base">Notifications</span>
                  </div>
                  <div>
                    {notifications.length === 0 && (
                      <div className="p-4 text-center text-muted-foreground text-sm">
                        No notifications
                      </div>
                    )}
                    {notifications.map((notif) => (
                      <div
                        key={notif.id}
                        className={`flex items-start gap-2 px-4 py-3 border-b last:border-b-0 hover:bg-accent/20 cursor-pointer transition-all duration-200 ${
                          notif.unread ? "bg-gradient-to-r from-primary/5 to-secondary/5" : ""
                        }`}
                      >
                        {notif.unread ? (
                          <span className="mt-2 mr-1 w-2 h-2 rounded-full bg-primary inline-block" />
                        ) : (
                          <span className="mt-2 mr-1 w-2 h-2 rounded-full bg-gray-400 opacity-50 inline-block" />
                        )}
                        <div className="flex-1">
                          <div
                            className={`leading-snug text-sm ${
                              notif.unread ? "font-semibold" : ""
                            }`}
                            dangerouslySetInnerHTML={{ __html: notif.message }}
                          />
                          <div className="text-xs text-muted-foreground mt-1">
                            {notif.date}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="p-2 text-center sticky bottom-0 bg-background bg-opacity-80 border-t">
                    <Link to="/admin/notifications" className="text-primary hover:underline text-sm font-medium">
                      View all notifications
                    </Link>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={avatarSrc} alt={userName} />
                      <AvatarFallback>{avatarFallback}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {userName || "Unknown User"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {userEmail || ""}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/admin/profile" className="flex items-center">
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
                        Logging out...
                      </>
                    ) : (
                      <>
                        <LogOut className="mr-2 h-4 w-4" />
                        Log out
                      </>
                    )}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>
          {showLogoutSuccess && (
            <div className="fixed top-20 right-6 z-50 animate-in slide-in-from-top-5">
              <Alert className="bg-green-50 border-green-200 text-green-900 shadow-lg">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="ml-2">
                  Successfully logged out! Redirecting...
                </AlertDescription>
              </Alert>
            </div>
          )}
          <main className="flex-1">
            <Outlet />
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default AdminLayout;
