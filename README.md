# Cloud-Based Smart Job Tracker & Skill Gap Analyzer

A full-stack React application designed to help users track job applications and automatically analyze job descriptions using natural language processing to identify skill gaps.

## Features
- **Job Tracker:** Log and manage active job applications (Company, Role, Status).
- **Skill Arsenal:** Build and manage your professional tech profile.
- **Skill Gap Analyzer:** Paste a job description to instantly extract required skills, compare them against your profile, and receive a match score with missing skills highlighted.
- **Interactive Dashboard:** Visualize your job hunt success rates via dynamic charts.
- **Serverless Architecture:** Completely powered by React on the frontend and Supabase (PostgreSQL + Auth) on the backend.

## Tech Stack
- **Frontend:** React, Vite, Tailwind CSS, Recharts, Lucide React
- **Backend/Database:** Supabase (PostgreSQL, Row Level Security, Authentication)

## Getting Started

### 1. Install Dependencies
Navigate to the frontend directory and install the required npm packages:
```bash
cd frontend
npm install
```

### 2. Environment Variables
Create a `.env` file in the `frontend` directory and add your Supabase keys:
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_public_key
```

### 3. Run the App
```bash
npm run dev
```

## Database Setup
Run the SQL script located in the `supabase_setup.md` guide inside your Supabase project's SQL Editor to instantly generate the tables and security policies.
