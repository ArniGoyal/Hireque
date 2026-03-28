import { motion } from "framer-motion";
import DashboardLayout from "@/components/DashboardLayout";
import StatCard from "@/components/StatCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Briefcase, FileText, CalendarDays, CheckCircle, ArrowRight, Upload } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const initialJobs = [
  { id: 1, company: "Google", role: "SDE Intern", package: "₹45 LPA", deadline: "Apr 5, 2026", eligible: true },
  { id: 2, company: "Microsoft", role: "Software Engineer", package: "₹38 LPA", deadline: "Apr 8, 2026", eligible: true },
  { id: 3, company: "Amazon", role: "SDE-1", package: "₹32 LPA", deadline: "Apr 12, 2026", eligible: false },
  { id: 4, company: "Flipkart", role: "Backend Developer", package: "₹28 LPA", deadline: "Apr 15, 2026", eligible: true },
];

const initialApplications = [
  { company: "TCS", role: "Associate Engineer", status: "Applied" },
  { company: "Infosys", role: "Systems Engineer", status: "Shortlisted" },
  { company: "Wipro", role: "Project Engineer", status: "Interview" },
];

const StudentDashboard = () => {
  const [jobs, setJobs] = useState(initialJobs);
  const [apps, setApps] = useState(initialApplications);
  const [isUploading, setIsUploading] = useState(false);
  const [aiScore, setAiScore] = useState(88);

  const handleApply = (jobId: number) => {
    const jobToApply = jobs.find(j => j.id === jobId);
    if (!jobToApply) return;

    setJobs(jobs.filter(j => j.id !== jobId));
    setApps([{ company: jobToApply.company, role: jobToApply.role, status: "Applied" }, ...apps]);
    
    toast.success(`Successfully applied to ${jobToApply.company}`, {
      description: "Your AI-optimized profile has been submitted.",
    });
  };

  const handleResumeUpload = () => {
    setIsUploading(true);
    toast("Parsing Resume via AI...", { description: "Extracting skills and calculating new eligibility score." });
    
    setTimeout(() => {
      setIsUploading(false);
      setAiScore(94);
      toast.success("Resume Parsed & Uploaded!", {
        description: "Your AI score increased to 94. 2 new jobs unlocked.",
      });
      setJobs(jobs.map(j => j.company === "Amazon" ? { ...j, eligible: true } : j));
    }, 2500);
  };

  return (
    <DashboardLayout role="student">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-serif font-extrabold tracking-tighter text-primary">Student Dashboard</h1>
          <p className="text-muted-foreground mt-2 font-medium">Your AI-curated placement trajectory.</p>
        </div>

        {/* AI Profile Intelligence Card */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
          className="bg-secondary/40 border border-primary/10 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden"
        >
           <div className="absolute right-0 top-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
           <div className="flex items-center gap-6 relative z-10">
              <div className="relative">
                 <div className="w-20 h-20 rounded-full bg-white border-2 border-primary/20 flex flex-col items-center justify-center shadow-sm">
                    <span className="text-2xl font-black font-serif text-primary">88</span>
                    <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">/ 100</span>
                 </div>
                 <div className="absolute -bottom-2 -right-2 bg-primary text-white text-[10px] px-2 py-0.5 rounded-full font-bold shadow-md">AI Score</div>
              </div>
              
              <div>
                 <h2 className="text-2xl font-bold font-serif tracking-tighter text-primary mb-1">Rohan Sharma</h2>
                 <p className="text-[13px] font-semibold text-muted-foreground mb-3 uppercase tracking-widest">B.Tech Computer Science | 8.9 CGPA</p>
                 <div className="flex gap-2 flex-wrap">
                    {['React', 'Node.js', 'System Design'].map(skill => (
                      <Badge key={skill} className="bg-white text-primary border-primary/20 hover:bg-white">{skill}</Badge>
                    ))}
                 </div>
              </div>
           </div>

           <div className="flex flex-col gap-3 w-full md:w-auto relative z-10">
              <Button className="w-full md:w-auto rounded-full font-bold bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20"><FileText className="w-4 h-4 mr-2" /> Update Resume</Button>
              <Button variant="outline" className="w-full md:w-auto rounded-full font-bold border-primary/20 text-primary hover:bg-primary/5">View AI Insights</Button>
           </div>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard icon={Briefcase} title="Smart Eligible Roles" value={14} trend="Filtered by CGPA" trendUp index={0} />
          <StatCard icon={FileText} title="Active Applications" value={5} index={1} />
          <StatCard icon={CalendarDays} title="Interviews Scheduled" value={2} index={2} />
          <StatCard icon={CheckCircle} title="Final Offers" value={1} trend="Congrats! 🎉" trendUp index={3} />
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
           {/* Recent Jobs */}
           <motion.div
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.5, delay: 0.4 }}
             className="bg-white border border-primary/10 rounded-3xl overflow-hidden shadow-sm lg:col-span-2 flex flex-col"
           >
             <div className="flex items-center justify-between p-6 border-b border-primary/5">
               <div>
                  <h3 className="font-serif font-extrabold tracking-tight text-xl text-primary">Smart Matches</h3>
                  <p className="text-[13px] text-muted-foreground font-medium mt-1">Roles instantly filtered for your profile.</p>
               </div>
               <Button variant="ghost" size="sm" className="text-primary font-bold tracking-widest uppercase text-[11px] hidden sm:flex">
                 View all <ArrowRight className="ml-1 w-3 h-3" />
               </Button>
             </div>
             <div className="divide-y divide-primary/5">
               {jobs.length === 0 ? (
                 <div className="p-8 text-center text-muted-foreground font-medium">No pending jobs. You're fully applied!</div>
               ) : jobs.map((job, i) => (
                 <motion.div
                   key={job.id}
                   initial={{ opacity: 0, x: -10 }}
                   animate={{ opacity: 1, x: 0 }}
                   transition={{ delay: 0.5 + i * 0.08 }}
                   className="flex items-center justify-between p-5 px-6 hover:bg-secondary/30 transition-colors group"
                 >
                   <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center font-bold text-primary border border-primary/10 text-xs shadow-sm">
                         {job.company.substring(0,2)}
                      </div>
                      <div>
                        <p className="font-bold text-[15px] text-primary group-hover:underline underline-offset-2">{job.role}</p>
                        <p className="text-[13px] text-muted-foreground font-medium mt-0.5">{job.company} · <span className="text-primary/70">{job.package}</span></p>
                      </div>
                   </div>
                   <div className="flex items-center gap-4">
                     {job.eligible ? (
                       <Button onClick={() => handleApply(job.id)} size="sm" className="rounded-full shadow-md shadow-primary/10 px-6 font-bold bg-primary text-white hover:scale-105 transition-transform">Apply Now</Button>
                     ) : (
                       <Badge variant="outline" className="text-muted-foreground border-primary/20 bg-transparent rounded-full font-bold px-4">Locked (CGPA)</Badge>
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
             className="bg-white border border-primary/10 rounded-3xl overflow-hidden shadow-sm flex flex-col max-h-[500px]"
           >
             <div className="p-6 border-b border-primary/5">
               <h3 className="font-serif font-extrabold tracking-tight text-xl text-primary">Live Pipeline</h3>
             </div>
             <div className="divide-y divide-primary/5 flex-1 overflow-y-auto no-scrollbar">
               {apps.map((app, i) => (
                 <motion.div
                   key={app.company + i}
                   initial={{ opacity: 0, x: -10 }}
                   animate={{ opacity: 1, x: 0 }}
                   transition={{ delay: 0.1 * i }}
                   className="flex items-center justify-between p-5 hover:bg-secondary/30 transition-colors"
                 >
                   <div>
                     <p className="font-bold text-[14px] text-primary">{app.role}</p>
                     <p className="text-[12px] text-muted-foreground font-medium mt-0.5">{app.company}</p>
                   </div>
                   <span className={`text-[10px] font-bold px-3 py-1 uppercase tracking-widest rounded-full border ${
                     app.status === 'Interview' ? 'bg-primary/10 text-primary border-primary/20' : 
                     app.status === 'Shortlisted' ? 'bg-amber-500/10 text-amber-600 border-amber-500/20' :
                     'bg-secondary text-muted-foreground border-primary/10'
                   }`}>
                     {app.status}
                   </span>
                 </motion.div>
               ))}
             </div>
           </motion.div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StudentDashboard;
