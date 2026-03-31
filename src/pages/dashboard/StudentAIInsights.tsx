import { motion } from "framer-motion";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

const insights = [
  { skill: "DSA", score: 80 },
  { skill: "React", score: 90 },
  { skill: "System Design", score: 65 },
  { skill: "Communication", score: 75 },
];

const StudentAIInsights = () => {
  return (
    <DashboardLayout role="student">
      <div className="space-y-8 max-w-5xl mx-auto">
        <div>
          <h1 className="text-3xl font-serif font-extrabold text-primary">AI Insights</h1>
          <p className="text-muted-foreground mt-2">Your AI-powered profile analysis and recommendations</p>
        </div>

        {/* Overall Score */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-3xl border shadow-sm"
        >
          <h2 className="text-xl font-bold text-primary mb-4">Overall Score</h2>
          <div className="flex items-center gap-6">
            <div className="text-4xl font-extrabold text-primary">88</div>
            <Progress value={88} className="w-full" />
          </div>
        </motion.div>

        {/* Skill Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white p-6 rounded-3xl border shadow-sm"
        >
          <h2 className="text-xl font-bold text-primary mb-4">Skill Analysis</h2>
          <div className="space-y-4">
            {insights.map((item, i) => (
              <div key={i}>
                <div className="flex justify-between text-sm font-semibold mb-1">
                  <span>{item.skill}</span>
                  <span>{item.score}%</span>
                </div>
                <Progress value={item.score} />
              </div>
            ))}
          </div>
        </motion.div>

        {/* Suggestions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white p-6 rounded-3xl border shadow-sm"
        >
          <h2 className="text-xl font-bold text-primary mb-4">AI Suggestions</h2>
          <div className="flex flex-wrap gap-2">
            <Badge>Improve System Design</Badge>
            <Badge>Practice DSA daily</Badge>
            <Badge>Build 2 more projects</Badge>
            <Badge>Enhance communication skills</Badge>
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default StudentAIInsights;
