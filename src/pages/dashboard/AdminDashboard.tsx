import { motion } from "framer-motion";
import DashboardLayout from "@/components/DashboardLayout";
import StatCard from "@/components/StatCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, Building2, TrendingUp, Award, ArrowRight, Loader2 } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { listPendingStudents, verifyStudent } from "@/firebase/users";

const placementData = [
  { month: "Jan", placed: 45 },
  { month: "Feb", placed: 62 },
  { month: "Mar", placed: 78 },
  { month: "Apr", placed: 120 },
  { month: "May", placed: 95 },
  { month: "Jun", placed: 140 },
];

const branchData = [
  { name: "CSE", value: 420, color: "#193c28" },
  { name: "IT", value: 280, color: "#2e5c40" },
  { name: "ECE", value: 190, color: "#3c7a54" },
  { name: "ME", value: 130, color: "#d4cbb8" },
  { name: "EE", value: 100, color: "#a89f8d" },
];

const initialCompanies = [
  { id: 1, name: "Vertex", openings: 5, status: "Active", visits: "Apr 10, 2026" },
  { id: 2, name: "Microsoft", openings: 3, status: "Active", visits: "Apr 14, 2026" },
  { id: 3, name: "Pinnacle", openings: 8, status: "Upcoming", visits: "Apr 20, 2026" },
  { id: 4, name: "Nova Corp", openings: 12, status: "Completed", visits: "Mar 28, 2026" },
];

const AdminDashboard = () => {
  const [companies, setCompanies] = useState(initialCompanies);
  const [pendingVerifications, setPendingVerifications] = useState(0);
  const [isVerifying, setIsVerifying] = useState(false);

  const handleVerify = async () => {
    if (pendingVerifications === 0) return;
    setIsVerifying(true);
    toast("Running Verification Module", { description: "Updating Firestore student verification status..." });

    try {
      const pending = await listPendingStudents();
      for (const student of pending) {
        await verifyStudent(student.uid);
      }
      setPendingVerifications(0);
      toast.success("All Profiles Verified!", {
        description: "Student accounts activated and onboarded successfully.",
      });
    } catch (err) {
      toast({
        title: "Verification failed",
        description: err instanceof Error ? err.message : "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const handleAddCompany = () => {
    const newCompany = { id: Date.now(), name: "Stripe", openings: 10, status: "Upcoming", visits: "May 1, 2026" };
    setCompanies([newCompany, ...companies]);
    toast.success("Stripe Onboarded", { description: "New partnership active. Company portal access granted." });
  };

  const handleManage = (companyName: string) => {
    toast(`Managing ${companyName}`, { description: "Opening company configurations..." });
  };

  useEffect(() => {
    const run = async () => {
      try {
        const pending = await listPendingStudents();
        setPendingVerifications(pending.length);
      } catch {
        // keep existing UI; verification area will still work
      }
    };
    run();
  }, []);

  return (
    <DashboardLayout role="admin">
      <div className="space-y-8">
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-serif font-extrabold tracking-tighter text-primary">Admin Control Center</h1>
            <p className="text-muted-foreground mt-2 font-medium">Verify students, manage companies, and monitor overall velocity.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard icon={Users} title="Total Students Placed" value="5,240" trend="+180 this sem" trendUp index={0} />
          <StatCard icon={Building2} title="Companies Visiting" value={342 + (companies.length - 4)} index={1} />
          <StatCard icon={TrendingUp} title="Placement %" value="92%" trend="+4% vs last year" trendUp index={2} />
          <StatCard icon={Award} title="Highest Package" value="₹62 LPA" index={3} />
        </div>

        {/* Charts */}
        <div className="grid lg:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-white border border-primary/10 rounded-3xl p-8 shadow-sm"
          >
            <h3 className="font-serif font-bold text-xl text-primary mb-6">Monthly Placements</h3>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={placementData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(25, 60, 40, 0.05)" />
                <XAxis dataKey="month" tick={{ fontSize: 12, fontWeight: 700 }} stroke="#a89f8d" />
                <YAxis tick={{ fontSize: 12, fontWeight: 700 }} stroke="#a89f8d" />
                <Tooltip
                  contentStyle={{
                    background: "#ffffff",
                    border: "1px solid rgba(25, 60, 40, 0.1)",
                    borderRadius: "16px",
                    boxShadow: "0 10px 25px -5px rgba(0,0,0,0.05)",
                    fontSize: 13,
                    fontWeight: 700,
                    color: "#193c28",
                  }}
                  itemStyle={{ color: "#193c28", fontWeight: "bold" }}
                />
                <Bar dataKey="placed" fill="#193c28" radius={[8, 8, 8, 8]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="bg-white border border-primary/10 rounded-3xl p-8 shadow-sm flex flex-col"
          >
            <h3 className="font-serif font-bold text-xl text-primary mb-6">Placements by Branch</h3>
            <div className="flex-1 flex justify-center items-center">
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie
                    data={branchData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={110}
                    paddingAngle={3}
                    dataKey="value"
                    stroke="none"
                  >
                    {branchData.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      background: "#ffffff",
                      border: "1px solid rgba(25, 60, 40, 0.1)",
                      borderRadius: "16px",
                      boxShadow: "0 10px 25px -5px rgba(0,0,0,0.05)",
                      fontSize: 13,
                      fontWeight: 700,
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-wrap gap-4 justify-center mt-6">
              {branchData.map((b) => (
                <div key={b.name} className="flex items-center gap-2 text-[12px] text-muted-foreground font-bold uppercase tracking-widest">
                  <span className="w-3 h-3 rounded-full" style={{ background: b.color }} />
                  {b.name}
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Action Panel */}
        <div className="grid lg:grid-cols-3 gap-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="bg-white border border-primary/10 rounded-3xl overflow-hidden shadow-sm lg:col-span-2"
            >
                <div className="flex items-center justify-between p-6 border-b border-primary/5">
                <div>
                   <h3 className="font-serif font-bold text-xl text-primary">Company Partnerships</h3>
                   <p className="text-[13px] text-muted-foreground font-medium mt-1">Manage and verify visiting recruiters.</p>
                </div>
                <Button onClick={handleAddCompany} size="sm" className="rounded-full shadow-lg shadow-primary/20 font-bold bg-primary text-white">Add Company</Button>
                </div>
                <div className="divide-y divide-primary/5 max-h-[350px] overflow-y-auto no-scrollbar">
                {companies.map((c, i) => (
                    <motion.div
                    key={c.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 + i * 0.08 }}
                    className="flex items-center justify-between p-5 px-6 hover:bg-secondary/30 transition-colors"
                    >
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center font-bold text-primary border border-primary/10 shadow-sm text-lg font-serif">
                           {c.name.charAt(0)}
                        </div>
                        <div>
                        <p className="font-bold text-[15px] text-primary">{c.name}</p>
                        <p className="text-[13px] text-muted-foreground font-medium mt-0.5">{c.openings} Openings · Visits: {c.visits}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <Badge variant="outline" className={`rounded-full font-bold px-4 border text-[11px] uppercase tracking-widest bg-transparent ${c.status === 'Active' ? 'text-green-700 border-green-700/20' : c.status === 'Upcoming' ? 'text-primary border-primary/30' : 'text-muted-foreground border-primary/10'}`}>{c.status}</Badge>
                        <Button onClick={() => handleManage(c.name)} variant="ghost" size="sm" className="font-bold text-primary hover:bg-secondary">Manage</Button>
                    </div>
                    </motion.div>
                ))}
                </div>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.7 }}
                className="bg-primary border border-primary rounded-3xl p-8 shadow-xl flex flex-col items-start justify-center text-left relative overflow-hidden"
            >
                 <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
                 <Users className="w-12 h-12 text-white/80 mb-6 relative z-10" />
                 <h3 className="text-3xl font-serif font-extrabold text-white mb-3 relative z-10 leading-tight">Student<br/>Verification</h3>
                 <p className="text-white/60 font-medium text-[14px] mb-8 relative z-10">
                    {pendingVerifications > 0 
                      ? `${pendingVerifications} new student profiles require manual administrative verification.` 
                      : "All queued student profiles have been verified!"}
                 </p>
                 <Button onClick={handleVerify} disabled={isVerifying || pendingVerifications === 0} className="w-full h-12 rounded-full bg-white text-primary font-extrabold shadow-lg hover:bg-white/90 relative z-10 disabled:opacity-80 disabled:hover:bg-white">
                    {isVerifying ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : ''} 
                    {isVerifying ? 'Verifying DB...' : pendingVerifications === 0 ? 'Verified' : 'Verify Pending Profiles'} 
                    {pendingVerifications > 0 && !isVerifying && <ArrowRight className="w-4 h-4 ml-2" />}
                 </Button>
            </motion.div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
