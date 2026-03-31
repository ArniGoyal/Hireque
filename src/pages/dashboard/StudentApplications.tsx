import { motion } from "framer-motion";
import DashboardLayout from "@/components/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Building2, ExternalLink } from "lucide-react";
import { useMemo, useState } from "react";
import { useAuth } from "@/auth/AuthProvider";
import { listStudentApplications, type ApplicationDoc, type ApplicationStatus } from "@/firebase/applications";
import { toast } from "sonner";
import { useEffect } from "react";
import { Timestamp as FbTimestamp } from "firebase/firestore";

const getStatusColor = (status: ApplicationStatus) => {
  switch (status) {
    case "Applied":
      return "bg-primary/5 text-primary border-primary/20";
    case "Shortlisted":
      return "bg-amber-500/10 text-amber-600 border-amber-500/20";
    case "Interview":
      return "bg-secondary text-primary border-primary/10";
    case "Selected":
      return "bg-green-700/10 text-green-700 border-green-700/20";
    default:
      return "bg-primary/5 text-primary border-primary/20";
  }
};

const nextStepForStatus = (status: ApplicationStatus) => {
  switch (status) {
    case "Applied":
      return "Online Assessment";
    case "Shortlisted":
      return "Technical Interview";
    case "Interview":
      return "Await Offer Letter";
    case "Selected":
      return "Offer Letter";
    default:
      return "Next Step";
  }
};

const StudentApplications = () => {
  const { loading, profile, user } = useAuth();
  const [apps, setApps] = useState<ApplicationDoc[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const run = async () => {
      if (loading || !user) return;
      try {
        setIsLoading(true);
        const next = await listStudentApplications(user.uid);
        setApps(next);
      } catch (err) {
        toast({
          title: "Could not load applications",
          description: err instanceof Error ? err.message : "Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    run();
  }, [loading, user]);

  const sorted = useMemo(() => {
    // Keep newest first when possible; otherwise keep Firestore order.
    return [...apps].sort((a, b) => String(b.id).localeCompare(String(a.id)));
  }, [apps]);

  if (loading || !profile || !user) {
    return (
      <DashboardLayout role="student">
        <div className="p-6 text-muted-foreground">Loading applications...</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="student">
      <div className="space-y-8 max-w-5xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4">
          <div>
            <h1 className="text-3xl font-serif font-extrabold tracking-tighter text-primary">Applications</h1>
            <p className="text-muted-foreground mt-2 font-medium">Track your end-to-end recruitment progress.</p>
          </div>
        </div>

        <div className="bg-white border border-primary/10 rounded-3xl overflow-hidden shadow-sm flex flex-col">
          <div className="divide-y divide-primary/5">
            {isLoading && apps.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground font-medium">Loading pipeline...</div>
            ) : sorted.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground font-medium">No applications yet. Apply to a smart match role.</div>
            ) : (
              sorted.map((app, i) => {
                const appliedAt = (() => {
                  const v = app.appliedAt as unknown;
                  if (v instanceof FbTimestamp) return v.toDate().toLocaleDateString();
                  return undefined;
                })();

                return (
                  <motion.div
                    key={app.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: i * 0.05 }}
                    className="p-6 md:p-8 hover:bg-secondary/30 cursor-pointer transition-colors flex flex-col md:flex-row md:items-center justify-between gap-6 group"
                    onClick={() => toast(`Next Action: ${nextStepForStatus(app.status)}`)}
                  >
                    <div className="flex items-start md:items-center gap-5">
                      <div className="w-14 h-14 rounded-2xl bg-secondary flex items-center justify-center font-bold text-primary border border-primary/10 shadow-sm shrink-0">
                        <Building2 className="w-6 h-6 text-primary/70" />
                      </div>
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="font-bold text-lg text-primary group-hover:underline underline-offset-4 decoration-primary/20">
                            {app.role}
                          </h3>
                          <Badge
                            variant="outline"
                            className={`rounded-full px-3 text-[10px] uppercase font-bold tracking-widest bg-transparent ${getStatusColor(app.status)}`}
                          >
                            {app.status}
                          </Badge>
                        </div>
                        <p className="text-sm font-semibold text-muted-foreground flex items-center gap-2">
                          {app.companyName} <span className="w-1 h-1 rounded-full bg-primary/20" /> Applied:{" "}
                          {appliedAt ?? "—"}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col md:items-end gap-2 md:gap-1 bg-primary/5 rounded-xl p-4 md:p-0 md:bg-transparent text-sm">
                      <p className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">Next Action</p>
                      <p
                        className="font-bold text-primary flex items-center gap-2 cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          toast(`Next Step: ${nextStepForStatus(app.status)}`);
                        }}
                      >
                        {nextStepForStatus(app.status)} <ExternalLink className="w-3 h-3 text-primary/50" />
                      </p>
                    </div>
                  </motion.div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StudentApplications;

