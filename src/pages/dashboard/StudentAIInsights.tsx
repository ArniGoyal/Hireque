import DashboardLayout from "@/components/DashboardLayout";
import { motion } from "framer-motion";

const insights = [
  { skill: "DSA", score: 75 },
  { skill: "Aptitude", score: 60 },
  { skill: "Communication", score: 80 },
  { skill: "Core Subjects", score: 65 },
];

const StudentAIInsights = () => {
  return (
    <DashboardLayout role="student">
      <div className="max-w-5xl mx-auto space-y-8">

        {/* Heading */}
        <div>
          <h1 className="text-3xl font-bold text-primary">AI Insights</h1>
          <p className="text-muted-foreground mt-2">
            Personalized analysis based on your profile & performance.
          </p>
        </div>

        {/* Insight Cards */}
        <div className="grid md:grid-cols-2 gap-6">
          {insights.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white p-6 rounded-2xl border shadow-sm"
            >
              <h3 className="font-bold text-lg mb-2">{item.skill}</h3>

              {/* Progress Bar */}
              <div className="w-full bg-gray-200 h-3 rounded-full">
                <div
                  className="bg-primary h-3 rounded-full"
                  style={{ width: `${item.score}%` }}
                />
              </div>

              <p className="text-sm mt-2 text-muted-foreground">
                Score: {item.score}%
              </p>
            </motion.div>
          ))}
        </div>

        {/* Suggestions */}
        <div className="bg-primary/5 p-6 rounded-2xl border">
          <h2 className="font-bold text-xl text-primary mb-3">
            AI Suggestions
          </h2>
          <ul className="list-disc ml-5 space-y-2 text-sm">
            <li>Improve Aptitude for better shortlisting chances</li>
            <li>Practice more DSA problems on LeetCode</li>
            <li>Focus on core subjects for technical interviews</li>
          </ul>
        </div>

      </div>
    </DashboardLayout>
  );
};

export default StudentAIInsights;