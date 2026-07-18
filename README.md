# ⚡ StadiumPulse

StadiumPulse is an advanced, real-time stadium operations, crowd flow intelligence, and automated dispatch control center. Designed specifically to address the high-occupancy operational challenges of **FIFA World Cup 2026** venues, it translates raw telemetry metrics into actionable predictive insights to pre-emptively manage surges, dispatch personnel, and ensure visitor safety.

🔗 **[Watch the LinkedIn Project Walkthrough & Pitch Video](https://www.linkedin.com/posts/austin-aro-3156a432a_promptwars-antigravityide-reactjs-ugcPost-7484312132839235584--SiR/?utm_source=share&utm_medium=member_desktop&rcm=ACoAAFMKLsEBmjzKEjNCCQPbSreGGlRLvLg16_g)**

---

## 🎯 Problem Statement Alignment (FIFA World Cup 2026)

FIFA World Cup 2026 venues present unprecedented operational challenges: extreme crowd density, concurrent match-day arrivals, localized flow bottlenecks, and high pressure on security and hospitality staff. StadiumPulse aligns directly with these challenges:

| World Cup Challenge | StadiumPulse Solution | Operational Impact |
| :--- | :--- | :--- |
| **High-Density Crowd Surges** | **Spatial Minimap** displays real-time capacity and occupancy metrics across 12 stadium sectors. | Operators get instant visual warnings when sectors cross critical thresholds (>85%). |
| **Gate & Concourse Bottlenecks** | **GenAI Copilot** dynamically calculates queue times, flags flow risks, and provides optimization advice. | Re-routes resources before wait times exceed the 15-minute SLA limit. |
| **Delayed Emergency Dispatch** | **Auto-Dispatch Command** (`SPACE` key) instantly routes nearest staff (e.g. Staff Alpha) to peak zones. | Cuts incident response times from minutes to seconds. |
| **Network Outages & Drops** | **Progressive Web App (PWA)** integration registers active standalone offline service workers. | Operations dashboard remains accessible and functional on mobile terminals even under network strain. |
| **Post-Event Compliance Audits** | **CSV Incident Log Exporter** generates structured, downloadable audit reports. | Provides event organizers and safety compliance officers with instantly reviewable operational records. |

---

## ✨ Features

### 🧠 GenAI Operational Copilot
- **Predictive Radar**: Automatically tracks occupancy metrics across all 12 zones every 3 seconds to predict peak bottlenecks and evaluate crowd-flow risks.
- **Resource Optimization Plans**: Recommends dynamic staff re-routing strategies based on capacity differences (e.g. from under-utilized merchandise stands to congested gates).
- **Automation Action**: Auto-dispatches personnel to the predicted peak zone with a single click or keyboard command.

### 🗺️ Spatial Stadium Minimap
- **2D Schematic Arena Grid**: Renders a CSS Grid layout representing the physical zones of the stadium.
- **Synchronized Focus**: Selecting a card or hovering over a map sector highlights it on both the grid and the minimap in real time.

### 🔊 Programmatic Synthesized Sound Alerts
- **Offline Reliability**: Uses the **Web Audio API** to programmatically synthesize warning chimes and high-priority siren tones in the browser—guaranteeing sound alerts work instantly without depending on external media assets.
- **Header Mute Switch**: Easily toggle sound alerts on and off from the operations header.

### ⌨️ Operations Center Keyboard Shortcuts
- Press `?` to toggle the shortcuts help menu.
- Press `ESC` to clear active zone highlighting.
- Select and scroll to any card instantly:
  - `N` → North Gate | `E` → East Gate | `G` → South Gate | `W` → West Gate
  - `V` → VIP Lounge | `P` → Press Box | `Y` → Family Zone | `S` → Supporters Section
  - `A` → Concourse A | `B` → Concourse B | `F` → Food Court | `M` → Merchandise
- Press `SPACE` to trigger the AI Recommended Auto-Dispatch action.

---

## 🛠️ Tech Stack

- **Framework**: React 18, Vite 8 (with Rolldown compilation)
- **Styling**: Tailwind CSS v4 (native `@tailwindcss/vite` plugin compilation)
- **PWA Capabilities**: `vite-plugin-pwa` (standalone service workers)
- **Testing Suite**: Vitest
- **Audio engine**: Web Audio API

---

## 🚀 Installation & Local Run

Copy and paste the following commands into your terminal:

### 1. Clone & Navigate
```bash
git clone https://github.com/AustinAro/Stadium_Pulse.git
cd StadiumPulse
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Run Automated Unit Tests
```bash
npm run test
```

### 4. Launch Development Server
```bash
npm run dev
```
Open **[http://localhost:5173/](http://localhost:5173/)** in your browser.

---

## 📂 Project Directory Structure

```text
StadiumPulse/
├── index.html              # Entry point index file
├── package.json            # Scripts, React, Vite, PWA, and Tailwind v4 dependencies
├── vite.config.js          # Configures PWA, Tailwind v4, and React plugins
├── postcss.config.js       # AutoPrefixer CSS configurations
└── src/
    ├── App.jsx             # Wraps components inside StadiumProvider
    ├── index.css           # Custom CSS animations and Tailwind imports
    ├── main.jsx            # DOM creation mount point
    ├── components/
    │   ├── Dashboard.jsx   # Metric panels, Minimap, Keyboard listeners, AI Copilot, CSV Exporter
    │   ├── MetricCard.jsx  # Zone status indicator card
    │   ├── IncidentItem.jsx# Alarm ticket card
    │   └── RuleEngine.jsx  # Background metrics evaluator (triggers incidents)
    ├── context/
    │   └── StadiumContext.jsx # Shared states, handler callbacks, and AI generators
    └── data/
        ├── mockDataEngine.js  # Telemetry generator
        ├── mockDataEngine.test.js # Telemetry unit tests
        └── StadiumContext.test.js # Context and AI logic unit tests
```
