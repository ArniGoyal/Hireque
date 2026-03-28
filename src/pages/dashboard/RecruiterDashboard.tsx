import { motion } from "framer-motion";
import DashboardLayout from "@/components/DashboardLayout";
import StatCard from "@/components/StatCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, FileText, CalendarDays, Briefcase, ArrowRight, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const initialJobs = [
  { id: 1, role: "SDE Intern", applications: 48, shortlisted: 12, status: "Active" },
  { id: 2, role: "Data Analyst", applications: 32, shortlisted: 8, status: "Active" },
  { id: 3, role: "Frontend Developer", applications: 55, shortlisted: 15, status: "Closed" },
];

const initialApplicants = [
  { id: 101, name: "Priya Sharma", branch: "CSE", cgpa: 9.2, skills: ["React", "Node.js", "Python"], status: "Pending" },
  { id: 102, name: "Arjun Mehta", branch: "IT", cgpa: 8.8, skills: ["Java", "Spring", "AWS"], status: "Pending" },
  { id: 103, name: "Sneha Reddy", branch: "CSE", cgpa: 9.5, skills: ["ML", "Python", "TensorFlow"], status: "Pending" },
  { id: 104, name: "Karan Singh", branch: "ECE", cgpa: 8.6, skills: ["C++", "Embedded", "IoT"], status: "Pending" },
];

const RecruiterDashboard = () => {
  const [jobs, setJobs] = useState(initialJobs);
  const [applicants, setApplicants] = useState(initialApplicants);
  const [isPosting, setIsPosting] = useState(false);

  const handlePostJob = () => {
    setIsPosting(true);
    toast("Configuring Smart Limits...", { description: "Setting up AI eligibility for your newly posted role." });
    setTimeout(() => {
        setIsPosting(false);
        const newJob = { id: Date.now(), role: "Product Manager", applications: 0, shortlisted: 0, status: "Active" };
        setJobs([newJob, ...jobs]);
        toast.success("Role Posted to Hiring Pool!", { description: "You will systematically receive AI-scored matches." });
    }, 2000);
  };

  const handleShortlist = (id: number) => {
    setApplicants(applicants.map(a => a.id === id ? { ...a, status: "Shortlisted" } : a));
    toast.success("Applicant Shortlisted!", { description: "Added to the interview pipeline." });
  };

  const handleSchedule = (id: number) => {
    setApplicants(applicants.map(a => a.id === id ? { ...a, status: "Scheduled" } : a));
    toast.success("Interview Scheduled", { description: "Invites have been dispatched via EmailJS." });
  };

  return (
    <DashboardLayout role="recruiter">
      <div className="space-y-8">
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-serif font-extrabold tracking-tighter text-primary">Recruiter Command Center</h1>
            <p className="text-muted-foreground mt-2 font-medium">Post roles and curate elite talent globally.</p>
          </div>
          <Button onClick={handlePostJob} disabled={isPosting} className="rounded-full shadow-lg shadow-primary/20 bg-primary text-white font-bold h-12 px-8 hover:-translate-y-1 transition-transform disabled:hover:translate-y-0 disabled:opacity-80">
            {isPosting ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : '+'} {isPosting ? 'Posting...' : 'Post New Role'}
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard icon={Briefcase} title="Active Postings" value={jobs.filter(j => j.status === 'Active').length} index={0} />
          <StatCard icon={Users} title="Total Applicants" value={135} trend="AI Filtered" trendUp index={1} />
          <StatCard icon={FileText} title="Shortlisted" value={35 + applicants.filter(a => a.status !== 'Pending').length} index={2} />
          <StatCard icon={CalendarDays} title="Interviews Pending" value={8 + applicants.filter(a => a.status === 'Scheduled').length} index={3} />
        </div>

        <div className="grid xl:grid-cols-3 gap-8">
           {/* Posted Jobs */}
           <motion.div
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.5, delay: 0.4 }}
             className="bg-white border border-primary/10 rounded-3xl overflow-hidden shadow-sm xl:col-span-2"
           >
             <div className="flex items-center justify-between p-6 border-b border-primary/5">
               <div>
                  <h3 className="font-serif font-bold text-xl text-primary">Your Job Postings</h3>
                  <p className="text-[13px] text-muted-foreground font-medium mt-1">Manage active roles and eligibility filters.</p>
               </div>
             </div>
             <div className="divide-y divide-primary/5 max-h-[400px] overflow-y-auto no-scrollbar">
               {jobs.map((job, i) => (
                 <motion.div
                   key={job.id}
                   initial={{ opacity: 0, x: -10 }}
                   animate={{ opacity: 1, x: 0 }}
                   transition={{ delay: 0.5 + i * 0.08 }}
                   className="flex items-center justify-between p-5 px-6 hover:bg-secondary/30 transition-colors"
                 >
                   <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center font-bold text-white shadow-sm">
                         <Briefcase className="w-5 h-5 text-white/70" />
                      </div>
                      <div>
                        <p className="font-bold text-[15px] text-primary">{job.role}</p>
                        <p className="text-[13px] text-muted-foreground font-medium mt-0.5">{job.applications} Applicants · {job.shortlisted} Shortlisted</p>
                      </div>
                   </div>
                   <div className="flex items-center gap-4">
                     <Badge variant="outline" className={`rounded-full font-bold px-4 border text-[11px] uppercase tracking-widest bg-transparent ${job.status === 'Active' ? 'text-primary border-primary/20' : 'text-muted-foreground border-primary/10'}`}>{job.status}</Badge>
                     <Button variant="ghost" size="sm" className="font-bold text-primary hover:bg-secondary">View Pool</Button>
                   </div>
                 </motion.div>
               ))}
             </div>
           </motion.div>

           {/* Top Applicants / AI Scored */}
           <motion.div
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.5, delay: 0.6 }}
             className="bg-white border border-primary/10 rounded-3xl overflow-hidden shadow-sm flex flex-col"
           >
             <div className="p-6 border-b border-primary/5 bg-secondary/30">
               <h3 className="font-serif font-bold text-xl text-primary">Highest AI Matches</h3>
               <p className="text-[13px] text-muted-foreground font-medium mt-1">Algorithmically scored applicants.</p>
             </div>
             <div className="divide-y divide-primary/5 flex-1 max-h-[400px] overflow-y-auto no-scrollbar">
               {applicants.map((a, i) => (
                 <motion.div
                   key={a.id}
                   initial={{ opacity: 0, x: -10 }}
                   animate={{ opacity: 1, x: 0 }}
                   transition={{ delay: 0.7 + i * 0.08 }}
                   className="p-5 hover:bg-secondary/20 transition-colors group flex flex-col gap-3"
                 >
                   <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-primary font-bold text-sm font-serif border border-primary/10">
                          {a.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-[14px] text-primary">{a.name}</p>
                          <p className="text-[11px] text-muted-foreground font-bold tracking-widest uppercase mt-0.5">{a.branch}</p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end">
                         <span className="text-[16px] font-black text-primary font-serif">{a.cgpa} <span className="text-[10px] text-muted-foreground font-sans">CGPA</span></span>
                      </div>
                   </div>
                   <div className="flex items-center gap-2 flex-wrap">
                      <Badge className="bg-primary/5 text-primary border-none rounded-sm px-2 py-0 hover:bg-primary/10 text-[10px]">AI Score: {Math.floor(Math.random() * 15) + 85}</Badge>
                      {a.skills.slice(0, 2).map((s) => (
                        <Badge key={s} variant="outline" className="text-[10px] py-0 border-primary/10 bg-transparent text-muted-foreground rounded-sm">{s}</Badge>
                      ))}
                   </div>
                   <div className="flex gap-2 w-full mt-2">
                      {a.status === 'Pending' ? (
                        <>
                          <Button onClick={() => handleShortlist(a.id)} size="sm" className="flex-1 rounded-md bg-primary text-white font-bold h-8 text-[11px] shadow-sm">Shortlist</Button>
                          <Button onClick={() => handleSchedule(a.id)} size="sm" variant="outline" className="flex-1 rounded-md border-primary/20 text-primary font-bold h-8 text-[11px]">Schedule</Button>
                        </>
                      ) : (
                         <div className="w-full flex items-center justify-center h-8 rounded-md bg-secondary text-[11px] font-bold text-primary uppercase tracking-widest border border-primary/10">
                            {a.status}
                         </div>
                      )}
                   </div>
                 </motion.div>
               ))}
             </div>
           </motion.div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default RecruiterDashboard;
