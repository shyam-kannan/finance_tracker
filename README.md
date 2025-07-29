# 🧾 FinanceTracker – AI-Powered Receipt Intelligence App

Welcome to **FinanceTracker**, a sleek, modern full-stack web app that helps you intelligently track and analyze your expenses using AI. Upload receipts (images only), extract store names and categories with Google's **Gemini LLM**, and get spending insights—all wrapped in a clean, user-friendly dashboard.

---

## Features

- **Image Upload Only**: Upload receipt screenshots (PNG, JPG, etc.)
- **AI Receipt Intelligence**: Gemini LLM extracts store name + category automatically
- **Non-Receipt Rejection**: Non-purchase images are auto-rejected with a friendly toast message
- **Calendar Reminder Prompt**: Option to set a return reminder if a deadline is detected
- **Dynamic Dashboard**: Track transactions, budgets, analytics, and AI-based insights

---

## 🖼Screenshots

| Dashboard | Transactions | Upload Receipt |
|----------|--------------|----------------|
| ![Dashboard](./public/screenshots/Screenshot%202025-07-29%20150942.png) | ![Transactions](./public/screenshots/Screenshot%202025-07-29%20150950.png) | ![Upload](./public/screenshots/Screenshot%202025-07-29%20151145.png) |

| AI Insights | Budgets | Analytics |
|-------------|---------|-----------|
| ![AI Insights](./public/screenshots/Screenshot%202025-07-29%20151210.png) | ![Budgets](./public/screenshots/Screenshot%202025-07-29%20151224.png) | ![Analytics](./public/screenshots/Screenshot%202025-07-29%20151158.png) |

| Settings | Appearance |
|----------|------------|
| ![Settings](./public/screenshots/Screenshot%202025-07-29%20151210.png) | ![Appearance](./public/screenshots/Screenshot%202025-07-29%20151152.png) |

---

## 🚀 Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/yourusername/finance-tracker.git
cd finance-tracker
```
### 2. Install Dependencies

```bash
npm install
```
### 3. Set up your .env file
Create a .env.local file in the root and include the following:

```bash
NEXT_PUBLIC_GOOGLE_API_KEY=your_gemini_api_key
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Run the development server

```bash
npm run dev
```
Visit http://localhost:3000 to view the app in your browser.

---

## Tech Stack

- **Framework:** Next.js 13 (App Router) + TypeScript
- **UI:** TailwindCSS + Shadcn + Lucide Icons
- **Auth:** Supabase Auth
- **Storage:** Supabase Storage
- **AI:** Gemini Pro API for smart receipt analysis
- **OCR:** Tesseract.js for image-to-text extraction
- **Reminders:** Optional Google Calendar integration via user prompt

---

## Author

- **Shyam Kannan — Software Developer**

---
