import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import {
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

import Dashboard from "./pages/Dashboard";
import Courses from "./pages/Courses";
import Timetable from "./pages/Timetable";
import Exams from "./pages/Exams";
import Attendance from "./pages/Attendance";
import Requests from "./pages/Requests";
import Messages from "./pages/Messages";
import Notifications from "./pages/Notifications";
import NotFound from "./pages/NotFound";
import Login from "./pages/Auth/Login";

// Admin
import AdminDashboard from "./pages/Admin/Dashboard";
import AdminUsers from "./pages/Admin/Users";


// Teacher
import TeacherDashboard from "./pages/Teacher/Dashboard";
import TeacherCourses from "./pages/Teacher/Courses";
import TeacherAttendance from "./pages/Teacher/Attendance";
import TeacherGrading from "./pages/Teacher/Grading";
import TeacherSchedule from "./pages/Teacher/Schedule";
import TeacherStudents from "./pages/Teacher/Students";

const queryClient = new QueryClient();

const Layout = () => (
  <SidebarProvider>
    <div className="flex min-h-screen w-full">
      <AppSidebar />

      <SidebarInset>
        <header className="sticky top-0 z-50 flex h-16 items-center gap-4 border-b bg-background/95 backdrop-blur px-6 shadow-sm">
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
              EduNex Portal
            </h1>
          </div>
        </header>

        <main className="flex-1">
          <Routes>
            {/* Student */}
            <Route path="/" element={<Dashboard />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/timetable" element={<Timetable />} />
            <Route path="/exams" element={<Exams />} />
            <Route path="/attendance" element={<Attendance />} />
            <Route path="/requests" element={<Requests />} />
            <Route path="/messages" element={<Messages />} />
            <Route path="/notifications" element={<Notifications />} />

            {/* Admin */}
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<AdminUsers />} />
            

            {/* Teacher */}
            <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
            <Route path="/teacher/courses" element={<TeacherCourses />} />
            <Route path="/teacher/students" element={<TeacherStudents />} />
            <Route path="/teacher/grading" element={<TeacherGrading />} />
            <Route path="/teacher/attendance" element={<TeacherAttendance />} />
            <Route path="/teacher/schedule" element={<TeacherSchedule />} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </SidebarInset>
    </div>
  </SidebarProvider>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* No layout */}
          <Route path="/login" element={<Login />} />

          {/* All protected pages use the layout */}
          <Route path="/*" element={<Layout />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
