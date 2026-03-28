import { motion } from "framer-motion";
import DashboardLayout from "@/components/DashboardLayout";
import StatCard from "@/components/StatCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, Building2, TrendingUp, Award, ArrowRight } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const placementData = [
  { month: "Jan", placed: 45 },
  { month: "Feb", placed: 62 },
  { month: "Mar", placed: 78 },
  { month: "Apr", placed: 120 },
  { month: "May", placed: 95 },
  { month: "Jun", placed: 140 },
];

const branchData = [
  { name: "CSE", value: 420, color: "hsl(222, 47%, 18%)" },
  { name: "IT", value: 280, color: "hsl(38, 72%, 54%)" },
  { name: "ECE", value: 190, color: "hsl(210, 70%, 50%)" },
  { name: "ME", value: 130, color: "hsl(152, 60%, 38%)" },
  { name: "EE", value: 100, color: "hsl(0, 72%, 51%)" },
];

const recentCompanies = [
  { name: "Google", openings: 5, status: "Active", visits: "Apr 10, 2026" },
  { name: "Microsoft", openings: 3, status: "Active", visits: "Apr 14, 2026" },
  { name: "Amazon", openings: 8, status: "Upcoming", visits: "Apr 20, 2026" },
  { name: "Deloitte", openings: 12, status: "Completed", visits: "Mar 28, 2026" },
];

const statusColors: Record<string, string> = {
  Active: "bg-success/10 text-success",
  Upcoming: "bg-info/10 text-info",
  Completed: "bg-muted text-muted-foreground",
};

const AdminDashboard = () => {
  return (
    <DashboardLayout role="admin">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-serif font-bold text-foreground">Admin Dashboard</h1>
          <p className="text-muted-foreground mt-1">Complete placement overview and management.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard icon={Users} title="Total Students" value="5,240" trend="+180 this sem" trendUp index={0} />
          <StatCard icon={Building2} title="Companies" value={342} index={1} />
          <StatCard icon={TrendingUp} title="Placement Rate" value="92%" trend="+4% vs last year" trendUp index={2} />
          <StatCard icon={Award} title="Highest Package" value="₹62 LPA" index={3} />
        </div>

        {/* Charts */}
        <div className="grid lg:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-card border rounded-2xl p-6 shadow-sm"
          >
            <h3 className="font-serif font-bold text-lg text-foreground mb-6">Monthly Placements</h3>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={placementData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(40, 10%, 88%)" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="hsl(220, 9%, 46%)" />
                <YAxis tick={{ fontSize: 12 }} stroke="hsl(220, 9%, 46%)" />
                <Tooltip
                  contentStyle={{
                    background: "hsl(0, 0%, 100%)",
                    border: "1px solid hsl(40, 10%, 88%)",
                    borderRadius: "10px",
                    fontSize: 13,
                    fontFamily: "'DM Serif Display', serif",
                  }}
                />
                <Bar dataKey="placed" fill="hsl(222, 47%, 18%)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="bg-card border rounded-2xl p-6 shadow-sm"
          >
            <h3 className="font-serif font-bold text-lg text-foreground mb-6">Students by Branch</h3>
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={branchData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {branchData.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: "hsl(0, 0%, 100%)",
                    border: "1px solid hsl(40, 10%, 88%)",
                    borderRadius: "10px",
                    fontSize: 13,
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap gap-4 justify-center mt-3">
              {branchData.map((b) => (
                <div key={b.name} className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ background: b.color }} />
                  {b.name}
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Companies */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="bg-card border rounded-2xl overflow-hidden shadow-sm"
        >
          <div className="flex items-center justify-between p-6 border-b">
            <h3 className="font-serif font-bold text-lg text-foreground">Company Visits</h3>
            <Button variant="ghost" size="sm" className="text-accent font-semibold">
              Manage <ArrowRight className="ml-1 w-3 h-3" />
            </Button>
          </div>
          <div className="divide-y">
            {recentCompanies.map((c, i) => (
              <motion.div
                key={c.name}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 + i * 0.08 }}
                className="flex items-center justify-between p-4 px-6 hover:bg-muted/40 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center text-accent font-bold text-sm font-serif">
                    {c.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{c.name}</p>
                    <p className="text-sm text-muted-foreground">{c.openings} openings · Visit: {c.visits}</p>
                  </div>
                </div>
                <span className={`text-xs font-semibold px-3 py-1.5 rounded-full ${statusColors[c.status]}`}>
                  {c.status}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
