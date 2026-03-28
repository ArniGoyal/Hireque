import { motion } from "framer-motion";
import DashboardLayout from "@/components/DashboardLayout";
import StatCard from "@/components/StatCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Briefcase, FileText, CalendarDays, CheckCircle, ArrowRight } from "lucide-react";

const recentJobs = [
  { id: 1, company: "Google", role: "SDE Intern", package: "₹45 LPA", deadline: "Apr 5, 2026", eligible: true },
  { id: 2, company: "Microsoft", role: "Software Engineer", package: "₹38 LPA", deadline: "Apr 8, 2026", eligible: true },
  { id: 3, company: "Amazon", role: "SDE-1", package: "₹32 LPA", deadline: "Apr 12, 2026", eligible: false },
  { id: 4, company: "Flipkart", role: "Backend Developer", package: "₹28 LPA", deadline: "Apr 15, 2026", eligible: true },
];

const applications = [
  { company: "TCS", role: "Associate Engineer", status: "Applied" },
  { company: "Infosys", role: "Systems Engineer", status: "Shortlisted" },
  { company: "Wipro", role: "Project Engineer", status: "Interview" },
];

const statusColors: Record<string, string> = {
  Applied: "bg-info/10 text-info",
  Shortlisted: "bg-warning/10 text-warning",
  Interview: "bg-primary/10 text-primary",
  Selected: "bg-success/10 text-success",
};

const StudentDashboard = () => {
  return (
    <DashboardLayout role="student">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-serif font-bold text-foreground">Welcome back, Rahul 👋</h1>
          <p className="text-muted-foreground mt-1">Here's your placement overview.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard icon={Briefcase} title="Eligible Jobs" value={12} trend="+3 this week" trendUp index={0} />
          <StatCard icon={FileText} title="Applications" value={5} index={1} />
          <StatCard icon={CalendarDays} title="Upcoming Interviews" value={2} index={2} />
          <StatCard icon={CheckCircle} title="Offers" value={1} trend="Congrats! 🎉" trendUp index={3} />
        </div>

        {/* Recent Jobs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-card border rounded-2xl overflow-hidden shadow-sm"
        >
          <div className="flex items-center justify-between p-6 border-b">
            <h3 className="font-serif font-bold text-lg text-foreground">Recent Job Openings</h3>
            <Button variant="ghost" size="sm" className="text-accent font-semibold">
              View all <ArrowRight className="ml-1 w-3 h-3" />
            </Button>
          </div>
          <div className="divide-y">
            {recentJobs.map((job, i) => (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + i * 0.08 }}
                className="flex items-center justify-between p-4 px-6 hover:bg-muted/40 transition-colors"
              >
                <div>
                  <p className="font-semibold text-foreground">{job.role}</p>
                  <p className="text-sm text-muted-foreground">{job.company} · {job.package}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground hidden sm:block">Deadline: {job.deadline}</span>
                  {job.eligible ? (
                    <Button size="sm" className="rounded-lg shadow-sm">Apply</Button>
                  ) : (
                    <Badge variant="secondary">Not Eligible</Badge>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Application Tracker */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="bg-card border rounded-2xl overflow-hidden shadow-sm"
        >
          <div className="p-6 border-b">
            <h3 className="font-serif font-bold text-lg text-foreground">Your Applications</h3>
          </div>
          <div className="divide-y">
            {applications.map((app, i) => (
              <motion.div
                key={app.company}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 + i * 0.08 }}
                className="flex items-center justify-between p-4 px-6 hover:bg-muted/40 transition-colors"
              >
                <div>
                  <p className="font-semibold text-foreground">{app.role}</p>
                  <p className="text-sm text-muted-foreground">{app.company}</p>
                </div>
                <span className={`text-xs font-semibold px-3 py-1.5 rounded-full ${statusColors[app.status]}`}>
                  {app.status}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default StudentDashboard;
