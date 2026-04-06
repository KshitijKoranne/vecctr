// ─────────────────────────────────────────────
// SEEDED RNG — LCG, deterministic per seed
// ─────────────────────────────────────────────
export function makeRng(seed: number) {
  let s = seed >>> 0;
  return function () {
    s = Math.imul(1664525, s) + 1013904223;
    s = s >>> 0;
    return s / 4294967296;
  };
}

// ─────────────────────────────────────────────
// COLOR UTILITIES
// ─────────────────────────────────────────────
export function blendHex(c1: string, c2: string, t: number): string {
  try {
    const h1 = c1.replace("#", "").padEnd(6, "0");
    const h2 = c2.replace("#", "").padEnd(6, "0");
    const r1 = parseInt(h1.slice(0, 2), 16);
    const g1 = parseInt(h1.slice(2, 4), 16);
    const b1 = parseInt(h1.slice(4, 6), 16);
    const r2 = parseInt(h2.slice(0, 2), 16);
    const g2 = parseInt(h2.slice(2, 4), 16);
    const b2 = parseInt(h2.slice(4, 6), 16);
    const r = Math.round(r1 + (r2 - r1) * t);
    const g = Math.round(g1 + (g2 - g1) * t);
    const b = Math.round(b1 + (b2 - b1) * t);
    return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
  } catch {
    return c1;
  }
}

// ─────────────────────────────────────────────
// GENERATOR PARAM TYPES
// ─────────────────────────────────────────────
export interface SurgeParams {
  layers: number;       // 2–8
  amplitude: number;    // 5–95
  frequency: number;    // 5–95
  smoothness: number;   // 10–90
  bgColor: string;
  fillColor: string;
  fill2Color: string;
}

export interface AuraParams {
  orbs: number;         // 2–9
  spread: number;       // 20–95
  intensity: number;    // 20–100
  bgColor: string;
  color1: string;
  color2: string;
  color3: string;
}

export interface MorphParams {
  complexity: number;   // 10–90
  scale: number;        // 20–90
  posX: number;         // 10–90
  posY: number;         // 10–90
  bgColor: string;
  fillColor: string;
  fill2Color: string;
}

export interface DriftParams {
  count: number;        // 5–40
  size: number;         // 10–80
  blur: number;         // 0–80
  bgColor: string;
  color1: string;
  color2: string;
  color3: string;
}

export interface PrismParams {
  resolution: number;   // 4–18
  distortion: number;   // 5–90
  bgColor: string;
  color1: string;
  color2: string;
  color3: string;
}

export interface WeaveParams {
  style: number;        // 0=dots 1=hex 2=cross
  size: number;         // 10–60
  opacity: number;      // 10–90
  bgColor: string;
  color1: string;
  color2: string;
}

export interface GrainParams {
  noise: number;        // 10–90
  blend: number;        // 10–90
  bgColor: string;
  color1: string;
  color2: string;
}

export interface ContourParams {
  levels: number;       // 4–20  ← was broken, now correct
  amplitude: number;    // 10–90
  frequency: number;    // 10–90
  bgColor: string;
  color1: string;
  color2: string;
}

export interface HaloParams {
  rings: number;        // 4–16
  spread: number;       // 30–100
  glow: number;         // 20–100
  bgColor: string;
  color1: string;
  color2: string;
}

export interface CascadeParams {
  steps: number;        // 3–12
  jaggedness: number;   // 0–90
  bgColor: string;
  color1: string;
  color2: string;
  color3: string;
}

export type GeneratorParams =
  | SurgeParams | AuraParams | MorphParams | DriftParams
  | PrismParams | WeaveParams | GrainParams | ContourParams
  | HaloParams | CascadeParams;

// ─────────────────────────────────────────────
// DEFAULT PARAMS
// ─────────────────────────────────────────────
export const DEFAULT_PARAMS: Record<string, GeneratorParams> = {
  surge:   { layers:4, amplitude:50, frequency:40, smoothness:60, bgColor:"#0D1B2A", fillColor:"#1B6CA8", fill2Color:"#00A8CC" },
  aura:    { orbs:5, spread:60, intensity:70, bgColor:"#0F0C29", color1:"#FF6B6B", color2:"#FFE66D", color3:"#4ECDC4" },
  morph:   { complexity:50, scale:55, posX:50, posY:50, bgColor:"#1a1a2e", fillColor:"#e94560", fill2Color:"#0f3460" },
  drift:   { count:20, size:45, blur:25, bgColor:"#0C0C0E", color1:"#F5A623", color2:"#FF6B6B", color3:"#4ECDC4" },
  prism:   { resolution:10, distortion:40, bgColor:"#0D1117", color1:"#1B4332", color2:"#52B788", color3:"#B7E4C7" },
  weave:   { style:0, size:30, opacity:50, bgColor:"#0C0C0E", color1:"#F5A623", color2:"#FF6B6B" },
  grain:   { noise:55, blend:60, bgColor:"#1F1C2C", color1:"#928DAB", color2:"#FF6B6B" },
  contour: { levels:10, amplitude:40, frequency:40, bgColor:"#05070A", color1:"#1B4332", color2:"#52B788" },
  halo:    { rings:8, spread:70, glow:65, bgColor:"#0C0C0E", color1:"#F5A623", color2:"#FF6B6B" },
  cascade: { steps:7, jaggedness:25, bgColor:"#0D1B2A", color1:"#1B6CA8", color2:"#00A8CC", color3:"#134E5E" },
};

// ─────────────────────────────────────────────
// 1. SURGE — wave layers
// ─────────────────────────────────────────────
export function genSurge(W: number, H: number, seed: number, p: SurgeParams, dir: string): string {
  const rng = makeRng(seed);
  const layers = Math.round(p.layers); // integer, directly used as layer count
  const amp = H * (p.amplitude / 100) * 0.22;
  const freq = 0.0008 + (p.frequency / 100) * 0.006;
  const isV = dir === "left" || dir === "right";
  const flip = dir === "top" || dir === "right";
  let paths = "";

  for (let i = layers; i >= 0; i--) {
    const t = layers === 0 ? 0 : i / layers;
    const color = blendHex(p.fillColor, p.fill2Color, 1 - t);
    const opacity = 0.65 + (1 - t) * 0.35;
    const phase  = rng() * Math.PI * 2;
    const phase2 = rng() * Math.PI * 2;
    const pts = 120;

    if (!isV) {
      const spread = flip ? 0.85 : 0.85;
      const yBase = flip
        ? H * (0.08 + t * spread * 0.84)
        : H * (1 - 0.08 - t * spread * 0.84);

      let d = `M0,${H} L0,${yBase}`;
      for (let j = 1; j <= pts; j++) {
        const x  = (j / pts) * W;
        const xp = ((j - 1) / pts) * W;
        const y  = yBase + Math.sin(x  * freq + phase) * amp + Math.sin(x  * freq * 1.93 + phase2) * amp * 0.38;
        const yp = yBase + Math.sin(xp * freq + phase) * amp + Math.sin(xp * freq * 1.93 + phase2) * amp * 0.38;
        const cpx = (xp + x) / 2;
        const cpy = (yp + y) / 2;
        d += ` Q${xp.toFixed(1)},${yp.toFixed(1)} ${cpx.toFixed(1)},${cpy.toFixed(1)}`;
      }
      d += ` L${W},${H} Z`;
      paths += `<path d="${d}" fill="${color}" opacity="${opacity.toFixed(2)}"/>`;
    } else {
      const xBase = flip
        ? W * (0.08 + t * 0.84)
        : W * (1 - 0.08 - t * 0.84);

      let d = `M${W},0 L${xBase},0`;
      for (let j = 1; j <= pts; j++) {
        const y  = (j / pts) * H;
        const yp = ((j - 1) / pts) * H;
        const x  = xBase + Math.sin(y  * freq + phase) * amp + Math.sin(y  * freq * 1.93 + phase2) * amp * 0.38;
        const xp2 = xBase + Math.sin(yp * freq + phase) * amp + Math.sin(yp * freq * 1.93 + phase2) * amp * 0.38;
        const cpx = (xp2 + x) / 2;
        const cpy = (yp + y) / 2;
        d += ` Q${xp2.toFixed(1)},${yp.toFixed(1)} ${cpx.toFixed(1)},${cpy.toFixed(1)}`;
      }
      d += ` L${W},${H} Z`;
      paths += `<path d="${d}" fill="${color}" opacity="${opacity.toFixed(2)}"/>`;
    }
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">
  <rect width="${W}" height="${H}" fill="${p.bgColor}"/>
  ${paths}
</svg>`;
}

// ─────────────────────────────────────────────
// 2. AURA — mesh gradient orbs
// ─────────────────────────────────────────────
export function genAura(W: number, H: number, seed: number, p: AuraParams): string {
  const rng = makeRng(seed);
  const orbs = Math.round(p.orbs);
  const spread = p.spread / 100;
  const intensity = p.intensity / 100;
  const colors = [p.color1, p.color2, p.color3];
  let defs = `<defs>
  <radialGradient id="abg${seed}" cx="50%" cy="50%" r="80%">
    <stop offset="0%" stop-color="${blendHex(p.bgColor, "#1a1a2e", 0.4)}"/>
    <stop offset="100%" stop-color="${p.bgColor}"/>
  </radialGradient>`;

  let circles = "";
  for (let i = 0; i < orbs; i++) {
    const cx = 5 + rng() * 90;
    const cy = 5 + rng() * 90;
    const rx = (18 + rng() * 38) * spread;
    const ry = rx * (0.45 + rng() * 0.9);
    const c  = colors[i % colors.length];
    const op = (0.35 + rng() * 0.55) * intensity;
    defs += `<radialGradient id="aorb${seed}x${i}" cx="50%" cy="50%" r="50%">
    <stop offset="0%"   stop-color="${c}" stop-opacity="${op.toFixed(2)}"/>
    <stop offset="65%"  stop-color="${c}" stop-opacity="${(op * 0.25).toFixed(2)}"/>
    <stop offset="100%" stop-color="${c}" stop-opacity="0"/>
  </radialGradient>`;
    circles += `<ellipse cx="${cx.toFixed(1)}%" cy="${cy.toFixed(1)}%" rx="${rx.toFixed(1)}%" ry="${ry.toFixed(1)}%" fill="url(#aorb${seed}x${i})"/>`;
  }
  defs += `<filter id="ablur${seed}"><feGaussianBlur stdDeviation="26"/></filter></defs>`;

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">
  ${defs}
  <rect width="${W}" height="${H}" fill="url(#abg${seed})"/>
  <g filter="url(#ablur${seed})" transform="scale(${W / 100},${H / 100})">${circles}</g>
</svg>`;
}

// ─────────────────────────────────────────────
// 3. MORPH — organic blob
// ─────────────────────────────────────────────
export function genMorph(W: number, H: number, seed: number, p: MorphParams): string {
  const rng = makeRng(seed);
  const complexity = p.complexity / 100;
  const radius = (p.scale / 100) * Math.min(W, H) * 0.52;
  const cx = (p.posX / 100) * W;
  const cy = (p.posY / 100) * H;
  const numPts = 10;

  // Generate radii
  const radii: number[] = [];
  for (let i = 0; i < numPts; i++) {
    radii.push(radius * (1 - complexity * 0.45 + rng() * complexity * 0.9));
  }

  // Compute point coords
  const coords: [number, number][] = radii.map((r, i) => {
    const a = (i / numPts) * Math.PI * 2 - Math.PI / 2;
    return [cx + Math.cos(a) * r, cy + Math.sin(a) * r];
  });

  // Build smooth closed path with catmull-rom-style cubic beziers
  let d = "";
  for (let i = 0; i < numPts; i++) {
    const p0 = coords[(i - 1 + numPts) % numPts];
    const p1 = coords[i];
    const p2 = coords[(i + 1) % numPts];
    const p3 = coords[(i + 2) % numPts];
    const tension = 0.35;
    const cp1x = p1[0] + (p2[0] - p0[0]) * tension;
    const cp1y = p1[1] + (p2[1] - p0[1]) * tension;
    const cp2x = p2[0] - (p3[0] - p1[0]) * tension;
    const cp2y = p2[1] - (p3[1] - p1[1]) * tension;
    if (i === 0) d = `M${p1[0].toFixed(1)},${p1[1].toFixed(1)}`;
    d += ` C${cp1x.toFixed(1)},${cp1y.toFixed(1)} ${cp2x.toFixed(1)},${cp2y.toFixed(1)} ${p2[0].toFixed(1)},${p2[1].toFixed(1)}`;
  }
  d += " Z";

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">
  <defs>
    <linearGradient id="mg${seed}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%"   stop-color="${p.fillColor}"/>
      <stop offset="100%" stop-color="${p.fill2Color}"/>
    </linearGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="${p.bgColor}"/>
  <path d="${d}" fill="url(#mg${seed})" opacity="0.93"/>
</svg>`;
}

// ─────────────────────────────────────────────
// 4. DRIFT — scattered shapes
// ─────────────────────────────────────────────
export function genDrift(W: number, H: number, seed: number, p: DriftParams): string {
  const rng = makeRng(seed);
  const count = Math.round(p.count); // direct use — no scaling fudge
  const maxR  = (p.size / 100) * Math.min(W, H) * 0.25;
  const blurAmt = (p.blur / 100) * 20;
  const colors = [p.color1, p.color2, p.color3];
  let shapes = "";

  for (let i = 0; i < count; i++) {
    const x  = rng() * W;
    const y  = rng() * H;
    const sz = maxR * (0.3 + rng() * 0.7);
    const c  = colors[Math.floor(rng() * colors.length)];
    const op = (0.12 + rng() * 0.55).toFixed(2);
    const t  = Math.floor(rng() * 3);

    if (t === 0) {
      shapes += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${sz.toFixed(1)}" fill="${c}" opacity="${op}"/>`;
    } else if (t === 1) {
      const rx = sz, ry = sz * (0.35 + rng() * 0.55);
      const rot = (rng() * 360).toFixed(0);
      shapes += `<ellipse cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" rx="${rx.toFixed(1)}" ry="${ry.toFixed(1)}" fill="${c}" opacity="${op}" transform="rotate(${rot},${x.toFixed(0)},${y.toFixed(0)})"/>`;
    } else {
      const sides = 5 + Math.floor(rng() * 4);
      const pts = Array.from({ length: sides }, (_, j) => {
        const a = (j / sides) * Math.PI * 2;
        const r = sz * (0.65 + rng() * 0.45);
        return `${(x + Math.cos(a) * r).toFixed(1)},${(y + Math.sin(a) * r).toFixed(1)}`;
      }).join(" ");
      shapes += `<polygon points="${pts}" fill="${c}" opacity="${op}"/>`;
    }
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">
  <defs><filter id="df${seed}"><feGaussianBlur stdDeviation="${blurAmt.toFixed(1)}"/></filter></defs>
  <rect width="${W}" height="${H}" fill="${p.bgColor}"/>
  <g filter="url(#df${seed})">${shapes}</g>
</svg>`;
}

// ─────────────────────────────────────────────
// 5. PRISM — low poly mesh
// ─────────────────────────────────────────────
export function genPrism(W: number, H: number, seed: number, p: PrismParams): string {
  const rng = makeRng(seed);
  const cols = Math.round(p.resolution) + 2; // resolution maps directly to column count
  const rows = Math.max(2, Math.ceil(cols * (H / W)));
  const cw = W / cols;
  const ch = H / rows;
  const distort = (p.distortion / 100) * 0.75;
  const colors = [p.bgColor, p.color1, p.color2, p.color3];

  // Build point grid with distortion
  const pts: [number, number][][] = [];
  for (let row = 0; row <= rows; row++) {
    pts[row] = [];
    for (let col = 0; col <= cols; col++) {
      const x = Math.max(0, Math.min(W, col * cw + (rng() - 0.5) * cw * distort));
      const y = Math.max(0, Math.min(H, row * ch + (rng() - 0.5) * ch * distort));
      pts[row][col] = [x, y];
    }
  }

  let tris = "";
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const a = pts[row][col];
      const b = pts[row][col + 1];
      const d = pts[row + 1][col];
      const e = pts[row + 1][col + 1];

      // Blend across color array based on position
      const t = (row / rows) * 0.55 + (col / cols) * 0.45;
      const span = colors.length - 1;
      const ci = Math.min(Math.floor(t * span), span - 1);
      const frac = t * span - ci;
      const color = blendHex(colors[ci], colors[ci + 1], frac);
      const br1 = (0.78 + rng() * 0.32).toFixed(2);
      const br2 = (0.62 + rng() * 0.30).toFixed(2);

      tris += `<polygon points="${a[0].toFixed(1)},${a[1].toFixed(1)} ${b[0].toFixed(1)},${b[1].toFixed(1)} ${e[0].toFixed(1)},${e[1].toFixed(1)}" fill="${color}" opacity="${br1}"/>`;
      tris += `<polygon points="${a[0].toFixed(1)},${a[1].toFixed(1)} ${e[0].toFixed(1)},${e[1].toFixed(1)} ${d[0].toFixed(1)},${d[1].toFixed(1)}" fill="${color}" opacity="${br2}"/>`;
    }
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">
  <rect width="${W}" height="${H}" fill="${p.bgColor}"/>
  ${tris}
</svg>`;
}

// ─────────────────────────────────────────────
// 6. WEAVE — geometric tiling
// ─────────────────────────────────────────────
export function genWeave(W: number, H: number, seed: number, p: WeaveParams): string {
  const rng = makeRng(seed);
  const sz  = Math.round(p.size) + 8; // size is grid cell size in px, direct
  const op  = p.opacity / 100;
  const colors = [p.color1, p.color2];
  let pat = "";

  if (p.style === 0) {
    // Dot grid — sz is spacing
    for (let y = sz / 2; y < H + sz; y += sz) {
      for (let x = sz / 2; x < W + sz; x += sz) {
        const c = colors[Math.floor(rng() * colors.length)];
        pat += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${(sz * 0.2).toFixed(1)}" fill="${c}" opacity="${op}"/>`;
      }
    }
  } else if (p.style === 1) {
    // Hex grid
    const hexR = sz;
    const hexH = hexR * Math.sqrt(3);
    const colW = hexR * 1.5;
    for (let col = -1; col * colW < W + hexR * 2; col++) {
      for (let row = -1; row * hexH < H + hexH * 2; row++) {
        const cx = col * colW;
        const cy = row * hexH + (col % 2 !== 0 ? hexH / 2 : 0);
        const pts = Array.from({ length: 6 }, (_, i) => {
          const a = (i * Math.PI) / 3;
          return `${(cx + hexR * Math.cos(a)).toFixed(1)},${(cy + hexR * Math.sin(a)).toFixed(1)}`;
        }).join(" ");
        const c = colors[Math.floor(rng() * colors.length)];
        pat += `<polygon points="${pts}" fill="none" stroke="${c}" stroke-width="1.2" opacity="${(op * 0.75).toFixed(2)}"/>`;
      }
    }
  } else {
    // Cross/plus pattern
    for (let y = sz; y < H + sz; y += sz) {
      for (let x = sz; x < W + sz; x += sz) {
        const c = colors[Math.floor(rng() * colors.length)];
        const arm = sz * 0.38;
        const th  = Math.max(1, sz * 0.09);
        pat += `<rect x="${(x - arm).toFixed(1)}" y="${(y - th).toFixed(1)}" width="${(arm * 2).toFixed(1)}" height="${(th * 2).toFixed(1)}" fill="${c}" opacity="${op}" rx="1"/>`;
        pat += `<rect x="${(x - th).toFixed(1)}" y="${(y - arm).toFixed(1)}" width="${(th * 2).toFixed(1)}" height="${(arm * 2).toFixed(1)}" fill="${c}" opacity="${op}" rx="1"/>`;
      }
    }
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">
  <rect width="${W}" height="${H}" fill="${p.bgColor}"/>
  ${pat}
</svg>`;
}

// ─────────────────────────────────────────────
// 7. GRAIN — noisy gradient (Pro)
// ─────────────────────────────────────────────
export function genGrain(W: number, H: number, seed: number, p: GrainParams): string {
  const id = `gr${seed}`;
  const noiseFreq = (0.35 + (p.noise / 100) * 0.65).toFixed(3);
  const blendOp   = (p.blend / 100).toFixed(2);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">
  <defs>
    <linearGradient id="${id}g" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%"   stop-color="${p.bgColor}"/>
      <stop offset="50%"  stop-color="${p.color1}"/>
      <stop offset="100%" stop-color="${p.color2}"/>
    </linearGradient>
    <filter id="${id}f" color-interpolation-filters="sRGB">
      <feTurbulence type="fractalNoise" baseFrequency="${noiseFreq}" numOctaves="4" stitchTiles="stitch" result="noise"/>
      <feColorMatrix in="noise" type="saturate" values="0" result="gray"/>
      <feBlend in="SourceGraphic" in2="gray" mode="overlay" result="blended"/>
      <feComposite in="blended" in2="SourceGraphic" operator="in"/>
    </filter>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#${id}g)"/>
  <rect width="${W}" height="${H}" fill="url(#${id}g)" filter="url(#${id}f)" opacity="${blendOp}"/>
</svg>`;
}

// ─────────────────────────────────────────────
// 8. CONTOUR — topographic lines (Pro) — FIXED
// The bug was: levels was being used as a loop bound but
// the rng phase was pre-computed once, so adding lines
// didn't add new randomised lines — just reused positions.
// Fix: rng phases computed fresh per level inside loop.
// ─────────────────────────────────────────────
export function genContour(W: number, H: number, seed: number, p: ContourParams): string {
  const rng = makeRng(seed);
  const levels = Math.round(p.levels); // exact count of lines rendered
  const amp = H * (p.amplitude / 100) * 0.11;
  const freq = 0.0015 + (p.frequency / 100) * 0.007;
  let paths = "";

  for (let l = 0; l < levels; l++) {
    // Each line gets its own phase — computed here so adding levels adds new lines
    const phase  = rng() * Math.PI * 2;
    const phase2 = rng() * Math.PI * 2;
    const phase3 = rng() * Math.PI * 2;

    const t      = l / Math.max(1, levels - 1);
    const yBase  = H * (0.04 + t * 0.92);
    const color  = blendHex(p.color1, p.color2, t);
    const op     = (0.18 + t * 0.65).toFixed(2);
    const sw     = (0.4 + t * 1.8).toFixed(1);
    const steps  = 150;

    let d = "";
    for (let s = 0; s <= steps; s++) {
      const x = (s / steps) * W;
      const y = yBase
        + Math.sin(x * freq + phase)  * amp
        + Math.sin(x * freq * 2.3 + phase2) * amp * 0.35
        + Math.sin(x * freq * 0.4 + phase3) * amp * 0.55;
      d += s === 0 ? `M${x.toFixed(1)},${y.toFixed(1)}` : ` L${x.toFixed(1)},${y.toFixed(1)}`;
    }
    paths += `<path d="${d}" fill="none" stroke="${color}" stroke-width="${sw}" opacity="${op}"/>`;
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">
  <rect width="${W}" height="${H}" fill="${p.bgColor}"/>
  ${paths}
</svg>`;
}

// ─────────────────────────────────────────────
// 9. HALO — radial rings (Pro) — FIXED
// Bug was: ring count didn't change visual ring count
// because the loop used a hardcoded value.
// Fix: loop directly from 0 to rings (inclusive).
// ─────────────────────────────────────────────
export function genHalo(W: number, H: number, seed: number, p: HaloParams): string {
  const rng = makeRng(seed);
  const rings  = Math.round(p.rings); // direct ring count
  const spread = p.spread / 100;
  const glow   = p.glow / 100;
  const cx = W * (0.3 + rng() * 0.4);
  const cy = H * (0.3 + rng() * 0.4);
  const maxR = Math.max(W, H) * spread * 0.82;
  let circles = "";

  for (let i = 0; i <= rings; i++) {
    const t  = i / rings;
    const r  = t * maxR;
    const color = blendHex(p.color1, p.color2, t);
    const op = ((1 - t * 0.7) * glow * 0.75).toFixed(2);
    const sw = (0.8 + (rings - i) * (2.5 / rings)).toFixed(1);
    circles += `<circle cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" r="${r.toFixed(1)}" fill="none" stroke="${color}" stroke-width="${sw}" opacity="${op}"/>`;
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">
  <defs>
    <radialGradient id="hbg${seed}" cx="${((cx / W) * 100).toFixed(0)}%" cy="${((cy / H) * 100).toFixed(0)}%" r="70%">
      <stop offset="0%"   stop-color="${p.color1}" stop-opacity="${(glow * 0.3).toFixed(2)}"/>
      <stop offset="100%" stop-color="${p.bgColor}" stop-opacity="1"/>
    </radialGradient>
    <filter id="hbl${seed}"><feGaussianBlur stdDeviation="1.2"/></filter>
  </defs>
  <rect width="${W}" height="${H}" fill="${p.bgColor}"/>
  <rect width="${W}" height="${H}" fill="url(#hbg${seed})"/>
  <g filter="url(#hbl${seed})">${circles}</g>
</svg>`;
}

// ─────────────────────────────────────────────
// 10. CASCADE — stacked terraces (Pro) — FIXED
// Bug was: jaggedness didn't visually change much.
// Fix: jag amplitude now directly proportional to step height,
// and steps now correctly fills canvas top-to-bottom.
// ─────────────────────────────────────────────
export function genCascade(W: number, H: number, seed: number, p: CascadeParams): string {
  const rng = makeRng(seed);
  const steps = Math.round(p.steps);
  const stepH = H / steps;
  const jag   = stepH * (p.jaggedness / 100) * 0.7;
  const colors = [p.bgColor, p.color1, p.color2, p.color3];
  let paths = "";

  for (let i = steps; i >= 0; i--) {
    const t = i / steps;
    const yBase = i * stepH;
    const ci    = Math.min(Math.floor((1 - t) * (colors.length - 1)), colors.length - 2);
    const frac  = (1 - t) * (colors.length - 1) - ci;
    const color = blendHex(colors[ci], colors[ci + 1], frac);
    const segs  = 10;

    let d = `M0,${H} L0,${yBase.toFixed(1)}`;
    for (let s = 0; s <= segs; s++) {
      const x = (s / segs) * W;
      const y = yBase + (rng() - 0.5) * jag * 2;
      d += ` L${x.toFixed(1)},${y.toFixed(1)}`;
    }
    d += ` L${W},${H} Z`;
    paths += `<path d="${d}" fill="${color}" opacity="0.9"/>`;
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">
  <rect width="${W}" height="${H}" fill="${p.bgColor}"/>
  ${paths}
</svg>`;
}

// ─────────────────────────────────────────────
// MASTER RENDER FUNCTION
// ─────────────────────────────────────────────
export function renderGenerator(
  slug: string,
  W: number,
  H: number,
  seed: number,
  params: GeneratorParams,
  direction = "bottom"
): string {
  switch (slug) {
    case "surge":   return genSurge(W, H, seed, params as SurgeParams, direction);
    case "aura":    return genAura(W, H, seed, params as AuraParams);
    case "morph":   return genMorph(W, H, seed, params as MorphParams);
    case "drift":   return genDrift(W, H, seed, params as DriftParams);
    case "prism":   return genPrism(W, H, seed, params as PrismParams);
    case "weave":   return genWeave(W, H, seed, params as WeaveParams);
    case "grain":   return genGrain(W, H, seed, params as GrainParams);
    case "contour": return genContour(W, H, seed, params as ContourParams);
    case "halo":    return genHalo(W, H, seed, params as HaloParams);
    case "cascade": return genCascade(W, H, seed, params as CascadeParams);
    default:        return "";
  }
}
