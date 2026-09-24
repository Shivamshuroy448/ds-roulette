# DS Roulette Architecture Overview

High-level architecture of the DS Roulette web application.

* **Frontend**: React 18, Vite, Tailwind CSS, Lucide icons, Canvas Confetti.
* **Wheel Engine**: Pure CSS and requestAnimationFrame angular interpolation.
* **Storage Layer**: Secure scoped localStorage with AES-compatible encryption abstractions.
* **Authentication**: Firebase Google OAuth with zero-credential guest mode fallback.
* **Sync Engine**: GitHub REST API client supporting Gist export and direct repo commits.
