import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Filter, Search } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/auth/AuthProvider";
import { applyToJob } from "@/firebase/applications";
import { listActiveJobs, type JobDoc } from "@/firebase/jobs";

type JobWithEligibility = JobDoc & { eligible: boolean; reason?: string };

const StudentJobs = () => {
  const { loading, profile, user } = useAuth();

  const [jobs, setJobs] = useState<JobWithEligibility[]>([]);
  const [isLoadingJobs, setIsLoadingJobs] = useState(false);

  const [search, setSearch] = useState("");
  const [filterEligible, setFilterEligible] = useState(false);

  const studentCgpa = profile?.student?.cgpa ?? 0;
  const studentBranch = profile?.student?.branch ?? "";
  const studentSkills = (profile?.student?.skills ?? []).map((s) => s.toLowerCase());
  const studentName = profile?.name ?? "";
  const isStudentVerified = profile?.student?.verified ?? false;

  const computeEligible = (job: JobDoc): { eligible: boolean; reason?: string } => {
    const minCgpa = job.eligibility?.minCgpa;
    if (typeof minCgpa === "number" && minCgpa > 0 && studentCgpa < minCgpa) {
      return { eligible: false, reason: `Requires ${minCgpa.toFixed(1)} CGPA` };
    }

    const branchRule = job.eligibility?.branch?.trim();
    if (branchRule && branchRule !== "All Branches") {
      const sBranch = (studentBranch || "").trim().toLowerCase();
      const jBranch = branchRule.toLowerCase();
      if (sBranch !== jBranch) {
        return { eligible: false, reason: `Only for ${branchRule} branch` };
      }
    }

    const requiredSkills = job.eligibility?.requiredSkills ?? [];
    if (requiredSkills.length > 0) {
      const requiredLower = requiredSkills.map((s) => s.toLowerCase());
      const matchCount = requiredLower.filter((s) => studentSkills.includes(s)).length;
      if (matchCount === 0) {
        return { eligible: false, reason: `Missing required skills (${requiredSkills.slice(0, 2).join(", ")}...)` };
      }
    }

    return { eligible: true };
  };

  useEffect(() => {
    if (loading || !profile) return;

    const run = async () => {
      try {
        setIsLoadingJobs(true);
        const active = await listActiveJobs();
        const mapped = active.map((j) => {
          const res = computeEligible(j);
          return { ...j, ...res };
        });
        setJobs(mapped);
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Could not load jobs");
      } finally {
        setIsLoadingJobs(false);
      }
    };

    run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, profile?.student?.cgpa, profile?.student?.branch, profile?.student?.skills]);

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const matchesSearch =
        job.companyName.toLowerCase().includes(search.toLowerCase()) ||
        job.role.toLowerCase().includes(search.toLowerCase());

      const matchesFilter = filterEligible ? job.eligible : true;
      return matchesSearch && matchesFilter;
    });
  }, [jobs, search, filterEligible]);

  const handleApply = async (jobId: string) => {
    if (!user || !profile) return;

    if (!isStudentVerified) {
      toast.error("Account pending verification. Admin must verify your profile before you can apply.");
      return;
    }

    const job = jobs.find((j) => j.id === jobId);
    if (!job) return;
    if (!job.eligible) return;

    try {
      await applyToJob({
        jobId: job.id,
        companyUid: job.companyUid,
        companyName: job.companyName,
        studentUid: user.uid,
        studentName,
        studentBranch,
        studentCgpa,
        studentSkills: profile?.student?.skills ?? [],
        role: job.role,
      });

      toast.success(`Applied to ${job.companyName}`, {
        description: `${job.role} application submitted successfully`,
      });

      setJobs((prev) => prev.filter((j) => j.id !== jobId));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Application failed");
    }
  };

  return (
    <DashboardLayout role="student">
      <div className="space-y-8 max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4">
          <div>
            <h1 className="text-3xl font-serif font-extrabold tracking-tighter text-primary">Browse Roles</h1>
            <p className="text-muted-foreground mt-2 font-medium">
              Discover top-tier placement opportunities filtered by your profile.
            </p>
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

        {isLoadingJobs && jobs.length === 0 ? (
          <div className="p-10 bg-white border border-primary/10 rounded-3xl text-muted-foreground font-medium">
            Loading roles...
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredJobs.map((job, i) => (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                className={`bg-white border rounded-3xl p-6 shadow-sm flex flex-col relative overflow-hidden group hover:border-primary/20 hover:shadow-md transition-all ${
                  job.eligible ? "border-primary/10" : "border-primary/5 opacity-80"
                }`}
              >
                <div className="flex justify-between items-start mb-6">
                  <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center font-bold text-primary border border-primary/10 text-lg">
                    {job.companyName.substring(0, 2)}
                  </div>
                  <Badge
                    variant="outline"
                    className={`rounded-full px-3 text-[10px] uppercase font-bold tracking-widest bg-transparent ${
                      job.eligible ? "text-primary border-primary/20" : "text-destructive border-destructive/20"
                    }`}
                  >
                    {job.eligible ? "Smart Match" : job.reason || "Locked"}
                  </Badge>
                </div>

                <div className="mb-6 flex-1">
                  <h3 className="text-xl font-bold text-primary font-serif leading-tight group-hover:underline underline-offset-4 decoration-primary/20 mb-1">
                    {job.role}
                  </h3>
                  <p className="text-[14px] font-semibold text-muted-foreground mb-4">{job.companyName}</p>

                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary" className="bg-primary/5 text-primary text-xs">
                      {job.type}
                    </Badge>
                    <Badge variant="secondary" className="bg-primary/5 text-primary/70 text-xs">
                      {job.location}
                    </Badge>
                  </div>
                </div>

                <div className="flex items-end justify-between border-t border-primary/5 pt-4 mt-auto">
                  <div>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Package</p>
                    <p className="font-serif font-black text-primary text-lg">{job.package}</p>
                  </div>
                  <Button
                    onClick={() => handleApply(job.id)}
                    disabled={!job.eligible || !isStudentVerified}
                    className="rounded-full font-bold shadow-md shadow-primary/10 hover:-translate-y-0.5 transition-transform disabled:hover:translate-y-0 disabled:opacity-50"
                  >
                    Apply
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default StudentJobs;
