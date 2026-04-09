import { motion } from "framer-motion";
import { Timestamp } from "firebase/firestore";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Code, GraduationCap, MapPin, Linkedin, Github } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@/auth/AuthProvider";
import { uploadResume } from "@/supabase/resumes";
import { updateStudentProfile } from "@/firebase/users";

const StudentProfile = () => {
  const { loading, profile, user } = useAuth();

  const student = profile?.student;
  const name = profile?.name ?? student?.name ?? "Student";
  const branch = student?.branch ?? "";
  const cgpa = student?.cgpa;
  const skills = student?.skills ?? [];
  const resumeUrl = student?.resume?.downloadUrl;
  const resumeStoragePath = student?.resume?.storagePath;

  const aiScore = useMemo(() => {
  let score = 0;

  // ✅ 1. CGPA (40%)
  if (typeof cgpa === "number") {
    score += (cgpa / 10) * 40;
  }

  // ✅ 2. Skills (30%)
  const skillCount = skills.length;
  const skillScore = Math.min(skillCount / 8, 1); // ideal = 8 skills
  score += skillScore * 30;

  // ✅ 3. Resume (15%)
  if (resumeUrl) {
    score += 15;
  }

  // ✅ 4. Profile completeness (15%)
  let completeness = 0;
  if (name) completeness += 0.25;
  if (branch) completeness += 0.25;
  if (cgpa) completeness += 0.25;
  if (skills.length > 0) completeness += 0.25;

  score += completeness * 15;

  return Math.round(score);
}, [cgpa, skills, resumeUrl, name, branch]);

  const initials = useMemo(() => {
    const parts = name.trim().split(/\s+/).filter(Boolean);
    return parts
      .slice(0, 2)
      .map((p) => p[0]?.toUpperCase())
      .join("")
      .slice(0, 2);
  }, [name]);

  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [cgpaDraft, setCgpaDraft] = useState("");
  const [branchDraft, setBranchDraft] = useState("");
  const [skillsDraft, setSkillsDraft] = useState("");
  const [collegeDraft, setCollegeDraft] = useState("");
const [yearDraft, setYearDraft] = useState("");
const [linkedinDraft, setLinkedinDraft] = useState("");
const [githubDraft, setGithubDraft] = useState("");
const [collegeOptions, setCollegeOptions] = useState<string[]>([]);
const [isEditing, setIsEditing] = useState(false);
const [nameDraft, setNameDraft] = useState("");
const [, setRefresh] = useState(0);

  useEffect(() => {
    if (!profile || isEditing) return;
    setNameDraft(profile.name ?? "");
    if (!student) return;
    setCgpaDraft(typeof student.cgpa === "number" ? student.cgpa.toString() : "");
    setBranchDraft(student.branch ?? "");
    setSkillsDraft((student.skills ?? []).join(", "));
    setCollegeDraft(student.college ?? "");
    setYearDraft(student.year ?? "");
    setLinkedinDraft(student.linkedin ?? "");
    setGithubDraft(student.github ?? "");
  }, [profile, student, isEditing]);

  useEffect(() => {
  const fetchColleges = async () => {
    try {
      const res = await fetch("http://universities.hipolabs.com/search?country=India");
      const data = await res.json();
      setCollegeOptions(data.slice(0, 50).map((c: any) => c.name));
    } catch {
      console.log("College API failed");
    }
  };
  fetchColleges();
}, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) setFile(e.target.files[0]);
  };
  const isValidUrl = (url: string) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};
  const handleUpload = async () => {
  if (!user) {
    toast.error("You must be signed in.");
    return;
  }
  if (!file) {
    toast.error("Please select a resume file first.");
    return;
  }

  let toastId;

  try {
    setIsUploading(true);

    toastId = toast.loading("Uploading Resume...");

    const { downloadUrl, storagePath } = await uploadResume({ uid: user.uid, file });

    await updateStudentProfile(user.uid, {
      resume: { storagePath, downloadUrl, updatedAt: Timestamp.now() },
    });

    toast.success("Resume uploaded successfully!", { id: toastId });

    setFile(null);
  } catch (err) {
    toast.error(
      err instanceof Error ? err.message : "Resume upload failed",
      { id: toastId }
    );
  } finally {
    setIsUploading(false);
  }
};


  const handleSaveProfile = async () => {
  if (!user) return;

  try {
    // ✅ Validate URLs
    if (linkedinDraft && !isValidUrl(linkedinDraft)) {
      toast.error("Invalid LinkedIn URL");
      return;
    }

    if (githubDraft && !isValidUrl(githubDraft)) {
      toast.error("Invalid GitHub URL");
      return;
    }

    // ✅ Clean CGPA
    const cgpaVal =
      cgpaDraft.trim().length === 0
        ? null
        : Number(cgpaDraft.trim().replace(",", "."));

    const cgpaClean =
      typeof cgpaVal === "number" && !Number.isNaN(cgpaVal)
        ? cgpaVal
        : null;

    // ✅ Clean skills
    const skillsArr = skillsDraft
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)
      .slice(0, 30);

    // ✅ Final safe object (NO undefined)
    const updatedData = {
      cgpa: cgpaClean,
      branch: branchDraft.trim() || null,
      skills: skillsArr,
      college: collegeDraft.trim() || null,
      year: yearDraft || null,
      linkedin: linkedinDraft.trim() || null,
      github: githubDraft.trim() || null,
      name: nameDraft.trim() || null,
    };

    await updateStudentProfile(user.uid, updatedData);

    // 🔥 IMPORTANT: update UI instantly
    profile.student = {
      ...profile.student,
      ...updatedData,
    };

    // 🔥 FORCE RE-RENDER
    setRefresh((prev) => prev + 1);

    setIsEditing(false);

    toast.success("Profile saved! 🚀");

  } catch (error) {
    console.error(error);
    toast.error("Failed to save profile");
  }
};

  if (loading || !profile || !user || !student) {
    return (
      <DashboardLayout role="student">
        <div className="p-6 text-muted-foreground">Loading your profile...</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="student">
      <div className="space-y-8 max-w-5xl mx-auto">
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-serif font-extrabold tracking-tighter text-primary">My Profile</h1>
            <p className="text-muted-foreground mt-2 font-medium">
              Manage your personal information, skills, and your resume.
            </p>
          </div>
          {isEditing ? (
            <Button
              onClick={() => setIsEditing(false)}
              variant="outline"
              className="rounded-full shadow-sm border-primary/20 text-primary font-bold h-10 px-6"
            >
              Cancel
            </Button>
          ) : (
            <Button
              onClick={() => setIsEditing(true)}
              className="rounded-full shadow-lg shadow-primary/20 bg-primary text-white font-bold h-10 px-6 flex"
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit Profile
            </Button>
          )}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column: Basic Info & Resume Upload */}
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white border border-primary/10 rounded-3xl p-8 shadow-sm flex flex-col items-center text-center relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-40 h-40 bg-secondary rounded-full blur-3xl -z-0" />
              <div className="w-24 h-24 rounded-full bg-secondary flex items-center justify-center font-bold text-primary font-serif text-3xl mb-4 border-4 border-white shadow-md relative z-10">
                {initials}
              </div>
              <h2 className="text-2xl font-bold font-serif text-primary relative z-10">
                {isEditing ? (
                  <input
                    title="Edit Name"
                    value={nameDraft}
                    onChange={(e) => setNameDraft(e.target.value)}
                    className="bg-transparent border-b border-primary/20 focus:outline-none w-full text-center"
                  />
                ) : (
                  name || "Student"
                )}
              </h2>
              <p className="text-sm font-semibold text-muted-foreground uppercase tracking-widest mt-1 relative z-10">
                {branch ? branch : "Student"}
              </p>

              <div className="flex items-center gap-2 mt-4 text-xs font-bold text-muted-foreground relative z-10 text-center px-4">
  <MapPin className="w-3 h-3 flex-shrink-0" />
  <span className="truncate">
    {student?.college || "Add your college"}
  </span>
</div>

              <div className="flex gap-3 mt-6 relative z-10">
                <Button
                  onClick={() => window.open(student?.linkedin || "https://linkedin.com", "_blank")}
                  variant="outline"
                  size="icon"
                  className="rounded-full border-primary/10 text-primary hover:bg-secondary"
                >
                  <Linkedin className="w-4 h-4" />
                </Button>
                <Button
                  onClick={() => window.open(student?.github || "https://github.com", "_blank")}
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
                <span className="text-xl font-black font-serif text-primary">{aiScore}</span>
              </div>
              <Badge className="bg-primary text-white text-[10px] px-3 py-0.5 rounded-full font-bold mb-3">
                CURRENT AI SCORE
              </Badge>
                <p className="text-xs text-muted-foreground font-medium px-4">
  {aiScore >= 85 && "Excellent profile! You're ready for top companies 🚀"}
  {aiScore >= 70 && aiScore < 85 && "Good profile. Add more skills to improve 💡"}
  {aiScore < 70 && "Complete your profile to increase job matches ⚡"}
</p>
              

              <div className="flex flex-col gap-3 w-full mt-4">
                {resumeUrl ? (
                  <a
                    href={resumeUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-bold text-primary hover:underline underline-offset-4 px-2"
                    title={resumeStoragePath ?? undefined}
                  >
                    View current resume
                  </a>
                ) : (
                  <p className="text-[12px] text-muted-foreground font-medium px-2">Upload your resume to improve matching.</p>
                )}

                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileChange}
                  className="text-xs"
                  disabled={isUploading}
                />

                <Button onClick={handleUpload} disabled={isUploading} className="rounded-full font-bold bg-primary text-white">
                  {isUploading ? "Uploading..." : "Upload Resume"}
                </Button>
              </div>
            </motion.div>
          </div>

          {/* Right Column: Academic Details + Skills */}
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
                    <h4 className="font-bold text-primary text-sm uppercase tracking-wide">
                      B.Tech in {branch || "Computer Science"}
                    </h4>
                    <p className="text-sm font-medium text-muted-foreground mt-1">{student?.college || "Add your college"}</p>
                  </div>
                  <div className="text-right">
                    <span className="block font-serif font-black text-lg text-primary">
                      {typeof cgpa === "number" ? cgpa.toFixed(1) : "--"}{" "}
                      <span className="text-xs font-sans text-muted-foreground">CGPA</span>
                    </span>
                    <span className="text-xs font-bold text-muted-foreground tracking-widest">
                      {typeof cgpa === "number" ? "Updated" : "Add your CGPA"}
                    </span>
                  </div>
                </div>
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-primary text-sm uppercase tracking-wide">Student Profile</h4>
                    <p className="text-sm font-medium text-muted-foreground mt-1">
                      Branch and CGPA are used for smart eligibility.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2 sm:col-span-2">
  <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">College</p>
  <input
    list="college-options"
    disabled={!isEditing}
    value={collegeDraft}
    onChange={(e) => setCollegeDraft(e.target.value)}
    placeholder="e.g. IIT Delhi"
    className="h-11 px-4 rounded-xl border border-primary/10 bg-background w-full"
  />
  <datalist id="college-options">
    {collegeOptions.map((c, i) => (
      <option key={i} value={c} />
    ))}
  </datalist>
</div>
                <div className="space-y-2">
                  <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">CGPA</p>
                  <input
                    type="number"
                    step={0.01}
                    min={0}
                    max={10}
                    value={cgpaDraft}
                    onChange={(e) => setCgpaDraft(e.target.value)}
                    disabled={!isEditing}
                    placeholder="e.g. 8.9"
                    className="h-11 px-4 rounded-xl border border-primary/10 bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div className="space-y-2">
                  <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Branch</p>
                  <input
                    type="text"
                    value={branchDraft}
                    onChange={(e) => setBranchDraft(e.target.value)}
                    disabled={!isEditing}
                    placeholder="e.g. CSE"
                    className="h-11 px-4 rounded-xl border border-primary/10 bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div className="space-y-2">
  <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Year</p>
  <select
    value={yearDraft}
    onChange={(e) => setYearDraft(e.target.value)}
    disabled={!isEditing}
    className="h-11 px-4 rounded-xl border border-primary/10 bg-background w-full"
  >
    <option value="">Select Year</option>
    <option value="1st">1st Year</option>
    <option value="2nd">2nd Year</option>
    <option value="3rd">3rd Year</option>
    <option value="4th">4th Year</option>
  </select>
</div>
<div className="space-y-2">
  <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">LinkedIn</p>
  <input
    type="text"
    value={linkedinDraft}
    onChange={(e) => setLinkedinDraft(e.target.value)}
    disabled={!isEditing}
    placeholder="https://linkedin.com/in/..."
    className="h-11 px-4 rounded-xl border border-primary/10 bg-background w-full"
  />
</div>
<div className="space-y-2">
  <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">GitHub</p>
  <input
    type="text"
    value={githubDraft}
    onChange={(e) => setGithubDraft(e.target.value)}
    disabled={!isEditing}
    placeholder="https://github.com/..."
    className="h-11 px-4 rounded-xl border border-primary/10 bg-background w-full"
  />
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

              <div className="flex flex-wrap gap-2 min-h-[48px]">
                {skills.length ? (
                  skills.map((s) => (
                    <Badge key={s} variant="outline" className="border-primary/20 text-primary py-1 px-3 text-xs bg-transparent">
                      {s}
                    </Badge>
                  ))
                ) : (
                  <p className="text-muted-foreground font-medium">No skills added yet. Add 3-8 key skills for better matches.</p>
                )}
              </div>

              <div className="mt-6 space-y-2">
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Skills (comma-separated)</p>
                <input
                  type="text"
                  value={skillsDraft}
                  onChange={(e) => setSkillsDraft(e.target.value)}
                  disabled={!isEditing}
                  placeholder="e.g. React, Node.js, SQL"
                  className="h-11 px-4 rounded-xl border border-primary/10 bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div className="mt-5">
                {isEditing && (
                <Button
                  onClick={handleSaveProfile}
                  className="w-full rounded-full font-bold bg-primary text-white hover:bg-primary/90"
                >
                  Save Profile
                </Button>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StudentProfile;
