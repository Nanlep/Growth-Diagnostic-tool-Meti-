# Meti Growth Diagnostic Tool

**AI-powered business maturity assessment for SMBs, Enterprise Service Companies, B2B firms, and SaaS growth companies.**

Meti is a sophisticated diagnostic application that uses Google's Gemini AI to analyze business metrics, identify growth bottlenecks, and generate actionable strategic roadmaps. It includes a multi-step assessment wizard, visual data dashboards, lead capture, and an admin portal.

## 🚀 Features

*   **AI-Driven Analysis**: Utilizes `gemini-3-flash-preview` to act as a senior management consultant, providing bespoke advice based on unit economics and operational maturity.
*   **Comprehensive Diagnostic**: 5-step wizard covering Company Profile, Business Model, Strategy & Goals, Unit Economics (CAC/LTV), and Technology/Operations.
*   **Visual Results Dashboard**: Interactive Radar charts and peer benchmarking bar charts using `Recharts`.
*   **PMF Calculator**: Built-in Sean Ellis Product-Market Fit calculator to test market readiness.
*   **Lead Capture & Scheduling**: Integrated lead generation form that gates access to a booking calendar (Calendly/Google Calendar integration).
*   **Admin Portal**: Password-protected dashboard for staff to view leads, search data, and export to CSV.
*   **Supabase Integration**: Robust backend for storing leads with Row Level Security (RLS).

## 🛠 Tech Stack

*   **Frontend**: React 19, Vite, TypeScript
*   **Styling**: Tailwind CSS
*   **AI Engine**: Google GenAI SDK (`@google/genai`)
*   **Database**: Supabase (PostgreSQL)
*   **Visualization**: Recharts
*   **Icons**: Lucide React

## ⚡️ Getting Started

### Prerequisites

*   Node.js (v18+)
*   A Google Cloud Project with Gemini API enabled.
*   A Supabase project.

### Installation

1.  **Clone the repository**
    ```bash
    git clone <your-repo-url>
    cd meti-growth-diagnostic
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Configure Environment Variables**
    Create a `.env` file in the root directory:
    ```env
    # Required: Google Gemini API Key
    VITE_GOOGLE_API_KEY=AIzaSy...

    # Required: Supabase Database Configuration
    VITE_SUPABASE_URL=https://your-project.supabase.co
    VITE_SUPABASE_ANON_KEY=eyJh...

    # Optional: Booking Calendar URL (e.g., Calendly link)
    VITE_GOOGLE_CALENDAR_URL=https://calendly.com/your-org/strategy-call
    ```

4.  **Run Development Server**
    ```bash
    npm run dev
    ```

## 🗄️ Database Setup (Supabase)

To make the Lead Capture and Admin Dashboard work, run the following SQL in your Supabase SQL Editor:

```sql
-- 1. Create the leads table
create table public.leads (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  company_name text not null,
  contact_name text not null,
  email text not null,
  business_model text,
  annual_revenue text,
  employee_count text,
  diagnostic_score numeric,
  diagnostic_summary text,
  notes text,
  referrer text,
  status text default 'Pending'::text
);

-- 2. Enable Row Level Security (RLS)
alter table public.leads enable row level security;

-- 3. Policy: Allow public to insert leads (Lead Form)
create policy "Allow public inserts"
on public.leads for insert
to anon
with check (true);

-- 4. Policy: Allow authenticated admins to view leads
create policy "Allow admins to view leads"
on public.leads for select
to authenticated
using (true);
```

> **Note:** The Admin Dashboard uses Supabase Auth. Ensure you have created a user in Supabase Authentication to log in.

## 📦 Deployment

### Vercel (Recommended)

1.  Push your code to GitHub.
2.  Import the project into Vercel.
3.  In Vercel Project Settings > **Environment Variables**, add the keys defined in your `.env` file.
4.  Deploy.

## 📂 Project Structure

*   `src/components/`: UI components (Hero, DiagnosticForm, ResultsDashboard, Scheduler, AdminDashboard).
*   `src/services/`: API integrations (geminiService.ts, bookingService.ts, supabase.ts).
*   `src/types.ts`: TypeScript interfaces for the application state.
*   `index.html`: Entry point with Tailwind CDN configuration.

## 📄 License

This project is proprietary.
