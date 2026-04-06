# Vecctr

**Beautiful backgrounds, instantly.**

A generative SVG design asset tool built under [KJR Labs](https://kjrlabs.in) · [vecctr.in](https://vecctr.in)

## Generators

| # | Generator | Tier | Description |
|---|-----------|------|-------------|
| 1 | **Surge**   | Free | Organic wave layers with noise distortion |
| 2 | **Aura**    | Free | Dreamy mesh gradients with soft color orbs |
| 3 | **Morph**   | Free | Organic blob shapes, positioned and scaled |
| 4 | **Drift**   | Free | Scattered soft shapes floating across the canvas |
| 5 | **Prism**   | Free | Low poly triangulated mesh |
| 6 | **Weave**   | Free | Geometric tiling patterns (dots, hex, cross) |
| 7 | **Grain**   | Pro  | Noisy gradient textures |
| 8 | **Contour** | Pro  | Topographic elevation line maps |
| 9 | **Halo**    | Pro  | Radial glow ring effects |
| 10 | **Cascade** | Pro  | Stacked angular terraces |

## Stack

- **Framework:** Next.js 16 (App Router, fully static)
- **Styling:** Tailwind CSS
- **Auth:** Clerk *(wired, keys pending)*
- **Database:** Convex *(schema ready, deploy key pending)*
- **Fonts:** Bricolage Grotesque + DM Sans
- **Deployment:** Vercel

## Local Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Environment Variables

Copy `.env.local` and fill in:

```env
# Clerk — https://dashboard.clerk.com
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Convex — https://dashboard.convex.dev
NEXT_PUBLIC_CONVEX_URL=https://merry-lobster-483.convex.cloud
CONVEX_DEPLOY_KEY=...
```

## Routes

| Route | Description |
|-------|-------------|
| `/` | Landing page |
| `/generators` | Generator gallery |
| `/generator/[slug]` | Generator editor |
| `/pricing` | Pricing page |

## Status

🚧 Active development — Phase 1 complete (landing + gallery + editor)

Next: Auth (Clerk) + Database (Convex) + Payment gateway

Built by [Kshitij Koranne](https://kjrlabs.in)
