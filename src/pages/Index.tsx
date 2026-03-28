import { motion, useScroll, useTransform } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Zap, 
  Building2, 
  ShieldCheck, 
  ArrowRight, 
  BarChart3, 
  Users, 
  TrendingUp, 
  Star,
  Globe,
  Award,
  CheckCircle,
} from "lucide-react";
import { useRef } from "react";
import { Badge } from "@/components/ui/badge";

const features = [
  {
    icon: Users,
    title: "Smart Eligibility Filter",
    description: "Automated CGPA and skill-based matching. Students never waste time on roles they aren't perfectly qualified for.",
  },
  {
    icon: Zap,
    title: "AI Resume Intelligence",
    description: "Instantly parse, score out of 100, and receive actionable OpenAI feedback on student resumes.",
  },
  {
    icon: ShieldCheck,
    title: "Unified Ecosystem",
    description: "Distinct interfaces for Students to apply, Recruiters to shortlist, and Admins to govern the pipeline.",
  },
];

const stats = [
  { icon: Users, value: "8,500+", label: "Total Students Placed" },
  { icon: Building2, value: "340+", label: "Companies Visiting" },
  { icon: Award, value: "98.4%", label: "Placement Percentage" },
  { icon: BarChart3, value: "₹28 LPA", label: "Highest Package" },
];

const testimonials = [
  { name: "Priya Sharma", role: "SDE @ Google", avatar: "PS", text: "Hireque transformed my placement journey. The AI matching was spot-on!" },
  { name: "Arjun Mehta", role: "DevOps @ Microsoft", avatar: "AM", text: "I landed my dream role within 2 weeks of joining. High velocity indeed." },
  { name: "Dr. Rajan Verma", role: "University Director", avatar: "RV", text: "Managing placement for 5000+ students became a breeze with these analytics." },
];

const fadeUp = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } },
};

const Index = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden selection:bg-primary selection:text-white font-sans">
      {/* Modern Floating Header - Balanced Scale */}
      <motion.nav
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="fixed top-6 left-0 right-0 z-50 flex justify-center pointer-events-none px-6"
      >
        <div className="w-full max-w-5xl bg-white/95 backdrop-blur-md border border-primary/5 shadow-xl rounded-full px-10 py-3 flex items-center justify-between pointer-events-auto">
          <Link to="/" className="flex items-center gap-2 group">
             <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center transition-transform group-hover:rotate-6">
                <Zap className="w-4.5 h-4.5 text-white fill-current" />
             </div>
             <span className="font-extrabold text-xl tracking-tighter text-primary font-serif">Hireque</span>
          </Link>

          <div className="hidden lg:flex items-center gap-10">
            {[
              { name: 'Home', href: '#' },
              { name: 'Network', href: '#stats' },
              { name: 'Solutions', href: '#features' },
              { name: 'Insights', href: '#testimonials' }
            ].map((item) => (
              <a key={item.name} href={item.href} className="text-[14px] font-semibold text-muted-foreground hover:text-primary transition-colors">{item.name}</a>
            ))}
          </div>

          <div className="flex items-center gap-6">
            <Link to="/login" className="text-[14px] font-semibold text-muted-foreground hover:text-primary hidden sm:block">Sign in</Link>
            <Button size="sm" asChild className="rounded-full px-7 h-9 text-[14px] font-bold bg-primary text-white hover:bg-primary/90 transition-all">
              <Link to="/signup">Get Started</Link>
            </Button>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section - Balanced Hierarchy */}
      <section ref={heroRef} className="relative pt-44 pb-24 px-6">
        <div className="container mx-auto max-w-5xl">
          <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-12">
            <div className="flex-[1.2] text-center lg:text-left lg:pr-8">
              <motion.p 
                variants={fadeUp} initial="hidden" animate="visible"
                className="text-[13px] font-bold text-muted-foreground mb-6 flex items-center justify-center lg:justify-start gap-2 uppercase tracking-[0.2em]"
              >
                Intelligent & Ready to Launch <span className="mb-0.5">🚀</span>
              </motion.p>
              
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
                className="text-5xl lg:text-7xl leading-[1.05] mb-8 font-extrabold tracking-tighter text-primary font-serif"
              >
                Enjoy Elite Talent <br />
                for <span className="text-primary/40 italic font-medium">Your</span> <span className="text-primary relative inline-block isolate"><span className="relative z-10">Placement.</span><div className="absolute bottom-1.5 left-0 w-full h-3.5 bg-yellow-400 opacity-50 rounded-full z-0"></div></span>
              </motion.h1>

              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.1 }}
                className="text-[17px] text-muted-foreground max-w-lg mb-10 leading-relaxed mx-auto lg:mx-0 font-medium"
              >
                The world's most sophisticated ecosystem where elite talent meets global opportunity. Automated precision for your trajectory.
              </motion.p>

              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 mb-12">
                <Button size="lg" asChild className="h-14 px-10 bg-primary text-white hover:bg-primary/90 rounded-full text-[16px] font-bold shadow-xl shadow-primary/10">
                  <Link to="/signup">Join Now</Link>
                </Button>
                <Link to="/login" className="flex items-center gap-3 text-[16px] font-bold text-primary hover:gap-4 transition-all group">
                   <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                      <ArrowRight className="w-4 h-4" />
                   </div>
                   Discover How
                </Link>
              </div>

              {/* Trusted Users - Refined Balance */}
              <motion.div variants={fadeUp} initial="hidden" animate="visible" transition={{ delay: 0.3 }} className="flex items-center justify-center lg:justify-start gap-4">
                 <div className="flex -space-x-3.5">
                    {[1,2,3].map(i => (
                      <div key={i} className="w-12 h-12 rounded-full border-2 border-background bg-secondary overflow-hidden shadow-sm">
                        <img src={`https://i.pravatar.cc/150?u=${i+30}`} alt="User" className="w-full h-full object-cover opacity-90 sepia-[.2]" />
                      </div>
                    ))}
                 </div>
                 <div className="text-left">
                    <p className="text-[15px] font-bold text-primary tracking-tight">Trusted by over</p>
                    <p className="text-[13px] text-muted-foreground font-medium">15k+ Elite Talents</p>
                 </div>
              </motion.div>
            </div>

            {/* Visual Side - Balanced Proportions */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="flex-1 relative hidden lg:block"
            >
              <div className="relative w-full aspect-square max-w-md ml-auto">
                <div className="absolute inset-0 bg-white border border-primary/5 shadow-2xl rounded-[3rem] p-10 flex flex-col justify-center">
                   <div className="flex items-center justify-between mb-10">
                      <div className="flex items-center gap-4">
                         <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center text-primary shadow-sm border border-primary/5"><CheckCircle className="w-6 h-6" /></div>
                         <div>
                            <p className="font-bold text-base text-primary">Elite Profile</p>
                            <p className="text-[11px] text-muted-foreground font-bold tracking-widest uppercase">Pipeline Active</p>
                         </div>
                      </div>
                      <Badge className="bg-secondary text-primary border-none px-4 py-1 font-bold text-[11px]">98.4% Match</Badge>
                   </div>
                   
                   <div className="space-y-6 mb-10">
                      {[1,2,3].map(i => (
                        <div key={i} className="space-y-2">
                           <div className="flex justify-between text-[11px] font-bold text-muted-foreground uppercase tracking-widest">
                              <span>Metric {i}</span>
                              <span>{i*25}%</span>
                           </div>
                           <div className="h-2.5 bg-secondary rounded-full w-full overflow-hidden">
                              <motion.div initial={{ width: 0 }} whileInView={{ width: `${i*25}%` }} className="h-full bg-primary rounded-full" transition={{ duration: 1, delay: i*0.1 }} />
                           </div>
                        </div>
                      ))}
                   </div>

                   <div className="p-5 bg-secondary rounded-3xl border border-primary/5 flex items-center gap-5">
                      <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center text-white"><TrendingUp className="w-6 h-6" /></div>
                      <div>
                         <p className="text-2xl font-extrabold tracking-tighter text-primary">₹28 LPA</p>
                         <p className="text-[11px] text-muted-foreground font-bold uppercase tracking-widest">Top Placement</p>
                      </div>
                   </div>
                </div>

                <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 4, repeat: Infinity }} className="absolute -top-6 -right-6 bg-white py-2 px-6 rounded-full shadow-xl border border-primary/5 text-[12px] font-bold flex items-center gap-2 text-primary">
                   <span className="w-2 h-2 rounded-full bg-primary/40" /> Active status
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Elegant Infinite Marquee / Global Partners */}
      <section className="py-10 border-y border-primary/5 bg-secondary/50 overflow-hidden flex items-center">
         <div className="container mx-auto px-6 flex justify-between items-center gap-12 opacity-60 grayscale hover:grayscale-0 transition-all duration-700 overflow-x-auto no-scrollbar">
             <div className="flex items-center gap-3 text-xl font-serif font-bold text-primary min-w-max"><Building2 className="w-6 h-6" /> Vertex</div>
             <div className="flex items-center gap-3 text-xl font-serif font-bold text-primary min-w-max"><Award className="w-6 h-6" /> Pinnacle</div>
             <div className="flex items-center gap-3 text-xl font-serif font-bold text-primary min-w-max"><Globe className="w-6 h-6" /> Nexus</div>
             <div className="flex items-center gap-3 text-xl font-serif font-bold text-primary min-w-max"><TrendingUp className="w-6 h-6" /> Apex Global</div>
             <div className="flex items-center gap-3 text-xl font-serif font-bold text-primary min-w-max hidden md:flex"><ShieldCheck className="w-6 h-6" /> Nova Corp</div>
         </div>
      </section>
      {/* Stats Row - Unified */}
      <section id="stats" className="py-16 bg-white border-y border-primary/5">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-12">
            {stats.map((stat, i) => (
              <motion.div key={stat.label} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ delay: i * 0.1 }} viewport={{ once: true }} className="text-center">
                <p className="text-4xl font-extrabold font-serif tracking-tighter mb-2 text-primary">{stat.value}</p>
                <p className="text-[11px] text-muted-foreground font-bold uppercase tracking-[0.2em]">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section - Equivalent Scale */}
      <section id="features" className="py-20 px-6">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-primary text-white px-4 py-1 rounded-full text-[11px] font-bold uppercase tracking-widest" variant="default">Expertise</Badge>
            <h2 className="text-4xl lg:text-5xl font-extrabold tracking-tighter mb-4 text-primary font-serif">Engineered for Velocity</h2>
            <p className="text-muted-foreground text-base font-medium">Institutional-grade performance redesigned for the modern placement cycle.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((f, i) => (
              <motion.div key={f.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} viewport={{ once: true }} className="bg-white rounded-[2rem] p-10 border border-primary/5 hover:shadow-2xl transition-all group">
                <div className="w-14 h-14 rounded-2xl bg-secondary border border-primary/5 flex items-center justify-center mb-8 group-hover:bg-primary group-hover:text-white transition-all shadow-sm text-primary">
                  <f.icon className="w-7 h-7" />
                </div>
                <h3 className="text-2xl font-bold mb-4 tracking-tight text-primary font-serif">{f.title}</h3>
                <p className="text-muted-foreground text-[15px] leading-relaxed mb-8 font-medium">{f.description}</p>
                <Link to="/signup" className="inline-flex items-center gap-2 text-[12px] font-bold uppercase tracking-widest text-primary hover:gap-3 transition-all">
                   Explore <ArrowRight className="w-4 h-4" />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works / The Process - Deeply Chic & Minimalist */}
      <section id="process" className="py-24 px-6 border-t border-primary/5 bg-secondary/30 relative">
        <div className="container mx-auto max-w-5xl">
          <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 items-start">
             <div className="flex-1 lg:sticky lg:top-32">
                <Badge className="mb-6 bg-primary/10 text-primary border-none px-4 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-widest hover:bg-primary/20 transition-colors">End-to-End Workflow</Badge>
                <h2 className="text-4xl lg:text-6xl font-extrabold tracking-tighter mb-8 text-primary font-serif leading-[1.05]">The Architecture<br />of Placement.</h2>
                <p className="text-muted-foreground text-[17px] font-medium leading-relaxed max-w-sm">From initial student registration to the final offer letter, experience a remarkably intelligent, frictionless recruitment ecosystem.</p>
             </div>
             
             <div className="flex-[1.2] flex flex-col gap-12 lg:gap-16">
                {[
                  {
                    num: "01",
                    title: "Student Profiling & Auth",
                    desc: "Students sign up and fill comprehensive profiles. Resumes are algorithmically parsed for skills, and university admins strictly verify eligibility."
                  },
                  {
                    num: "02",
                    title: "Company Jobs & Smart Filters",
                    desc: "Companies post exact job requirements. The system instantly applies smart CGPA/branch filters, so recruiters only review perfectly matching candidates."
                  },
                  {
                    num: "03",
                    title: "Interviews & Final Results",
                    desc: "Recruiters seamlessly shortlist applicants. Interview invitations trigger automated emails, leading straight to definitive selections."
                  }
                ].map((step, i) => (
                   <motion.div key={step.num} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.15 }} viewport={{ once: true }} className="relative pl-10 md:pl-0">
                      <div className="md:hidden absolute left-0 top-0 text-3xl font-serif text-primary/20 font-bold">{step.num}</div>
                      <div className="flex flex-col md:flex-row gap-6 md:gap-12 items-start group">
                         <div className="hidden md:block text-5xl lg:text-7xl font-serif font-extrabold text-primary/10 group-hover:text-primary/30 transition-colors tracking-tighter leading-none mt-1">
                            {step.num}
                         </div>
                         <div>
                            <h3 className="text-2xl lg:text-3xl font-bold mb-4 tracking-tight text-primary font-serif">{step.title}</h3>
                            <p className="text-muted-foreground text-[16px] leading-relaxed font-medium">{step.desc}</p>
                         </div>
                      </div>
                      {/* Elegant subtle divider */}
                      {i !== 2 && <div className="mt-12 h-px w-full bg-gradient-to-r from-primary/10 to-transparent" />}
                   </motion.div>
                ))}
             </div>
          </div>
        </div>
      </section>

      {/* Testimonials - No Box Background */}
      <section id="testimonials" className="py-16 px-6 mb-8">
        <div className="container mx-auto max-w-5xl">
           <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tighter mb-4 text-primary font-serif">Trusted by Achievers</h2>
              <p className="text-muted-foreground text-sm font-medium">Hear from elite talent across our network.</p>
           </div>
           <div className="grid md:grid-cols-3 gap-6">
             {testimonials.map((t, i) => (
               <motion.div key={t.name} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} viewport={{ once: true }} className="bg-white rounded-3xl p-7 flex flex-col h-full hover:shadow-xl transition-all shadow-md">
                 <div className="flex gap-1 mb-4">
                   {[...Array(5)].map((_, i) => <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />)}
                 </div>
                 <p className="text-primary/70 text-sm mb-6 leading-relaxed flex-1 font-medium italic">"{t.text}"</p>
                 <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-secondary text-primary flex items-center justify-center font-bold text-[11px] border border-primary/5">{t.avatar}</div>
                    <div>
                       <p className="font-bold text-[13px] text-primary">{t.name}</p>
                       <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">{t.role}</p>
                    </div>
                 </div>
               </motion.div>
             ))}
           </div>
        </div>
      </section>

      {/* Simple Minimalist Footer */}
      <footer className="py-12 px-6 bg-background">
        <div className="container mx-auto max-w-5xl flex flex-col md:flex-row items-center justify-between gap-8 border-t border-primary/10 pt-12">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-primary fill-current" />
            <span className="font-bold font-serif text-xl tracking-tighter text-primary">Hireque</span>
          </div>
          
          <div className="flex gap-8">
             {['Privacy', 'Network', 'Support'].map(i => (
               <Link key={i} to="#" className="text-[13px] font-bold text-muted-foreground hover:text-primary transition-colors">{i}</Link>
             ))}
          </div>

          <p className="text-[12px] text-muted-foreground font-medium uppercase tracking-widest">© 2026 Hireque.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
