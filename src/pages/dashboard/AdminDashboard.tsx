import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend
} from "recharts";
import {
  collection,
  doc,
  getDocs,
  increment,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
  type DocumentData,
} from "firebase/firestore";
import { listAllStudents, listAllRecruiters, verifyUser } from "@/firebase/users";
import { listAllJobs, createJobPosting } from "@/firebase/jobs";
import type { UserProfileDoc } from "@/types/user";
import type { JobDoc } from "@/firebase/jobs";
import { useAuth } from "@/auth/AuthProvider";

// ─── DATA ────────────────────────────────────────────────────────────────────

const initialCompanies = [
  { id: 1, name: "Google", sector: "Tech", package: 32, openRoles: 3, status: "Verified", joined: "2024-01-10" },
  { id: 2, name: "Microsoft", sector: "Tech", package: 28, openRoles: 5, status: "Verified", joined: "2024-01-15" },
  { id: 3, name: "Deloitte", sector: "Consulting", package: 14, openRoles: 8, status: "Verified", joined: "2024-02-01" },
  { id: 4, name: "Infosys", sector: "IT Services", package: 8, openRoles: 20, status: "Verified", joined: "2024-02-10" },
  { id: 5, name: "Zomato", sector: "Startup", package: 18, openRoles: 2, status: "Pending", joined: "2024-03-05" },
  { id: 6, name: "KPMG", sector: "Consulting", package: 12, openRoles: 6, status: "Pending", joined: "2024-03-20" },
];

const initialStudents = [
  { id: 101, name: "Priya Sharma", branch: "CSE", cgpa: 9.2, status: "Placed", company: "Google", package: 32 },
  { id: 102, name: "Arjun Mehta", branch: "IT", cgpa: 8.8, status: "Placed", company: "Microsoft", package: 28 },
  { id: 103, name: "Sneha Reddy", branch: "CSE", cgpa: 9.5, status: "Placed", company: "Deloitte", package: 14 },
  { id: 104, name: "Karan Singh", branch: "ECE", cgpa: 8.6, status: "Unplaced", company: "-", package: 0 },
  { id: 105, name: "Ananya Gupta", branch: "IT", cgpa: 9.1, status: "Placed", company: "Zomato", package: 18 },
  { id: 106, name: "Ishaan Malhotra", branch: "CSE", cgpa: 8.4, status: "Pending", company: "-", package: 0 },
  { id: 107, name: "Riya Verma", branch: "MAE", cgpa: 8.9, status: "Placed", company: "Infosys", package: 8 },
  { id: 108, name: "Sahil Kapoor", branch: "IT", cgpa: 8.2, status: "Unplaced", company: "-", package: 0 },
  { id: 109, name: "Mehak Jain", branch: "CSE", cgpa: 9.7, status: "Placed", company: "Google", package: 32 },
  { id: 110, name: "Vikram Das", branch: "ECE", cgpa: 8.7, status: "Pending", company: "-", package: 0 },
];

const initialJobs = [
  { id: 1, role: "SDE Intern", company: "Google", type: "Internship", package: 32, status: "Active", applicants: 48, posted: "2024-03-01" },
  { id: 2, role: "Data Analyst", company: "Microsoft", type: "Full-time", package: 28, status: "Active", applicants: 32, posted: "2024-03-05" },
  { id: 3, role: "Business Analyst", company: "Deloitte", type: "Full-time", package: 14, status: "Closed", applicants: 67, posted: "2024-02-15" },
  { id: 4, role: "Systems Engineer", company: "Infosys", type: "Full-time", package: 8, status: "Active", applicants: 120, posted: "2024-03-10" },
  { id: 5, role: "Product Manager", company: "Zomato", type: "Full-time", package: 18, status: "Paused", applicants: 22, posted: "2024-03-18" },
];

const trendData = [
  { month: "Aug", placed: 5, target: 20 }, { month: "Sep", placed: 18, target: 40 },
  { month: "Oct", placed: 34, target: 60 }, { month: "Nov", placed: 52, target: 80 },
  { month: "Dec", placed: 71, target: 100 }, { month: "Jan", placed: 89, target: 120 },
  { month: "Feb", placed: 112, target: 140 }, { month: "Mar", placed: 134, target: 160 },
];

const pkgData = [
  { range: "<8 LPA", count: 12 }, { range: "8–12", count: 28 },
  { range: "12–20", count: 19 }, { range: "20–30", count: 8 }, { range: ">30", count: 4 },
];

const branchData = [
  { name: "CSE", value: 42 }, { name: "IT", value: 28 },
  { name: "ECE", value: 16 }, { name: "MAE", value: 8 }, { name: "Other", value: 6 },
];

const PIE_COLORS = ["#1f3d2b", "#06b6d4", "#f59e0b", "#2e7d5b", "#f43f5e"];

const INITIAL_NOTIFS = [
  { id: 1, icon: "🏢", text: "Zomato registered as new company", time: "2m ago", unread: true },
  { id: 2, icon: "👤", text: "2 students pending verification", time: "15m ago", unread: true },
  { id: 3, icon: "📋", text: "Google posted a new job role", time: "1h ago", unread: false },
  { id: 4, icon: "✅", text: "KPMG verification approved", time: "3h ago", unread: false },
];

// ─── SVG ICON ────────────────────────────────────────────────────────────────

const Ic = ({ d, size = 18, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);

const ic = {
  analytics: "M18 20V10 M12 20V4 M6 20v-6",
  companies: "M3 9h18v10a2 2 0 01-2 2H5a2 2 0 01-2-2V9z M8 9V5a2 2 0 012-2h4a2 2 0 012 2v4",
  students: "M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2 M9 7a4 4 0 100 8 4 4 0 000-8 M23 21v-2a4 4 0 00-3-3.87 M16 3.13a4 4 0 010 7.75",
  jobs: "M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",
  bell: "M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9 M13.73 21a2 2 0 01-3.46 0",
  plus: "M12 5v14M5 12h14",
  trash: "M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6",
  check: "M20 6L9 17l-5-5",
  xmark: "M18 6L6 18M6 6l12 12",
  search: "M21 21l-4.35-4.35M17 11A6 6 0 105 11a6 6 0 0012 0",
  shield: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
  trending: "M23 6l-9.5 9.5-5-5L1 18",
  users: "M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8M23 21v-2a3 3 0 00-5-2.239M16 3.13a4 4 0 010 7.75",
  box: "M12 2l10 6.5v7L12 22 2 15.5v-7L12 2zM12 22V9M2 8.5l10 6.5 10-6.5",
  pause: "M10 4H6v16h4V4zM18 4h-4v16h4V4z",
  settings: "M12 15a3 3 0 100-6 3 3 0 000 6zM19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z",
  logout: "M17 16l4-4-4-4M21 12H9M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4",
  user: "M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8",
};

// ─── SMALL COMPONENTS ────────────────────────────────────────────────────────

const Badge = ({ children, color = "gray" }) => {
  const m = {
    green:  { bg: "#dce7de", tx: "#1f5c45" },
    red:    { bg: "#fee2e2", tx: "#991b1b" },
    amber:  { bg: "#fef3c7", tx: "#92400e" },
    blue:   { bg: "#dbeafe", tx: "#1e40af" },
    gray:   { bg: "#f3f4f6", tx: "#374151" },
    purple: { bg: "#ede9fe", tx: "#5b21b6" },
  };
  const c = m[color] || m.gray;
  return <span style={{ background: c.bg, color: c.tx, fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 100, whiteSpace: "nowrap" }}>{children}</span>;
};

const StatCard = ({ label, value, sub, icon, accent }) => (
  <div style={{ background: "#f5f7f5", borderRadius: 20, padding: "1.4rem 1.6rem", border: "1px solid #dcdedc", display: "flex", flexDirection: "column", gap: 14, boxShadow: "0 2px 12px rgba(0,0,0,0.04)", position: "relative", overflow: "hidden" }}>
    <div style={{ position: "absolute", top: 0, right: 0, width: 90, height: 90, background: accent + "12", borderRadius: "0 20px 0 100%" }} />
    <div style={{ width: 44, height: 44, borderRadius: 14, background: accent + "18", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1 }}>
      <Ic d={icon} size={20} color={accent} />
    </div>
    <div style={{ zIndex: 1 }}>
      <div style={{ fontSize: 30, fontWeight: 700, color: "#1f2a23", letterSpacing: -1 }}>{value}</div>
      <div style={{ fontSize: 13, color: "#5f6f63", marginTop: 2 }}>{label}</div>
      {sub && <div style={{ fontSize: 11, color: accent, marginTop: 4, fontWeight: 600 }}>{sub}</div>}
    </div>
  </div>
);

const Overlay = ({ onClose, children }) => (
  <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }} onClick={onClose}>
    <div style={{ background: "#fff", borderRadius: 24, padding: "2rem", width: "100%", maxWidth: 480, boxShadow: "0 25px 60px rgba(0,0,0,0.15)" }} onClick={e => e.stopPropagation()}>
      {children}
    </div>
  </div>
);

const ModalHeader = ({ title, onClose }) => (
  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
    <h3 style={{ fontSize: 20, fontWeight: 700, color: "#1f2a23", margin: 0 }}>{title}</h3>
    <button onClick={onClose} style={{ border: "none", background: "#f3f4f6", borderRadius: "50%", width: 32, height: 32, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <Ic d={ic.xmark} size={16} color="#6b7280" />
    </button>
  </div>
);

const FInput = ({ label, ...p }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
    {label && <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", textTransform: "uppercase", letterSpacing: "0.05em" }}>{label}</label>}
    <input {...p} style={{ padding: "10px 14px", border: "1.5px solid #d6dad6", borderRadius: 12, fontSize: 14, outline: "none", color: "#1f2a23", ...(p.style || {}) }}
      onFocus={e => e.target.style.borderColor = "#1f3d2b"}
      onBlur={e => e.target.style.borderColor = "#d6dad6"} />
  </div>
);

const FSel = ({ label, children, ...p }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
    {label && <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", textTransform: "uppercase", letterSpacing: "0.05em" }}>{label}</label>}
    <select {...p} style={{ padding: "10px 14px", border: "1.5px solid #d6dad6", borderRadius: 12, fontSize: 14, outline: "none", color: "#1f2a23", background: "#fff", cursor: "pointer" }}>{children}</select>
  </div>
);

const Btn = ({ children, variant = "primary", onClick, style: sx = {} }) => {
  const vs = {
    primary: { background: "#1f3d2b", color: "#fff", border: "none" },
    secondary: { background: "#f3f4f6", color: "#374151", border: "1px solid #d6dad6" },
    danger: { background: "#fee2e2", color: "#991b1b", border: "none" },
  };
  return (
    <button onClick={onClick} style={{ ...vs[variant], padding: "9px 18px", borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 6, fontFamily: "inherit", ...sx }}
      onMouseEnter={e => e.currentTarget.style.opacity = "0.82"}
      onMouseLeave={e => e.currentTarget.style.opacity = "1"}>
      {children}
    </button>
  );
};

const SearchBar = ({ value, onChange, placeholder }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 10, background: "#fff", border: "1px solid #d6dad6", borderRadius: 14, padding: "10px 16px" }}>
    <Ic d={ic.search} size={16} color="#8a948c" />
    <input value={value} onChange={onChange} placeholder={placeholder} style={{ border: "none", outline: "none", fontSize: 14, color: "#1f2a23", flex: 1, background: "transparent", fontFamily: "inherit" }} />
  </div>
);

const TH = ({ children }) => (
  <th style={{ padding: "12px 16px", fontSize: 11, fontWeight: 700, color: "#8a948c", textTransform: "uppercase", letterSpacing: "0.05em", textAlign: "left" }}>{children}</th>
);

// ─── ANALYTICS PAGE ──────────────────────────────────────────────────────────

const AnalyticsPage = ({ students, companies }: { students: UserProfileDoc[], companies: UserProfileDoc[] }) => {
  const verifiedStudents = students.filter(s => s.student?.verified === true);
  const pct = students.length > 0 ? Math.round((verifiedStudents.length / students.length) * 100) : 0;
  // Highest package logic needs jobs/applications, for now use a dummy or skip
  const highest = 0; 
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
      <div>
        <h2 style={{ fontSize: 26, fontWeight: 700, color: "#1f2a23", letterSpacing: -0.5, margin: 0 }}>Analytics Dashboard</h2>
        <p style={{ color: "#6b7280", fontSize: 14, marginTop: 4 }}>Placement season at a glance — batch 2024</p>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16 }}>
        <StatCard label="Students Verified" value={verifiedStudents.length} sub={`${pct}% of batch`} icon={ic.users} accent="#1f3d2b" />
        <StatCard label="Companies Visiting" value={companies.length} sub={`${companies.filter(c => c.recruiter?.verified).length} verified`} icon={ic.companies} accent="#06b6d4" />
        <StatCard label="Highest Package" value={`${highest} LPA`} sub="—" icon={ic.box} accent="#f59e0b" />
        <StatCard label="Placement %" value={`${pct}%`} sub="↑ 12% vs last year" icon={ic.trending} accent="#2e7d5b" />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr", gap: 20 }}>
        <div style={{ background: "#fff", borderRadius: 20, padding: "1.5rem", border: "1px solid #dcdedc" }}>
          <h4 style={{ fontSize: 15, fontWeight: 700, color: "#1f2a23", margin: "0 0 20px" }}>Placement trend</h4>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#dcdedc" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#8a948c" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: "#8a948c" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #dcdedc", fontSize: 13 }} />
              <Line type="monotone" dataKey="placed" stroke="#1f3d2b" strokeWidth={2.5} dot={{ fill: "#1f3d2b", r: 4 }} name="Placed" />
              <Line type="monotone" dataKey="target" stroke="#d6dad6" strokeWidth={2} strokeDasharray="5 5" dot={false} name="Target" />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div style={{ background: "#fff", borderRadius: 20, padding: "1.5rem", border: "1px solid #dcdedc" }}>
          <h4 style={{ fontSize: 15, fontWeight: 700, color: "#1f2a23", margin: "0 0 20px" }}>Branch-wise placement</h4>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie data={branchData} cx="50%" cy="50%" innerRadius={55} outerRadius={90} dataKey="value" paddingAngle={3}>
                {branchData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #dcdedc", fontSize: 13 }} />
              <Legend iconType="circle" iconSize={10} wrapperStyle={{ fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div style={{ background: "#fff", borderRadius: 20, padding: "1.5rem", border: "1px solid #dcdedc" }}>
        <h4 style={{ fontSize: 15, fontWeight: 700, color: "#1f2a23", margin: "0 0 20px" }}>Package distribution</h4>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={pkgData} barCategoryGap="30%">
            <CartesianGrid strokeDasharray="3 3" stroke="#dcdedc" vertical={false} />
            <XAxis dataKey="range" tick={{ fontSize: 12, fill: "#8a948c" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 12, fill: "#8a948c" }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #dcdedc", fontSize: 13 }} />
            <Bar dataKey="count" fill="#1f3d2b" radius={[8, 8, 0, 0]} name="Students" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

// ─── COMPANIES PAGE ───────────────────────────────────────────────────────────

const CompaniesPage = ({ companies, setCompanies, showToast }) => {
  const [modal, setModal] = useState(false);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState({ name: "", sector: "", package: "", openRoles: "", status: "Pending" });

  const filtered = companies.filter(c => c.name.toLowerCase().includes(search.toLowerCase()) || c.sector.toLowerCase().includes(search.toLowerCase()));

  const add = () => {
    if (!form.name || !form.sector) return showToast("Fill required fields", "error");
    setCompanies(p => [...p, { id: Date.now(), ...form, package: +form.package || 0, openRoles: +form.openRoles || 0, joined: new Date().toISOString().split("T")[0] }]);
    setModal(false); setForm({ name: "", sector: "", package: "", openRoles: "", status: "Pending" });
    showToast("Company added!", "success");
  };
  const remove = id => { setCompanies(p => p.filter(c => c.id !== id)); showToast("Company removed", "error"); };
  const verify = async (id) => {
    try {
      await verifyUser(id, "recruiter");
      setCompanies(p => p.map(c => c.uid === id ? { ...c, recruiter: { ...c.recruiter, verified: true } } : c));
      showToast("Company verified!", "success");
    } catch (err) {
      showToast("Verification failed", "error");
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h2 style={{ fontSize: 26, fontWeight: 700, color: "#1f2a23", letterSpacing: -0.5, margin: 0 }}>Companies</h2>
          <p style={{ color: "#6b7280", fontSize: 14, marginTop: 4 }}>{companies.length} registered · {companies.filter(c => c.status === "Verified").length} verified</p>
        </div>
        <Btn onClick={() => setModal(true)}><Ic d={ic.plus} size={16} color="#fff" /> Add Company</Btn>
      </div>
      <SearchBar value={search} onChange={e => setSearch(e.target.value)} placeholder="Search companies or sector..." />
      <div style={{ background: "#fff", borderRadius: 20, border: "1px solid #dcdedc", overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead><tr style={{ background: "#fafafa", borderBottom: "1px solid #dcdedc" }}>{["Company","Sector","Pkg (LPA)","Open Roles","Status","Joined","Actions"].map(h => <TH key={h}>{h}</TH>)}</tr></thead>
          <tbody>
            {filtered.map((c, i) => (
              <tr key={c.id} style={{ borderBottom: "1px solid #f9f9fb", background: i % 2 === 0 ? "#fff" : "#fafafe" }}>
                <td style={{ padding: "14px 16px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 36, height: 36, borderRadius: 10, background: "#ede9fe", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, color: "#5b21b6" }}>{c.name?.[0] || "?"}</div>
                    <span style={{ fontSize: 14, fontWeight: 600, color: "#1f2a23" }}>{c.recruiter?.companyName || c.name}</span>
                  </div>
                </td>
                <td style={{ padding: "14px 16px", fontSize: 13, color: "#6b7280" }}>{c.recruiter?.sector || "Tech"}</td>
                <td style={{ padding: "14px 16px", fontSize: 14, fontWeight: 600, color: "#1f2a23" }}>{c.recruiter?.package || "—"}</td>
                <td style={{ padding: "14px 16px", fontSize: 13, color: "#6b7280" }}>{c.recruiter?.openRoles || 0}</td>
                <td style={{ padding: "14px 16px" }}><Badge color={c.recruiter?.verified ? "green" : "amber"}>{c.recruiter?.verified ? "Verified" : "Pending"}</Badge></td>
                <td style={{ padding: "14px 16px", fontSize: 12, color: "#8a948c" }}>{c.createdAt ? c.createdAt?.toDate?.()?.toLocaleDateString?.() || "—" : "-"}</td>
                <td style={{ padding: "14px 16px" }}>
                  <div style={{ display: "flex", gap: 8 }}>
                    {!c.recruiter?.verified && <button onClick={() => verify(c.uid)} style={{ border: "none", background: "#dce7de", padding: "6px 8px", borderRadius: 8, cursor: "pointer" }}><Ic d={ic.shield} size={14} color="#1f5c45" /></button>}
                    <button onClick={() => remove(c.id)} style={{ border: "none", background: "#fee2e2", padding: "6px 8px", borderRadius: 8, cursor: "pointer" }}><Ic d={ic.trash} size={14} color="#991b1b" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {modal && (
        <Overlay onClose={() => setModal(false)}>
          <ModalHeader title="Add Company" onClose={() => setModal(false)} />
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <FInput label="Company Name *" placeholder="Google" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
              <FInput label="Sector *" placeholder="Tech" value={form.sector} onChange={e => setForm({ ...form, sector: e.target.value })} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <FInput label="Package (LPA)" placeholder="12" type="number" value={form.package} onChange={e => setForm({ ...form, package: e.target.value })} />
              <FInput label="Open Roles" placeholder="5" type="number" value={form.openRoles} onChange={e => setForm({ ...form, openRoles: e.target.value })} />
            </div>
            <FSel label="Status" value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}><option>Pending</option><option>Verified</option></FSel>
            <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
              <Btn onClick={add} style={{ flex: 1, justifyContent: "center" }}>Add Company</Btn>
              <Btn variant="secondary" onClick={() => setModal(false)} style={{ flex: 1, justifyContent: "center" }}>Cancel</Btn>
            </div>
          </div>
        </Overlay>
      )}
    </div>
  );
};

// ─── STUDENTS PAGE ────────────────────────────────────────────────────────────

const StudentsPage = ({ students, setStudents, showToast }) => {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  const filtered = students.filter(s => {
    const mS = s.name.toLowerCase().includes(search.toLowerCase()) || (s.student?.branch || "").toLowerCase().includes(search.toLowerCase());
    const isPlaced = false; // logic for actual placements from applications needed later
    const status = isPlaced ? "Placed" : (s.student?.verified ? "Verified" : "Pending");
    const mF = filter === "All" || status === filter;
    return mS && mF;
  });

  const verify = async (uid: string) => {
    try {
      await verifyUser(uid, "student");
      setStudents(p => p.map(s => s.uid === uid ? { ...s, student: { ...s.student, verified: true } } : s));
      showToast("Student verified!", "success");
    } catch (err) {
      showToast("Verification failed", "error");
    }
  };
  const sc = { Placed: "green", Unplaced: "red", Pending: "amber" };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h2 style={{ fontSize: 26, fontWeight: 700, color: "#1f2a23", letterSpacing: -0.5, margin: 0 }}>Students</h2>
          <p style={{ color: "#6b7280", fontSize: 14, marginTop: 4 }}>{students.length} registered · {students.filter(s => s.status === "Placed").length} placed</p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {["All", "Verified", "Pending"].map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{ padding: "8px 16px", borderRadius: 100, fontSize: 12, fontWeight: 600, cursor: "pointer", border: filter === f ? "none" : "1px solid #d6dad6", background: filter === f ? "#1f3d2b" : "#fff", color: filter === f ? "#fff" : "#6b7280", fontFamily: "inherit" }}>{f}</button>
          ))}
        </div>
      </div>
      <SearchBar value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name or branch..." />
      <div style={{ background: "#fff", borderRadius: 20, border: "1px solid #dcdedc", overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead><tr style={{ background: "#fafafa", borderBottom: "1px solid #dcdedc" }}>{["Student","Branch","CGPA","Resume","Status","Actions"].map(h => <TH key={h}>{h}</TH>)}</tr></thead>
          <tbody>
            {filtered.map((s, i) => (
              <tr key={s.uid} style={{ borderBottom: "1px solid #f9f9fb", background: i % 2 === 0 ? "#fff" : "#fafafe" }}>
                <td style={{ padding: "14px 16px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#ede9fe", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, color: "#5b21b6" }}>{s.name?.[0] || "?"}</div>
                    <div><div style={{ fontSize: 14, fontWeight: 600, color: "#1f2a23" }}>{s.name}</div><div style={{ fontSize: 11, color: "#8a948c" }}>ID: {s.uid.slice(0, 8)}</div></div>
                  </div>
                </td>
                <td style={{ padding: "14px 16px" }}><Badge color="purple">{s.student?.branch || "—"}</Badge></td>
                <td style={{ padding: "14px 16px", fontSize: 14, fontWeight: 600, color: (s.student?.cgpa || 0) >= 9 ? "#1f5c45" : "#1f2a23" }}>{s.student?.cgpa || "—"}</td>
                <td style={{ padding: "14px 16px" }}>
                  {s.student?.resume?.downloadUrl ? (
                    <a href={s.student.resume.downloadUrl} target="_blank" rel="noreferrer" style={{ color: "#1f3d2b", textDecoration: "underline", fontSize: 13, fontWeight: 600 }}>Download PDF</a>
                  ) : (
                    <span style={{ color: "#8a948c", fontSize: 13 }}>No Resume</span>
                  )}
                </td>
                <td style={{ padding: "14px 16px" }}><Badge color={s.student?.verified ? "green" : "amber"}>{s.student?.verified ? "Verified" : "Pending"}</Badge></td>
                <td style={{ padding: "14px 16px" }}>
                  {!s.student?.verified
                    ? <button onClick={() => verify(s.uid)} style={{ border: "none", background: "#dbeafe", padding: "6px 8px", borderRadius: 8, cursor: "pointer" }}><Ic d={ic.check} size={14} color="#1e40af" /></button>
                    : <Badge color="blue">Verified</Badge>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// ─── JOB POSTINGS PAGE ───────────────────────────────────────────────────────

const JobsPage = ({ jobs, setJobs, showToast }) => {
  const [modal, setModal] = useState(false);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState({ role: "", company: "", type: "Full-time", package: "", status: "Active" });

  const filtered = jobs.filter(j => j.role.toLowerCase().includes(search.toLowerCase()) || j.company.toLowerCase().includes(search.toLowerCase()));

  const add = async () => {
    if (!form.role || !form.company) return showToast("Fill required fields", "error");
    try {
      const jobId = await createJobPosting({
        companyUid: "admin_broadcast",
        companyName: form.company,
        role: form.role,
        type: form.type as "Full-time" | "Internship",
        location: "Remote/Campus",
        package: form.package,
        eligibility: { minCgpa: 6.0, branch: "All Branches" }
      });

    setJobs(p => [
    {
    id: jobId,
    ...form,
    applicationsCount: 0,
    createdAt: { seconds: Date.now() / 1000 }
    },
    ...p
    ]);

setModal(false); setForm({ role: "", company: "", type: "Full-time", package: "", status: "Active" });
      showToast("Job posting created!", "success");
    } catch (err) {
      showToast("Failed to create job", "error");
    }
  };
  const toggle = id => { setJobs(p => p.map(j => j.id === id ? { ...j, status: j.status === "Active" ? "Paused" : "Active" } : j)); showToast("Status updated", "info"); };
  const remove = id => { setJobs(p => p.filter(j => j.id !== id)); showToast("Job removed", "error"); };
  const sc = { Active: "green", Closed: "gray", Paused: "amber" };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h2 style={{ fontSize: 26, fontWeight: 700, color: "#1f2a23", letterSpacing: -0.5, margin: 0 }}>Job Postings</h2>
          <p style={{ color: "#6b7280", fontSize: 14, marginTop: 4 }}>{jobs.length} total · {jobs.filter(j => j.status === "Active").length} active</p>
        </div>
        <Btn onClick={() => setModal(true)}><Ic d={ic.plus} size={16} color="#fff" /> Create Posting</Btn>
      </div>
      <SearchBar value={search} onChange={e => setSearch(e.target.value)} placeholder="Search job role or company..." />
      <div style={{ background: "#fff", borderRadius: 20, border: "1px solid #dcdedc", overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead><tr style={{ background: "#fafafa", borderBottom: "1px solid #dcdedc" }}>{["Role","Company","Type","Package","Applicants","Status","Posted","Actions"].map(h => <TH key={h}>{h}</TH>)}</tr></thead>
          <tbody>
            {filtered.map((j, i) => (
              <tr key={j.id} style={{ borderBottom: "1px solid #f9f9fb", background: i % 2 === 0 ? "#fff" : "#fafafe" }}>
                <td style={{ padding: "14px 16px", fontSize: 14, fontWeight: 600, color: "#1f2a23" }}>{j.role}</td>
                <td style={{ padding: "14px 16px", fontSize: 13, color: "#6b7280" }}>{j.company}</td>
                <td style={{ padding: "14px 16px" }}><Badge color={j.type === "Internship" ? "blue" : "purple"}>{j.type}</Badge></td>
                <td style={{ padding: "14px 16px", fontSize: 14, fontWeight: 600, color: "#1f2a23" }}>{j.package}</td>
                <td style={{ padding: "14px 16px", fontSize: 13, color: "#6b7280" }}>{j.applicationsCount || 0}</td>
                <td style={{ padding: "14px 16px" }}><Badge color={j.status === "Active" ? "green" : "gray"}>{j.status}</Badge></td>
                  <td style={{ padding: "14px 16px", fontSize: 12, color: "#8a948c" }}>
                  {j.createdAt?.seconds
                  ? new Date(j.createdAt.seconds * 1000).toLocaleDateString() : "-"}
                  </td>
                  <td style={{ padding: "14px 16px" }}>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button onClick={() => toggle(j.id)} style={{ border: "none", background: "#fef3c7", padding: "6px 8px", borderRadius: 8, cursor: "pointer" }}><Ic d={ic.pause} size={14} color="#92400e" /></button>
                    <button onClick={() => remove(j.id)} style={{ border: "none", background: "#fee2e2", padding: "6px 8px", borderRadius: 8, cursor: "pointer" }}><Ic d={ic.trash} size={14} color="#991b1b" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {modal && (
        <Overlay onClose={() => setModal(false)}>
          <ModalHeader title="Create Job Posting" onClose={() => setModal(false)} />
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <FInput label="Job Role *" placeholder="SDE-1" value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} />
              <FInput label="Company *" placeholder="Google" value={form.company} onChange={e => setForm({ ...form, company: e.target.value })} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <FSel label="Type" value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}><option>Full-time</option><option>Internship</option></FSel>
              <FInput label="Package (LPA)" placeholder="12" type="number" value={form.package} onChange={e => setForm({ ...form, package: e.target.value })} />
            </div>
            <FSel label="Status" value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}><option>Active</option><option>Paused</option></FSel>
            <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
              <Btn onClick={add} style={{ flex: 1, justifyContent: "center" }}>Create Posting</Btn>
              <Btn variant="secondary" onClick={() => setModal(false)} style={{ flex: 1, justifyContent: "center" }}>Cancel</Btn>
            </div>
          </div>
        </Overlay>
      )}
    </div>
  );
};

// ─── PROFILE MODAL ────────────────────────────────────────────────────────────

const ProfileModal = ({ onClose }) => (
  <Overlay onClose={onClose}>
    <ModalHeader title="Admin Profile" onClose={onClose} />
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      <div style={{ width: 72, height: 72, borderRadius: "50%", background: "#1f3d2b", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, fontWeight: 700, color: "#fff" }}>A</div>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 18, fontWeight: 700, color: "#1f2a23" }}>Super Admin</div>
        <div style={{ fontSize: 13, color: "#6b7280", marginTop: 4 }}>admin@college.edu</div>
      </div>
      <div style={{ width: "100%", background: "#eef2ee", borderRadius: 14, padding: "1rem" }}>
        {[["Role","Placement Administrator"],["College","IGDTUW Placement Cell"],["Access","Full Control"],["Last Login","Today, 8:04 PM"]].map(([k, v]) => (
          <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #dcdedc", fontSize: 13 }}>
            <span style={{ color: "#8a948c", fontWeight: 600 }}>{k}</span>
            <span style={{ color: "#1f2a23", fontWeight: 500 }}>{v}</span>
          </div>
        ))}
      </div>
      <Btn onClick={onClose} style={{ width: "100%", justifyContent: "center" }}>Close</Btn>
    </div>
  </Overlay>
);

  const SettingsModal = ({ onClose, darkMode, setDarkMode }) => {
  const [toggles, setToggles] = useState([true, false, false, false]);
  const items = ["Email notifications", "Auto-verify companies", "Dark mode", "Two-factor auth"];

const handleToggle = (i) => {
  if (i === 2) {
    setDarkMode(prev => !prev);
  } else {
    setToggles(t => t.map((v, j) => j === i ? !v : v));
  }
};

  return (
    <Overlay onClose={onClose}>
      <ModalHeader title="Settings" onClose={onClose} />
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        {items.map((label, i) => (
          <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: "1px solid #dcdedc" }}>
            <span style={{ fontSize: 14, fontWeight: 500, color: "#1f2a23" }}>{label}</span>
           <div
  onClick={() => handleToggle(i)}
  style={{
    width: 40,
    height: 22,
    borderRadius: 100,
    background: i === 2
      ? (darkMode ? "#1f3d2b" : "#d6dad6")
      : (toggles[i] ? "#1f3d2b" : "#d6dad6"),
    cursor: "pointer",
    position: "relative",
    transition: "background 0.2s"
  }}
>
  <div
    style={{
      width: 16,
      height: 16,
      borderRadius: "50%",
      background: "#fff",
      position: "absolute",
      top: 3,
      left: i === 2
        ? (darkMode ? 21 : 3)
        : (toggles[i] ? 21 : 3),
      transition: "left 0.2s"
    }}
  />
</div>
          </div>
        ))}
        <Btn onClick={onClose} style={{ width: "100%", justifyContent: "center", marginTop: 16 }}>Save Settings</Btn>
      </div>
    </Overlay>
  );
};

// ─── ROOT ─────────────────────────────────────────────────────────────────────

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const [page, setPage] = useState("analytics");
  const [companies, setCompanies] = useState<UserProfileDoc[]>([]);
  const [students, setStudents] = useState<UserProfileDoc[]>([]);
  const [jobs, setJobs] = useState<JobDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [notifs, setNotifs] = useState(INITIAL_NOTIFS);
  const [showNotif, setShowNotif] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
  return localStorage.getItem("darkMode") === "true";
  });

  useEffect(() => {
    localStorage.setItem("darkMode", darkMode.toString());
      }, [darkMode]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [studentsData, recruitersData, jobsData] = await Promise.all([
          listAllStudents(),
          listAllRecruiters(),
          listAllJobs()
        ]);
        setStudents(studentsData);
        setCompanies(recruitersData);
        setJobs(jobsData);
      } catch (err) {
        console.error("Error fetching admin data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const showToast = (msg, type = "success") => { setToast({ msg, type }); setTimeout(() => setToast(null), 2800); };
  const verifiedCount = students.filter(s => s.student?.verified).length;
  const unread = notifs.filter(n => n.unread).length;

  const navItems = [
    { id: "analytics", label: "Analytics", icon: ic.analytics },
    { id: "companies", label: "Companies", icon: ic.companies },
    { id: "students", label: "Students", icon: ic.students },
    { id: "jobs", label: "Job Postings", icon: ic.jobs },
  ];

  return (
    <div style={{ display: "flex", width: "100vw", height: "100vh", fontFamily: "'DM Sans', system-ui, sans-serif", background: darkMode ? "#0f172a" : "#eef2ee", overflow: "hidden" }}
      onClick={() => { setShowNotif(false); setShowMenu(false); }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');
        @keyframes fadeUp { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-thumb { background: #d6dad6; border-radius: 6px; }
      `}</style>

      {/* SIDEBAR */}
      <aside style={{ width: 240, minWidth: 240, height: "100vh", background: darkMode ? "#111827" : "#fff", borderRight: "1px solid #dcdedc", display: "flex", flexDirection: "column", padding: "1.5rem 1rem", flexShrink: 0, overflowY: "auto" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: "1.5rem", padding: "0 0.25rem" }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: "#1f3d2b", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Ic d={ic.shield} size={18} color="#e7ece7" />
          </div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, color: "#1f2a23" }}>Hireque</div>
            <div style={{ fontSize: 11, color: "#8a948c" }}>Admin Panel</div>
          </div>
        </div>

        <div style={{ fontSize: 10, fontWeight: 700, color: "#d1d5db", textTransform: "uppercase", letterSpacing: "0.1em", padding: "0 0.5rem", marginBottom: 6 }}>Menu</div>

        {navItems.map(n => (
          <button key={n.id} onClick={() => setPage(n.id)} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 12px", borderRadius: 12, border: "none", cursor: "pointer", width: "100%", textAlign: "left", background: page === n.id ? "#1f3d2b" : "transparent", color: page === n.id ? "#fff" : "#6b7280", fontWeight: 600, fontSize: 14, marginBottom: 2, fontFamily: "inherit" }}>
            <Ic d={n.icon} size={18} color={page === n.id ? "#fff" : "#8a948c"} />
            {n.label}
          </button>
        ))}

        <div style={{ marginTop: "auto" }}>
          <div style={{ background: "#eef2ee", borderRadius: 14, padding: 14, marginBottom: 12 }}>
            <div style={{ fontSize: 11, color: "#8a948c", marginBottom: 6 }}>Verification progress</div>
            <div style={{ height: 6, background: "#d6dad6", borderRadius: 100, overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${students.length > 0 ? Math.round(verifiedCount / students.length * 100) : 0}%`, background: "#1f3d2b", borderRadius: 100, transition: "width 0.4s" }} />
            </div>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#1f3d2b", marginTop: 6 }}>{students.length > 0 ? Math.round(verifiedCount / students.length * 100) : 0}% verified</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 12, background: "#eef2ee" }}>
            <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#1f3d2b", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, color: "#fff" }}>A</div>
            <div><div style={{ fontSize: 13, fontWeight: 600, color: "#1f2a23" }}>Admin</div><div style={{ fontSize: 11, color: "#8a948c" }}>admin@college.edu</div></div>
          </div>
        </div>
      </aside>

      {/* MAIN */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0, height: "100vh" }}>

        {/* TOPBAR */}
        <header style={{ height: 64, minHeight: 64, background: darkMode ? "#111827" : "#fff", borderBottom: "1px solid #dcdedc", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 2rem", flexShrink: 0 }}>
          <div style={{ fontSize: 13, color: "#8a948c"}}>
            Welcome back, <span style={{ color: "#1f3d2b", fontWeight: 600 }}>Admin</span> · {new Date().toLocaleDateString("en-IN", { dateStyle: "long" })}
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 12 }} onClick={e => e.stopPropagation()}>

            {/* BELL */}
            <div style={{ position: "relative" }}>
              <button onClick={() => { setShowNotif(v => !v); setShowMenu(false); }}
                style={{ border: "1px solid #d6dad6", background: "#fff", borderRadius: 12, padding: "8px 10px", cursor: "pointer", display: "flex", alignItems: "center", position: "relative" }}>
                <Ic d={ic.bell} size={18} color="#6b7280" />
                {unread > 0 && (
                  <span style={{ position: "absolute", top: 5, right: 5, width: 16, height: 16, background: "#ef4444", borderRadius: "50%", border: "2px solid #fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, color: "#fff", fontWeight: 700 }}>
                    {unread}
                  </span>
                )}
              </button>
              {showNotif && (
                <div style={{ position: "absolute", top: 50, right: 0, width: 300, background: "#fff", border: "1px solid #d6dad6", borderRadius: 16, boxShadow: "0 12px 40px rgba(0,0,0,0.12)", zIndex: 500, overflow: "hidden", animation: "fadeUp 0.2s" }}>
                  <div style={{ padding: "12px 16px", borderBottom: "1px solid #dcdedc", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: 14, fontWeight: 700, color: "#1f2a23" }}>Notifications</span>
                    <button onClick={() => setNotifs(p => p.map(n => ({ ...n, unread: false })))} style={{ fontSize: 11, color: "#1f3d2b", fontWeight: 600, border: "none", background: "none", cursor: "pointer", fontFamily: "inherit" }}>Mark all read</button>
                  </div>
                  {notifs.map(n => (
                    <div key={n.id} onClick={() => setNotifs(p => p.map(x => x.id === n.id ? { ...x, unread: false } : x))}
                      style={{ display: "flex", gap: 12, padding: "12px 16px", borderBottom: "1px solid #f9f9fb", background: n.unread ? "#fafafe" : "#fff", cursor: "pointer", alignItems: "flex-start" }}>
                      <span style={{ fontSize: 18 }}>{n.icon}</span>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 13, color: "#1f2a23", fontWeight: n.unread ? 600 : 400 }}>{n.text}</div>
                        <div style={{ fontSize: 11, color: "#8a948c", marginTop: 2 }}>{n.time}</div>
                      </div>
                      {n.unread && <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#1f3d2b", marginTop: 4, flexShrink: 0 }} />}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* AVATAR */}
            <div style={{ position: "relative" }}>
              <div onClick={() => { setShowMenu(v => !v); setShowNotif(false); }}
                style={{ width: 38, height: 38, borderRadius: "50%", background: "#1f3d2b", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, fontWeight: 700, color: "#fff", cursor: "pointer", userSelect: "none" }}>
                A
              </div>
              {showMenu && (
                <div style={{ position: "absolute", top: 50, right: 0, width: 185, background: "#fff", border: "1px solid #d6dad6", borderRadius: 14, boxShadow: "0 12px 40px rgba(0,0,0,0.12)", zIndex: 500, overflow: "hidden", animation: "fadeUp 0.2s" }}>
                  <div style={{ padding: "12px 14px", borderBottom: "1px solid #dcdedc" }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "#1f2a23" }}>Super Admin</div>
                    <div style={{ fontSize: 11, color: "#8a948c" }}>admin@college.edu</div>
                  </div>
                  {[
                    { label: "View Profile", icon: ic.user, fn: () => { setShowProfile(true); setShowMenu(false); } },
                    { label: "Settings", icon: ic.settings, fn: () => { setShowSettings(true); setShowMenu(false); } },
                  ].map(item => (
                    <button key={item.label} onClick={item.fn}
                      style={{ width: "100%", padding: "10px 14px", border: "none", background: "transparent", cursor: "pointer", display: "flex", alignItems: "center", gap: 10, fontSize: 13, color: "#374151", fontWeight: 500, fontFamily: "inherit", textAlign: "left" }}
                      onMouseEnter={e => e.currentTarget.style.background = "#eef2ee"}
                      onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                      <Ic d={item.icon} size={15} color="#8a948c" /> {item.label}
                    </button>
                  ))}
                  <div style={{ borderTop: "1px solid #dcdedc" }}>
                    <button
                      onClick={async () => {
                      if (window.confirm("Logout?")) {
                      await signOut();
                      navigate("/");
                     }
                    }}
                      style={{ width: "100%", padding: "10px 14px", border: "none", background: "transparent", cursor: "pointer", display: "flex", alignItems: "center", gap: 10, fontSize: 13, color: "#991b1b", fontWeight: 600, fontFamily: "inherit", textAlign: "left" }}
                      onMouseEnter={e => e.currentTarget.style.background = "#fee2e2"}
                      onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                      <Ic d={ic.logout} size={15} color="#991b1b" /> Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* PAGE */}
        <main style={{ flex: 1, overflowY: "auto", padding: "2rem 2.5rem" }}>
          {page === "analytics" && <AnalyticsPage students={students} companies={companies} />}
          {page === "companies" && <CompaniesPage companies={companies} setCompanies={setCompanies} showToast={showToast} />}
          {page === "students" && <StudentsPage students={students} setStudents={setStudents} showToast={showToast} />}
          {page === "jobs" && <JobsPage jobs={jobs} setJobs={setJobs} showToast={showToast} />}
        </main>
      </div>

      {/* MODALS */}
      {showProfile && <ProfileModal onClose={() => setShowProfile(false)} />}
      {showSettings && (
        <SettingsModal
      onClose={() => setShowSettings(false)}
      darkMode={darkMode}
      setDarkMode={setDarkMode}
      />
  )}
      {/* TOAST */}
      {toast && (
        <div style={{ position: "fixed", bottom: 28, right: 28, background: toast.type === "success" ? "#1f5c45" : toast.type === "error" ? "#991b1b" : "#1e40af", color: "#fff", padding: "12px 20px", borderRadius: 14, fontSize: 13, fontWeight: 500, zIndex: 9999, boxShadow: "0 8px 24px rgba(0,0,0,0.2)", animation: "fadeUp 0.3s" }}>
          {toast.msg}
        </div>
      )}
    </div>
  );
}
