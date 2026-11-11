# Cognirex Solutions — Content Management System (`/cms`)

Full-stack Content Management System engineered for **Cognirex Solutions**, running seamlessly on the **same domain** at `/cms` (backed by Next.js API routes in `src/app/api/cms/*` with dual MongoDB Atlas + `.data/` JSON persistence) and also buildable with the included standalone Express server (`cms/dist-backend`).

## Features

- **Real-Time Visual Preview**: Split-pane live iframe preview synced via `window.postMessage` (`CMS_LIVE_PREVIEW`) before publishing changes live.
- **Full Website Content Control**: Edit headlines, subtitles, photos, add/delete/reorder cards across all 10 Cognirex sections:
  - Navigation & Brand (`site_brand`)
  - Hero & Capability Strip (`hero`)
  - About, Mission, Vision, Values & Core Disciplines (`about`)
  - Solutions & Business Needs (`solutions`)
  - Why Choose Us (`why_choose_us`)
  - 5-Stage Process Roadmap (`process`)
  - Industries Solutions (`industries`)
  - Innovation & Responsible AI (`innovation`)
  - Contact CTA & Contact Portal (`contact_section`)
  - Careers & Job Openings (`careers`)
- **Image Library**: Upload images (Cloudinary when configured, or persisted cleanly in `public/uploads/cms/`), browse assets, copy URLs, and pick directly inside any image field.
- **Unified Leads & Hiring Inboxes**: Manage Project Enquiries, Consultation Bookings (including calendar conflict prevention, notes, email replies, and status changes), and Career Applications with CSV export.
- **Role & Email Whitelist Security**: Google OAuth 2.0 + JWT email/password login, Super Admin email whitelisting, SMTP verification & configuration.

## Quick Build (Same-Domain Deployment)

From the root directory (`D:\cognirex-solutions-pvt-main`):
```bash
npm run cms:build
```

Or standalone CMS development:
```bash
cd cms
npm install
npm run dev
```
