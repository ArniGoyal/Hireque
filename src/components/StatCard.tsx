import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  trendUp?: boolean;
  index?: number;
}

const StatCard = ({ title, value, icon: Icon, trend, trendUp, index = 0 }: StatCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
    whileHover={{ y: -3, transition: { duration: 0.25 } }}
    className="bg-card rounded-2xl border p-6 shadow-sm hover:shadow-lg transition-shadow duration-300 group"
  >
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm text-muted-foreground mb-1">{title}</p>
        <p className="text-3xl font-serif font-bold text-foreground">{value}</p>
        {trend && (
          <p className={`text-xs mt-2 font-medium ${trendUp ? "text-success" : "text-destructive"}`}>
            {trend}
          </p>
        )}
      </div>
      <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center group-hover:bg-accent/15 transition-colors">
        <Icon className="w-6 h-6 text-accent" />
      </div>
    </div>
  </motion.div>
);

export default StatCard;
