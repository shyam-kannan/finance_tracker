# FinanceTracker – AI-Powered Receipt Intelligence App

FinanceTracker is an AI-powered personal finance web app that transforms how you manage expenses. Simply upload a receipt image or PDF — and the app will automatically detect whether it's a valid purchase receipt, extract all essential information (vendor, total, date, payment method), categorize your spending, and offer personalized insights using a powerful language model.

Whether you’re trying to stay within your monthly food budget or spot sneaky recurring charges, FinanceTracker delivers an intelligent, automated, and visually intuitive solution for staying in control of your money — all with zero manual data entry.

---

## Features

- **Image Upload Only**: Upload receipt screenshots (PNG, JPG, etc.)
- **AI Receipt Intelligence**: Gemini LLM extracts store name + category automatically
- **Non-Receipt Rejection**: Non-purchase images are auto-rejected with a friendly toast message
- **Calendar Reminder Prompt**: Option to set a return reminder if a deadline is detected
- **Dynamic Dashboard**: Track transactions, budgets, analytics, and AI-based insights

---

## App Overview

### Main Views

<div style="display: flex; overflow-x: auto; gap: 20px; padding: 10px 0;">
  <div style="min-width: 500px;">
    <strong>Dashboard</strong><br/>
    <img src="https://i.imgur.com/naryNNP.png" width="100%"/>
  </div>
  <div style="min-width: 500px;">
    <strong>Transactions</strong><br/>
    <img src="https://i.imgur.com/QDE2yXq.png" width="100%"/>
  </div>
</div>

### Analytics & AI

<div style="display: flex; overflow-x: auto; gap: 20px; padding: 10px 0;">
  <div style="min-width: 500px;">
    <strong>AI Insights</strong><br/>
    <img src="https://i.imgur.com/Kx2BaTs.png" width="100%"/>
  </div>
  <div style="min-width: 500px;">
    <strong>Budgets</strong><br/>
    <img src="https://i.imgur.com/r2XQS3c.png" width="100%"/>
  </div>
  <div style="min-width: 500px;">
    <strong>Analytics</strong><br/>
    <img src="https://i.imgur.com/vjYXrRv.png" width="100%"/>
  </div>
</div>

### Settings

<div style="display: flex; overflow-x: auto; gap: 20px; padding: 10px 0;">
  <div style="min-width: 500px;">
    <strong>Settings</strong><br/>
    <img src="https://i.imgur.com/p9MJIA7.png" width="100%"/>
  </div>
</div>


## Getting Started

### Webapp link to avoid running locally 
https://financebuddy101.netlify.app/

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
