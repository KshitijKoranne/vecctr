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
- **Auth:** Clerk *(keys pending)*
- **Database:** Convex — `https://merry-lobster-483.convex.cloud`
- **Fonts:** Bricolage Grotesque + DM Sans
- **Deployment:** Vercel

## Local Setup

```bash
git clone https://github.com/KshitijKoranne/vecctr.git
cd vecctr
npm install
```

Create `.env.local` in the root:

```env
NEXT_PUBLIC_CONVEX_URL=https://merry-lobster-483.convex.cloud
CONVEX_DEPLOY_KEY=<your deploy key from Convex dashboard>

# Clerk — add when ready
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_TODO
CLERK_SECRET_KEY=sk_test_TODO
```

Push Convex schema (first time only):

```bash
npx convex dev --once
```

Run dev server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Vercel Deployment

1. Import repo at vercel.com/new
2. Add env vars in Vercel dashboard:
   - `NEXT_PUBLIC_CONVEX_URL`
   - `CONVEX_DEPLOY_KEY`
3. Deploy — no other config needed

## Routes

| Route | Description |
|-------|-------------|
| `/` | Landing page with live cycling hero |
| `/generators` | Generator gallery (All / Free / Pro filter) |
| `/generator/[slug]` | Full generator editor |
| `/pricing` | Pricing page |

## Status

- [x] Landing page
- [x] Generator gallery
- [x] Generator editor — all 10 generators working
- [x] PNG + SVG download, copy SVG
- [x] Convex schema (palettes + history)
- [ ] Clerk auth
- [ ] Free/Pro gating
- [ ] Payment gateway

Built by [Kshitij Koranne](https://kjrlabs.in)
