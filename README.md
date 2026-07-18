# ⚡ StadiumPulse

StadiumPulse is a real-time stadium operations, crowd flow intelligence, and dispatch dashboard designed for high-occupancy event hubs (such as FIFA World Cup 2026 venues). Powered by simulated real-time telemetry and a GenAI Copilot, it equips operators to proactively manage surges, dispatch resources, and monitor safety alerts.

---

## ✨ Features

### 🧠 GenAI Operational Copilot
*   **Dynamic Risk Evaluation:** Analyzes telemetry across all 12 zones every 3 seconds to predict peak bottlenecks and evaluate crowd-flow risks.
*   **Resource Optimization Plans:** Offers dynamic staff re-routing suggestions based on capacity differences.
*   **One-Key Auto-Dispatch:** Pressing `SPACE` (or clicking the button) automates personnel dispatch to the predicted peak zone.

### 🗺️ Spatial Stadium Minimap
*   **2D Schematic Arena Grid:** Translates metrics into a spatial visual schematic of the stadium sectors.
*   **Synchronized Focus:** Selecting a card or hovering over a map sector highlights it on both the grid and the minimap in real time.

### 🔊 Programmatic Synthesized Sound Alerts
*   **Zero Audio Assets Required:** Uses the standard browser **Web Audio API** to synthesize warning chimes and high-priority siren tones on the fly.
*   **Control:** Toggle mute/unmute directly in the header dashboard panel.

### ⌨️ Operations Center Keyboard Shortcuts
*   Press `?` to toggle the shortcuts help menu.
*   Press `ESC` to clear active zone highlighting.
*   Select and scroll to any card instantly:
    *   `N` → North Gate | `E` → East Gate | `G` → South Gate | `W` → West Gate
    *   `V` → VIP Lounge | `P` → Press Box | `Y` → Family Zone | `S` → Supporters Section
    *   `A` → Concourse A | `B` → Concourse B | `F` → Food Court | `M` → Merchandise

---

## 🛠️ Tech Stack

*   **Framework:** React 18, Vite 5
*   **Styling:** Tailwind CSS v4 (using the `@tailwindcss/vite` plugin compilation)
*   **State Management:** React Context, Hooks (`useCallback`, `useMemo`)
*   **Audio synthesis:** Web Audio API

---

## 🚀 Installation & Local Run

Copy and paste the following block into your terminal to clone the repository, install dependencies, and start the development server:

```bash
git clone [https://github.com/your-username/StadiumPulse.git](https://github.com/your-username/StadiumPulse.git)
cd StadiumPulse
npm install
npm run dev
```

## 📂 Project Directory Structure

```text
StadiumPulse/
├── index.html              # Entry point index file (with font imports)
├── package.json            # Scripts, React, Vite, and Tailwind v4 dependencies
├── vite.config.js          # Configures esbuild JSX loaders and Tailwind plugins
├── postcss.config.js       # AutoPrefixer CSS configurations
└── src/
    ├── App.js              # Wraps components inside StadiumProvider
    ├── index.css           # Custom CSS animations and Tailwind imports
    ├── main.jsx            # DOM creation mount point
    ├── components/
    │   ├── Dashboard.js    # Metric panels, Minimap, Keyboard listeners, AI Copilot
    │   ├── MetricCard.js   # Zone status indicator card
    │   ├── IncidentItem.js # Alarm ticket card
    │   └── RuleEngine.js   # Background metrics evaluator (triggers incidents)
    ├── context/
    │   └── StadiumContext.js # Shared states, handler callbacks, and AI generators
    └── data/
        └── mockDataEngine.js # Telemetry generator
