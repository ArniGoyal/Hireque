import { motion, AnimatePresence } from "framer-motion";
import DashboardLayout from "@/components/DashboardLayout";
import StatCard from "@/components/StatCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select";
import {
  Users, FileText, CalendarDays, Briefcase, Loader2, Plus, MapPin, IndianRupee, Clock, Code, Search, ArrowLeft
} from "lucide-react";
import { useState, useMemo } from "react";
import { useLocation, Link } from "react-router-dom";
import { toast } from "sonner";

// --- ANIMATION VARIANTS (Defined outside to fix the "not found" error) ---
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 }
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 260, damping: 20 }
  },
  exit: { opacity: 0, scale: 0.95, transition: { duration: 0.2 } }
};

// --- INITIAL DATA ---
const initialApplicants = [
  { id: 101, name: "Priya Sharma", branch: "CSE", cgpa: 9.2, skills: ["React", "Node.js", "Tailwind"], status: "Pending" },
  { id: 102, name: "Arjun Mehta", branch: "IT", cgpa: 8.8, skills: ["Java", "AWS", "SQL"], status: "Pending" },
  { id: 103, name: "Sneha Reddy", branch: "CSE", cgpa: 9.5, skills: ["ML", "Python", "TensorFlow"], status: "Pending" },
  { id: 104, name: "Karan Singh", branch: "ECE", cgpa: 8.6, skills: ["C++", "Embedded", "IoT"], status: "Pending" },
  { id: 105, name: "Ananya Gupta", branch: "IT", cgpa: 9.1, skills: ["Flutter", "Dart", "Firebase"], status: "Pending" },
  { id: 106, name: "Ishaan Malhotra", branch: "CSE", cgpa: 8.4, skills: ["Next.js", "TypeScript", "Prisma"], status: "Pending" },
  { id: 107, name: "Riya Verma", branch: "MAE", cgpa: 8.9, skills: ["AutoCAD", "MATLAB", "SolidWorks"], status: "Pending" },
  { id: 108, name: "Sahil Kapoor", branch: "IT", cgpa: 8.2, skills: ["Cybersecurity", "Linux"], status: "Pending" },
  { id: 109, name: "Mehak Jain", branch: "CSE", cgpa: 9.7, skills: ["Deep Learning", "NLP"], status: "Pending" },
  { id: 110, name: "Vikram Das", branch: "ECE", cgpa: 8.7, skills: ["VLSI", "Verilog"], status: "Pending" },
];

const initialJobs = [
  { id: 1, role: "SDE Intern", type: "Internship", applications: 48, status: "Active", package: "12", location: "Bangalore", skills: "React, Node.js" },
  { id: 2, role: "Data Analyst", type: "Full-time", applications: 32, status: "Active", package: "10", location: "Remote", skills: "Python, SQL" },
];

const RecruiterDashboard = () => {
  const [jobs, setJobs] = useState(initialJobs);
  const [applicants, setApplicants] = useState(initialApplicants);
  const [searchTerm, setSearchTerm] = useState("");
  const [isPosting, setIsPosting] = useState(false);
  const [open, setOpen] = useState(false);
  const location = useLocation();

  // Route Detection
  const isMainDashboard = location.pathname === "/dashboard/recruiter";
  const isShortlistedView = location.pathname.includes("shortlisted");
  const isScheduleView = location.pathname.includes("schedule");

  const [newJob, setNewJob] = useState({
    role: "", type: "Full-time", cgpa: "7.0", branch: "All Branches", package: "", location: "", skills: ""
  });

  const handleCreateJob = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newJob.role || !newJob.location) return toast.error("Please fill required fields");
    setIsPosting(true);
    setTimeout(() => {
      setJobs([{ id: Date.now(), ...newJob, applications: 0, status: "Active" }, ...jobs]);
      setIsPosting(false);
      setOpen(false);
      setNewJob({ role: "", type: "Full-time", cgpa: "7.0", branch: "All Branches", package: "", location: "", skills: "" });
      toast.success("Role Broadcasted!");
    }, 1200);
  };

  const handleShortlist = (id: number) => {
    setApplicants(prev => prev.map(a => a.id === id ? { ...a, status: "Shortlisted" } : a));
    toast.success("Applicant Shortlisted");
  };

  const handleSchedule = (id: number) => {
    setApplicants(prev => prev.map(a => a.id === id ? { ...a, status: "Scheduled" } : a));
    toast.info("Interview Scheduled");
  };

  const displayApplicants = useMemo(() => {
    return applicants.filter(a => {
      const matchesRoute = isShortlistedView ? a.status === "Shortlisted" : isScheduleView ? a.status === "Scheduled" : true;
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = a.name.toLowerCase().includes(searchLower) ||
        a.branch.toLowerCase().includes(searchLower) ||
        a.skills.some(s => s.toLowerCase().includes(searchLower));
      return matchesRoute && matchesSearch;
    });
  }, [applicants, isShortlistedView, isScheduleView, searchTerm]);

  return (
    <DashboardLayout role="recruiter">
      <div className="space-y-8 pb-10">

        {/* --- HEADER (Only on Main Dashboard) --- */}
        {isMainDashboard && (
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex justify-between items-end">
            <div>
              <h1 className="text-4xl font-serif font-extrabold tracking-tighter text-primary">Recruiter Command Center</h1>
              <p className="text-muted-foreground mt-2 font-medium">Manage elite talent and broadcast roles.</p>
            </div>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button className="rounded-full shadow-lg bg-primary text-white font-bold h-12 px-8 hover:scale-105 transition-all">
                  <Plus className="w-5 h-5 mr-2" /> Post New Role
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px] rounded-[2.5rem] p-8 border-primary/10">
                <DialogHeader><DialogTitle className="font-serif text-3xl text-primary">Job Details</DialogTitle></DialogHeader>
                <form onSubmit={handleCreateJob} className="space-y-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1"><Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Title</Label><Input placeholder="SDE-1" value={newJob.role} onChange={e => setNewJob({ ...newJob, role: e.target.value })} className="rounded-xl" /></div>
                    <div className="space-y-1"><Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Type</Label>
                      <Select value={newJob.type} onValueChange={val => setNewJob({ ...newJob, type: val })}><SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="Full-time">Full-time</SelectItem><SelectItem value="Internship">Internship</SelectItem></SelectContent></Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1"><Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Location</Label><Input placeholder="Bangalore" value={newJob.location} onChange={e => setNewJob({ ...newJob, location: e.target.value })} className="rounded-xl" /></div>
                    <div className="space-y-1"><Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">LPA</Label><Input placeholder="12" value={newJob.package} onChange={e => setNewJob({ ...newJob, package: e.target.value })} className="rounded-xl" /></div>
                  </div>
                  <div className="space-y-1"><Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Skills</Label><Input placeholder="React, Java..." value={newJob.skills} onChange={e => setNewJob({ ...newJob, skills: e.target.value })} className="rounded-xl" /></div>
                  <Button type="submit" disabled={isPosting} className="w-full bg-primary h-14 rounded-2xl font-bold text-white shadow-xl mt-4">
                    {isPosting ? <Loader2 className="animate-spin" /> : "Broadcast Role"}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </motion.div>
        )}

        {/* --- STATS --- */}
        {isMainDashboard && (
          <motion.div initial="hidden" animate="visible" variants={containerVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard icon={Briefcase} title="Active Postings" value={jobs.length} index={0} />
            <StatCard icon={Users} title="Total Applicants" value={applicants.length} index={1} />
            <StatCard icon={FileText} title="Shortlisted" value={applicants.filter(a => a.status === 'Shortlisted').length} index={2} />
            <StatCard icon={CalendarDays} title="Interviews" value={applicants.filter(a => a.status === 'Scheduled').length} index={3} />
          </motion.div>
        )}

        <div className={`grid ${isMainDashboard ? 'xl:grid-cols-3' : 'grid-cols-1'} gap-8`}>

          {/* --- ACTIVE JOBS --- */}
          {isMainDashboard && (
            <div className="xl:col-span-2 space-y-6">
              <h3 className="font-serif font-bold text-2xl text-primary">Active Job Board</h3>
              <div className="grid gap-4">
                {jobs.map((job) => (
                  <motion.div key={job.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-6 rounded-[2rem] border border-primary/10 flex items-center justify-between shadow-sm hover:shadow-md transition-all group">
                    <div className="flex items-center gap-5">
                      <div className="w-14 h-14 rounded-2xl bg-secondary flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all"><Briefcase className="w-6 h-6" /></div>
                      <div>
                        <p className="font-bold text-xl text-primary">{job.role}</p>
                        <div className="flex flex-wrap gap-4 mt-1.5 font-bold text-muted-foreground text-[10px] uppercase">
                          <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {job.type}</span>
                          <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> {job.location}</span>
                          <span className="flex items-center gap-1.5"><IndianRupee className="w-3.5 h-3.5" /> {job.package} LPA</span>
                        </div>
                      </div>
                    </div>
                    <Badge className="bg-primary text-white border-none font-bold uppercase tracking-widest text-[10px] px-5 py-2 rounded-full">{job.status}</Badge>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* --- APPLICANT LIST (Full Width when on subpages) --- */}
          <div className="flex flex-col gap-6 w-full">
            {!isMainDashboard && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-5">
                  <Link to="/dashboard/recruiter" className="w-12 h-12 flex items-center justify-center hover:bg-secondary rounded-full border border-primary/5 transition-colors"><ArrowLeft className="text-primary" /></Link>
                  <h2 className="text-4xl font-serif font-extrabold tracking-tighter text-primary">
                    {isShortlistedView ? "Shortlisted Pipeline" : isScheduleView ? "Interview Schedule" : "Global Talent Pool"}
                  </h2>
                </div>
                <Badge className="bg-primary/10 text-primary font-bold px-5 py-2 rounded-full">{displayApplicants.length} Candidates</Badge>
              </motion.div>
            )}

            {isMainDashboard && <h3 className="font-serif font-bold text-2xl text-primary">Matched Talent Pool</h3>}

            <div className="bg-white border border-primary/10 rounded-[2.5rem] overflow-hidden shadow-sm flex flex-col w-full">
              <div className="p-5 border-b border-primary/5 bg-secondary/20">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input placeholder="Search name, branch, skills..." className="pl-12 h-12 rounded-2xl bg-white border-primary/10 text-md" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                </div>
              </div>

              <motion.div layout initial="hidden" animate="visible" variants={containerVariants} className={`p-8 overflow-y-auto no-scrollbar ${isMainDashboard ? 'max-h-[500px]' : 'min-h-[70vh]'}`}>
                <div className={`grid gap-6 ${isMainDashboard ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'}`}>
                  <AnimatePresence mode="popLayout">
                    {displayApplicants.map((a) => (
                      <motion.div key={a.id} layout variants={cardVariants} initial="hidden" animate="visible" exit="exit" className="bg-white p-6 rounded-[2rem] border border-primary/5 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col gap-5 group">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-full bg-primary text-white flex items-center justify-center font-bold text-xl shadow-lg border-4 border-white">{a.name.charAt(0)}</div>
                            <div>
                              <p className="font-bold text-lg text-primary">{a.name}</p>
                              <p className="text-[11px] font-bold text-muted-foreground uppercase">{a.branch} Branch</p>
                            </div>
                          </div>
                          <div className="text-right bg-secondary/50 px-3 py-1 rounded-xl border border-primary/5">
                            <span className="font-serif font-black text-primary text-2xl leading-none">{a.cgpa}</span>
                            <p className="text-[9px] font-bold text-muted-foreground uppercase leading-none mt-1">CGPA</p>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2 min-h-[50px]">
                          {a.skills.map(s => <Badge key={s} variant="outline" className="text-[10px] px-3 py-0.5 border-primary/10 text-primary/80 font-bold rounded-lg bg-white shadow-sm">{s}</Badge>)}
                        </div>

                        <div className="flex gap-3 w-full mt-auto">
                          {a.status === 'Pending' ? (
                            <>
                              <Button onClick={() => handleShortlist(a.id)} size="sm" className="flex-1 bg-primary text-white h-10 text-[11px] font-bold rounded-xl shadow-md">Shortlist</Button>
                              <Button onClick={() => handleSchedule(a.id)} size="sm" variant="outline" className="flex-1 h-10 text-[11px] font-bold border-primary/20 text-primary rounded-xl">Schedule</Button>
                            </>
                          ) : (
                            <div className="w-full text-center py-3 rounded-xl bg-secondary text-[11px] font-bold text-primary uppercase border border-primary/10 tracking-[0.2em]">{a.status}</div>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default RecruiterDashboard;