import { motion } from "framer-motion";
import DashboardLayout from "@/components/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Video, FileText, CheckCircle2 } from "lucide-react";

const interviews = [
  { id: 1, company: "Wipro", role: "Project Engineer", type: "Technical Round", date: "April 18, 2026", time: "10:30 AM", platform: "Google Meet", prepLink: "DSA Topics", status: "Scheduled" },
  { id: 2, company: "Capgemini", role: "Software Analyst", type: "HR Round", date: "April 20, 2026", time: "02:00 PM", platform: "Microsoft Teams", prepLink: "Company Values", status: "Scheduled" },
];

const completed = [
  { id: 3, company: "Infosys", role: "Systems Engineer", type: "Technical", result: "Pass" },
  { id: 4, company: "TCS", role: "Associate Engineer", type: "OA", result: "Pass" }
];

const StudentInterviews = () => {
  return (
    <DashboardLayout role="student">
      <div className="space-y-8 max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4">
          <div>
            <h1 className="text-3xl font-serif font-extrabold tracking-tighter text-primary">Interviews</h1>
            <p className="text-muted-foreground mt-2 font-medium">Manage pending interview rounds and preparation logic.</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
               <h3 className="font-serif font-bold text-xl text-primary border-b border-primary/10 pb-4">Upcoming Schedule</h3>
               {interviews.map((interview, i) => (
                  <motion.div
                     key={interview.id}
                     initial={{ opacity: 0, scale: 0.98 }}
                     animate={{ opacity: 1, scale: 1 }}
                     transition={{ duration: 0.4, delay: i * 0.1 }}
                     className="bg-white border border-primary/10 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col md:flex-row justify-between gap-6"
                   >
                     <div className="flex gap-6">
                        <div className="w-16 h-20 bg-secondary rounded-2xl flex flex-col justify-center items-center text-primary font-bold shadow-inner border border-primary/5">
                           <span className="text-[10px] uppercase tracking-widest text-muted-foreground">{interview.date.split(" ")[0]}</span>
                           <span className="text-2xl font-serif">{interview.date.split(" ")[1].replace(',', '')}</span>
                        </div>
                        <div>
                           <Badge className="bg-primary/5 text-primary border-primary/20 hover:bg-primary/10 mb-2 py-0.5 text-[10px] uppercase font-bold tracking-widest">{interview.type}</Badge>
                           <h3 className="font-bold text-lg text-primary">{interview.company}</h3>
                           <p className="text-[13px] font-semibold text-muted-foreground">{interview.role}</p>
                           <div className="flex flex-wrap gap-4 mt-4 font-bold text-primary/70 text-xs">
                               <span className="flex items-center"><Clock className="w-3.5 h-3.5 mr-1.5 inline" /> {interview.time}</span>
                               <span className="flex items-center"><Video className="w-3.5 h-3.5 mr-1.5 inline" /> {interview.platform}</span>
                           </div>
                        </div>
                     </div>
                     <div className="flex flex-col gap-3 md:justify-end border-t md:border-t-0 border-primary/10 pt-4 md:pt-0">
                        <Button className="w-full sm:w-auto rounded-full font-bold shadow-lg shadow-primary/20 bg-primary text-white hover:-translate-y-0.5 transition-transform"><Video className="w-4 h-4 mr-2" /> Join Call</Button>
                        <Button variant="outline" className="w-full sm:w-auto rounded-full font-bold border-primary/20 text-primary hover:bg-secondary text-xs"><FileText className="w-4 h-4 mr-2" /> Prep: {interview.prepLink}</Button>
                     </div>
                  </motion.div>
               ))}
               
               {interviews.length === 0 && (
                   <div className="bg-white border border-primary/10 border-dashed rounded-3xl p-12 flex flex-col items-center justify-center text-center">
                       <Calendar className="w-12 h-12 text-primary/20 mb-4" />
                       <h3 className="font-serif font-bold text-xl text-primary block">No Interviews Scheduled</h3>
                       <p className="text-muted-foreground font-medium text-sm mt-2">Apply to more Smart Matches to fill up your calendar.</p>
                   </div>
               )}
            </div>

            <div>
               <h3 className="font-serif font-bold text-xl text-primary border-b border-primary/10 pb-4 mb-8">Completed</h3>
               <div className="space-y-4">
                  {completed.map((comp, i) => (
                     <motion.div
                       key={comp.id}
                       initial={{ opacity: 0, x: 20 }}
                       animate={{ opacity: 1, x: 0 }}
                       transition={{ duration: 0.3, delay: 0.3 + (i * 0.1) }}
                       className="bg-secondary/40 border border-primary/10 rounded-2xl p-5 flex items-center justify-between"
                     >
                        <div>
                           <p className="font-bold text-[14px] text-primary">{comp.company}</p>
                           <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest mt-1">{comp.type}</p>
                        </div>
                        <Badge className="bg-green-700 text-white border-none py-1"><CheckCircle2 className="w-3 h-3 mr-1" /> {comp.result}</Badge>
                     </motion.div>
                  ))}
               </div>
            </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StudentInterviews;
