# Cognirex Solutions — Monorepo

This repository contains two separate projects:

## 📁 cognirex-website
**Next.js 15 website** — the main public-facing site with API backend.

```bash
cd cognirex-website
npm install
npm run dev        # Start development server → http://localhost:3000
npm run build      # Production build
npm run cms:build  # Build CMS and copy output to public/cms/
```

> Copy `.env.example` → `.env.local` and fill in your credentials before running.

**Tech:** Next.js 15, React 19, TypeScript, Tailwind CSS, MongoDB, Cloudinary, Nodemailer

---

## 📁 cognirex-cms
**Vite + React CMS admin panel** with Express.js backend.

```bash
cd cognirex-cms
npm install
npm run build      # Build CMS React SPA
npm run server     # Run standalone Express CMS server
npm run dev        # CMS dev mode (Vite)
```

> Copy `.env.example` → `.env` and fill in your credentials before running.

**Tech:** Vite 6, React 19, TypeScript, Tailwind CSS 4, Express.js, Mongoose, Tiptap, Zustand

---

## How They Work Together

The CMS is embedded into the website:
- Run `npm run cms:build` from `cognirex-website/` to compile the CMS and copy it to `cognirex-website/public/cms/`
- The website then serves the CMS at `/cms/`
- All CMS API calls go through the Next.js API routes at `/api/cms/*`
