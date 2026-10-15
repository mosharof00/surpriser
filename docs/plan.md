# Expedition Surprise: Hiking Invitation Web Application

A personalized, interactive hiking invitation web application created for a best friend living in Albania. Designed with high-end alpine aesthetics, engaging gamified steps, a playful surprise RSVP, and instant email dispatch of all user inputs upon confirmation.

---

## 1. Project Objectives
1. **Unforgettable Surprise**: Transform a simple invitation into an immersive, gamified alpine journey tailored to Albania's majestic mountain landscapes.
2. **Interactive Multi-Step Journey**:
   - Mystery teaser briefing
   - Trail vibe and mountain snack selector
   - Curated Albanian summit explorer (Valbona-Theth, Lake Bovilla, Maja e Çikës / Llogara)
   - Expedition calendar and gear checklist
   - Heartfelt personal note and playful interactive RSVP (with runaway "No" button)
   - Digital "Summit Boarding Pass" ticket with instant confetti celebration
3. **Automated Notification**: Once the friend accepts and confirms, all selected trail details, dates, snack choices, and custom notes are instantly sent via email to the organizer.
4. **Vercel Readiness**: Optimized for zero-friction free deployment on Vercel with environment variable support for email routing.
5. **Aesthetics & Typography**: Premium outdoor luxury feel using Google Fonts (*Outfit* and *Playfair Display* / *Cabinet Grotesk* aesthetic), dark emerald tones, warm sunrise gold, glassmorphic cards, and fluid micro-animations.

---

## 2. Technical Stack
- **Framework**: Next.js 16 (App Router) + React 19 + TypeScript
- **Styling**: Pure Modern CSS with CSS Variables & CSS Modules (no external styling bloat, responsive, fluid animations)
- **Icons**: Lucide React
- **Celebration Effects**: Canvas Confetti
- **Email Delivery**: Next.js API Route (`/api/send-rsvp`) + Web3Forms / Resend webhook with graceful offline/preview fallback
- **Audio / Ambience**: Web Audio API generated gentle alpine breeze / nature chime ambience (zero external audio file dependency)

---

## 3. Visual Design System

### 3.1 Color Palette
- **Forest Abyss (Background Dark)**: `#0B1713`
- **Alpine Slate (Card Backgrounds)**: `rgba(20, 38, 32, 0.75)` with `backdrop-filter: blur(16px)`
- **Alpine Pine (Accents)**: `#1F4E3D`
- **Summit Sunrise (Primary Gold)**: `#F5B843`
- **Warm Glow (Hover Highlights)**: `#FFD166`
- **Emerald Pulse (Success / Badges)**: `#2EC4B6`
- **Pure White / Mist Text**: `#F8FAF9` and `#A2B7AF`

### 3.2 Typography
- **Heading Font**: *Outfit* & *Playfair Display* (Imported via `next/font/google` for zero layout shift)
- **Body Font**: *Plus Jakarta Sans*

---

## 4. User Journey & Step Progression

### Phase 1: The Mystery Briefing (Hero)
- Alpine mountain silhouette with glowing sunrise gradient.
- Coordinates badge: `📍 42.0693° N, 19.7828° E — Accursed Mountains, Albania`
- Classified Mission prompt: *"A secret summit expedition has been planned exclusively for you. Do you accept the mission?"*
- Interactive Ambient Sound toggle (generative soft wind & chirps).

### Phase 2: Trail Vibe & Provisions
- **Vibe Selection**: 
  - 📷 *Panoramic Ridge & Golden Hour Photos*
  - 🧗‍♀️ *Challenging Summit Conquest*
  - 🧺 *Chill Alpine Lake Picnic & Hammock Nap*
- **Trail Snack of Choice**:
  - 🫓 *Warm Albanian Byrek*
  - 🍫 *Dark Chocolate & Salted Nuts*
  - 🍇 *Fresh Figs, Apples & Cheese*
  - 🫖 *Traditional Çaj Mali (Mountain Herbal Tea)*

### Phase 3: The Albanian Summit Selection
Curated interactive cards with real distance, elevation gain, and descriptions:
1. **Valbona to Theth Pass** (The Crown Jewel of the Albanian Alps, 17 km, 1,795m)
2. **Lake Bovilla Cliff Balcony** (Turquoise Reservoir & dramatic cliff-edge viewpoint, 6 km)
3. **Maja e Çikës / Llogara Pass** (Where the Ceraunian Mountains touch the Ionian Sea, 12 km)
4. **Secret Wildcard** ("Surprise Me / You Choose the Ridge!")

### Phase 4: Schedule & Gear Checklist
- **Preferred Timing**: Weekend selector or custom date picker.
- **Organizer Gear Duty**: Checkboxes for what the organizer will carry:
  - ☕ Hot Thermos with Mountain Tea / Coffee
  - 📸 Camera for epic ridge photos
  - 🎒 Extra warm fleece & windbreaker
  - 🎵 Bluetooth trail tunes speaker
  - 🥪 Fresh summit snacks & fruits

### Phase 5: The Grand Proposal & Playful RSVP
- A handwritten-style personal letter card.
- The big question: *"Will you climb this mountain with me?"*
- Buttons:
  - **"YES, ABSOLUTELY!"** (Triggers celebration sound, confetti, moves to ticket)
  - **"No"** (Playful dodging button: moves to random positions on hover/touch, or cycles hilarious prompts like *"Are you sure?"*, *"Wrong button!"*, *"Boots already tied!"*)

### Phase 6: Summit Victory & Instant Email
- Generates a customized **Digital Summit Boarding Pass** with:
  - Trail Name, Date, Provision picks, Hiker Name, Pass ID
  - Download / Screenshot friendly card
- Dispatches all collected answers to the organizer's email via `/api/send-rsvp`.

---

## 5. Implementation Roadmap
1. [x] Scaffold Next.js project with App Router and TypeScript
2. [x] Install Lucide React and Canvas Confetti
3. [x] Create project documentation (`docs/plan.md`)
4. [x] Build ambient audio generator and Google Fonts integration in `layout.tsx`
5. [x] Build CSS design system in `globals.css` (tokens, glassmorphism, animations, cards)
6. [x] Implement `/api/send-rsvp` route supporting Web3Forms / direct webhook email delivery
7. [x] Build interactive multi-step component with persistent state & validation
8. [x] Implement the playful runaway "No" button and confetti summit celebration
9. [x] Create the digital Boarding Pass export/preview
10. [x] Test build (`npm run build`) and verify Vercel deployment configuration

---

## 6. How to Deploy on Free Vercel in 2 Minutes

1. **Push your code to GitHub**:
   ```bash
   git add .
   git commit -m "feat: complete hiking surprise invitation web app"
   git branch -M main
   git remote add origin https://github.com/your-username/surpriser.git
   git push -u origin main
   ```
2. **Import to Vercel**:
   - Go to [vercel.com/new](https://vercel.com/new).
   - Select your `surpriser` repository.
   - Framework preset: **Next.js** (automatically detected).
3. **Set Up Your Email Notification (Free)**:
   - Go to [web3forms.com](https://web3forms.com/) and type your email to get your free key in 5 seconds.
   - In Vercel Project Settings > **Environment Variables**, add:
     - Name: `WEB3FORMS_ACCESS_KEY`
     - Value: `your-web3forms-access-key`
4. **Click Deploy**:
   - Vercel gives you a free live URL (e.g., `https://surpriser.vercel.app`).
5. **Send to Her**:
   - Share the link directly or customize it with her name:
     `https://surpriser.vercel.app?name=HerName`

