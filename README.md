# Aman Safar (امان سفر) — Your Safety, One Tap Away

A women’s safety and emergency alert web application engineered for students, working women, travelers, and families.

---

## Important Safety Rule & Disclaimer

> **Critical Operational Policy:**  
> Aman Safar is a personal community support and coordination platform. It does **not** claim that police, ambulance, university security, or emergency authorities are automatically notified or guaranteed to respond. The SOS feature alerts the user's selected trusted emergency contacts and shares a live location link via WhatsApp, SMS, and direct dialing when internet and device location permissions are active.

---

## Core Features

1. **One-Tap SOS Emergency Center:**
   - 5-second accidental tap cancellation countdown.
   - Browser Geolocation API acquisition.
   - Pre-filled WhatsApp distress dispatch:  
     `"Emergency! I need help. My current location is: [Google Maps Link]. Please contact me immediately."`
   - Pre-filled direct SMS and telephone dialing (`tel:`) to primary contact.
   - Incident history logging.

2. **Trusted Emergency Contacts Hub:**
   - Save up to 5 verified contacts (Relationship, Phone, WhatsApp, Email).
   - Star primary guardian for instant one-tap dispatch.
   - Direct call and WhatsApp test triggers.

3. **Live Journey Location Sharing:**
   - Ephemeral, time-limited tracking sessions (15, 30, or 60 minutes).
   - Real-time OpenStreetMap/Leaflet positioning.
   - Secure public tracking link with cryptographic share token (`/track/:token`).
   - Strict privacy: viewers only see coordinates and expiration time, never private profiles or emails.

4. **Safety Check-In Schedule:**
   - Set expected arrival timer (e.g., "Arrived at hostel after lab").
   - "I Am Safe" one-tap completion.
   - Automatic missed-status detection with designated guardian contact prompt.

5. **Community Safety Map & Unsafe Spot Reporting:**
   - Anonymous reporting for broken streetlights, deserted stretches, and harassment spots.
   - Moderator desk approval workflow before appearing on public map.
   - Explicit advisory notice: *"Community-reported information — use caution and verify locally. Aman Safar does not certify any route as officially safe."*

6. **Safety Tips & Urdu Bilingual Guidance:**
   - Practical categories: Travel, University & Hostel, Public Transport, Online Safety, Emergency Preparedness, First Response.
   - Full English and Urdu translations (`اردو`).

7. **Admin Control Center:**
   - Moderation desk to approve/reject hazard reports.
   - Content management to add, edit, and publish safety guides.
   - Live audit logs for SOS alerts, active tracking broadcasts, and community inquiries.

---

## Tech Stack

- **Frontend:** React 19, TypeScript, Vite
- **Styling:** Tailwind CSS v4, Lucide React icons
- **Maps:** Leaflet & OpenStreetMap
- **Routing:** React Router v7 (`react-router-dom`)
- **Database & Auth:** Supabase (`@supabase/supabase-js`) with full Row Level Security (RLS) policies + Resilient Local Storage fallback for instant offline/demo evaluation
- **State & Forms:** React Context, React Hook Form, Zod

---

## Supabase Database Setup & Connection Instructions

### 1. Create a Supabase Project
1. Go to [https://supabase.com](https://supabase.com) and create a free project.
2. Under **Project Settings > API**, copy:
   - **Project URL**
   - **Anon public key**

### 2. Configure Environment Variables
Set your environment variables in `.env` (or via your deployment settings):
```bash
VITE_SUPABASE_URL="https://YOUR_PROJECT_ID.supabase.co"
VITE_SUPABASE_ANON_KEY="YOUR_SUPABASE_ANON_KEY"
```

*Note: If these variables are not supplied or invalid, Aman Safar automatically and seamlessly falls back to its built-in reactive local storage engine with pre-seeded realistic data.*

### 3. Run Database Schema
1. In the Supabase Dashboard, open the **SQL Editor**.
2. Open `supabase/schema.sql` from this repository.
3. Paste and run the entire script. It provisions:
   - `profiles`
   - `emergency_contacts`
   - `sos_alerts`
   - `live_location_sessions`
   - `safety_checkins`
   - `unsafe_place_reports`
   - `safety_tips`
   - `contact_messages`
   - Row Level Security (RLS) policies ensuring users only view and manage their own data.

### 4. How to Create the First Admin Account

#### Method A: Instant Reviewer Mode (Zero Setup Required)
Click **"Sign In As Demo Admin"** on `/admin-login` or `/login`. You will be authenticated as the built-in demo administrator with full access to moderation tables and statistics.

#### Method B: In Supabase Production
1. Register a new user at `/register` (e.g. `admin@yourdomain.com`).
2. In Supabase Dashboard, go to **Table Editor > profiles**.
3. Locate the user row and set the `role` column to `'admin'`.
4. The user can now access `/admin` and moderate reports, publish safety guides, and review logs.

---

## Direct Emergency Helplines (Dial Free)

- **Police Emergency:** `15`
- **Women Protection Helpline:** `1043`
- **Edhi Ambulance:** `115`
- **Motorway Police:** `130`
