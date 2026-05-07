# Devfolio — Web

Next.js 16 frontend for the Devfolio portfolio platform.

**Live:** [devfolio.uz](https://devfolio.uz)

---

## Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **State:** Zustand
- **Server state:** TanStack Query v5
- **Forms:** React Hook Form + Zod
- **HTTP:** Axios
- **Export:** `@react-pdf/renderer` (PDF), `docx` (DOCX)

---

## Project Structure

```
src/
├── app/
│   ├── (auth)/           # Login, register, forgot-password, verify-email
│   ├── auth/callback/    # OAuth redirect handler
│   ├── dashboard/        # Portfolio management dashboard
│   ├── settings/         # Profile settings
│   ├── u/[username]/     # Public portfolio page
│   ├── layout.tsx
│   ├── page.tsx
│   ├── robots.ts
│   └── sitemap.ts
├── components/
│   ├── layout/           # Navbar
│   └── ExportModal.tsx   # PDF / DOCX export dialog
├── lib/
│   ├── api.ts            # Axios instance
│   └── export/
│       ├── pdf-templates.tsx
│       └── docx-export.ts
├── services/             # API call functions per resource
├── store/
│   └── auth.store.ts     # Zustand auth store
```

---

## Getting Started

### Prerequisites

- Node.js 20+
- API server running (see [root README](../../README.md))

### Install and run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Environment variables

Create `apps/web/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:4000/api
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

---

## Key Pages

| Route | Description |
|---|---|
| `/` | Landing page |
| `/register` | Sign up with email |
| `/login` | Sign in (email, Google, GitHub) |
| `/verify-email` | OTP email verification |
| `/forgot-password` | Password reset flow |
| `/dashboard` | Manage portfolio sections |
| `/settings` | Update profile info |
| `/u/[username]` | Public portfolio page |
| `/auth/callback` | OAuth token handler |

---

## Export

Users can export their portfolio from the dashboard:

- **PDF** — rendered with `@react-pdf/renderer`, downloads as `portfolio.pdf`
- **DOCX** — generated with `docx`, downloads as `portfolio.docx`

---

## Build

```bash
npm run build
npm run start
```

---

## Linting

```bash
npm run lint
```
