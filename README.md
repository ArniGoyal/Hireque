# Hireque 🎓

<div align="center">
  <img src="https://img.shields.io/badge/React-18-blue?style=for-the-badge&logo=react" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black" alt="Firebase" />
  <img src="https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white" alt="Supabase" />
  <img src="https://img.shields.io/badge/MIT-License-green?style=for-the-badge" alt="License" />
</div>

<br />

A campus placement management system built with a "Paris Chic" editorial aesthetic. Hireque connects students, recruiters, and university administration through a single multi-role interface, with Firebase and Supabase handling auth, data, and file storage.

---

## 🌟 Core Modules

The platform is divided into three role-based portals:

### 👨‍🎓 1. Student Portal
- **Eligibility-Matched Listings:** Jobs filtered by CGPA, branch, and skill criteria set per posting.
- **Application Pipeline:** Track applications from "Applied" → "Interview" → "Selected".
- **Profile:** Academic standing, technical skills, and resume upload (stored via Supabase).
- **Interview Hub:** View scheduled interviews and prep material.

### 🏢 2. Recruiter Command Center
- **Applicant Review:** Browse and shortlist applicants against posted eligibility criteria.
- **Job Postings:** Create roles with eligibility constraints (CGPA / branch / required skills).
- **Scheduling:** Move shortlisted candidates into the interview pipeline.

### 👩‍💼 3. Admin Control Center
- **Analytics:** Visualize placement data via Recharts.
- **Student Verification:** Approve pending student sign-ups.
- **Company Management:** Track participating companies and their postings.

---

## 💻 Tech Stack

| Domain | Technologies |
|---|---|
| **Framework** | React 18 + Vite |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS + Custom Theming |
| **UI Components** | Shadcn UI (Radix Primitives) |
| **Animations** | Framer Motion |
| **Data Viz** | Recharts |
| **Auth & Database** | Firebase Authentication + Firestore |
| **File Storage** | Supabase Storage |
| **Icons** | Lucide React |

> Hireque is a frontend application that talks to Firebase and Supabase directly via their client SDKs — there is currently no custom backend server (no Express/Node API layer).

---

## 🔐 How Roles & Access Work

- Each user has a `role` field (`student` / `recruiter` / `admin`) stored in their Firestore `users` document.
- `AuthProvider` subscribes to that document in real time, so role changes reflect instantly across the app.
- `RequireAuth` and `RequireRole` are React Router guards that redirect users away from routes that don't match their role.

**Known limitation:** route guards are enforced on the client. They control navigation/UX, not data access — a request made directly to the Firebase/Supabase APIs (bypassing the React app) is not currently blocked by them. Locking this down properly requires Firestore Security Rules and Supabase Storage policies scoped to each role. This is the most important item on the roadmap below.

---

## 🚀 Getting Started

### Prerequisites

You need Node.js `(>=18.x.x)` installed on your system.

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/ArniGoyal/Hireque.git
   cd Hireque
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   Copy `.env.example` to `.env` and fill in your Firebase and Supabase project credentials.

4. **Run the development server:**
   ```bash
   npm run dev
   ```

5. **Open your browser:**
   Navigate to `http://localhost:8080` (or the port specified by Vite) to view the application.

---

## 🎨 Design Philosophy

Hireque defies traditional, utilitarian B2B portal layouts. By utilizing a "Paris Chic" editorial aesthetic, it embraces deep, sophisticated primary tones (Forest Green `#193c28`) paired with soft, luxurious backgrounds (Muted Beige). Component architectures use modern micro-animations, glassmorphism hints, and dynamic floating elements.

---

## 🚧 Roadmap

- [ ] **Lock down data access:** Firestore Security Rules + Supabase Storage policies enforced server-side per role (currently only client-side route guards).
- [ ] **Real AI matching/parsing:** Replace rule-based eligibility filtering and placeholder resume scoring with actual ML-based matching and ATS parsing (e.g. OpenAI/Gemini integration).
- [ ] **Live data everywhere:** Extend the real-time listener pattern (currently only on user profiles) to job postings, applications, and interviews.
- [ ] **Automated Alerts:** EmailJS workflows for interview scheduling notifications.

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!
Feel free to check out the [issues page](https://github.com/ArniGoyal/Hireque/issues) if you want to contribute.

## 📝 License

This project is [MIT](LICENSE) licensed.

---
*Built with ❤️ for transforming the campus placement experience.*
