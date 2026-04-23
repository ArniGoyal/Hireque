import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Zap,
  Eye,
  EyeOff,
  Mail,
  Lock,
  Award,
  Users,
  Briefcase,
  X
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ensureUserProfile, signIn, validateEmailRoleMatch } from "@/firebase/auth";
import { useAuth } from "@/auth/AuthProvider";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<"student" | "recruiter" | "admin">("student");
  const [isLoading, setIsLoading] = useState(false);
  const [pendingRole, setPendingRole] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { loading: authLoading, role: userRole } = useAuth();

  // Wait for profile to load after login before navigating
  useEffect(() => {
    if (!pendingRole) return;

    // Navigate if:
    // 1. Role matches (profile loaded successfully), OR
    // 2. We have a role and loading is complete (timeout reached)
    if (userRole === pendingRole || (!authLoading && userRole)) {
      console.log("Navigating to dashboard:", pendingRole);
      navigate(`/dashboard/${pendingRole}`);
      setPendingRole(null);
    }
  }, [authLoading, userRole, pendingRole, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // Add validation before signing in
      validateEmailRoleMatch(email, role);

      const { uid, email: signedInEmail } = await signIn({ email, password });
      await ensureUserProfile({
        uid,
        email: signedInEmail,
        role,
        name: signedInEmail.includes("@") ? signedInEmail.split("@")[0] : "User",
      });
      toast({ title: "Welcome back!", description: `Signed in as ${role}.` });
      // Set pending role and let useEffect handle navigation once profile loads
      setPendingRole(role);
    } catch (err) {
      toast({
        title: "Login failed",
        description: err instanceof Error ? err.message : "Please check your credentials.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };


  const handleForgotPassword = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!email) {
      toast({
        title: "Email required",
        description: "Please enter your email address first.",
        variant: "destructive"
      });
      return;
    }
    toast({
      title: "Reset link sent",
      description: `A password reset link has been sent to ${email}.`,
    });
  };

  const roles = [
    { key: "student" as const, label: "Student", icon: <Users className="w-4 h-4" /> },
    { key: "recruiter" as const, label: "Recruiter", icon: <Briefcase className="w-4 h-4" /> },
    { key: "admin" as const, label: "Admin", icon: <Award className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen flex selection:bg-primary selection:text-white bg-background font-sans relative">

      {/* Floating Close Button */}
      <Link to="/" className="absolute top-8 right-8 lg:right-12 w-12 h-12 rounded-full bg-black/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all duration-300 z-50 shadow-xl group">
        <X className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
      </Link>

      {/* Left Side: Form (Harmonious Beige-Green Background) */}
      <div className="flex-1 flex flex-col justify-center items-center py-12 px-6 lg:px-16 xl:px-24 relative">
        <div className="w-full max-w-[420px] relative z-10">

          <Link to="/" className="flex items-center gap-2 group mb-16">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center transition-transform group-hover:-rotate-6 shadow-sm">
              <Zap className="w-5 h-5 text-white fill-current" />
            </div>
            <span className="font-extrabold text-2xl tracking-tighter font-serif text-primary">Hireque</span>
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
          >
            <div className="text-left mb-12">
              <h2 className="text-4xl font-serif font-extrabold tracking-tighter text-primary mb-3">
                Welcome back
              </h2>
              <p className="text-muted-foreground text-[16px] font-medium leading-relaxed">
                Enter your credentials to access your dashboard.
              </p>
            </div>

            {/* Minimalist Role Selector */}
            <div className="flex bg-transparent rounded-full gap-2 mb-10 p-1 border border-primary/10">
              {roles.map((r) => (
                <button
                  key={r.key}
                  onClick={() => setRole(r.key)}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-full text-[13px] font-bold transition-all duration-300 relative ${role === r.key
                      ? "text-primary-foreground"
                      : "text-muted-foreground hover:text-primary"
                    }`}
                >
                  {role === r.key && (
                    <motion.div
                      layoutId="activeRoleLoginModalChic"
                      className="absolute inset-0 bg-primary shadow-sm rounded-full"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-1.5">{r.icon} {r.label}</span>
                </button>
              ))}
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-5">
                <div className="group flex flex-col gap-2">
                  <Label htmlFor="email" className="text-[14px] font-bold text-primary ml-1">
                    Email address
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary/40 group-focus-within:text-primary transition-colors" />
                    <Input
                      id="email"
                      type="email"
                      placeholder={role === "student" ? "name@igdtuw.ac.in" : role === "recruiter" ? "name@company.com" : "name@university.edu"}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="h-14 pl-[3.25rem] pr-4 rounded-xl border border-primary/20 bg-background hover:bg-white focus:bg-white hover:border-primary/40 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all text-[16px] font-medium shadow-sm"
                    />
                  </div>
                </div>

                <div className="group flex flex-col gap-2">
                  <div className="flex justify-between items-center ml-1 mr-1">
                    <Label htmlFor="password" className="text-[14px] font-bold text-primary">
                      Password
                    </Label>
                    <button
                      type="button"
                      onClick={handleForgotPassword}
                      className="text-[13px] font-bold text-primary/70 hover:text-primary transition-colors underline-offset-4 hover:underline"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary/40 group-focus-within:text-primary transition-colors" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="h-14 pl-[3.25rem] pr-12 rounded-xl border border-primary/20 bg-background hover:bg-white focus:bg-white hover:border-primary/40 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all text-[16px] font-medium shadow-sm"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-primary/40 hover:text-primary transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-3 pt-2">
                <Checkbox id="remember" className="rounded-sm border-primary/30 w-4 h-4 data-[state=checked]:bg-primary data-[state=checked]:border-primary" />
                <label htmlFor="remember" className="text-[14px] font-medium leading-none cursor-pointer text-primary/70">
                  Keep me signed in for 30 days
                </label>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-14 rounded-full text-[16px] font-bold bg-primary text-primary-foreground hover:bg-primary/90 shadow-xl shadow-primary/20 transition-all mt-4 hover:-translate-y-1"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Authenticating...
                  </div>
                ) : (
                  "Sign In"
                )}
              </Button>

              <p className="text-center text-[14px] font-medium text-muted-foreground mt-8">
                Don't have an account? <Link to="/signup" className="text-primary font-bold hover:underline underline-offset-4">Join Hireque</Link>
              </p>
            </form>
          </motion.div>
        </div>
      </div>

      {/* Right Side: Stunning Paris Chic Abstract Image */}
      <div className="hidden lg:flex flex-1 relative overflow-hidden flex-col items-center justify-center p-16 sticky top-0 h-screen max-w-[50%]">
        {/* Extremely elegant dark overlay over a soft high-fashion abstract structural image */}
        <div className="absolute inset-0 bg-primary z-0" />
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1541888049-74d6426a8d62?q=80&w=2670&auto=format&fit=crop')] object-cover opacity-40 mix-blend-overlay z-0" />
        <div className="absolute inset-0 bg-gradient-to-tr from-primary/90 via-primary/40 to-transparent z-0 pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative z-10 text-center max-w-md"
        >
          <h3 className="text-5xl xl:text-6xl font-serif font-extrabold text-white mb-6 leading-[1.05]">
            Welcome back<br /><span className="italic text-white/50 font-medium">to the exceptional.</span>
          </h3>
          <p className="text-white/60 text-[18px] font-medium leading-relaxed">
            Connect seamlessly to the world's most impressive roles, or recruit the talent that defines tomorrow.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
