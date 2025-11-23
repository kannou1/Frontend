import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@/contexts/ThemeContext";

// Auth
import Login from "./pages/Auth/Login";

// Admin
import AdminLayout from "./pages/Admin/Layout";
import AdminDashboard from "./pages/Admin/Dashboard";
import AdminUsers from "./pages/Admin/Users";
import AdminCourses from "./pages/Admin/Courses";
import AdminReports from "./pages/Admin/Reports";
import AdminSettings from "./pages/Admin/Settings";
import AdminMessages from "./pages/Admin/Messages";
import AdminProfile from "./pages/Admin/Profile";
import AdminNotifications from "./pages/Admin/Notifications";

// Teacher
import TeacherLayout from "./pages/Teacher/Layout";
import TeacherDashboard from "./pages/Teacher/Dashboard";
import TeacherCourses from "./pages/Teacher/Courses";
import TeacherAttendance from "./pages/Teacher/Attendance";
import TeacherGrading from "./pages/Teacher/Grading";
import TeacherSchedule from "./pages/Teacher/Schedule";
import TeacherStudents from "./pages/Teacher/Students";
import TeacherMessages from "./pages/Teacher/Messages";
import TeacherProfile from "./pages/Teacher/Profile";
import TeacherNotifications from "./pages/Teacher/Notifications";

// Student
import StudentLayout from "./pages/Student/Layout";
import StudentDashboard from "./pages/Student/Dashboard";
import StudentCourses from "./pages/Student/Courses";
import StudentAttendance from "./pages/Student/Attendance";
import StudentTimetable from "./pages/Student/Timetable";
import StudentExams from "./pages/Student/Exams";
import StudentRequests from "./pages/Student/Requests";
import StudentMessages from "./pages/Student/Messages";
import StudentNotifications from "./pages/Student/Notifications";
import StudentProfile from "./pages/Student/Profile";
import StudentNotFound from "./pages/Student/NotFound";


const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
        <Routes>
          {/* First page / login */}
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />

          {/* Student routes */}
          <Route path="/student" element={<StudentLayout />}>
            <Route index element={<StudentDashboard />} />
            <Route path="courses" element={<StudentCourses />} />
            <Route path="timetable" element={<StudentTimetable />} />
            <Route path="exams" element={<StudentExams />} />
            <Route path="attendance" element={<StudentAttendance />} />
            <Route path="requests" element={<StudentRequests />} />
            <Route path="messages" element={<StudentMessages />} />
            <Route path="notifications" element={<StudentNotifications />} />
            <Route path="profile" element={<StudentProfile />} />
            <Route path="*" element={<StudentNotFound />} />
          </Route>

          {/* Teacher routes */}
          <Route path="/teacher" element={<TeacherLayout />}>
            <Route index element={<TeacherDashboard />} />
            <Route path="courses" element={<TeacherCourses />} />
            <Route path="students" element={<TeacherStudents />} />
            <Route path="grading" element={<TeacherGrading />} />
            <Route path="attendance" element={<TeacherAttendance />} />
            <Route path="schedule" element={<TeacherSchedule />} />
            <Route path="messages" element={<TeacherMessages />} />
            <Route path="notifications" element={<TeacherNotifications />} />
            <Route path="profile" element={<TeacherProfile />} />
            <Route path="*" element={<StudentNotFound />} />
          </Route>

          {/* Admin routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="students" element={<AdminUsers />} />
            <Route path="teachers" element={<AdminUsers />} />
            <Route path="courses" element={<AdminCourses />} />
            <Route path="reports" element={<AdminReports />} />
            <Route path="settings" element={<AdminSettings />} />
            <Route path="messages" element={<AdminMessages />} />
            <Route path="notifications" element={<AdminNotifications />} />
            <Route path="profile" element={<AdminProfile />} />
            <Route path="*" element={<StudentNotFound />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </ThemeProvider>
  </QueryClientProvider>
);

export default App; 