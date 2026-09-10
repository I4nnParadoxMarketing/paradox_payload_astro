# Staging deploy: Neon + Vercel

Two Vercel projects from this monorepo:

| Project | Root Directory | Role |
|---------|----------------|------|
| `paradox-cms` | `payload` | Admin + API |
| `paradox-site` | `frontend` | Public Astro site |

Local stays on SQLite until you set a `postgresql://` `DATABASE_URL`.

---

## 1. Neon Postgres

1. Go to [https://console.neon.tech](https://console.neon.tech) and sign in.
2. **Create project** → name e.g. `paradox-staging`.
3. Region: pick one close to you / Vercel (e.g. `Sydney` or `US East`).
4. After create, open **Dashboard → Connection details**.
5. Copy the **connection string** (pooled is fine for serverless).  
   It looks like:  
   `postgresql://...@ep-xxxx.region.aws.neon.tech/neondb?sslmode=require`
6. Keep this tab open — you’ll paste it into Vercel.

Optional: create a second Neon branch named `staging` if you want DB isolation later.

---

## 2. Push code to GitHub

From the repo root (when ready to commit):

```bash
git add -A
git status
git commit -m "Prepare Neon Postgres, Vercel Blob, and Astro Vercel adapter"
git push origin main
```

Repo: `https://github.com/I4nnParadoxMarketing/paradox_payload_astro`

---

## 3. Vercel project A — CMS (`payload`)

1. [https://vercel.com/new](https://vercel.com/new) → import `paradox_payload_astro`.
2. **Project Name:** `paradox-cms` (or similar).
3. **Root Directory:** click Edit → `payload`.
4. Framework: Next.js (auto).
5. **Environment Variables** (Production + Preview):

| Name | Value |
|------|--------|
| `DATABASE_URL` | Neon connection string from step 1 |
| `PAYLOAD_SECRET` | long random string (e.g. `openssl rand -hex 32`) |
| `NEXT_PUBLIC_SERVER_URL` | leave blank first deploy, then set to CMS URL |
| `PAYLOAD_SERVER_URL` | same as `NEXT_PUBLIC_SERVER_URL` after first deploy |
| `FRONTEND_URL` | leave blank first, then set to site URL |
| `BLOB_READ_WRITE_TOKEN` | from Vercel Blob (step 4) |

6. Deploy.
7. Copy the deployment URL, e.g. `https://paradox-cms-xxx.vercel.app`.
8. Update env:
   - `NEXT_PUBLIC_SERVER_URL=https://paradox-cms-xxx.vercel.app`
   - `PAYLOAD_SERVER_URL=https://paradox-cms-xxx.vercel.app`
9. Redeploy CMS.

Open `https://paradox-cms-xxx.vercel.app/admin` and create the first admin user.

---

## 4. Vercel Blob (media)

1. In the **CMS** Vercel project → **Storage** → **Create** → **Blob**.
2. Connect it to `paradox-cms`.
3. Vercel adds `BLOB_READ_WRITE_TOKEN` automatically (or copy it into env).
4. Redeploy CMS so uploads use Blob.

---

## 5. Vercel project B — Site (`frontend`)

1. [https://vercel.com/new](https://vercel.com/new) → **same repo** again.
2. **Project Name:** `paradox-site`.
3. **Root Directory:** `frontend`.
4. Framework: Astro.
5. Env vars:

| Name | Value |
|------|--------|
| `PAYLOAD_URL` | `https://paradox-cms-xxx.vercel.app` |
| `PUBLIC_PAYLOAD_URL` | `https://paradox-cms-xxx.vercel.app` |

6. Deploy.
7. Copy site URL, e.g. `https://paradox-site-xxx.vercel.app`.

---

## 6. Wire CORS between them

In **CMS** project env:

| Name | Value |
|------|--------|
| `FRONTEND_URL` | `https://paradox-site-xxx.vercel.app` |
| `CORS_ORIGINS` | optional extra preview URLs, comma-separated |

Redeploy CMS.

---

## 7. Seed / import content on staging

Point local scripts at Neon (careful — this writes to staging DB):

```bash
cd payload
# temporary env for one-shot import
export DATABASE_URL='postgresql://...neon.tech/neondb?sslmode=require'
export PAYLOAD_SECRET='same-as-vercel'
export NEXT_PUBLIC_SERVER_URL='https://paradox-cms-xxx.vercel.app'
npm run seed:menu
npm run import:wordpress
# etc.
```

Or create content manually in staging admin.

---

## 8. Smoke test

- [ ] `…/admin` loads and you can log in  
- [ ] Upload an image in Media (Blob URL, not local disk)  
- [ ] Staging site homepage loads  
- [ ] Insights / capabilities pages resolve  
- [ ] Let’s Talk popup works  

---

## Local development (unchanged)

Leave `DATABASE_URL` unset (or `file:…`) and omit `BLOB_READ_WRITE_TOKEN` → SQLite + local `media/` folder.
