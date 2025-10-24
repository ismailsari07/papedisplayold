# 🕌 Pape Mosque Display

**Pape Mosque Display** is a continuously running TV screen application designed for mosque environments.  
It displays **daily prayer times**, **Friday prayer notice**, **daily hadith**, and if applicable, **ikame time change notices** for the next day — all updated automatically every night.

---

## 🧭 Overview

This screen is intended to be displayed on a **TV inside the mosque**, showing accurate and visually clear prayer times throughout the day.  
The data is automatically updated every night at **03:01 AM** via a cron job (managed in another project) that fetches fresh times from an external API and saves them into **Supabase**.  

This display project then **reads from Supabase**, ensuring that the mosque’s TV screen always presents the most current schedule and messages without any manual updates.

---

## ⚙️ How It Works

1. **Cron Job (external project):**  
   Every night at 03:01 AM, the cron fetches new prayer data (including `date`, `payload`, and `fetched_at`) and stores it in Supabase.

2. **Vercel Serverless API:**  
   The `/api/prayer/today` endpoint in this project retrieves the latest record from Supabase and returns it as JSON to the display screen.

3. **TV Display (Frontend):**  
   - The frontend (HTML/CSS/JS) fetches `/api/prayer/today` when the screen loads.  
   - Afterward, it automatically refetches data every day at **03:05 AM**.  
   - The screen updates the visible times, hadith, and notices without requiring a page reload.  

4. **Dynamic Behavior:**
   - If `payload` contains a *Friday prayer time*, it is highlighted.
   - If there is an *ikame change notice* for tomorrow, it is displayed as a small note.
   - If `payload` contains a *hadith of the day*, it is shown at the bottom.
   - If there are no notices, the notice container is hidden dynamically.

---

## 🧩 Tech Stack

| Layer | Technology | Purpose |
|-------|-------------|----------|
| **Frontend** | HTML5, CSS3, JavaScript | Display prayer times and messages on TV |
| **Backend (API)** | Node.js (Vercel Serverless Function) | Fetches data from Supabase and returns JSON |
| **Database** | Supabase | Stores daily prayer times, Friday info, hadith, and notices |
| **Environment Management** | Dotenv | Handles `.env` variables during local development |
| **Deployment** | Vercel | Hosts both the static display and API endpoint |

---

## 🗂 File Structure

```
cami-tv/
├─ public/
│  ├─ index.html        # Main display screen
│  ├─ styles.css        # Visual theme (neutral color palette)
│  └─ app.js            # Fetch & render logic for daily updates
│
├─ api/
│  └─ prayer/
│     └─ today.js       # Reads from Supabase and serves JSON data
│
├─ lib/
│  └─ supabase.js       # Supabase client initialization with dotenv
│
├─ .env                 # (not committed) Supabase credentials
├─ .gitignore           # node_modules, .env, etc.
├─ package.json         # Dependencies and ESM config
└─ vercel.json          # Rewrite and header configuration
```

---

## 🚀 Setup & Deployment

### Local Development
```bash
# install dependencies
npm install

# create your .env file in project root
SUPABASE_URL=https://YOUR_PROJECT.supabase.co
SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY

# run locally (loads .env automatically)
vercel dev
```

Then open **http://localhost:3000** in your browser.

### Deployment
1. Push to GitHub.  
2. Go to **Vercel Dashboard → New Project → Import** this repo.  
3. Under **Settings → Environment Variables**, add:
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
4. Deploy.  
   The live endpoint will be available at:  
   `https://<your-project>.vercel.app/api/prayer/today`

---

## 🖥 Design & UI

- Uses a **neutral color palette** suitable for large TV screens.  
- Layout optimized for **high contrast and legibility from a distance**.  
- Font sizes and spacing chosen for readability in public mosque environments.  
- Automatically hides notice area if there are no current announcements.

---

## 🔁 Data Model

| Column | Type | Description |
|---------|------|-------------|
| `date` | `DATE` | Prayer day (YYYY-MM-DD, Toronto TZ) |
| `payload` | `JSON` | Includes fajr, sunrise, dhuhr, asr, maghrib, isha, friday time, hadith, notices |
| `fetched_at` | `TIMESTAMP` | When the data was last fetched by cron |

---

## 🧠 Working Principle

- **Autonomous:** No manual intervention; the screen updates daily.
- **Resilient:** If today’s record is missing, API gracefully falls back to the latest available.
- **Cache-safe:** Server and client both use `Cache-Control: no-store` and `fetch(..., { cache: 'no-store' })`.
- **Timezone-safe:** Dates are calculated in **America/Toronto** timezone.

---

## 📜 License
MIT — Free for use and modification.

---

## ✨ Author Notes
Developed for **Pape Mosque** (Toronto) as part of a digital modernization effort.  
Focused on **reliability, simplicity, and readability** for continuous display use.
