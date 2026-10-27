# Honyaki Authentic Sushi Valencia — Setup & Deployment Guide

This document describes how to configure Supabase, manage database migrations, run local tests, and deploy to Vercel.

---

## 1. Supabase Project Setup

1. **Create a Supabase Project**:
   - Go to [database.new](https://database.new) and create a new project named `honyaki-sushi-valencia`.
   - Select your nearest region (e.g. `ap-southeast-1` Singapore for Philippines / Bukidnon latency optimization).
   - Set a strong database password.

2. **Execute Database Migrations**:
   - In your Supabase Dashboard, open the **SQL Editor**.
   - Copy and paste the entire script from `/supabase/migrations/20261027_honyaki_schema.sql`.
   - Click **Run**. This provisions all tables, indexes, and Row Level Security (RLS) policies.

3. **Create the Admin Account**:
   - In the **SQL Editor**, run the script from `/supabase/migrations/20261027_create_admin_account.sql`.
   - This automatically creates `honyakiitamaesushi2016@gmail.com` with confirmed status and assigns the `admin` role in `public.profiles`.

4. **Configure Storage**:
   - Navigate to **Storage** in your Supabase Dashboard.
   - Create a public bucket called `menu-dishes`.
   - Under bucket policies, allow public `SELECT` and restrict `INSERT/UPDATE/DELETE` to authenticated staff (`public.is_staff_or_admin()`).

4. **Environment Variables**:
   In your `.env` (or Vercel project settings):
   ```env
   VITE_SUPABASE_URL="https://your-project-id.supabase.co"
   VITE_SUPABASE_ANON_KEY="your-anon-key"
   ```

---

## 2. Restaurant Operating Policies & Disclaimers
 
 As specified in the official restaurant registry:
 - **Location**: 3rd Floor, ASV Townhouse, Sayre Highway, Barangay Bagontaas, Valencia City, Bukidnon, Philippines.
 - **Contact Phone**: 0954 298 2417
 - **Official Gmail**: honyakiitamaesushi2016@gmail.com
 - **Google Maps**: [Honyaki Authentic Sushi Valencia on Google Maps](https://www.google.com/maps/place/Honyaki+Authentic+Sushi+Valencia/@7.9423426,125.1109165,7617m/data=!3m1!1e3!4m15!1m8!3m7!1s0x32ff197dcc3e6a41:0xfd73c3a172dc74bc!2sValencia+City,+Bukidnon!3b1!8m2!3d7.9048967!4d125.0906584!16zL20vMDZwa2Qy!3m5!1s0x32ff1bffe3fa3871:0x8f886ec8fa41a61c!8m2!3d7.9465815!4d125.1012141!16s%2Fg%2F11p0623p4r?entry=ttu&g_ep=EgoyMDI2MTAyMC4wIKXMDSoASAFQAw%3D%3D)
 - **Operating Hours**: Tuesday – Sunday: 11:00 AM – 2:00 PM (Lunch), 5:00 PM – 9:30 PM (Dinner). Closed Mondays.
 - **Service Verification**:
   - Dine-in reservations must be confirmed by staff prior to arrival.
   - Delivery radius covers central Valencia City proper. Outlying barangays require direct coordination.
   - Catering and group orders for 15+ guests require at least 48 hours notice.

---

## 3. Deployment on Vercel

1. Push your repository to GitHub or GitLab.
2. In the Vercel dashboard, click **Add New Project** and select the repository.
3. Framework Preset: **Vite**.
4. Build Command: `npm run build`.
5. Output Directory: `dist`.
6. Add environment variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
7. Click **Deploy**.
