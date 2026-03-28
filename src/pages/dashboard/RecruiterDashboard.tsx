import { motion } from "framer-motion";
import DashboardLayout from "@/components/DashboardLayout";
import StatCard from "@/components/StatCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, FileText, CalendarDays, Briefcase, ArrowRight } from "lucide-react";

const postedJobs = [
  { id: 1, role: "SDE Intern", applications: 48, shortlisted: 12, status: "Active" },
  { id: 2, role: "Data Analyst", applications: 32, shortlisted: 8, status: "Active" },
  { id: 3, role: "Frontend Developer", applications: 55, shortlisted: 15, status: "Closed" },
];

const topApplicants = [
  { name: "Priya Sharma", branch: "CSE", cgpa: 9.2, skills: ["React", "Node.js", "Python"] },
  { name: "Arjun Mehta", branch: "IT", cgpa: 8.8, skills: ["Java", "Spring", "AWS"] },
  { name: "Sneha Reddy", branch: "CSE", cgpa: 9.5, skills: ["ML", "Python", "TensorFlow"] },
  { name: "Karan Singh", branch: "ECE", cgpa: 8.6, skills: ["C++", "Embedded", "IoT"] },
];

const RecruiterDashboard = () => {
  return (
    <DashboardLayout role="recruiter">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-serif font-bold text-foreground">Recruiter Dashboard</h1>
          <p className="text-muted-foreground mt-1">Manage your job postings and applicants.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard icon={Briefcase} title="Active Jobs" value={2} index={0} />
          <StatCard icon={Users} title="Total Applicants" value={135} trend="+24 today" trendUp index={1} />
          <StatCard icon={FileText} title="Shortlisted" value={35} index={2} />
          <StatCard icon={CalendarDays} title="Interviews Scheduled" value={8} index={3} />
        </div>

        {/* Posted Jobs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-card border rounded-2xl overflow-hidden shadow-sm"
        >
          <div className="flex items-center justify-between p-6 border-b">
            <h3 className="font-serif font-bold text-lg text-foreground">Your Job Postings</h3>
            <Button size="sm" className="rounded-lg shadow-sm">+ Post New Job</Button>
          </div>
          <div className="divide-y">
            {postedJobs.map((job, i) => (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + i * 0.08 }}
                className="flex items-center justify-between p-4 px-6 hover:bg-muted/40 transition-colors"
              >
                <div>
                  <p className="font-semibold text-foreground">{job.role}</p>
                  <p className="text-sm text-muted-foreground">{job.applications} applications · {job.shortlisted} shortlisted</p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant={job.status === "Active" ? "default" : "secondary"}>{job.status}</Badge>
                  <Button variant="ghost" size="sm" className="text-accent font-semibold">
                    View <ArrowRight className="ml-1 w-3 h-3" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Top Applicants */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="bg-card border rounded-2xl overflow-hidden shadow-sm"
        >
          <div className="p-6 border-b">
            <h3 className="font-serif font-bold text-lg text-foreground">Top Applicants</h3>
          </div>
          <div className="divide-y">
            {topApplicants.map((a, i) => (
              <motion.div
                key={a.name}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 + i * 0.08 }}
                className="flex items-center justify-between p-4 px-6 hover:bg-muted/40 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center text-accent font-bold text-sm font-serif">
                    {a.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{a.name}</p>
                    <p className="text-sm text-muted-foreground">{a.branch} · CGPA {a.cgpa}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {a.skills.slice(0, 2).map((s) => (
                    <Badge key={s} variant="secondary" className="text-xs">{s}</Badge>
                  ))}
                  <Button variant="outline" size="sm" className="rounded-lg">Shortlist</Button>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default RecruiterDashboard;
