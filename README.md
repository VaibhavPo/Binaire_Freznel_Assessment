# freznelai-cli

> A terminal-based `btop`-style interactive system monitor CLI built with Node.js, React (Ink), Express, and Firebase Authentication.

---

## 📋 Table of Contents
- [Features](#-features)
- [Architecture](#-architecture)
- [Prerequisites](#-prerequisites)
- [Option 1: Using from GitHub / Source Repository](#-option-1-using-from-github--source-repository)
- [Option 2: Using via npm (Global / Package Runner)](#-option-2-using-via-npm-global--package-runner)
- [Environment Configuration](#-environment-configuration)
- [Available Scripts](#-available-scripts)
- [Keyboard Controls & Navigation](#-keyboard-controls--navigation)
- [API Endpoints](#-api-endpoints)
- [Troubleshooting](#-troubleshooting)

---

## ✨ Features

- **Interactive Terminal UI**: Inspired by `btop` with multi-panel dashboard rendering powered by React and [Ink](https://github.com/vadimdemedes/ink).
- **Live System Metrics**: Real-time monitoring of:
  - **CPU & GPU**: Multi-core usage, load averages, CPU clock speeds, temperatures, live history wave graphs with Y-axis markers, and battery status.
  - **Memory & Disks**: Total/used/available/cached/commit memory bars, and disk I/O / partition capacity bars.
  - **Network Transfer**: Per-second RX/TX rates, total accumulated bandwidth, and wave charts.
  - **Processes**: Interactive scrollable process table displaying PID, program, user, memory, and CPU utilization.
- **Firebase Authentication**: Secure user registration and login prompt with token storage and API middleware verification.
- **Modular REST Backend**: Lightweight Express API querying hardware data via `systeminformation`.

---

## 🏗 Architecture

```
freznelai-cli/
├── bin/
│   └── cli.js                     # CLI executable binary runner
├── src/
│   ├── api/
│   │   ├── server.js              # Express REST API (port 3000)
│   │   ├── routes/                # System metric API routes (/api/*)
│   │   ├── services/              # systeminformation hardware query services
│   │   └── auth/                  # Firebase Admin auth middleware & tokens
│   ├── components/                # Ink UI panels (CpuPanel, MemDiskPanel, etc.)
│   ├── pages/                     # Interactive login/signup CLI prompts (@clack/prompts)
│   ├── utils/                     # History buffers, chartli sparklines, and metric formatting
│   ├── App.jsx                    # Root reactive dashboard component & key bindings
│   └── index.jsx                  # CLI entry point (handles auth & renders Ink app)
├── package.json
└── README.md
```

---

## ⚙ Prerequisites

- **Node.js**: `v18.0.0` or higher (tested with Node 18, 20, 22+)
- **npm**: `v9.0.0` or higher

---

## 🚀 Option 1: Using from GitHub / Source Repository

### Step 1: Clone the Repository
```bash
git clone https://github.com/VaibhavPo/FreznelAI-Assessment-1.git
cd FreznelAI-Assessment-1
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Configure Environment Variables
Create or verify the `.env` file in the root directory:
```env
apiKey=AIzaSyAj6FbmQqnvGNOFSMufzKJXEKvHA691zp0
authDomain="frenzelai-assignment.firebaseapp.com"
projectId="frenzelai-assignment"
appId="1:107899362555:web:30da93b631307d916ea45e"

baseURL="http://127.0.0.1:3000"
```

### Step 4: Run the Backend Server
In your first terminal tab/window:
```bash
npm run server
```
*The server will start listening at `http://127.0.0.1:3000`.*

### Step 5: Launch the CLI Dashboard
In a second terminal window:
```bash
npm start
```
*(Alternatively, for direct development mode with tsx hot reload: `npm run dev`)*

Follow the prompt to **Login** or **Sign up**, after which the interactive terminal monitor will render!

---

## 📦 Option 2: Using via npm (Global / Package Runner)

### Running without Manual Install (npx)
```bash
npx freznel-monitor
```

### Installing Globally
```bash
npm install -g freznelai-cli
```

Once installed globally, you can invoke the CLI from any terminal:
```bash
freznel-monitor
```

> **Note**: Ensure the local backend server is running (`npm run server`) so the CLI client can stream hardware statistics via `http://127.0.0.1:3000/api`.

---

## 📜 Available Scripts

| Command | Description |
| :--- | :--- |
| `npm run server` | Starts the Express system monitoring server on `http://127.0.0.1:3000` |
| `npm start` | Launches the CLI executable (`node bin/cli.js`) |
| `npm run dev` | Runs the client app directly via `tsx src/index.jsx` |
| `npm test` | Runs the test suite |

---

## 🎮 Keyboard Controls & Navigation

| Key | Action |
| :--- | :--- |
| `↑` / `↓` (Arrow Keys) | Select and scroll through running processes |
| `PageUp` / `PageDown` | Jump 7 processes up or down |
| `q` or `Q` | Safely quit the application and restore terminal |
| `Ctrl + C` | Force exit and restore terminal screen |

---

## 🔌 API Endpoints

All monitoring endpoints are served under `/api` and require a valid Bearer token (`Authorization: Bearer <token>`):

- `GET /api/cpu` - Overall CPU utilization, cores, temperature, uptime, and load averages.
- `GET /api/gpu` - GPU utilization, model, and memory.
- `GET /api/memory` - Total, used, available, swap, and cached RAM statistics.
- `GET /api/disk` - Mounted disks, total/used capacities, and disk I/O metrics.
- `GET /api/network` - Active network interfaces, IP addresses, and transfer rates.
- `GET /api/battery` - Battery percent and charging status.
- `GET /api/processes` - Process list with CPU and memory consumption.

---

## 🛠 Troubleshooting

- **Server Connection Refused (`ECONNREFUSED 127.0.0.1:3000`)**:  
  Make sure you ran `npm run server` in a dedicated terminal window before launching the monitor.
- **Terminal Display Distortion / Flicker**:  
  Ensure your terminal window is at least **100 columns wide by 30 rows high** for optimal layout rendering.
- **Session Expired (401)**:  
  Press `q` or `Ctrl + C` to exit, then relaunch `npm start` to log in and renew your authentication token.
