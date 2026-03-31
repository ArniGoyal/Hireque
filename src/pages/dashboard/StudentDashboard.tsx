import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import DashboardLayout from "@/components/DashboardLayout";
import StatCard from "@/components/StatCard";
import { FileText, Briefcase, CalendarDays, CheckCircle, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/auth/AuthProvider";
import { listActiveJobs, type JobDoc } from "@/firebase/jobs";
import { listStudentApplications, applyToJob, type ApplicationDoc } from "@/firebase/applications";

type JobWithEligibility = JobDoc & { eligible: boolean };

const StudentDashboard = () => {
  const { loading, profile, user } = useAuth();
  const navigate = useNavigate();

  const [jobs, setJobs] = useState<JobWithEligibility[]>([]);
  const [applications, setApplications] = useState<ApplicationDoc[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const studentCgpa = profile?.student?.cgpa ?? 0;
  const studentBranch = profile?.student?.branch ?? "";
  const studentSkills = (profile?.student?.skills ?? []).map((s) => s.toLowerCase());
  const studentName = profile?.name ?? "";
  const resumeMissing = !(profile?.student?.resume?.downloadUrl);
  const isStudentVerified = profile?.student?.verified ?? false;

  const aiScore = useMemo(() => {
    if (typeof profile?.student?.cgpa !== "number" || Number.isNaN(profile?.student?.cgpa)) return 88;
    return Math.min(100, Math.max(0, Math.round(((profile?.student?.cgpa as number) / 10) * 100)));
  }, [profile?.student?.cgpa]);

  const computeEligible = (job: JobDoc) => {
    const minCgpa = job.eligibility?.minCgpa;
    if (typeof minCgpa === "number" && studentCgpa < minCgpa) return false;

    const branchRule = job.eligibility?.branch;
    if (branchRule && branchRule !== "All Branches" && branchRule !== studentBranch) return false;

    const requiredSkills = job.eligibility?.requiredSkills ?? [];
    if (requiredSkills.length > 0) {
      const requiredLower = requiredSkills.map((s) => s.toLowerCase());
      const matchCount = requiredLower.filter((s) => studentSkills.includes(s)).length;
      if (matchCount === 0) return false;
    }

    return true;
  };

  useEffect(() => {
    if (loading || !profile || !user) return;

    const run = async () => {
      try {
        setIsLoading(true);
        const [activeJobs, apps] = await Promise.all([listActiveJobs(), listStudentApplications(user.uid)]);

        const mappedJobs = activeJobs.map((j) => ({ ...j, eligible: computeEligible(j) }));
        setJobs(mappedJobs);
        setApplications(apps);
      } catch (err) {
        toast({
          title: "Could not load dashboard",
          description: err instanceof Error ? err.message : "Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, user?.uid, profile?.student?.cgpa, profile?.student?.branch, profile?.student?.skills]);

  const appliedJobIds = useMemo(() => new Set(applications.map((a) => a.jobId)), [applications]);

  const smartMatches = useMemo(() => {
    return jobs
      .filter((j) => j.eligible)
      .filter((j) => !appliedJobIds.has(j.id))
      .slice(0, 4);
  }, [jobs, appliedJobIds]);

  const pipeline = useMemo(() => {
    // Keep UI stable and predictable: newest first.
    return [...applications].sort((a, b) => String(b.id).localeCompare(String(a.id))).slice(0, 8);
  }, [applications]);

  const handleApply = async (jobId: string) => {
    if (!user || !profile) return;
    const job = jobs.find((j) => j.id === jobId);
    if (!job || !job.eligible) return;

    if (!isStudentVerified) {
      toast({
        title: "Account pending verification",
        description: "Admin must verify your profile before applying.",
        variant: "destructive",
      });
      return;
    }

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

      toast.success(`Applied to ${job.companyName}`, { description: "Your application is now in the pipeline." });
      const nextApps = await listStudentApplications(user.uid);
      setApplications(nextApps);
    } catch (err) {
      toast({
        title: "Application failed",
        description: err instanceof Error ? err.message : "Please try again.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <DashboardLayout role="student">
        <div className="p-6 text-muted-foreground">Loading your dashboard...</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="student">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-serif font-extrabold tracking-tighter text-primary">Student Dashboard</h1>
          <p className="text-muted-foreground mt-2 font-medium">Your AI-curated placement trajectory.</p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-secondary/40 border border-primary/10 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden"
        >
          <div className="absolute right-0 top-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
          <div className="flex items-center gap-6 relative z-10">
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-white border-2 border-primary/20 flex flex-col items-center justify-center shadow-sm">
                <span className="text-2xl font-black font-serif text-primary">{aiScore}</span>
                <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">/ 100</span>
              </div>
              <div className="absolute -bottom-2 -right-2 bg-primary text-white text-[10px] px-2 py-0.5 rounded-full font-bold shadow-md">
                AI Score
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold font-serif tracking-tighter text-primary">{studentName || "Student"}</h2>
              <p className="text-[13px] font-semibold text-muted-foreground mb-3 uppercase tracking-widest">
                {studentBranch ? `${studentBranch} Branch` : "Branch"} | {typeof studentCgpa === "number" ? `${studentCgpa} CGPA` : "CGPA"}
              </p>
              <div className="flex gap-2 flex-wrap">
                {(profile?.student?.skills ?? []).slice(0, 3).map((skill) => (
                  <Badge key={skill} className="bg-white text-primary border-primary/20 hover:bg-white">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 w-full md:w-auto relative z-10">
            <Button
              onClick={() => navigate("/dashboard/student/profile")}
              className="w-full md:w-auto rounded-full font-bold bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20"
            >
              <FileText className="w-4 h-4 mr-2" />
              {resumeMissing ? "Update Resume" : "Update Resume"}
            </Button>
            <Button
              onClick={() => navigate("/dashboard/student/ai-insights")}
              variant="outline"
              className="w-full md:w-auto rounded-full font-bold border-primary/20 text-primary hover:bg-primary/5"
            >
              View AI Insights
            </Button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            icon={Briefcase}
            title="Smart Eligible Roles"
            value={smartMatches.length}
            trend="Filtered by CGPA"
            trendUp
            index={0}
          />
          <StatCard icon={FileText} title="Active Applications" value={applications.length} index={1} />
          <StatCard icon={CalendarDays} title="Interviews Scheduled" value={applications.filter((a) => a.status === "Interview").length} index={2} />
          <StatCard icon={CheckCircle} title="Final Offers" value={applications.filter((a) => a.status === "Selected").length} trend="Congrats!" trendUp index={3} />
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
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
              {isLoading && smartMatches.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground font-medium">Loading matches...</div>
              ) : smartMatches.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground font-medium">No smart matches right now.</div>
              ) : (
                smartMatches.map((job, i) => (
                  <motion.div
                    key={job.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 * i }}
                    className="flex items-center justify-between p-5 px-6 hover:bg-secondary/30 transition-colors group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center font-bold text-primary border border-primary/10 text-xs shadow-sm">
                        {job.companyName.substring(0, 2)}
                      </div>
                      <div>
                        <p className="font-bold text-[15px] text-primary group-hover:underline underline-offset-2">{job.role}</p>
                        <p className="text-[13px] text-muted-foreground font-medium mt-0.5">
                          {job.companyName} · <span className="text-primary/70">{job.package}</span>
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <Button
                        onClick={() => handleApply(job.id)}
                        size="sm"
                        disabled={!job.eligible || !isStudentVerified}
                        className="rounded-full shadow-md shadow-primary/10 px-6 font-bold bg-primary text-white hover:scale-105 transition-transform"
                      >
                        Apply Now
                      </Button>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25 }}
            className="bg-white border border-primary/10 rounded-3xl overflow-hidden shadow-sm flex flex-col max-h-[500px]"
          >
            <div className="p-6 border-b border-primary/5">
              <h3 className="font-serif font-extrabold tracking-tight text-xl text-primary">Live Pipeline</h3>
            </div>
            <div className="divide-y divide-primary/5 flex-1 overflow-y-auto no-scrollbar">
              {pipeline.length === 0 ? (
                <div className="p-6 text-center text-muted-foreground font-medium">No applications yet. Apply to smart matches.</div>
              ) : (
                pipeline.map((app, i) => (
                  <motion.div
                    key={app.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 * i }}
                    className="flex items-center justify-between p-5 hover:bg-secondary/30 transition-colors"
                  >
                    <div>
                      <p className="font-bold text-[14px] text-primary">{app.role}</p>
                      <p className="text-[12px] text-muted-foreground font-medium mt-0.5">{app.companyName}</p>
                    </div>
                    <span
                      className={`text-[10px] font-bold px-3 py-1 uppercase tracking-widest rounded-full border ${
                        app.status === "Interview"
                          ? "bg-primary/10 text-primary border-primary/20"
                          : app.status === "Shortlisted"
                            ? "bg-amber-500/10 text-amber-600 border-amber-500/20"
                            : app.status === "Selected"
                              ? "bg-green-700/10 text-green-700 border-green-700/20"
                              : "bg-secondary text-muted-foreground border-primary/10"
                      }`}
                    >
                      {app.status}
                    </span>
                  </motion.div>
                ))
              )}
            </div>

            <div className="p-4 border-t border-primary/5">
              <Button
                onClick={() => navigate("/dashboard/student/jobs")}
                variant="outline"
                className="w-full rounded-full font-bold border-primary/20 text-primary hover:bg-secondary"
              >
                Browse more roles <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StudentDashboard;

