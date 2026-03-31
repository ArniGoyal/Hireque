import { useState } from "react";
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
import { ensureUserProfile, signIn, signInWithGoogle } from "@/firebase/auth";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<"student" | "recruiter" | "admin">("student");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const { uid, email: signedInEmail } = await signIn({ email, password });
      await ensureUserProfile({
        uid,
        email: signedInEmail,
        role,
        name: signedInEmail.includes("@") ? signedInEmail.split("@")[0] : "User",
      });
      toast({ title: "Welcome back!", description: `Signed in as ${role}.` });
      navigate(`/dashboard/${role}`);
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

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      await signInWithGoogle({ role });
      toast({ title: "Welcome!", description: `Signed in with Google as ${role}.` });
      navigate(`/dashboard/${role}`);
    } catch (err) {
      toast({
        title: "Google sign-in failed",
        description: err instanceof Error ? err.message : "Please try again.",
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
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-full text-[13px] font-bold transition-all duration-300 relative ${
                      role === r.key
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
                        placeholder="name@university.edu"
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

                <div className="relative my-8">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-primary/10" />
                  </div>
                  <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-[0.2em]">
                    <span className="bg-background px-4 text-primary/50">Or continue with</span>
                  </div>
                </div>

                <Button
                  variant="outline"
                  type="button"
                  onClick={handleGoogleLogin}
                  disabled={isLoading}
                  className="h-14 rounded-full border-primary/20 hover:border-primary hover:bg-transparent w-full font-bold text-[15px] text-primary shadow-sm bg-transparent transition-colors"
                >
                  <svg className="mr-3 h-5 w-5" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                  </svg>
                  Google
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
