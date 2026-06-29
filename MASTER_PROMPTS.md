# Elevoras Smart Car Wash Ecosystem
## Enterprise Master Prompts & Architecture Specifications

This document contains the complete specifications, feature trees, database schemas, and AI automation modules for the Elevoras Smart Car Wash Ecosystem.

---

## 🎨 UNIVERSAL DESIGN SYSTEM

### Theme: Modern Premium Luxury

* **Primary Orangish-Red Theme Accents**:
  - Main brand CTAs: `#FF5722`
  - Secondary brand highlights: `#FF6A3D`
* **Charcoal Black Panels & Bases**:
  - App background: `#0F0F10`
  - Surface cards & layouts: `#181818`
  - Borders & dividers: `#242424`
* **Success Green Accents**:
  - Complete checkmarks & verified steps: `#00C853`
  - Transaction values & positive indicators: `#4CAF50`
* **Neutral Palette**:
  - Light mode base background: `#F8F9FA`
  - Primary text / borders: `#ECECEC`
  - Muted secondary text / indicators: `#9E9E9E`
* **Typography**:
  - Primary display & headings: **`Poppins`**
  - Clean UI & body: **`Inter`**
  - System data, codes, timers: **`JetBrains Mono`**
* **Aesthetic Components**:
  - Glassmorphism overlays, soft shadows, rounded corners, fluid transitions, pull-to-refresh animations, skeleton loaders, and interactive hover states.

---

## 📱 1. CUSTOMER MOBILE APP (Master Prompt)

> Build a world-class premium Customer Car Wash application that feels like Uber, Tesla, and Apple combined.

* **Technology Stack**: Flutter (or React Native), Firebase Auth, Node.js backend, MongoDB, Socket.IO, Razorpay, Firebase Cloud Messaging, Google Maps, Riverpod/Zustand state management.
* **Authentication**: Mobile OTP, Email, Google Login, Apple Login, Face ID, and Fingerprint.
* **Home Screen**:
  - Dynamic "Good Morning" greeting.
  - Live status indicator ring for today's wash.
  - Next upcoming wash countdown.
  - Active subscription plan tier.
  - Wallet balances with neon green LED font style.
  - Quick action buttons (Request service, Book deep clean).
  - Nearby support and promo banners.
  - Premium vector car illustration with animations.
  - AI Assistant floating trigger.
* **Car Garage Management**:
  - Support for unlimited vehicles per resident.
  - Details: photo upload, custom nickname, license plate number, brand, model, color, fuel type, and cleaner instructions.
* **Booking Panel**:
  - Options: One-time wash, weekly/monthly subscription, premium deep polish, exterior/interior detail, engine steam wash, ceramic coating.
  - Categorization: SUV, Luxury sedan, Hatchback, Corporate fleet, Gated community resident discount.
* **Live Wash Tracking**:
  - Real-time pit-stop tracker.
  - Cleaner GPS locator and estimated time of arrival (ETA).
  - Multi-stage progress line: Scheduled ➔ Cleaner Arrived ➔ Wash Started ➔ Completed.
  - Live upload photo preview stream.
* **Before & After Timeline**:
  - Image slider comparison with double-tap zoom, screenshot download, and timeline histories.
* **Payments & Billing**:
  - Razorpay, saved cards, UPI instant pay, digital wallet balance, AutoPay subscription setup.
  - Automated PDF invoices with GST itemizations.
  - Promo codes, rewards coins, cashback logs.
* **Subscription Tiers**:
  - Silver, Gold, Diamond, Gated Apartment special, Corporate account, Family multi-car bundles.
* **AI Car Care Assistant**:
  - Recommends wash frequency based on local dust index and precipitation forecasts.
  - Reminders: tire rotations, insurance renewals, standard service intervals, battery check.
* **Smart Notifications**:
  - Trigger alerts: wash started, wash completed with photo link, payment confirmed, low wallet balance warning, shift scheduling changes.
* **Reviews & Appreciation**:
  - Star ratings, text comments, photo reviews, tip option for cleaner.
* **Referral & Loyalty**:
  - Shareable referral link, rewards wallet, gamified monthly cleaner leaderboard.
* **Customer Support**:
  - In-app support chat, voice calls, ticket tracker.

---

## 🧽 2. CLEANER MOBILE APP (Master Prompt)

> Build a highly optimized field-service application designed for professional cleaners.

* **Technology Stack**: Flutter, Offline-first database caching, Background GPS tracker, SQLite local storage, Socket.IO, Camera API wrapper, Biometrics.
* **Login**: Employee ID verification + OTP, fingerprint/face login.
* **Dashboard**:
  - Daily job list queue.
  - Attendance tracker indicator.
  - Performance scorecards.
  - Incentive/target progress wheels.
  - Total earnings (daily/monthly metrics).
  - Daily top cleaner leaderboard.
* **Attendance System**:
  - GPS-linked geofencing check-in/out.
  - Selfie submission requirement (anti-proxy check).
  - Live clock-in hours counter.
* **Job Queue Navigation**:
  - Address details: Block, Flat, vehicle spot location, priority badge.
  - Google Maps navigation with estimated travel paths.
* **Wash Execution Workflow**:
  - Accept Job ➔ Arrive at Spot ➔ Start Wash (lock timer) ➔ Interactive Checklist ➔ Before Image ➔ Cleaning ➔ After Image ➔ Submit.
* **Camera Module (OS-Enforced)**:
  - System camera lock: Gallery access disabled to prevent fake uploads.
  - Auto-watermarks: GPS tags, date, timestamp, and plate recognition.
  - Image verification checks (checks focus, blur, lighting).
* **AI Wash Quality Checker**:
  - Edge detection check: verifies that the target car is fully centered.
  - Water/foam presence verification.
  - Anti-fraud duplicate detector (checks if previous day's photo was reused).
* **Inventory Tracking**:
  - Current supplies: liquid quantities, cleaning sprays, microfiber towels.
  - Low stock warning + Request restock trigger to admins.
* **Offline Synchronization**:
  - Works offline when in basement parking spots.
  - Queues wash photos locally in SQLite and automatically syncs when network is restored.
* **Field Features**:
  - Pre-existing damage reporter (log vehicle dents/scratches with photos before starting).
  - SOS emergency button, voice notes, leave request forms.

---

## 🖥️ 3. ADMIN WEB APPLICATION (Master Prompt)

> Build an enterprise-grade SaaS Admin Dashboard capable of managing thousands of apartments, customers, vehicles, cleaners, payments, and analytics.

* **Technology Stack**: Next.js 14, React, TypeScript, Node.js, MongoDB, Redis caching, Chart.js/Recharts data visualizations, Tailwind CSS.
* **Command Center**:
  - Live metrics: Today's Revenue, Total Completed Washes, Active On-Duty Cleaners, Pending Wash Queue, Checked-In Cleaners list.
  - Donut charts for completion rates, line charts for revenue trends, bar charts for weekly wash stats.
  - Interactive map showing active cleaners' live GPS coordinates.
* **Customer Registry (CRM)**:
  - Complete CRUD table, bulk Excel import/export.
  - Subscription tier tracking, linked vehicles, transaction logs, wallet adjustments, and support tickets.
* **Cleaner Directory**:
  - Cleaner profile listings, rating averages, attendance summaries, logs, payroll, monthly bonus awards.
* **Apartment Digital Twin**:
  - Visual structural map: Complex name ➔ Blocks ➔ Towers ➔ Flats ➔ Parking Slots.
  - Quick cleaner-to-flat scheduling table.
* **Intelligent Scheduler**:
  - AI automatic cleaner-to-flat assignments based on distance and workload.
  - Manual override panels, recurring schedules, vacation logs, route optimization.
* **Live Wash Monitor**:
  - Kanban board: Upcoming Washes | Washing (live counters) | Completed (images + verification).
  - Auto-reassignment tool if a cleaner is delayed or flags an issue.
* **Financial Ledger**:
  - Monthly invoices, wallet payouts, refund requests, GST collections, and ledger exports.
* **Security & Audit Logs**:
  - Role-Based Access Control (RBAC): Super Admin, Manager, Agent, Auditor.
  - System logs: records every IP request, configuration edit, and database deletion.

---

## 🗄️ DATABASE ARCHITECTURE (Collections)

* `Users`: General user accounts, roles, auth metadata.
* `Customers`: Customer profile, flat link, notification settings.
* `Cleaners`: Cleaner employee profile, assigned flats, attendance logs.
* `Admins`: Admin system user metadata, access permissions.
* `Apartments`: Complex name, towers, blocks, parking slot mapping.
* `Flats`: Flat ID, tower, block, primary resident link.
* `Vehicles`: Plate number, type, brand, color, resident ID.
* `WashSchedules`: Booking details, cleaner ID, flat ID, days scheduled, times.
* `WashHistory`: Wash completed records, start time, end time, photo proof URL, check status.
* `Attendance`: Check-in selfie URL, GPS check, clock-in, clock-out.
* `Subscriptions`: Active plan, start date, end date, billing cycle.
* `Invoices`: Billing invoices, payments, tax calculations.
* `Payments`: Razorpay transaction logs, state updates.
* `Wallets`: Customer balance logs, credits, debits.
* `Notifications`: Alerts stack, read status, channel.
* `Ratings`: Wash feedback, stars, comment, review date.
* `Inventory`: Cleaner supplies logs, restock request status.
* `AuditLogs`: Admin activity history logs, IP bounds.

---

## 🤖 AI AUTOMATION WORKFLOWS

1. **AI Cleaner Assignment**: Automatically recalculates cleaner work queues to minimize walking distance between towers.
2. **AI Quality & Fraud Prevention**: Parses before/after images using vision checks. Flags duplicates or blurry uploads instantly.
3. **AI Precipitation Forecast**: Reads meteorological reports to pause or reschedule scheduled exterior washes on rainy days automatically.
4. **AI Churn Alert**: Flags residents who haven't rated services or have experienced delayed washes.

---

## 💫 PREMIUM MICRO-INTERACTIONS

* Liquid check-in button animations.
* Floating Action Button (FAB) menus that slide out.
* Confetti burst on payment confirmations.
* Live countdown counters.
* Masonry grids with smooth load-ins for photo feeds.
* Skeleton loading panels.
