# ⚡ Workflow Builder

An interactive, resilient, node-based automation workflow builder and execution engine built with **Next.js 15**, **React Flow v12**, **Redux Toolkit**, structured following **Feature-Sliced Design (FSD)** architecture.



---

## 🛠️ Tech Stack

<p align="left">
   <img src="https://img.shields.io/badge/Next.js_15-black?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js" />
   <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
   <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
   <img src="https://img.shields.io/badge/React_Flow_v12-FF4154?style=for-the-badge&logo=react" alt="React Flow" />
   <img src="https://img.shields.io/badge/Redux_Toolkit-764ABC?style=for-the-badge&logo=redux&logoColor=white" alt="Redux Toolkit" />
   <img src="https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind" />
   <img src="https://img.shields.io/badge/Zod-3E67B1?style=for-the-badge&logo=zod&logoColor=white" alt="Zod" />
</p>

---

## ✨ Features

### 🎨 Interactive Visual Canvas
- Drag-and-drop node creation from the toolbar onto the canvas
- Seamless connection between source & target handles
- Full pan, zoom, and minimap support
- One-click **DAG Auto Layout** for clean hierarchical alignment

### 🧩 Node Catalog
| Node | Purpose |
| :--- | :--- |
| **Start** | Flow entry — configurable trigger (`Manual`, `Webhook`, `CRON`) |
| **Action** | External tasks like HTTP requests (`GET`, `POST`, `PUT`, `DELETE`) |
| **Condition** | Dynamic boolean branching (`true` / `false` handles) |
| **Delay** | Real wall-clock async pause (milliseconds / seconds) |
| **End** | Terminal outcome tasks like HTTP requests (`GET`, `POST`, `PUT`, `DELETE`) |
| **Condition** | Dynamic boolean branching (`true` / `false` handles) |
| **Delay** | Real wall-clock async pause (milliseconds / seconds) |
| **End** | Terminal outcome (`success` / `failure`) |

### ⚙️; **Reset** → full state re-init
- Live terminal-style execution log with step timings and validation issues

---

## 🏗️ Architecture — Feature-Sliced Design (FSD)

Strict **FSD layers** keep dependencies unidirectional and scopes well-defined:
```
src/

├── app/ # Next.js App Router, layout, global providers

│

├── widgets/

│ └── workflow-canvas/ # Full-screen React Flow viewport orchestrator

│

├── features/

│ ├── workflow-execution/ # Execution engine, step runner, log panel

│ ├── workflow-inspector/ # Node debug drawer & config forms

│ ├── workflow-layout/ # DAG autolayout computation

│ └── workflow-toolbar/ # Draggable node palette

│

├── entities/

│ ├── workflow/ # Node type models, schemas, custom UI nodes

│ └── workflow-execution/ # Redux execution slice

│

└── shared/

├── components/ui/ # Atomic UI primitives (shadcn/ui)

└── lib/ # Store, hooks, helpers
```

---

## 🧠 Algorithms & Engine Details

### 1. Pre-flight Validation & Cycle Detection
- **DFS-based cycle detection** using 3-state coloring (`UNVISITED`, `VISITING`, `VISITED`)
- A back-edge to a `VISITING` ancestor ⇒ whole run is **aborted** with `Workflows must be acyclic` diagnostics
- **Zod schema validation** on every node's config ensures malformed nodes are caught **before** execution

### 2. Generator-based Execution Engine
The runtime runs inside an ES6 **generator** (`executeGraph.ts`), decoupled from React rendering:
- Yields immutable **execution steps** per node phase (`START`, `EXECUTE`, `FINISH`, `SKIP`)
- Evaluates condition predicates at runtime, steering the cursor along matched handles while marking unchosen branches as `skipped`
- **Real async sleep** for `Delay` nodes — suspends without blocking the UI thread
- **Infinite-loop guard**: hard ceiling on total steps (`MAX_EXECUTION_STEPS`)

---

## ✅ Validated Test Scenarios

| # | Scenario | What It Covers | Status |
| :-: | :--- | :--- | :-: |
| **1** | Linear Execution w/ Delay | Sequential `Start → Delay → Action → End` with real-time sleep | ✅ Passed |
| **2** | Conditional Branching | Correct `true`/`false` path activation & skipping | ✅ Passed |
| **3** | Pre-flight Validation | Intercepts unconfigured / malformed nodes | ✅ Passed |
| **4** | Cycle Detection | Halts loops & reports the DAG violation | ✅ Passed |
| **5** | Step-by-Step & Reset | Interactive stepping & state re-init | ✅ Passed |
| **6** | DAG Auto Layout | Clean hierarchical alignment, no edge overlaps | ✅ Passed |

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** `v18.18+` (or `v20+`)
- Package manager: `npm`, `pnpm`, or `yarn`

### 1. Install

npm install

### 2. Run Development Server

npm run dev

### 3. Open
Browse to http://localhost:3000
