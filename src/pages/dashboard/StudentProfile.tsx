import { motion } from "framer-motion";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Edit, Code, GraduationCap, MapPin, Linkedin, Github } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast } from "sonner";
const StudentProfile = () => {
    const navigate = useNavigate();
    const [file, setFile] = useState<File | null>(null);
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  if (e.target.files && e.target.files[0]) {
    setFile(e.target.files[0]);
  }
};
const handleUpload = () => {
  if (!file) {
    toast.error("Please select a file first");
    return;
  }

  toast("Uploading Resume...", {
    description: "Analyzing with AI...",
  });

  setTimeout(() => {
    toast.success("Resume uploaded successfully!");
  }, 2000);
};
  return (
    <DashboardLayout role="student">
      <div className="space-y-8 max-w-5xl mx-auto">
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-serif font-extrabold tracking-tighter text-primary">My Profile</h1>
            <p className="text-muted-foreground mt-2 font-medium">Manage your personal information, skills, and AI resume.</p>
          </div>
          <Button
  onClick={() => alert("Edit Profile Coming Soon")}
  className="rounded-full shadow-lg shadow-primary/20 bg-primary text-white font-bold h-10 px-6 hidden sm:flex"
>
  <Edit className="w-4 h-4 mr-2" />
  Edit Profile
</Button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column: Basic Info & Stats */}
            <div className="space-y-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="bg-white border border-primary/10 rounded-3xl p-8 shadow-sm flex flex-col items-center text-center relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 w-40 h-40 bg-secondary rounded-full blur-3xl -z-0" />
                    <div className="w-24 h-24 rounded-full bg-secondary flex items-center justify-center font-bold text-primary font-serif text-3xl mb-4 border-4 border-white shadow-md relative z-10">
                        RS
                    </div>
                    <h2 className="text-2xl font-bold font-serif text-primary relative z-10">Rohan Sharma</h2>
                    <p className="text-sm font-semibold text-muted-foreground uppercase tracking-widest mt-1 relative z-10">Software Engineer</p>
                    
                    <div className="flex items-center gap-2 mt-4 text-xs font-bold text-muted-foreground relative z-10">
                        <MapPin className="w-3 h-3" /> New Delhi, India
                    </div>

                    <div className="flex gap-3 mt-6 relative z-10">
                        <Button
  onClick={() => window.open("https://linkedin.com", "_blank")}
  variant="outline"
  size="icon"
  className="rounded-full border-primary/10 text-primary hover:bg-secondary"
>
  <Linkedin className="w-4 h-4" />
</Button>
                        <Button
  onClick={() => window.open("https://github.com", "_blank")}
  variant="outline"
  size="icon"
  className="rounded-full border-primary/10 text-primary hover:bg-secondary"
>
  <Github className="w-4 h-4" />
</Button>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="bg-secondary/40 border border-primary/10 rounded-3xl p-6 shadow-sm relative overflow-hidden flex flex-col items-center text-center group"
                >
                    <div className="w-16 h-16 rounded-full bg-white border border-primary/20 flex flex-col items-center justify-center shadow-sm mb-3">
                        <span className="text-xl font-black font-serif text-primary">88</span>
                    </div>
                    <Badge className="bg-primary text-white text-[10px] px-3 py-0.5 rounded-full font-bold mb-3">CURRENT AI SCORE</Badge>
                    <p className="text-xs text-muted-foreground font-medium px-4">Your profile is consistently matching with top-tier product companies.</p>
                    <div className="flex flex-col gap-3 w-full mt-4">
  <input
    type="file"
    accept=".pdf,.doc,.docx"
    onChange={handleFileChange}
    className="text-xs"
  />

  <Button
    onClick={handleUpload}
    className="rounded-full font-bold bg-primary text-white"
  >
    Upload Resume
  </Button>
</div>
                </motion.div>
            </div>

            {/* Right Column: Details */}
            <div className="lg:col-span-2 space-y-8">
                 {/* Education */}
                 <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="bg-white border border-primary/10 rounded-3xl p-8 shadow-sm flex flex-col"
                >
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center font-bold text-primary shadow-sm">
                            <GraduationCap className="w-5 h-5" />
                        </div>
                        <h3 className="font-serif font-extrabold text-xl text-primary">Academic Background</h3>
                    </div>

                    <div className="space-y-6">
                        <div className="flex justify-between items-start border-b border-primary/5 pb-4">
                            <div>
                                <h4 className="font-bold text-primary text-sm uppercase tracking-wide">B.Tech in Computer Science</h4>
                                <p className="text-sm font-medium text-muted-foreground mt-1">National Institute of Technology</p>
                            </div>
                            <div className="text-right">
                                <span className="block font-serif font-black text-lg text-primary">8.9 <span className="text-xs font-sans text-muted-foreground">CGPA</span></span>
                                <span className="text-xs font-bold text-muted-foreground tracking-widest">2023 - 2027</span>
                            </div>
                        </div>
                        <div className="flex justify-between items-start">
                            <div>
                                <h4 className="font-bold text-primary text-sm uppercase tracking-wide">Higher Secondary (XII)</h4>
                                <p className="text-sm font-medium text-muted-foreground mt-1">Delhi Public School</p>
                            </div>
                            <div className="text-right">
                                <span className="block font-serif font-black text-lg text-primary">94.2 <span className="text-xs font-sans text-muted-foreground">%</span></span>
                                <span className="text-xs font-bold text-muted-foreground tracking-widest">2021 - 2023</span>
                            </div>
                        </div>
                    </div>
                </motion.div>

                 {/* Skills */}
                 <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                    className="bg-white border border-primary/10 rounded-3xl p-8 shadow-sm flex flex-col"
                >
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center font-bold text-primary shadow-sm">
                            <Code className="w-5 h-5" />
                        </div>
                        <h3 className="font-serif font-extrabold text-xl text-primary">Technical Skills</h3>
                    </div>

                    <div className="space-y-5">
                        <div>
                           <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">Languages</p>
                           <div className="flex gap-2 flex-wrap">
                               {['JavaScript', 'TypeScript', 'Python', 'Java', 'C++'].map(s => <Badge key={s} variant="outline" className="border-primary/20 text-primary py-1 px-3 text-xs bg-transparent">{s}</Badge>)}
                           </div>
                        </div>
                        <div>
                           <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">Frameworks & Tools</p>
                           <div className="flex gap-2 flex-wrap">
                               {['React.js', 'Node.js', 'Express', 'Next.js', 'MongoDB', 'PostgreSQL', 'Git', 'Docker'].map(s => <Badge key={s} className="bg-secondary text-primary border-none hover:bg-secondary py-1 px-3 text-xs">{s}</Badge>)}
                           </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StudentProfile;
