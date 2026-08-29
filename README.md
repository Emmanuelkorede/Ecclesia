# Ecclesia

A modern, multi-tenant Church Management SaaS platform built with React, TypeScript, Supabase (PostgreSQL), and Tailwind CSS — designed to streamline attendance tracking, ministry management, and member engagement for churches of every size.

---

### 🌐 Live Demo
👉 **Experience the live app here:** **[https://ecclesia-church.vercel.app/](https://ecclesia-church.vercel.app/)**

---

## ✨ Overview

Ecclesia replaces manual attendance registers and scattered spreadsheets with a single platform built specifically for church operations. Admins can run live attendance sessions with expiring passcodes and QR codes, manage sub-ministries like Choir and Ushering, track engagement analytics, and communicate with their congregation — all under a secure, multi-tenant architecture that lets one user belong to multiple churches with different roles.

## 🚀 Key Features

### Multi-Tenant Architecture
- Members and admins can belong to multiple churches under a single account
- Seamless context switching between organizations via an in-app switcher
- Strict tenant data isolation enforced at the database level with Row Level Security (RLS)

### Authentication & Onboarding
- Email/password and Google OAuth sign-in
- Guided onboarding flow: profile completion → create a church or join with a unique church code
- Role-based access control: Super Admin, Sub-Admin, and Member

### Smart Attendance Engine
- **Custom Events** — one-off attendance sessions for special programs and conferences
- **Recurring Programs** — weekly schedule items (Sunday Service, Bible Study, Choir Practice) with attendance tracked per calendar occurrence, no need to recreate events every week
- Three check-in methods: auto-expiring passcodes, dynamic QR codes, and manual admin override
- Group-restricted attendance — restrict a session to a specific ministry (e.g. only Choir members can check into Choir Practice), enforced via RLS
- Real-time roster updates using Supabase Realtime — admins see check-ins live with no page refresh

### Groups & Ministries
- Create and manage sub-ministries (Choir, Ushers, Media Team, etc.)
- Add/remove members from groups with a searchable roster
- Assign group leaders and link groups to attendance restrictions

### Analytics & Reporting
- Attendance trend charts for both recurring programs and custom events
- Member retention metrics (active vs. inactive over rolling 30-day windows)
- Attendance-by-group breakdowns
- One-click CSV and PDF export of attendance reports, branded with the church's name

### Communication
- In-app announcements with optional group targeting
- Web push notifications via OneSignal, triggered automatically when an announcement is posted
- Sermon media hub with embedded video playback (YouTube, Vimeo, Facebook) and a full-screen lightbox viewer
- Weekly church schedule view, separate from one-off events

### Billing & Subscriptions
- Free, Pro, and Master pricing tiers with enforced usage limits (members, groups, events)
- Manual payment verification flow: admins upload a bank transfer receipt, reviewed and approved by the platform owner
- Automatic 30-day subscription tracking with expiry handling that preserves data instead of deleting it
- Platform-owner dashboard for reviewing and approving/rejecting payments across all churches

### Member Experience
- Personal dashboard with live "attendance open now" alerts
- Personal attendance history with streak tracking
- Profile management with avatar upload and phone verification
- Fully responsive with dedicated mobile bottom navigation

### Progressive Web App (PWA)
- Installable on mobile and desktop home screens
- Custom install prompt (not the browser default), shown only to authenticated users
- Branded app icons and splash behavior

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React + TypeScript |
| **Styling** | Tailwind CSS |
| **Routing** | React Router |
| **Backend & Database** | Supabase (PostgreSQL, Auth, Storage, Realtime, Edge Functions) |
| **Row-Level Security** | Postgres RLS policies enforcing tenant and role isolation |
| **Push Notifications** | OneSignal |
| **Charts** | Recharts |
| **PDF/CSV Export** | jsPDF, jspdf-autotable |
| **QR Code Generation & Scanning** | qrcode.react, @yudiel/react-qr-scanner |
| **PWA** | vite-plugin-pwa |
| **Deployment** | Vercel |

## 🗄️ Database Design

Ecclesia's schema is built around clean separation between:
- **Organizations** (church tenants) and **Profiles** (global user identities)
- **Memberships** as the junction enabling multi-tenant, multi-role access
- **Events** (one-off) vs. **Church Schedules** (recurring), both able to drive attendance sessions independently
- **Attendance Sessions** and **Attendance Logs**, supporting passcode, QR, and manual check-in methods
- **Groups** and **Group Members** for ministry-level organization and access restriction
- **Subscriptions** with an audit trail of manual payment approvals/rejections

All tables are protected by Row Level Security policies, with helper SQL functions (`is_org_member`, `is_org_admin`, `is_group_member`, `is_platform_superadmin`) enforcing access control directly at the database layer — not just in application code.

## 🔐 Security

- Row Level Security enforced on every table
- Tenant isolation guaranteed at the database level, not just the UI
- Storage buckets scoped per-organization and per-user with matching RLS policies
- Sensitive operations (subscription approval) run through `SECURITY DEFINER` Postgres functions with role checks baked in
- Secrets (API keys) never exposed client-side — all third-party integrations requiring private keys run through Supabase Edge Functions

## 📱 Responsive Design

Ecclesia is built mobile-first with a fully adaptive layout:
- Desktop: persistent sidebar navigation with organization switcher
- Mobile: bottom tab navigation with an expandable "More" menu for admin tools
- Installable as a native-feeling app on both platforms via PWA support

---

## 📄 License

This project is proprietary software. All rights reserved.
