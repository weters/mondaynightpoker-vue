<div align="center">

<img src="public/monday-night-poker@2x.png" alt="Monday Night Poker" width="420" />

# Monday Night Poker

**Online dealer's-choice house games with your friends.**

Real-time, browser-based poker and card games — deal a hand of Bourré, run a Texas Hold'em table, or pass the poop — all from a shared virtual table.

[![CI/CD](https://github.com/weters/mondaynightpoker-vue/actions/workflows/build.yaml/badge.svg)](https://github.com/weters/mondaynightpoker-vue/actions/workflows/build.yaml)
[![CodeQL](https://github.com/weters/mondaynightpoker-vue/actions/workflows/codeql-analysis.yml/badge.svg)](https://github.com/weters/mondaynightpoker-vue/actions/workflows/codeql-analysis.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE.txt)
[![Vue 3](https://img.shields.io/badge/Vue-3-42b883.svg?logo=vue.js&logoColor=white)](https://vuejs.org/)
[![Vite](https://img.shields.io/badge/Vite-7-646cff.svg?logo=vite&logoColor=white)](https://vitejs.dev/)

[Play at mondaynight.bid](https://mondaynight.bid) · [Report a bug](https://github.com/weters/mondaynightpoker-vue/issues) · [Backend repo](https://github.com/weters/mondaynightpoker-server)

</div>

---

## Overview

This is the **front-end single-page application** for Monday Night Poker. It talks to the
[mondaynightpoker-server](https://github.com/weters/mondaynightpoker-server) backend over a REST API
(for accounts, tables, and profiles) and a **WebSocket** connection (for live gameplay). The server is
the authority for all game state — the client renders that state, animates the cards, and relays each
player's actions back over the socket.

Create a table, invite your friends, and take turns dealing whatever house game you feel like. Each
table keeps a running ledger of everyone's balance so you can settle up at the end of the night.

> **Looking for the game logic, architecture, or API?** See the
> [architecture document](https://github.com/weters/mondaynightpoker-server/blob/master/architecture.md)
> in the backend repo.

## Games

Every table is dealer's choice. The following games are built in — each has its own selector, table
UI, and Pinia store, all registered in [`src/games/index.js`](src/games/index.js):

| Game | Slug | Notes |
| --- | --- | --- |
| **Acey Deucey** | `acey-deucey` | In-between / red dog |
| **Bourré** | `bourre` | Trick-taking, pot-carrying |
| **Guts** | `guts` | 2-card guts with trade & declare |
| **Texas Hold'em** | `texas-hold-em` | Community-card poker |
| **Seven Card** | `seven-card` | Seven-card stud |
| **Little L** | `little-l` | Community-card variant |
| **Pass the Poop** | `pass-the-poop` | Last-card-standing elimination |

Game slugs are shared with the backend's game factory — the two sides stay in sync via matching tests
on each repo, so adding a game means adding it in both places.

## Features

- **Live multiplayer tables** over WebSocket, with automatic reconnection and exponential backoff.
- **Dealer's-choice game selector** with per-game options (antes, stakes, variants).
- **Animated card dealing & splash effects** via lightweight composables (`popmotion`, `flubber`).
- **Player accounts** — sign up, email verification, password reset, and profile management.
- **reCAPTCHA v3** on signup to keep the bots out.
- **JWT sessions** persisted to `localStorage`, auto-refreshed at the token's half-life.
- **Per-table balance history** and **player profile graphs** rendered with Chart.js.
- **Admin tooling** — manage players and tables with site-admin and per-table-admin roles.
- **PWA-ready** — installable with app icons and a web manifest.

## Tech stack

| Layer | Technology |
| --- | --- |
| Framework | [Vue 3](https://vuejs.org/) (Options + Composition API) |
| Build tool | [Vite 7](https://vitejs.dev/) |
| State | [Pinia](https://pinia.vuejs.org/) |
| Routing | [Vue Router 4](https://router.vuejs.org/) (lazy-loaded routes) |
| Styling | [Sass/SCSS](https://sass-lang.com/) with auto-injected design tokens |
| Charts | [Chart.js](https://www.chartjs.org/) via `vue-chartjs` |
| Animation | `popmotion`, `flubber` |
| Testing | [Vitest](https://vitest.dev/) + [Vue Test Utils](https://test-utils.vuejs.org/) (jsdom) |
| Linting | [ESLint](https://eslint.org/) 9 (flat config) + `eslint-plugin-vue` |
| Runtime image | Multi-stage Docker → [nginx](https://nginx.org/) |

## Getting started

### Prerequisites

- **Node.js 20+** and npm
- A running [mondaynightpoker-server](https://github.com/weters/mondaynightpoker-server) instance
  (or point `VITE_API_URL` at a deployed one)

### Install & run

```bash
# 1. Install dependencies
npm install

# 2. Start the dev server (http://localhost:8080, hot-reload)
npm run dev
```

That's it — open <http://localhost:8080> and sign up for a local account.

### Environment variables

Configuration is supplied through Vite env vars. The checked-in [`.env`](.env) points at the public
API by default; create a `.env.local` (git-ignored) to override for local development.

| Variable | Description | Example |
| --- | --- | --- |
| `VITE_API_URL` | Base URL of the REST API | `http://localhost:5080` |
| `VITE_WEBSOCKET_URL` | Base URL of the game WebSocket | `ws://localhost:5080` |
| `VITE_SITE_KEY` | Google reCAPTCHA v3 site key | `6Lf...` |
| `VITE_APP_VERSION` | Build version (injected by CI) | `v1.2.3` |

When unset, `VITE_API_URL` and `VITE_WEBSOCKET_URL` fall back to `localhost:5080`. A `VITE_SITE_KEY`
is required — the app throws on startup without one.

## npm scripts

| Script | What it does |
| --- | --- |
| `npm run dev` | Start the Vite dev server with hot-reload on port 8080 |
| `npm run build` | Type-check-free production build to `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | Lint `src/` with ESLint (fails on any warning) |
| `npm test` | Run the unit test suite once (Vitest) |
| `npm run test:watch` | Run tests in watch mode |

> **Before committing:** run `npm run lint` and fix any errors — CI treats warnings as failures
> (`--max-warnings 0`).

## Project structure

```
mondaynightpoker-vue/
├── public/                 # Static assets, icons, PWA manifest
├── deployments/            # Kubernetes manifests (deployment, service, ingress)
├── src/
│   ├── main.js             # App bootstrap: Pinia, router, global mixin
│   ├── App.vue             # Root shell (header, footer, banners)
│   ├── router.js           # Routes with public / requiresAuth / requiresAdmin guards
│   ├── store.js            # Root Pinia store (user, game, logs, client state)
│   ├── client.js           # REST API client
│   ├── webSocket.js        # WebSocket client with reconnect + request/response context
│   ├── auth.js / session.js# JWT session persistence & refresh
│   ├── recaptcha.js        # reCAPTCHA v3 integration
│   ├── currency.js         # Cents → display-amount formatting
│   ├── variables.scss      # Design tokens & mixins (auto-injected into every component)
│   ├── games/index.js      # Registry mapping game slugs → component/selector/store
│   ├── store/              # Per-game Pinia stores
│   ├── composables/        # Reusable logic (deal animation, splash effects)
│   ├── mixins/             # Shared component behavior
│   └── components/
│       ├── games/          # One folder per game's table UI
│       ├── gameselector/   # Game-selection UI
│       ├── formelements/   # Form inputs
│       └── admin/          # Admin screens
└── vite.config.js          # Build config, path aliases, SCSS injection, test config
```

Path alias: `@` resolves to `src/` (e.g. `import client from '@/client'`).

## Testing

Unit tests live next to the code they cover as `*.spec.js` files and run under Vitest with a jsdom
environment.

```bash
npm test            # single run
npm run test:watch  # watch mode
```

## Deployment

The app ships as a static bundle served by nginx. The multi-stage [`Dockerfile`](Dockerfile) builds
the Vue app, then copies `dist/` into an nginx image configured with SPA history-mode fallback
([`nginx.conf`](nginx.conf)).

```bash
docker build --build-arg version=$(git describe --always) -t mondaynightpoker-vue .
docker run -p 8080:80 mondaynightpoker-vue
```

CI/CD is handled by [GitHub Actions](.github/workflows/build.yaml):

1. **Test** — lint + build on every pull request and push.
2. **Build** — push a multi-tagged image to GHCR on merges to `master` and version tags.
3. **Deploy** — roll out to Kubernetes on `v*` tags (manifests in [`deployments/`](deployments/)).

## Contributing

Issues and pull requests are welcome!

1. Fork the repo and create a feature branch.
2. Make your changes, keeping components small and colocating tests as `*.spec.js`.
3. Run `npm run lint` and `npm test` — both must pass.
4. Open a pull request against `master` with a clear description.

## License

Released under the [MIT License](LICENSE.txt) — © 2020 Thomas Peters.
