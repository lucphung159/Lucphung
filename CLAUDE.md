# CLAUDE.md

## Project Overview
Personal portfolio website for Luc Phung. Built with Next.js 15 (App Router), Tailwind CSS v4, and MongoDB. Deployed on Vercel.

## Tech Stack
- **Framework**: Next.js 15 (App Router, TypeScript)
- **Styling**: Tailwind CSS v4 with custom CSS variables in `app/globals.css`
- **Database**: MongoDB via Mongoose (`lib/mongodb.ts`, `lib/models/Content.ts`)
- **Auth**: JWT via `jose` library stored in httpOnly cookie (`lib/jwt.ts`)
- **Deployment**: Vercel

## Key Commands
```bash
npm install       # install dependencies
npm run dev       # start dev server at localhost:3000
npm run build     # production build
npm run lint      # run eslint
```

## Project Structure
```
app/
  page.tsx                  # Public portfolio page (server component, fetches from MongoDB)
  layout.tsx                # Root layout
  globals.css               # Global styles + CSS variables
  admin/
    page.tsx                # Admin login page (/admin)
    dashboard/page.tsx      # Page builder dashboard (/admin/dashboard)
  api/
    auth/login/route.ts     # POST /api/auth/login
    auth/logout/route.ts    # POST /api/auth/logout
    content/route.ts        # GET/PUT /api/content
lib/
  mongodb.ts                # MongoDB connection (cached)
  jwt.ts                    # signToken / verifyToken helpers
  models/Content.ts         # Mongoose content schema
middleware.ts               # Protects /admin/dashboard (redirects if not authed)
```

## Environment Variables
Required in `.env.local` (never commit this file):
```
MONGODB_URI=          # MongoDB connection string
JWT_SECRET=           # Strong random string for JWT signing
ADMIN_USERNAME=       # Admin login username
ADMIN_PASSWORD=       # Admin login password
```

## Admin Panel
- Login at `/admin` with credentials from env vars
- Dashboard at `/admin/dashboard` — edit Profile, News, Publications, Contact
- Changes save to MongoDB; public page reflects them immediately
- Session stored as httpOnly cookie (`admin_token`), expires in 7 days

## Content Model
Single MongoDB document (`type: "page_content"`) with:
- `profile` — name, title, university, advisor, email, social links, bio paragraphs
- `news[]` — date, type (paper/award/talk/misc), text
- `publications[]` — title, authors, venue, year, links[]
- `contact` — address, office, email

## Styling Conventions
CSS variables defined in `app/globals.css`:
- `--accent`: `#1e3a5f` (navy, primary color)
- `--accent-light`: `#2d5a8e`
- `--muted`: `#6b7280`
- `--border`: `#e5e7eb`
- `--highlight`: `#f0f4f8`

Reusable CSS classes: `.section-title`, `.publication-entry`, `.news-item`, `.badge`, `.badge-paper`, `.badge-award`, `.badge-talk`, `.badge-misc`

## Notes
- Public page uses `export const revalidate = 0` for fresh data on every request
- Mongoose model uses `models.Content || model(...)` pattern to avoid re-registration in hot reload
- `.env.local` is in `.gitignore` — add env vars manually in Vercel dashboard before deploying
