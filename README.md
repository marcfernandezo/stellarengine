# Stellar Engine

**StellarEngine** is a real-time gravitational simulation platform built for the web.
It combines an N-body physics engine with a high-performance 3D visualization layer, enabling interactive exploration of orbital mechanics in a browser environment.

The project is structured as a monorepo, separating the marketing site, simulation engine, and shared logic into independent but connected applications.

---

## 🌌 Overview

StellarEngine simulates physically accurate celestial motion using numerical integration methods (RK4 / Verlet) and renders it in real time using WebGL (Three.js).

It is designed as both:

* A technical demonstration of numerical physics in TypeScript
* A product-style simulation interface inspired by tools like Space Engine

---

## 🧱 Monorepo Structure

```txt
apps/
  main/           # Astro-based landing web
  viewer/         # React + Three.js real-time web simulator

packages/
  core-physics    # N-body simulation, integrators (RK4, Verlet)
  renderer        # Three.js abstractions and scene utilities
  shared          # Shared types, constants, utilities
```

---

## 🚀 Applications

### 📡 Landing (`apps/main`)

A lightweight Astro-based website that introduces the project.

Responsibilities:

* Product presentation
* Visual storytelling
* Entry point to the simulator

No simulation logic is executed here.

---

### 🪐 Viewer (`apps/viewer`)

A real-time 3D simulation built with React and Three.js.

Responsibilities:

* Rendering celestial bodies
* Running the physics loop
* User interaction (camera controls, time scaling)
* Visual debugging tools

---

## 🧠 Core Physics

The simulation is based on classical Newtonian gravity:

* N-body gravitational interaction
* Numerical integration (RK4 / Verlet)
* Time scaling for accelerated simulation
* Astronomical Unit (AU) based system

Planned improvements:

* Adaptive timestep integration
* Collision handling
* Soft-body approximations for large-scale systems

---

## ⚙️ Tech Stack

* TypeScript
* Three.js
* React
* Astro
* pnpm Workspaces
* Vite

---

## 🧪 Development

Install dependencies:

```bash
pnpm install
```

Run all apps:

```bash
pnpm dev
```

Run individually:

```bash
pnpm dev:landing
pnpm dev:viewer
```

---

## 📦 Build

```bash
pnpm build
```

---

## 🎯 Goals

* Real-time accurate orbital simulation in the browser
* Clean separation between physics and rendering
* Scalable architecture for future expansion (WASM / C++ integration)
* High-performance visualization comparable to desktop tools

---

## 🌍 Design Philosophy

* Physics correctness over visual approximation (where possible)
* Separation of concerns between simulation and rendering
* Deterministic simulation core
* Modular architecture suitable for WebAssembly migration

---

## 🛰 Future Roadmap

* WebAssembly physics core (C++ / Rust)
* GPU-accelerated n-body simulation
* Collision system
* Procedural galaxy generation
* Persistent universe states
* Performance profiling tools

---

## 👤 Author

StellarEngine is an experimental project focused on real-time physics simulation in web environments.
