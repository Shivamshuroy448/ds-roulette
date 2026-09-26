# DS Roulette

Interactive, high-yield Data Science & Machine Learning interview preparation wheel with 60 comprehensive topics, interactive drill assessments, and automated GitHub study synchronization.

[![GitHub license](https://img.shields.io/badge/License-MIT-0d1117?style=flat-square&logo=opensourceinitiative&logoColor=white)](LICENSE)
[![React](https://img.shields.io/badge/React-18-0d1117?style=flat-square&logo=react&logoColor=white)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-5-0d1117?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-3-0d1117?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)

---

## Overview

DS Roulette transforms technical interview preparation from passive reading into an active, gamified daily ritual. Spin the wheel to test your intuition on real-world questions across six core data science disciplines:

* **SQL & Data Wrangling**: Gaps and islands, window functions, recursive CTEs, and retention cohort analysis.
* **Machine Learning**: Bias-variance tradeoff, tree pruning, gradient boosting, and regularization geometry.
* **Statistics & Experimentation**: Sample size derivation, A/B test guardrails, statistical power, and Bonferroni corrections.
* **Deep Learning & Transformers**: Backprop calculus, scaled dot-product attention, normalization dynamics, and LoRA.
* **Product Analytics**: North Star metrics, funnel drop-off models, cannibalization, and LTV-to-CAC economics.
* **ML System Design**: Candidate retrieval, online feature stores, real-time fraud engines, and drift monitoring.

---

## Features

* **Interactive Spin Wheel**: Fluid 60fps angular physics with procedural Web Audio feedback.
* **7-8 Question Drills**: Every topic includes interactive drill questions with instant feedback and senior recruiter gotchas.
* **GitHub Study Sync**: Export interview notes directly to GitHub to keep your contribution streak active.
* **Curated Research**: Direct links to authoritative papers, documentation, and benchmark implementations.
* **Privacy Focused**: Zero third-party tracking pixels, client-scoped storage, and optional Google OAuth authentication.

---

## Getting Started

### Prerequisites
* Node.js 18+
* npm or yarn

### Installation
```bash
git clone https://github.com/Shivamshuroy448/ds-roulette.git
cd ds-roulette
npm install
npm run dev
```

The application will be live at `http://localhost:5173`.

---

## Project Structure

```
ds-roulette/
├── docs/                 # Architectural specs, cheat sheets, and technical guides
├── drills/               # Category-specific interview drill questions
├── public/               # Static assets and icons
├── scripts/              # Validation, link checking, and export scripts
├── src/
│   ├── assets/           # Application graphics
│   ├── components/       # Modals, wheel, dashboard, and UI components
│   ├── context/          # Authentication and user state providers
│   ├── data/             # Curriculum topic catalog and theme definitions
│   └── utils/            # Audio, security, GitHub sync, and Firebase utilities
├── study-notes/          # 60 generated Markdown study guides by category
└── tests/                # Unit test suites
```

---

## License

MIT License. Built for data scientists and ML engineers aiming for technical mastery.
