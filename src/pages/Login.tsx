import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GraduationCap, Eye, EyeOff, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<"student" | "recruiter" | "admin">("student");
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    toast({ title: "Logged in!", description: `Welcome back as ${role}.` });
    navigate(`/dashboard/${role}`);
  };

  const roles = [
    { key: "student" as const, label: "Student", emoji: "👨‍🎓" },
    { key: "recruiter" as const, label: "Recruiter", emoji: "🏢" },
    { key: "admin" as const, label: "Admin", emoji: "👩‍💼" },
  ];

  return (
    <div className="min-h-screen flex">
      {/* Left panel — branding */}
      <motion.div
        initial={{ x: -40, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="hidden lg:flex flex-col justify-between w-[45%] bg-primary text-primary-foreground p-12 relative overflow-hidden"
      >
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{ backgroundImage: "radial-gradient(circle at 30% 70%, hsl(38 72% 54% / 0.4), transparent 50%)" }} />
        </div>
        <div className="relative z-10">
          <Link to="/" className="flex items-center gap-2.5 mb-20">
            <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-accent-foreground" />
            </div>
            <span className="text-xl font-serif font-bold">PlaceHub</span>
          </Link>
          <h1 className="text-4xl font-serif font-bold leading-tight mb-4">
            Welcome back to<br />
            <span className="text-gradient-gold">your future.</span>
          </h1>
          <p className="text-primary-foreground/60 text-lg max-w-sm leading-relaxed">
            Continue your journey towards the perfect placement.
          </p>
        </div>
        <div className="relative z-10 flex items-center gap-2 text-primary-foreground/40 text-sm">
          <Sparkles className="w-4 h-4" />
          <span>Trusted by 5,200+ students</span>
        </div>
      </motion.div>

      {/* Right panel — form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="flex-1 flex items-center justify-center p-6 bg-background"
      >
        <div className="w-full max-w-md">
          <Link to="/" className="flex items-center justify-center gap-2 mb-8 lg:hidden">
            <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-lg font-serif font-bold text-foreground">PlaceHub</span>
          </Link>

          <div className="text-center mb-8">
            <h2 className="text-3xl font-serif font-bold text-foreground mb-2">Welcome back</h2>
            <p className="text-muted-foreground">Sign in to your account</p>
          </div>

          {/* Role selector */}
          <div className="grid grid-cols-3 gap-2 mb-8">
            {roles.map((r) => (
              <motion.button
                key={r.key}
                whileTap={{ scale: 0.97 }}
                onClick={() => setRole(r.key)}
                className={`py-3 px-3 rounded-xl border-2 text-sm font-medium transition-all duration-300 ${
                  role === r.key
                    ? "bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/20"
                    : "bg-card text-muted-foreground border-border hover:border-primary/30"
                }`}
              >
                <span className="block text-lg mb-0.5">{r.emoji}</span>
                {r.label}
              </motion.button>
            ))}
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@university.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-12 rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-12 rounded-xl"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <Button type="submit" className="w-full h-12 rounded-xl text-base font-semibold shadow-lg shadow-primary/20">
              Sign In
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-8">
            Don't have an account?{" "}
            <Link to="/signup" className="text-accent font-semibold hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
