# BitLance Blog & Resources Hub

Content engine for [BitLance](https://bitlance.io) — the Bitcoin-native freelance marketplace. Optimized for SEO, AI search discovery (llms.txt), and client conversion.

## Stack

- **Frontend:** React 19, Vite, Tailwind CSS 4, TipTap editor
- **Backend:** Express (TypeScript), Firebase Admin SDK, Firestore
- **Media:** Cloudinary
- **AI:** Gemini API (server-side)

## Run locally

Prerequisites: Node.js 20+

```bash
npm install
cp .env.example .env.local   # then fill in the values
npm run dev
```

Required environment variables — see `.env.example`:

| Variable | Purpose |
|---|---|
| `GEMINI_API_KEY` | Server-side Gemini calls |
| `FIREBASE_SERVICE_ACCOUNT` | Admin SDK credentials (JSON). Optional on Cloud Run (ADC is auto-detected) |
| `ADMIN_EMAILS` | Comma-separated admin allowlist |
| `CLOUDINARY_*` | Image storage |

## Security model

- Firestore rules **deny all direct client access**. Every read/write goes through the API server, which authenticates via the Firebase Admin SDK.
- Admin endpoints verify Firebase ID tokens **cryptographically** (`verifyIdToken`) and check the email against `ADMIN_EMAILS`.
- Admin accounts are created manually in the Firebase Console (Authentication → Add user). There is no self-serve admin signup.

## Build & deploy

```bash
npm run build   # vite build + server bundle
npm start       # serve dist/server.cjs
```

Deployed via Cloud Run (AI Studio) or Vercel (`vercel.json` included — set `FIREBASE_SERVICE_ACCOUNT` in project env vars).

## Feeds & discovery

Auto-generated at runtime: `/sitemap.xml`, `/feed.xml` (RSS), `/atom.xml`, `/feed.json`, `/robots.txt`, `/llms.txt`, `/llms-full.txt`.
