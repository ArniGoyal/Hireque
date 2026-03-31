import { motion } from "framer-motion";
import DashboardLayout from "@/components/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Briefcase, Search, Filter } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const allJobs = [
  { id: 1, company: "Google", role: "SDE Intern", package: "₹45 LPA", type: "Internship", deadline: "Apr 5, 2026", eligible: true },
  { id: 2, company: "Microsoft", role: "Software Engineer", package: "₹38 LPA", type: "Full Time", deadline: "Apr 8, 2026", eligible: true },
  { id: 3, company: "Amazon", role: "SDE-1", package: "₹32 LPA", type: "Full Time", deadline: "Apr 12, 2026", eligible: false },
  { id: 4, company: "Flipkart", role: "Backend Developer", package: "₹28 LPA", type: "Full Time", deadline: "Apr 15, 2026", eligible: true },
  { id: 5, company: "Atlassian", role: "Frontend Intern", package: "₹40 LPA", type: "Internship", deadline: "Apr 20, 2026", eligible: true },
  { id: 6, company: "Goldman Sachs", role: "Analyst", package: "₹25 LPA", type: "Full Time", deadline: "Apr 22, 2026", eligible: false },
];

const StudentJobs = () => {
  const [jobs, setJobs] = useState(allJobs);
  const handleApply = (id: number) => {
  const job = jobs.find(j => j.id === id);
  if (!job) return;

  toast.success(`Applied to ${job.company}`, {
    description: `${job.role} application submitted successfully`,
  });

  // remove job after applying (optional UX)
  setJobs(jobs.filter(j => j.id !== id));
};

const [search, setSearch] = useState("");
const [filterEligible, setFilterEligible] = useState(false);
const filteredJobs = jobs.filter((job) => {
  const matchesSearch =
    job.company.toLowerCase().includes(search.toLowerCase()) ||
    job.role.toLowerCase().includes(search.toLowerCase());

  const matchesFilter = filterEligible ? job.eligible : true;

  return matchesSearch && matchesFilter;
});
  return (
    <DashboardLayout role="student">
      <div className="space-y-8 max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4">
          <div>
            <h1 className="text-3xl font-serif font-extrabold tracking-tighter text-primary">Browse Roles</h1>
            <p className="text-muted-foreground mt-2 font-medium">Discover top-tier placement opportunities filtered by AI.</p>
          </div>
          <div className="flex gap-3">
             <div className="relative flex-1 sm:w-64">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
  type="text"
  placeholder="Search companies, roles..."
  value={search}
  onChange={(e) => setSearch(e.target.value)}
  className="w-full h-10 pl-10 pr-4 text-sm bg-white border border-primary/10 rounded-full focus:outline-none focus:ring-1 focus:ring-primary/20 shadow-sm transition-all"
/>
             </div>
             <Button
  onClick={() => setFilterEligible(!filterEligible)}
  variant="outline"
  className="rounded-full shadow-sm border-primary/10 text-primary w-10 sm:w-auto px-0 sm:px-6"
>
                <Filter className="w-4 h-4 sm:mr-2" /> <span className="hidden sm:inline font-bold">Filters</span>
             </Button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredJobs.map((job, i) => (
                <motion.div
                    key={job.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: i * 0.05 }}
                    className={`bg-white border rounded-3xl p-6 shadow-sm flex flex-col relative overflow-hidden group hover:border-primary/20 hover:shadow-md transition-all ${job.eligible ? 'border-primary/10' : 'border-primary/5 opacity-80'}`}
                >
                    <div className="flex justify-between items-start mb-6">
                        <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center font-bold text-primary border border-primary/10 text-lg">
                            {job.company.substring(0,2)}
                        </div>
                        <Badge variant="outline" className={`rounded-full px-3 text-[10px] uppercase font-bold tracking-widest bg-transparent ${job.eligible ? 'text-primary border-primary/20' : 'text-muted-foreground border-primary/10'}`}>
                            {job.eligible ? 'Smart Match' : 'Locked'}
                        </Badge>
                    </div>

                    <div className="mb-6 flex-1">
                        <h3 className="text-xl font-bold text-primary font-serif leading-tight group-hover:underline underline-offset-4 decoration-primary/20 mb-1">{job.role}</h3>
                        <p className="text-[14px] font-semibold text-muted-foreground mb-4">{job.company}</p>
                        
                        <div className="flex flex-wrap gap-2">
                           <Badge variant="secondary" className="bg-primary/5 text-primary text-xs">Full Time</Badge>
                           <Badge variant="secondary" className="bg-primary/5 text-primary/70 text-xs">On-Site</Badge>
                        </div>
                    </div>

                    <div className="flex items-end justify-between border-t border-primary/5 pt-4 mt-auto">
                        <div>
                           <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Package</p>
                           <p className="font-serif font-black text-primary text-lg">{job.package}</p>
                        </div>
                        <Button
  onClick={() => handleApply(job.id)}
  disabled={!job.eligible}
  className="rounded-full font-bold shadow-md shadow-primary/10 hover:-translate-y-0.5 transition-transform disabled:hover:translate-y-0 disabled:opacity-50"
>
  Apply
</Button>
                    </div>
                </motion.div>
            ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StudentJobs;
