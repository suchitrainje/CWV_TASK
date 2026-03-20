# High-Performance News Aggregator

This project demonstrates the methodical process of identifying and resolving Core Web Vitals (CWV) performance bottlenecks within a React application. It simulates the real-world scenario of adopting poorly optimized legacy code and transforming it into a highly performant application utilizing modern best practices.

## Project Structure and Branches

The repository contains two distinct states of the application reflecting the before-and-after optimization phases:

1. **`slow-version` Branch**:
   - Features the intentionally unoptimized "before" state of the application.
   - Includes anti-patterns such as Network Waterfalls, Monolithic React bundles, heavy full-library Lodash imports, unoptimized render-blocking static assets, and missing List Virtualization, deliberately causing poor loading times and input lag.
   
2. **`main` Branch** (Final Deliverable):
   - Features the completely optimized production-ready application.
   - Fully mitigates issues tracking **LCP** (Largest Contentful Paint), **INP** (Interaction to Next Paint), and **CLS** (Cumulative Layout Shift) by integrating:
     - Parallelized `Promise.all` network requests bypassing API waterfalls.
     - `@tanstack/react-virtual` for strict List Virtualization resolving DOM overload.
     - `Intl.DateTimeFormat` memoization to skip expensive React re-renders.
     - Explicit WebP Hero Image markup leveraging `srcset`, `width`/`height` bounding, and `loading="lazy"`.
     - Code Splitting chunks via `React.lazy` and `<Suspense>`.
     - Cherry-picked bundle dependencies reducing footprint constraints.

---

## Running the Project Locally

The application uses Docker and Docker Compose for simple and consistent deployment. An `.env.example` file is provided which you can copy to `.env` if desired (the docker compose already sets the required environment).

### Prerequisites
- [Docker](https://docs.docker.com/get-docker/) installed and running.
- [Node.js](https://nodejs.org/en/) & npm (Optional, for local development outside Docker).

### Option 1: Running the Optimized Application (`main` branch)

1. Ensure you are on the `main` branch:
   ```bash
   git checkout main
   ```
2. Build and start the containerized application:
   ```bash
   docker-compose up -d --build
   ```
3. The Vite server will launch. Wait a few seconds for the Docker healthcheck to pass, then open [http://localhost:3000](http://localhost:3000) in your browser.
4. To view the final bundled chunk structure verifying Code Splitting:
   ```bash
   npm install
   npm run build
   ```
   You will find multiple JS chunk files populated in `dist/assets/`, along with a bundle composition map via `stats.html`.

### Option 2: Running the Unoptimized Baseline (`slow-version` branch)

1. Switch to the unoptimized branch:
   ```bash
   git checkout slow-version
   ```
2. Build and start the containerized application:
   ```bash
   docker-compose up -d --build
   ```
3. Open [http://localhost:3000](http://localhost:3000) in your browser. *(Note: You will experience significant deliberate delays loading the network requests and typing into the filter box.)*

---

## Performance Auditing

All baseline statistics, audits, root-cause analyses, and implemented optimizations are documented inside the **[PERFORMANCE.md](./PERFORMANCE.md)** file generated through rigorous Lighthouse and Chrome DevTools profiling.
