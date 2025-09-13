# Aapda Setu - Disaster Preparedness App 🛡️

A comprehensive web application designed to equip students and educational institutions in India with the tools and knowledge needed for effective disaster preparedness and response. This project was built for a hackathon.

## 🚀 Live Demo

The live version of Aapda Setu is deployed on Vercel.

Visit: https://bit.ly/aapdasetu

---

## ✨ Key Features

- **🚨 Real-Time Alerts**: Live disaster warnings to keep students and staff informed.
- **📚 Video Library**: A curated collection of educational videos on various disaster protocols.
- **🧠 Interactive Quizzes**: Gamified quizzes to test knowledge and reinforce learning.
- **🔥 Virtual Drills**: Step-by-step interactive simulations for emergency procedures.
- **📞 Emergency Contacts**: A quick-access directory for critical services.
- **📊 Admin Dashboard**: A portal for school administrators to track campus-wide preparedness.

---

## 🛠️ Tech Stack

- **Frontend**: React (Vite)
- **Styling**: Tailwind CSS
- **Routing**: React Router
- **Deployment**: Vercel

---

## Auth, Admin, Assistant (This branch)

This branch adds authentication (currently in DEMO MODE with hardcoded users), role-based dashboards, persistent dark mode and settings, and a floating Assistant.

Temporary demo credentials:

- Student: user `student`, password `student` (redirects to `/dashboard`)
- Staff/Admin: user `admin`, password `admin` (redirects to `/admin`)

Note: Google Sheets integration remains in the code but is disabled when env vars are missing or `USE_HARDCODED_AUTH=true`. To re-enable Sheets, set the env vars as described below.

### Demo-only Auth (Hardcoded)

In this demo build, Google Sheets is disabled and credentials are hardcoded:

- Student: user `student`, password `student` → `/dashboard`
- Staff/Admin: user `admin`, password `admin` → `/admin`

If you want to re-enable Sheets later, restore the removed files and env configs and replace the demo handlers with real integrations.

### Environment Variables

Create a local `.env` and set the following (see `.env.example`):

GOOGLE_SERVICE_ACCOUNT_KEY (JSON string)
GOOGLE_SHEETS_USERS_SHEET_ID
JWT_SECRET
LLM_PROVIDER, LLM_MODEL_DEFAULT, LLM_MODEL_LONG, LLM_API_KEY

### Dev

```
npm i
npm run dev
```

Vite runs on :5173; API server on :5174 proxied at `/api`.

### Notes

All server endpoints run in demo mode with in-memory data; no external services are called.
