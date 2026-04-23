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
  User,
  Mail,
  Lock,
  Users,
  Award,
  Rocket,
  X
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { signUp, validateEmailRoleMatch } from "@/firebase/auth";
import { useAuth } from "@/auth/AuthProvider";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<"student" | "recruiter" | "admin">("student");
  const [isLoading, setIsLoading] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [pendingRole, setPendingRole] = useState<string | null>(null);

  const navigate = useNavigate();
  const { toast } = useToast();
  const { loading: authLoading, role: userRole } = useAuth();

  // Wait for profile to load after signup before navigating
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

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreed) {
      toast({
        title: "Agreement required",
        description: "Please agree to the Terms and Conditions.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      // Validate email domain based on role
      validateEmailRoleMatch(email, role);

      await signUp({ email, password, role, name });
      toast({ title: "Account created!", description: `Welcome to Hireque as ${role}.` });
      // Set pending role and let useEffect handle navigation once profile loads
      setPendingRole(role);
    } catch (err) {
      toast({
        title: "Signup failed",
        description: err instanceof Error ? err.message : "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };



  const roles = [
    { key: "student" as const, label: "Student", icon: <Users className="w-4 h-4" /> },
    { key: "recruiter" as const, label: "Recruiter", icon: <Rocket className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen flex selection:bg-primary selection:text-white bg-background font-sans relative">

      {/* Floating Close Button */}
      <Link to="/" className="absolute top-8 left-8 lg:left-12 w-12 h-12 rounded-full bg-black/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all duration-300 z-50 shadow-xl group">
        <X className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
      </Link>

      {/* Left Side: Stunning Paris Chic Abstract Image */}
      <div className="hidden lg:flex flex-1 relative overflow-hidden flex-col items-center justify-center p-16 sticky top-0 h-screen max-w-[50%] order-2 lg:order-1">
        {/* Extremely elegant dark overlay over a soft high-fashion abstract structural image */}
        <div className="absolute inset-0 bg-primary z-0" />
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1552581234-26160f608093?q=80&w=2670&auto=format&fit=crop')] object-cover opacity-40 mix-blend-overlay z-0" />
        <div className="absolute inset-0 bg-gradient-to-tr from-primary/90 via-primary/40 to-transparent z-0 pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative z-10 text-center max-w-md"
        >
          <h3 className="text-5xl xl:text-6xl font-serif font-extrabold text-white mb-6 leading-[1.05]">
            Accelerate your<br /><span className="italic text-white/50 font-medium">infinite trajectory.</span>
          </h3>
          <p className="text-white/60 text-[18px] font-medium leading-relaxed">
            Connect seamlessly to the world's most impressive roles, or recruit the talent that defines tomorrow.
          </p>
        </motion.div>
      </div>

      {/* Right Side: Form (Harmonious Beige-Green Background) */}
      <div className="flex-1 flex flex-col justify-center items-center py-12 px-6 lg:px-16 xl:px-24 relative order-1 lg:order-2">
        <div className="w-full max-w-[420px] relative z-10">

          <Link to="/" className="flex items-center gap-2 group mb-12">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center transition-transform group-hover:rotate-6 shadow-sm">
              <Zap className="w-5 h-5 text-white fill-current" />
            </div>
            <span className="font-extrabold text-2xl tracking-tighter font-serif text-primary">Hireque</span>
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
          >
            <div className="text-left mb-10">
              <h2 className="text-4xl font-serif font-extrabold tracking-tighter text-primary mb-3">
                Create account
              </h2>
              <p className="text-muted-foreground text-[16px] font-medium leading-relaxed">
                Join the exclusive network today.
              </p>
            </div>

            {/* Minimalist Role Selector */}
            <div className="flex bg-transparent rounded-full gap-2 mb-8 p-1 border border-primary/10">
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
                      layoutId="activeRoleSignupModalChic"
                      className="absolute inset-0 bg-primary shadow-sm rounded-full"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-1.5">{r.icon} {r.label}</span>
                </button>
              ))}
            </div>

            <form onSubmit={handleSignup} className="space-y-6">
              <div className="space-y-5">
                <div className="group flex flex-col gap-2">
                  <Label htmlFor="name" className="text-[14px] font-bold text-primary ml-1">
                    Full Name
                  </Label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary/40 group-focus-within:text-primary transition-colors" />
                    <Input
                      id="name"
                      placeholder="John Doe"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="h-14 pl-[3.25rem] pr-4 rounded-xl border border-primary/20 bg-background hover:bg-white focus:bg-white hover:border-primary/40 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all text-[16px] font-medium shadow-sm"
                    />
                  </div>
                </div>

                <div className="group flex flex-col gap-2">
                  <Label htmlFor="email" className="text-[14px] font-bold text-primary ml-1">
                    Email address
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary/40 group-focus-within:text-primary transition-colors" />
                    <Input
                      id="email"
                      type="email"
                      placeholder={role === "student" ? "name@igdtuw.ac.in" : role === "recruiter" ? "name@company.com" : "name@company.com"}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="h-14 pl-[3.25rem] pr-4 rounded-xl border border-primary/20 bg-background hover:bg-white focus:bg-white hover:border-primary/40 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all text-[16px] font-medium shadow-sm"
                    />
                  </div>
                </div>

                <div className="group flex flex-col gap-2">
                  <Label htmlFor="password" className="text-[14px] font-bold text-primary ml-1">
                    Password
                  </Label>
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

              <div className="flex items-start space-x-3 pt-2">
                <Checkbox
                  id="terms"
                  checked={agreed}
                  onCheckedChange={(checked) => setAgreed(checked as boolean)}
                  className="mt-1 rounded-sm border-primary/30 w-4 h-4 data-[state=checked]:bg-primary data-[state=checked]:border-primary hover:border-primary shadow-none transition-colors"
                />
                <label htmlFor="terms" className="text-[14px] font-medium leading-relaxed text-primary/70 cursor-pointer">
                  I agree to the <Link to="#" className="text-primary font-bold hover:underline underline-offset-4">Terms of Service</Link> and <Link to="#" className="text-primary font-bold hover:underline underline-offset-4">Privacy Policy</Link>.
                </label>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-14 rounded-full text-[16px] font-bold bg-primary text-primary-foreground hover:bg-primary/90 shadow-xl shadow-primary/20 transition-all mt-6 hover:-translate-y-1"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Creating account...
                  </div>
                ) : (
                  "Create Account"
                )}
              </Button>

              <p className="text-center text-[14px] font-medium text-muted-foreground mt-8">
                Already have an account? <Link to="/login" className="text-primary font-bold hover:underline underline-offset-4">Sign In</Link>
              </p>
            </form>
          </motion.div>
        </div>
      </div>

    </div>
  );
};

export default Signup;
