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

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Sonner position="top-center" richColors />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Student Routes */}
          <Route path="/dashboard/student" element={<StudentDashboard />} />
          <Route path="/dashboard/student/profile" element={<StudentProfile />} />
          <Route path="/dashboard/student/jobs" element={<StudentJobs />} />
          <Route path="/dashboard/student/applications" element={<StudentApplications />} />
          <Route path="/dashboard/student/interviews" element={<StudentInterviews />} />

          {/* Recruiter Routes mapped to Sidebar */}
          <Route path="/dashboard/recruiter" element={<RecruiterDashboard />} />
          <Route path="/dashboard/recruiter/post-job" element={<RecruiterDashboard />} />
          <Route path="/dashboard/recruiter/applicants" element={<RecruiterDashboard />} />
          <Route path="/dashboard/recruiter/shortlisted" element={<RecruiterDashboard />} />
          <Route path="/dashboard/recruiter/schedule" element={<RecruiterDashboard />} />

          <Route path="/dashboard/admin/*" element={<AdminDashboard />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;