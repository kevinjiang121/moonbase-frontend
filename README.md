# Moonbase Frontend 🚀

A modern Angular 19 application with Server‑Side Rendering (SSR), standalone components, context‑menu driven channel/chat UI, Cypress integration tests, and Docker support.

## Table of Contents

1. [Project Overview](#project-overview)  
2. [Features](#features)  
3. [Prerequisites](#prerequisites)  
4. [Getting Started](#getting-started)  
   - [Clone & Install](#clone--install)  
   - [Environment Configuration](#environment-configuration)  
   - [Development Server (CSR)](#development-server-csr)  
   - [Development Server (SSR)](#development-server-ssr)  
5. [Building for Production](#building-for-production)  
6. [Testing](#testing)  
   - [Unit Tests (Karma & Jasmine)](#unit-tests-karma--jasmine)  
   - [Integration Tests (Karma + Headless Chrome)](#integration-tests-karma--headless-chrome)  
   - [End‑to‑End Tests (Cypress)](#end‑to‑end-tests-cypress)  
7. [Docker](#docker)  
8. [Project Structure](#project-structure)  
9. [Contributing](#contributing)  
10. [License](#license)  

---

## Project Overview

Moonbase Frontend is the Angular client for “Moonbase”, a Real-Time Communication and Community Platform providing:

- **Authentication** flows (signup, login, forgot/reset password)  
- **Channel** & **Category** management via context‑menu  
- Real‑time **chat** powered by WebSockets  
- **Server‑Side Rendering** (SSR) for SEO & initial‑load performance  
- Fully **standalone** Angular components (no NgModules)  
- Comprehensive **unit**, **integration**, and **e2e** tests  
- **Docker** multi‑stage build for production  

---

## Features

- **Standalone Components** & Angular CLI 19  
- **SSR** via `@angular/ssr` + Express  
- **Context Menu** for channel/category CRUD  
- **Reactive Forms** & Guards for auth flows  
- **WebSocket** service for live chat  
- **Unit Tests**: Karma + Jasmine  
- **Integration Tests**: Karma (headless)  
- **E2E Tests**: Cypress  
- **Docker** ready (port 4000)  

---

## Prerequisites

- Node.js v18+ & npm  
- Docker (optional, for containerized builds)  
- A running backend API at `environment.apiUrl` (default: `http://localhost:8000/api`)  

---

## Getting Started

### Clone & Install

```bash
git clone https://github.com/kevinjiang121/moonbase-frontend.git
cd moonbase-frontend
npm install
```

### Environment Configuration
Edit src/environments/environment.ts:
```bash
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8000/api'
};
```

For production, update `environment.prod.ts` accordingly.

### Development Server (CSR)

```
npm run start
```

- Opens at http://localhost:4200/ 
- Live‑reload on edits

### Development Server (SSR)

```
npm run serve:ssr:moonbase-frontend
```

- Renders on the server
- Listens on port 4000 by default
- Visit http://localhost:4000/

## Building for Production

```
npm run build
```

- Outputs client bundle under dist/moonbase-frontend/browser
- Outputs server bundle under dist/moonbase-frontend/server

## Testing

### Unit Tests (Karma & Jasmine)

```
npm run test
```

- Runs all `*.spec.ts` under `src/app`
- Watch mode by default

### Integration Tests (Karma + Headless Chrome)

```
npm run test:integration
```

- Runs only `*.integration.spec.ts` under `src/integration`
- Uses headless Chrome via Karma

### End‑to‑End Tests (Cypress)

```
npm run e2e
```

- Opens Cypress Test Runner
- To run headlessly:

```
npx cypress run
```

## Docker

Build and run with Docker:

```
docker build -t moonbase-frontend .
docker run --rm -p 4000:4000 moonbase-frontend
```

- Multi‑stage build for optimized image
- Exposes port 4000

```
├── src/
│   ├── app/
│   ├── environments/
│   ├── integration/
│   ├── main.ts
│   ├── main.server.ts
│   ├── server.ts
│   └── styles.scss
├── public/
├── cypress/
├── karma.conf.js
├── karma.integration.conf.js
├── tsconfig.*.json
└── Dockerfile
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/fooBar`)
3. Commit your changes (`git commit -am 'Add some fooBar'`)
4. Push to the branch (`git push origin feature/fooBar`)
5. Open a Pull Request

## License

Distributed under the MIT License. See [LICENSE](LICENSE) for details.
