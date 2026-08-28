# Frontend PRD: Industry CRM Framework (Solar CRM V1)

**Version:** 1.0 · **Status:** Draft for review · **Owner:** Product/Engineering
**Companion document:** [`docs/backend-prd.md`](./backend-prd.md)

---

## 1. Executive Summary

The frontend mirrors the backend strategy: a **reusable, white-label CRM frontend framework** where **Solar CRM is the first template**. It is built as an **installable PWA** that feels native on mobile devices — app-shell architecture, offline support, gesture-driven navigation, and pixel-perfect rendering across all device classes — while remaining a fast, dense, keyboard-friendly web app on desktop.

The same **80% core / 20% industry module** split applies: core screens (leads, quotes, projects, payments, tickets, dashboard, settings) are industry-agnostic and theme-driven; industry screens (site survey, subsidy tracker) plug in via a template manifest. Launching Real Estate, Construction, HVAC, or any future vertical means swapping the template manifest, theme tokens, and industry modules — not rewriting the app.

**Business goals**

- Ship Solar CRM V1 frontend in the same MVP cycle as the backend
- Per-client white-labeling (logo, colors, PDF themes) with zero code changes
- Native-app-quality mobile experience for field roles (Sales, Technician) without app-store distribution
- New vertical frontend in weeks via the template system

**Non-goals (MVP)**

- Native iOS/Android apps (PWA only)
- Customer-facing portal (Phase 2)
- Real-time collaboration / websockets (Phase 2; polling + cache invalidation in MVP)
- Full offline editing for all modules (MVP: offline read everywhere + offline create/edit for field workflows only)

---

## 2. Product Principles

1. **Mobile-first, desktop-strong.** Every screen is designed at 360px first, then progressively enhanced. Desktop gets density, tables, and keyboard shortcuts — not a stretched phone layout.
2. **Core vs. industry separation is sacred.** No solar terminology in `core/` screens, routes, or components. Industry screens register through the template manifest.
3. **Theme is data, not code.** All colors, typography, radii, spacing, and branding come from design tokens hydrated from the backend `Settings.branding` API.
4. **Config-driven UI.** Pipelines, statuses, custom fields, and role permissions render dynamically from backend configuration — the UI never hard-codes stage names.
5. **Perceived performance is a feature.** Skeletons, optimistic updates, instant route transitions, and prefetching everywhere. No spinner longer than 300 ms without a skeleton.
6. **Permission-aware rendering.** UI elements the user cannot act on are hidden (not disabled), driven by the permission set from `GET /auth/me`.

---

## 3. Tech Stack

| Layer | Choice | Rationale |
|---|---|---|
| Framework | React 18 + TypeScript (strict) | Ecosystem, team velocity, component reuse across templates |
| Build | Vite + `vite-plugin-pwa` (Workbox) | Fast builds, first-class PWA tooling, code-splitting |
| Routing | React Router v6 (lazy routes) | Route-level code splitting per module |
| Server state | TanStack Query v5 | Caching, optimistic updates, offline mutation queue, prefetching |
| Client state | Zustand | Minimal global state (auth, theme, UI shell) |
| Styling | Tailwind CSS + CSS custom properties (design tokens) | Token-driven theming, white-labeling without rebuilds |
| Components | shadcn/ui (Radix primitives) | Accessible, ownable source, themeable via tokens |
| Forms | React Hook Form + Zod | Shared validation schemas mirroring backend contracts |
| Tables | TanStack Table | Virtualized, sortable, column-configurable lists |
| Charts | Recharts | Dashboard KPIs, funnel, collections trends |
| Dates | date-fns | Tree-shakeable, timezone-safe formatting |
| Maps/GPS | Leaflet (lazy-loaded) | Survey GPS capture and display |
| HTTP | Axios instance with interceptors | Token refresh, request IDs, error envelope handling |
| i18n | i18next | English MVP; Hindi + regional languages Phase 2 |
| Icons | Lucide | Consistent stroke style, tree-shakeable |
| Testing | Vitest + React Testing Library + Playwright | Unit, component, and E2E (including mobile viewports) |
| Quality | ESLint + Prettier + TypeScript strict + Lighthouse CI | Enforced in pipeline |

---

## 4. Architecture

### 4.1 Folder structure

```text
src/
├── core/                      # industry-agnostic (80%)
│   ├── auth/                  # login, forgot/reset password, session
│   ├── dashboard/
│   ├── leads/
│   ├── quotations/
│   ├── projects/
│   ├── payments/
│   ├── tickets/
│   ├── customers/
│   ├── users/
│   ├── settings/
│   └── ai/                    # AI assistant surfaces
├── industry/
│   └── solar/                 # the 20%
│       ├── surveys/
│       ├── subsidy/
│       └── manifest.ts        # registers routes, nav items, dashboard widgets
├── shared/
│   ├── components/            # design-system components (ui/), layout, data-display
│   ├── hooks/                 # useAuth, usePermissions, useOffline, useMediaQuery
│   ├── api/                   # axios client, query keys, generated API types
│   ├── theme/                 # token definitions, theme provider, branding loader
│   ├── pwa/                   # sw registration, install prompt, update toast, push
│   ├── stores/                # zustand stores
│   └── utils/
├── app/
│   ├── router.tsx             # assembles core + template manifest routes
│   ├── shell/                 # AppShell: sidebar (desktop), bottom nav (mobile)
│   └── providers.tsx
└── main.tsx
```

### 4.2 Template manifest (critical decision)

An industry template is a typed manifest the app loads at boot:

```text
TemplateManifest {
  id: "solar",
  routes[]            // industry screens (surveys, subsidy)
  navItems[]          // injected into sidebar / bottom nav / "More" sheet
  dashboardWidgets[]  // e.g., Surveys Pending, Subsidy Status
  leadExtensions      // industryData form sections (monthlyBill, roofType)
  projectExtensions   // systemSizeKw field, milestone presets
  terminology{}       // label overrides ("Site Survey", "Subsidy")
}
```

Core screens render extension slots (`<IndustrySlot name="lead.detail.sidebar" />`) that the manifest fills. A new vertical = new manifest + industry modules; core is untouched.

### 4.3 Data layer rules

- All server data flows through TanStack Query with a **central query-key registry** per module
- Mutations use **optimistic updates** for status changes, assignment, notes, and follow-ups, with rollback on error
- List → detail **prefetch on hover/press** for instant navigation
- API types generated from the backend OpenAPI spec — no hand-written response types
- Standard error envelope (`error.code`) mapped to user-facing toasts/inline messages; 401 triggers silent token refresh; 403 renders permission-denied state

---

## 5. Design System & Theming

### 5.1 Theme direction (CRM-optimized)

Default theme: **clean, professional light theme** — the proven pattern for data-dense CRM work — with full **dark mode** support (auto via `prefers-color-scheme` + manual toggle).

| Token group | Default (Solar template) |
|---|---|
| Surface | Near-white app background `#F8FAFC`, white cards, 1px `#E2E8F0` borders |
| Primary | Deep professional blue `#1D4ED8` (overridable per client) |
| Accent | Solar amber `#F59E0B` for highlights and CTAs (template-defined) |
| Semantic | Success `#16A34A` · Warning `#D97706` · Danger `#DC2626` · Info `#0284C7` |
| Pipeline | Distinct hue per stage, auto-generated for custom stages with AA contrast |
| Typography | Inter; 14px base desktop, 16px base mobile; tabular numerals for money |
| Radius | 8px cards/inputs, 999px pills/badges |
| Elevation | Subtle 2-level shadow scale; borders preferred over heavy shadows |
| Spacing | 4px grid (4/8/12/16/24/32) |

### 5.2 White-labeling

- All tokens are **CSS custom properties**; `Settings.branding` (primaryColor, secondaryColor, logo) hydrates them at runtime — client branding requires **no rebuild**
- Derived shades (hover, active, subtle backgrounds, on-color text) are computed from the primary color with automatic WCAG AA contrast enforcement
- Logo appears in the app shell, login screen, PWA splash screen, and PDF previews
- Per-template accent + terminology come from the manifest

### 5.3 Component inventory (shared, themeable)

AppShell · PageHeader · DataTable (virtualized) · CardList (mobile counterpart of tables) · KanbanBoard · Timeline · StatusBadge · PipelineStepper · StatCard · ChartCard · FormSection · DynamicField (renders custom fields from backend schema) · FileUploader (camera-aware) · ImageGallery · NotesPanel · ActivityFeed · AssignmentPicker · DateRangePicker · SearchCommand (⌘K) · BottomSheet · ActionSheet · ConfirmDialog · EmptyState · SkeletonSet · OfflineBanner · PWAUpdateToast

Every component ships with mobile and desktop behavior defined (e.g., DataTable renders as CardList below `md`).

---

## 6. PWA & Native-Feel Requirements

### 6.1 Installability & app identity

- Web App Manifest: client name + logo, `display: standalone`, themed splash screens, maskable icons (192/512), iOS meta tags + apple-touch-icons
- Custom **install prompt** UX (deferred `beforeinstallprompt`, dismissible, re-surfaced after 3 sessions); iOS gets an "Add to Home Screen" guide sheet
- App shortcuts in manifest: New Lead, Today’s Follow-ups, My Tickets

### 6.2 Service worker & offline strategy (Workbox)

| Asset/data | Strategy |
|---|---|
| App shell, JS/CSS | Precache, stale-while-revalidate, versioned cleanup |
| Images (Cloudinary) | Cache-first, 30-day expiry, LRU cap |
| GET API (lists/details) | Network-first with cached fallback → **offline read for all visited data** |
| Mutations (field workflows) | **Background-sync queue** for survey updates, ticket updates, notes, milestone completion, photo uploads — queued offline, synced on reconnect with conflict toast |
| Updates | New SW version → non-blocking "Update available" toast → skipWaiting on confirm |

A persistent **OfflineBanner** indicates connectivity state; queued mutations show a "pending sync" badge on affected records.

### 6.3 Native feel checklist (mobile)

- **Bottom navigation bar** (5 slots: Dashboard, Leads, +Quick-Add FAB, Projects, More) replacing the desktop sidebar
- **Quick-Add FAB** opens an action sheet: New Lead, New Note, New Ticket, Record Payment
- Bottom sheets instead of modals; full-screen dialogs for forms
- Swipe gestures: back-swipe navigation, swipe actions on list rows (call, assign, follow-up)
- **Pull-to-refresh** on all list screens
- `tel:` / `mailto:` / WhatsApp deep links on every phone number and email
- Camera capture (`capture=environment`) for survey images and proof uploads, with client-side compression before upload
- Geolocation API for survey GPS capture with accuracy indicator
- Safe-area insets (`env(safe-area-inset-*)`) for notches and home indicators
- No 300 ms tap delay, no rubber-band scroll glitches (`overscroll-behavior`), momentum scrolling, `touch-action` tuned per surface
- Haptics via Vibration API on destructive confirms (where supported)
- **Push notifications** (Web Push, VAPID): lead assigned, follow-up due, payment received, ticket assigned — permission requested in context, never on first load

### 6.4 Pixel-perfect device matrix

Layouts verified (Playwright viewport suite + manual QA) on:

| Class | Targets |
|---|---|
| Small phones | 360×800 (Android), 375×812 (iPhone SE/13 mini) |
| Standard phones | 390×844, 414×896, 430×932 |
| Tablets | 768×1024 (portrait + landscape), 820×1180 |
| Laptops | 1280, 1440 |
| Desktops | 1920+ |

Breakpoints: `sm 640 · md 768 · lg 1024 · xl 1280 · 2xl 1536`. Rules: minimum touch target **44×44px**, minimum body text 14px (16px inputs on iOS to prevent zoom), no horizontal scroll ever, all tap targets ≥ 8px apart.

---

## 7. Screens & Module Requirements

All list screens share: search, saved filters, sort, pagination/infinite scroll (mobile), bulk actions (desktop), permission-aware actions, empty/error/skeleton states, and CSV export where backend supports it.

### 7.1 Authentication (core)

- Login (branded), Forgot/Reset Password flows mapped to backend Module 1
- Silent refresh-token rotation; session-expiry redirect preserving deep link; lockout messaging after failed attempts
- Biometric-friendly: supports browser credential autofill / passkey-ready structure

### 7.2 Dashboard (core + industry widgets)

- Role-scoped KPI grid (StatCards): Total Leads, Conversion Rate, Active Projects, Collections, Outstanding, Open Tickets
- Leads funnel chart, collections trend chart, upcoming payments list, AMC-expiring list
- Industry widgets via manifest (Solar: Surveys Pending, Subsidy Status)
- Date-range filter; mobile shows swipeable KPI carousel + stacked cards; 60 s cache aligned with backend

### 7.3 Leads (core — flagship module)

- **Dual views:** Kanban board by pipeline stage (drag-and-drop, desktop) and list/CardList (default on mobile)
- Stage chips rendered from backend `PipelineDefinition` — never hard-coded
- Lead detail: header (name, stage stepper, quick actions: call/WhatsApp/email/assign), tabs — Overview, Timeline (merged activities + notes), Notes, Files, Quotations, plus industry slot (Solar: survey summary, monthly bill)
- Create/edit with duplicate-detection warning surfaced inline (409 handling)
- Follow-ups: "Today / Overdue / Upcoming" segmented view; one-tap reschedule via bottom sheet
- Won → celebratory micro-interaction + link to created Customer; Lost → required reason sheet
- CSV import wizard (upload → column mapping → dedupe report → confirm) reflecting async job progress

### 7.4 Site Survey (Solar industry module)

- Technician-first mobile UX: today’s assigned surveys list, map preview, one-tap navigate (Google Maps deep link)
- Survey form optimized for field use: large inputs, segmented controls (shading, connection type), GPS capture button, multi-photo camera capture with compression + offline queue
- Works fully **offline**: form saves locally, syncs via background sync
- Survey PDF preview + share sheet; AI Survey Summary button (suggestion UI, see 7.10)

### 7.5 Quotations (core)

- Builder: searchable product picker from catalog, line items with qty/price, server-computed totals displayed live (debounced calc endpoint), discount + subsidy fields, GST breakdown
- Status flow UI (Draft → Sent → Accepted/Rejected/Expired) with immutability messaging — editing a Sent quote forks a new version with version history
- Branded PDF preview (in-app viewer) + Email send with templated message + duplicate action
- AI Quotation Assistant entry point (see 7.10)

### 7.6 Projects (core + Solar extensions)

- List with status filters; detail with **milestone checklist** (ordered completion, proof photo upload per milestone, completed-by/at)
- Status stepper from template definition; team assignment panel; timeline tab; payment summary card linking to Payments
- Mobile: milestone completion is a one-screen flow — tap milestone → capture proof → confirm

### 7.7 Subsidy Tracker (Solar industry module)

- Status pipeline view with history, document upload checklist, reminder date surfaced with notification, approved amount reflected in project outstanding

### 7.8 Payments (core)

- Per-project payment schedule with installment statuses; record-payment bottom sheet (amount, mode, reference) with idempotent submit
- Invoice/receipt PDF preview + share; outstanding view per customer/project; GST report export (date-range → CSV)
- All money rendered with tabular numerals, locale formatting (₹), and paise-safe display from integer values

### 7.9 After Sales — Tickets & AMC (core)

- Ticket list with priority/status filters; SLA-due indicators; technician "My Tickets" mobile view
- Status flow with required resolution notes on Resolve; service history on project/customer detail
- AMC list with expiring-soon highlighting and renewal action

### 7.10 AI Surfaces (core, suggestion-only)

- **Quotation Assistant:** input sheet (monthly bill, state, roof area) → suggested kW, savings, ROI card → "Use in quotation" applies values into the builder (user confirms)
- **Follow-up Generator:** from lead detail → channel + tone picker → editable draft → copy / open in WhatsApp / open mail client
- **Survey Summary:** from survey detail → summary, risks, recommendations → attach as note on confirm
- All AI UI: streaming/typing indicator, 10 s timeout fallback, clearly labeled "AI suggestion — review before use", daily-quota messaging

### 7.11 Users, Customers & Settings (core, Admin/Manager)

- Users: CRUD, deactivate, role assignment, team management; reassignment flow when deactivating owners
- Customers: directory auto-populated from Won leads; detail aggregates projects, payments, tickets, AMC
- Settings (the customization backbone): Company profile · **Branding (live theme preview while editing colors/logo)** · Product catalog CRUD · Pipeline editor (stage add/rename/reorder with transition rules) · Custom-field builder (type, required, options → rendered by DynamicField) · Roles & permissions matrix · Numbering formats · Email template editor with preview

---

## 8. Performance Budgets

| Metric | Budget |
|---|---|
| Lighthouse (mobile, mid-tier device) | ≥ 90 Performance · ≥ 95 Accessibility · 100 PWA installability |
| LCP | < 2.0 s on 4G mid-tier Android |
| INP | < 200 ms |
| CLS | < 0.1 |
| Initial JS (gzipped, app shell) | < 200 KB; each lazy module < 100 KB |
| Route transition (cached) | < 100 ms perceived (skeleton immediate) |
| List scroll | 60 fps via virtualization beyond 50 rows |

Tactics: route-level code splitting per module, lazy-loaded charts/maps/PDF viewer, Cloudinary responsive image transforms (`w_auto,q_auto,f_auto`), font subsetting + `font-display: swap`, prefetch on intent, TanStack Query cache persistence to IndexedDB, Lighthouse CI budget enforcement in the pipeline.

---

## 9. Accessibility & Internationalization

- **WCAG 2.1 AA**: full keyboard navigation, visible focus rings, ARIA via Radix primitives, AA contrast enforced even for client-chosen brand colors, screen-reader-tested critical flows (login, create lead, record payment)
- Reduced-motion support (`prefers-reduced-motion`) disables non-essential animation
- i18next from day one: all strings externalized, English MVP; Hindi + regional languages Phase 2; ₹/date/number formatting via `Intl` with `Asia/Kolkata` default

---

## 10. Security (Frontend)

- Access token in memory; refresh token in httpOnly secure cookie (backend-set); no tokens in localStorage
- Strict CSP (no inline scripts), sanitized rendering (no `dangerouslySetInnerHTML` with user content)
- Permission checks are UX only — backend remains the authority; deep links to unauthorized resources render 403 state
- Auto-logout on refresh-token revocation; sensitive screens (Settings, Users) re-verify permissions on mount
- File upload validation (type/size) client-side before signed Cloudinary upload; EXIF GPS stripped except for survey images where GPS is intentional

---

## 11. Testing & Quality

- **Unit/component:** Vitest + RTL for shared components and hooks (≥ 70% coverage on `shared/` and `core/` logic)
- **E2E:** Playwright on desktop + mobile viewports for critical journeys — login, lead create→won, quote create→send, survey offline→sync, payment record, ticket resolve
- **Visual regression:** Playwright screenshots across the device matrix for shell, lists, and detail screens (pixel-perfect enforcement)
- **PWA QA checklist per release:** install on Android Chrome + iOS Safari, offline cold start, background sync replay, push notification receipt, update-toast flow
- CI: lint + typecheck + unit + E2E smoke + Lighthouse CI budgets on every MR

---

## 12. Phasing

| Phase | Scope |
|---|---|
| **MVP (8–10 wks, parallel with backend)** | App shell + theming + PWA install/offline-read, Auth, Dashboard, Leads (list/kanban/detail/import), Surveys (offline-capable), Quotations + PDF, Projects + milestones, Subsidy, Payments, Tickets/AMC, Settings, AI surfaces |
| **Phase 2** | Push notifications at scale, customer portal (separate PWA on same design system), WhatsApp deep integration UI, workflow automation builder, lead scoring UI, reminder center, Hindi/regional i18n |
| **Phase 3** | Second industry template (validates manifest system), per-template theme marketplace, advanced offline editing across all modules |

**MVP success metrics:** Lighthouse budgets green on CI; PWA installed by 100% of pilot field users; survey completed fully offline and synced; new lead created on mobile in < 30 s; client rebrand (logo + colors) completed in < 10 min via Settings with zero deploys.

---

## 13. Risks & Mitigations

| Risk | Mitigation |
|---|---|
| iOS Safari PWA limitations (push, storage eviction) | iOS-specific QA track; critical data synced eagerly; in-app notification center as fallback for push |
| Offline sync conflicts | Last-write-wins with conflict toast + activity log entry; field workflows scoped to low-conflict operations |
| Client brand colors break contrast | Automatic AA contrast adjustment of derived tokens; preview warnings in Settings |
| Config-driven UI complexity (custom fields/pipelines) | DynamicField + PipelineStepper as the only renderers; schema validation mirrors backend |
| Bundle growth as templates accumulate | Per-template lazy chunks; only the active template manifest loads; bundle budget enforced in CI |
| Pixel-perfection regressions | Visual regression suite across device matrix on every MR |
