# Project Specification: Production Studio Dashboard

## 1. Project Overview
Build a sleek, internal-only dashboard for a video production team to track "Video Spec Shoots" and "Lead Outreach." The app must be high-end, minimalist, and functional.

**Tech Stack:**
- **Frontend:** React (Vite) or Next.js
- **Styling:** Tailwind CSS (Apple Minimalist Style)
- **Database:** Supabase
- **Icons:** Lucide-React
- **Deployment Target:** Netlify

---

## 2. Database Schema (Supabase SQL)
Please provide the SQL code first so I can run it in the Supabase SQL Editor. The schema should include:

### Table: `spec_shoots`
- `id`: uuid (primary key)
- `created_at`: timestamp with time zone
- `title`: text
- `status`: text (Options: Concept, Pre-Prod, Filming, Editing, Done)
- `shoot_date`: date
- `notes`: text
- `thumbnail_url`: text

### Table: `company_outreach`
- `id`: uuid (primary key)
- `created_at`: timestamp with time zone
- `company_name`: text
- `contact_name`: text
- `status`: text (Options: Lead, Contacted, In Talks, Signed)
- `notes`: text
- `industry`: text

---

## 3. UI/UX & Aesthetic Requirements
- **Theme:** Apple Minimalist. 
- **Palette:** White (#FFFFFF), Off-white (#F5F5F7), and light gray (#E8E8ED). Primary accent: Apple Blue (#007AFF).
- **Navigation:** A centered, pill-shaped tab switcher at the top to toggle between "Gallery" and "Outreach."
- **Components:** - Use `backdrop-blur` for the navigation bar.
  - Large `rounded-2xl` corners on all cards.
  - Thin stroke icons (Lucide).
  - High whitespace and clean typography (Inter or System Sans).

---

## 4. Key Features
- **Tab 1: Gallery (Spec Shoots):** - A visual grid of cards showing video projects.
  - Status badges with soft background colors.
  - Ability to click a card to edit details.
- **Tab 2: Outreach (Company List):** - A clean, spacious list or table view.
  - Inline status dropdowns for quick updates.
- **CRUD Functionality:** Full Create, Read, Update, and Delete capabilities for both sections.
- **Modals:** Use minimalist slide-over panels or centered modals for adding new entries.

---

## 5. Implementation Instructions
1. **Database First:** Generate the SQL migration/setup code for Supabase.
2. **Environment Variables:** Use `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
3. **Responsive Design:** Ensure it looks premium on both desktop and tablet.
4. **Error Handling:** Include loading states and basic error toasts for database operations.