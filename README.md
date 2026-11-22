# resume-analyzer

AI resume analyzer for final-year students applying for their first developer job.

## How to run

### Server

```bash
cd server
cp .env.example .env
npm install
npm run dev
```

The API server runs at `http://localhost:4000`.

### Client

```bash
cd client
npm install
npm run dev
```

The web app runs at `http://localhost:5180` and proxies `/api` requests to `http://localhost:4000`.
