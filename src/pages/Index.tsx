import { motion, useScroll, useTransform } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { GraduationCap, Building2, ShieldCheck, ArrowRight, BarChart3, Users, Briefcase, TrendingUp, Sparkles, Star } from "lucide-react";
import { useRef } from "react";

const features = [
  {
    icon: GraduationCap,
    title: "Student Portal",
    description: "Build your profile, upload resume, browse & apply to top companies, and track your applications.",
    accent: "from-accent/20 to-accent/5",
  },
  {
    icon: Building2,
    title: "Recruiter Hub",
    description: "Post openings, set eligibility criteria, shortlist candidates, and schedule interviews seamlessly.",
    accent: "from-primary/20 to-primary/5",
  },
  {
    icon: ShieldCheck,
    title: "Admin Control",
    description: "Full oversight — manage students, companies, postings, and view real-time placement analytics.",
    accent: "from-info/20 to-info/5",
  },
];

const stats = [
  { icon: Users, value: "5,200+", label: "Students Registered" },
  { icon: Briefcase, value: "340+", label: "Companies Partnered" },
  { icon: TrendingUp, value: "92%", label: "Placement Rate" },
  { icon: BarChart3, value: "₹18 LPA", label: "Avg Package" },
];

const testimonials = [
  { name: "Priya Sharma", role: "CSE '25 — Placed at Google", text: "PlaceHub made my placement journey incredibly smooth. I got 3 offers within a month!" },
  { name: "Arjun Mehta", role: "IT '25 — Placed at Microsoft", text: "The application tracking and interview scheduling features saved me so much time." },
  { name: "Dr. Rajan Verma", role: "Placement Director", text: "Managing 5000+ students across companies has never been this effortless." },
];

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const } },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const } },
};

const Index = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Navbar */}
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="fixed top-0 left-0 right-0 z-50 glass"
      >
        <div className="container mx-auto flex items-center justify-between h-16 px-4">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-lg font-serif font-bold text-foreground tracking-tight">PlaceHub</span>
          </Link>
          <div className="flex items-center gap-3">
            <Button variant="ghost" asChild className="font-medium">
              <Link to="/login">Log in</Link>
            </Button>
            <Button asChild className="bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20">
              <Link to="/signup">Get Started</Link>
            </Button>
          </div>
        </div>
      </motion.nav>

      {/* Hero */}
      <section ref={heroRef} className="relative pt-28 pb-24 px-4 overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
            className="absolute -top-40 -right-40 w-96 h-96 rounded-full border border-accent/10"
          />
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 70, repeat: Infinity, ease: "linear" }}
            className="absolute -bottom-20 -left-20 w-72 h-72 rounded-full border border-primary/10"
          />
          <motion.div
            className="absolute top-32 right-20 text-accent/30"
            animate={{ y: [-5, 5, -5] }}
            transition={{ duration: 4, repeat: Infinity }}
          >
            <Star className="w-6 h-6" />
          </motion.div>
          <motion.div
            className="absolute top-48 left-16 text-primary/20"
            animate={{ y: [5, -5, 5] }}
            transition={{ duration: 5, repeat: Infinity }}
          >
            <Sparkles className="w-8 h-8" />
          </motion.div>
        </div>

        <motion.div
          style={{ y: heroY, opacity: heroOpacity }}
          className="container mx-auto text-center max-w-3xl relative z-10"
        >
          <motion.div
            variants={container}
            initial="hidden"
            animate="visible"
          >
            <motion.span
              variants={fadeUp}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/10 text-accent text-sm font-semibold mb-8 border border-accent/20"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Campus Placement Platform
            </motion.span>
            <motion.h1
              variants={fadeUp}
              className="text-5xl md:text-7xl font-serif font-bold text-foreground leading-[1.1] mb-6 tracking-tight"
            >
              Your Gateway to{" "}
              <span className="text-gradient-gold italic">
                Dream Placements
              </span>
            </motion.h1>
            <motion.p
              variants={fadeUp}
              className="text-lg text-muted-foreground max-w-xl mx-auto mb-10 leading-relaxed"
            >
              Connecting students, recruiters, and placement cells on one seamless platform. Apply, hire, and manage — all in one place.
            </motion.p>
            <motion.div variants={fadeUp} className="flex items-center justify-center gap-4">
              <Button size="lg" asChild className="px-8 bg-primary hover:bg-primary/90 shadow-xl shadow-primary/20 text-base">
                <Link to="/signup">
                  Start Now <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="px-8 text-base border-2">
                <Link to="/login">Explore Dashboard</Link>
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* Stats */}
      <section className="py-16 border-y bg-primary text-primary-foreground relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{ backgroundImage: "radial-gradient(circle at 20% 50%, hsl(38 72% 54% / 0.3), transparent 50%)" }} />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {stats.map((stat) => (
              <motion.div
                key={stat.label}
                variants={scaleIn}
                className="text-center"
              >
                <stat.icon className="w-7 h-7 text-accent mx-auto mb-3" />
                <p className="text-4xl font-serif font-bold mb-1">{stat.value}</p>
                <p className="text-sm text-primary-foreground/70">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-4">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <span className="text-sm font-semibold text-accent uppercase tracking-widest mb-3 block">Features</span>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-4">Built for Every Stakeholder</h2>
            <p className="text-muted-foreground max-w-lg mx-auto text-lg">
              Whether you're a student, recruiter, or admin — PlaceHub has you covered.
            </p>
          </motion.div>
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto"
          >
            {features.map((f) => (
              <motion.div
                key={f.title}
                variants={fadeUp}
                whileHover={{ y: -6, transition: { duration: 0.3 } }}
                className="bg-card rounded-2xl p-8 border shadow-sm hover:shadow-xl transition-shadow duration-500 group relative overflow-hidden"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${f.accent} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                <div className="relative z-10">
                  <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/15 transition-colors">
                    <f.icon className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="text-xl font-serif font-bold text-foreground mb-3">{f.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{f.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-4 bg-muted/50">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <span className="text-sm font-semibold text-accent uppercase tracking-widest mb-3 block">Testimonials</span>
            <h2 className="text-4xl font-serif font-bold text-foreground">Loved by Thousands</h2>
          </motion.div>
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto"
          >
            {testimonials.map((t) => (
              <motion.div
                key={t.name}
                variants={fadeUp}
                whileHover={{ y: -4 }}
                className="bg-card rounded-2xl p-8 border shadow-sm"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-accent text-accent" />
                  ))}
                </div>
                <p className="text-foreground mb-6 leading-relaxed italic">"{t.text}"</p>
                <div>
                  <p className="font-semibold text-foreground text-sm">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="max-w-3xl mx-auto text-center bg-primary text-primary-foreground rounded-3xl p-12 md:p-16 relative overflow-hidden"
          >
            <div className="absolute inset-0 opacity-20">
              <div className="absolute inset-0" style={{ backgroundImage: "radial-gradient(circle at 80% 20%, hsl(38 72% 54% / 0.5), transparent 50%)" }} />
            </div>
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">Ready to Get Placed?</h2>
              <p className="text-primary-foreground/70 mb-8 text-lg max-w-md mx-auto">
                Join thousands of students who found their dream careers through PlaceHub.
              </p>
              <Button size="lg" variant="secondary" asChild className="px-10 text-base font-semibold shadow-xl">
                <Link to="/signup">
                  Create Free Account <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-10 px-4 bg-card">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <GraduationCap className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-serif font-bold text-foreground">PlaceHub</span>
          </div>
          <p className="text-sm text-muted-foreground">© 2026 PlaceHub. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
