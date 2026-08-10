[README.md](https://github.com/user-attachments/files/30916754/README.md)

# noaa.macachor.org — Scalar Observatory

NOAA space weather proxy + Scalar Observatory frontend deployed to Cloudflare Workers.

## Structure
```
.
├── public/
│   └── index.html          ← Scalar Observatory (served at /)
├── src/
│   └── index.ts            ← Worker: NOAA proxy + static assets
├── wrangler.toml           ← Cloudflare config
├── package.json            ← Wrangler dependency
└── .github/workflows/
    └── deploy.yml          ← Auto-deploy on push
```

## Routes
| Path | Handler |
|------|---------|
| `/` | Scalar Observatory HTML |
| `/api/noaa/...` | Proxied to `services.swpc.noaa.gov/...` |
| `/*` | Static assets fallback |

## Deploy
1. Ensure `CLOUDFLARE_API_TOKEN` is set in GitHub repo secrets
2. Push to `main`
3. GitHub Action auto-deploys via Wrangler

## Local Dev
```bash
npm install
npm run dev
```
