This repository is a Next.js 14+ app (app router) for a pizza storefront/admin panel. The goal of these instructions is to give an AI coding agent the concrete, repo-specific knowledge it needs to be productive immediately.

Key facts (short)
- App router: main pages live under `app/` using React Server and Client components. Many UI components are under `shared/components/`.
- Styling: Tailwind CSS utility classes are used throughout. Classes are often combined at runtime via `cn` helper in `shared/lib/utils`.
- Auth: `next-auth` is used (see `shared/auth-options.ts` and API routes under `app/api/auth`).
- DB: Prisma is configured in `prisma/` (schema at `prisma/schema.prisma`) with seed script `prisma/seed.ts`. Use `npm run prisma:push` / `prisma:studio` / `prisma:seed` as needed.

What to change and how (concrete patterns)
- UI components
  - Use Tailwind classes. For conditional classes the project uses `cn(...)` from `shared/lib/utils` (example: `app/(root)/profile/profile-sidebar.tsx`). Follow the pattern: base classes as strings, and an object for conditional variants.
  - Many components are client components (start with `"use client"`). If state, hooks or browser-only libs (lucide, next-auth client, pusher) are used, keep `"use client"` at the top.
  - Example change: to add a selected outline and purple hover to the profile links edit `app/(root)/profile/profile-sidebar.tsx` - base class then add `hover:bg-purple-50 hover:text-purple-600` and for active use `ring-2 ring-green-400` (this repo uses green accents for selection in some places).

- Data fetching and APIs
  - Server components fetch on the server. API endpoints live under `app/api/*`. When adding server-side helpers prefer `shared/lib` or `shared/services`.
  - Prisma client is instantiated in `prisma/prisma-client.ts`; import that rather than creating new clients.

- Auth & permissions
  - Use `get-user-session` helpers in `shared/lib` or `shared/services/auth.ts` to check session server-side. Manager/admin checks use `shared/lib/check-manager-role..ts`.

- State & stores
  - Local client state uses hooks in `shared/hooks` and `store/*` (e.g., `store/cart.ts`). For cross-component state prefer `zustand` stores already present.

Build, run, and DB commands (exact)
- Start dev server: `npm run dev` (Next dev on port 3000 by default).
- Build: `npm run build` then `npm run start` for production server.
- Lint: `npm run lint`.
- Prisma: `npm run prisma:push`, `npm run prisma:studio`, `npm run prisma:seed`.

Project-specific conventions
- File locations: pages and layout are organized under `app/(...)` groups. Admin/manager routes live under `app/(manager)` and `(admin)` groups. Use existing group patterns when adding new guarded areas.
- Shared UI: `shared/components/ui` contains smaller primitives; `shared/components/shared` holds higher-level shared views like `profile-form.tsx`.
- Icons: `lucide-react` icons are imported and rendered as components (pass `size` prop). Keep imports local to the file.
- CSS tokens: Tailwind v4 with `tailwind-merge` is used; avoid duplicating conflicting utility classes.

Integration points and external services
- Stripe: frontend Stripe components are used (`@stripe/react-stripe-js`) and server Stripe calls live in `app/api/payment*`.
- Pusher: real-time events via `pusher`/`pusher-js` helper in `shared/lib/pusher.ts`.
- Google Maps / geocoding: `@googlemaps/google-maps-services-js` used in `shared/lib/openstreetmap.ts`.

Testing and quick checks
- This repo has no test runner configured. Use the dev server for manual checks. For small changes, run `npm run dev` and open `http://localhost:3000/profile` to exercise the profile sidebar and confirm hover/selected styles.

Examples and references
- Change selected/hover styling: `app/(root)/profile/profile-sidebar.tsx` (see `cn(...)` usage and link rendering).
- Conditional classes helper: `shared/lib/utils` (search `export function cn`).
- Prisma client: `prisma/prisma-client.ts` and `prisma/schema.prisma`.

If you modify server-side behavior
- Update or reuse helpers in `shared/lib` and ensure Prisma client import uses the centralized `prisma/prisma-client.ts` to avoid duplicate clients.

When to ask for human review
- Large DB migrations or seed changes.
- Changes to auth flows or cookie/session lifetimes.

If anything about environment, secrets, or runtime is unclear, ask for the `.env` contents or which deployment target is used.

End of instructions.
