# 🚗 Smart Parking Slot & Rental Availability Platform

> **Submitted By:** Rahul Mahto  
> **Submitted To:** Unified Mentor  
> **Documentation PDF:** [`Smart_Parking_Platform_Project_Documentation.pdf`](./Smart_Parking_Platform_Project_Documentation.pdf)

---

## 🌟 Executive Overview
The **Smart Parking Slot & Rental Availability Platform** is an end-to-end full-stack smart city solution that solves urban parking congestion through:
- **Interactive 2D IoT Matrix Grid**: Real-time visual sensor floor plan mapping available, occupied, and EV charging slots.
- **Dynamic Slot Reservation & Billing**: Hourly, daily, and monthly booking calculations with instant platform confirmations.
- **Live Digital Gate Passes**: Real-time countdown clock and QR barcode passes for automated parking barrier scanners.
- **Role-Based Authentication**: Dedicated **Driver** *(find & book slots)* and **Admin** *(live console, telemetry & manual slot override)* accounts with icons.
- **Day / Night Mode UI/UX**: Full light and dark theme adaptation with fluid transitions and persistent user preference.
- **Cloud-Ready Deployments**: Backend configured for **Vercel** serverless functions, frontend configured for **Netlify** high-speed global CDN.

---

## 🚀 Cloud Deployment Instructions

### 1. ⚡ Backend Deployment on Vercel
The backend is configured with [`Backend/vercel.json`](./Backend/vercel.json) for instant serverless execution.

1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```
2. Navigate to the backend directory:
   ```bash
   cd Backend
   ```
3. Deploy with Vercel:
   ```bash
   vercel
   ```
4. Set Environment Variables in the Vercel Dashboard:
   - `MONGO_URI` = `mongodb+srv://<username>:<password>@cluster.mongodb.net/smartpark`
   - `JWT_SECRET` = `your_super_secret_jwt_key_2026`
   - `NODE_ENV` = `production`
5. Deploy to production:
   ```bash
   vercel --prod
   ```
   *Your API URL will be: `https://your-backend.vercel.app`*

---

### 2. 🌐 Frontend Deployment on Netlify
The frontend is configured with [`Frontend/netlify.toml`](./Frontend/netlify.toml) and [`Frontend/public/_redirects`](./Frontend/public/_redirects) for Single Page Application (SPA) routing.

1. Push this repository to GitHub / GitLab / Bitbucket.
2. In **Netlify Dashboard**, click **"Add new site"** &rarr; **"Import an existing project"**.
3. Configure Build Settings:
   - **Base directory:** `Frontend`
   - **Build command:** `npm run build`
   - **Publish directory:** `Frontend/dist`
4. Set Environment Variables in Netlify:
   - `VITE_API_URL` = `https://your-backend.vercel.app` *(Your Vercel backend URL)*
5. Click **Deploy Site**. Netlify will build and deploy the application with HTTPS.

---

## 🛠️ Local Development

### 1. Start the Backend API (Port 5000)
```bash
cd Backend
npm install
npm run seed     # Seeds demo parking slots & telemetry
npm start        # Launches Express server on http://localhost:5000
```

### 2. Start the Frontend (Vite)
```bash
cd Frontend
npm install
npm run dev      # Launches React app on http://localhost:3000
```

---

## 📄 Project Documentation PDF
A complete, multi-page report with screenshots, diagrams, and technical specifications is available in:
[`Smart_Parking_Platform_Project_Documentation.pdf`](./Smart_Parking_Platform_Project_Documentation.pdf)
