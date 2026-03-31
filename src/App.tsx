import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import StudentDashboard from "./pages/dashboard/StudentDashboard";
import StudentProfile from "./pages/dashboard/StudentProfile";
import StudentJobs from "./pages/dashboard/StudentJobs";
import StudentApplications from "./pages/dashboard/StudentApplications";
import StudentInterviews from "./pages/dashboard/StudentInterviews";
import RecruiterDashboard from "./pages/dashboard/RecruiterDashboard";
import AdminDashboard from "./pages/dashboard/AdminDashboard";
import NotFound from "./pages/NotFound";
import { AuthProvider } from "@/auth/AuthProvider";
import { RequireRole } from "@/auth/RequireRole";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Sonner position="top-center" richColors />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* Student Routes */}
            <Route
              path="/dashboard/student"
              element={
                <RequireRole role="student">
                  <StudentDashboard />
                </RequireRole>
              }
            />
            <Route
              path="/dashboard/student/profile"
              element={
                <RequireRole role="student">
                  <StudentProfile />
                </RequireRole>
              }
            />
            <Route
              path="/dashboard/student/jobs"
              element={
                <RequireRole role="student">
                  <StudentJobs />
                </RequireRole>
              }
            />
            <Route
              path="/dashboard/student/applications"
              element={
                <RequireRole role="student">
                  <StudentApplications />
                </RequireRole>
              }
            />
            <Route
              path="/dashboard/student/interviews"
              element={
                <RequireRole role="student">
                  <StudentInterviews />
                </RequireRole>
              }
            />
            <Route
              path="/dashboard/student/ai-insights"
              element={
                <RequireRole role="student">
                  <div>AI Insights Page</div>
                </RequireRole>
              }
            />

            {/* Recruiter Routes mapped to Sidebar */}
            <Route
              path="/dashboard/recruiter"
              element={
                <RequireRole role="recruiter">
                  <RecruiterDashboard />
                </RequireRole>
              }
            />
            <Route
              path="/dashboard/recruiter/post-job"
              element={
                <RequireRole role="recruiter">
                  <RecruiterDashboard />
                </RequireRole>
              }
            />
            <Route
              path="/dashboard/recruiter/applicants"
              element={
                <RequireRole role="recruiter">
                  <RecruiterDashboard />
                </RequireRole>
              }
            />
            <Route
              path="/dashboard/recruiter/shortlisted"
              element={
                <RequireRole role="recruiter">
                  <RecruiterDashboard />
                </RequireRole>
              }
            />
            <Route
              path="/dashboard/recruiter/schedule"
              element={
                <RequireRole role="recruiter">
                  <RecruiterDashboard />
                </RequireRole>
              }
            />

            {/* Admin */}
            <Route
              path="/dashboard/admin/*"
              element={
                <RequireRole role="admin">
                  <AdminDashboard />
                </RequireRole>
              }
            />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;