export type GeneratorSlug =
  | "surge" | "aura" | "morph" | "drift" | "prism" | "weave"
  | "grain" | "contour" | "halo" | "cascade";

export interface GeneratorMeta {
  slug: GeneratorSlug;
  name: string;
  desc: string;
  free: boolean;
  hasDirection: boolean;
  tags: string[];
}

export const GENERATORS: GeneratorMeta[] = [
  { slug: "surge",   name: "Surge",   free: true,  hasDirection: true,  desc: "Organic wave layers with noise distortion", tags: ["waves","organic"] },
  { slug: "aura",    name: "Aura",    free: true,  hasDirection: false, desc: "Dreamy mesh gradients with soft color orbs", tags: ["gradient","soft"] },
  { slug: "morph",   name: "Morph",   free: true,  hasDirection: false, desc: "Organic blob shapes, positioned and scaled", tags: ["blob","organic"] },
  { slug: "drift",   name: "Drift",   free: true,  hasDirection: false, desc: "Scattered soft shapes floating across the canvas", tags: ["scatter","shapes"] },
  { slug: "prism",   name: "Prism",   free: true,  hasDirection: false, desc: "Low poly triangulated mesh with color ranges", tags: ["geometric","mesh"] },
  { slug: "weave",   name: "Weave",   free: true,  hasDirection: false, desc: "Geometric tiling patterns — dots, hex, or cross", tags: ["pattern","geometric"] },
  { slug: "grain",   name: "Grain",   free: false, hasDirection: false, desc: "Noisy gradient textures — the grainy look", tags: ["noise","gradient","texture"] },
  { slug: "contour", name: "Contour", free: false, hasDirection: false, desc: "Topographic elevation line maps", tags: ["lines","topographic"] },
  { slug: "halo",    name: "Halo",    free: false, hasDirection: false, desc: "Radial glow rings — aurora and neon effects", tags: ["glow","rings","neon"] },
  { slug: "cascade", name: "Cascade", free: false, hasDirection: false, desc: "Stacked angular terraces filling the canvas", tags: ["geometric","layers"] },
];

export const FREE_GENERATORS  = GENERATORS.filter(g => g.free);
export const PRO_GENERATORS   = GENERATORS.filter(g => !g.free);
export const getGenerator = (slug: string) => GENERATORS.find(g => g.slug === slug);

export const CANVAS_PRESETS = [
  { label: "3:2",  sub: "900 × 600",    w: 900,  h: 600  },
  { label: "16:9", sub: "1280 × 720",   w: 1280, h: 720  },
  { label: "1:1",  sub: "1080 × 1080",  w: 1080, h: 1080 },
  { label: "9:16", sub: "1080 × 1920",  w: 1080, h: 1920 },
];

export const DIRECTIONS = [
  { key: "bottom", label: "↑", title: "Waves rise from bottom" },
  { key: "top",    label: "↓", title: "Waves fall from top"    },
  { key: "left",   label: "→", title: "Waves from left"        },
  { key: "right",  label: "←", title: "Waves from right"       },
];

export const CONTROLS: Record<GeneratorSlug, {
  variants: Array<
    | { type: "slider"; key: string; label: string; min: number; max: number; step: number }
    | { type: "seg";    key: string; label: string; options: { label: string; icon: string }[] }
  >;
  colors: { key: string; label: string }[];
}> = {
  surge: {
    variants: [
      { type:"slider", key:"layers",     label:"Layers",     min:2,  max:8,  step:1 },
      { type:"slider", key:"amplitude",  label:"Amplitude",  min:5,  max:95, step:1 },
      { type:"slider", key:"frequency",  label:"Frequency",  min:5,  max:95, step:1 },
      { type:"slider", key:"smoothness", label:"Smoothness", min:10, max:90, step:1 },
    ],
    colors: [
      { key:"bgColor",    label:"Background" },
      { key:"fillColor",  label:"Fill"       },
      { key:"fill2Color", label:"Fill 2"     },
    ],
  },
  aura: {
    variants: [
      { type:"slider", key:"orbs",      label:"Orbs",      min:2,  max:9,   step:1 },
      { type:"slider", key:"spread",    label:"Spread",    min:20, max:95,  step:1 },
      { type:"slider", key:"intensity", label:"Intensity", min:20, max:100, step:1 },
    ],
    colors: [
      { key:"bgColor", label:"Background" },
      { key:"color1",  label:"Color 1"    },
      { key:"color2",  label:"Color 2"    },
      { key:"color3",  label:"Color 3"    },
    ],
  },
  morph: {
    variants: [
      { type:"slider", key:"complexity", label:"Complexity", min:10, max:90, step:1 },
      { type:"slider", key:"scale",      label:"Scale",      min:20, max:90, step:1 },
      { type:"slider", key:"posX",       label:"Position X", min:10, max:90, step:1 },
      { type:"slider", key:"posY",       label:"Position Y", min:10, max:90, step:1 },
    ],
    colors: [
      { key:"bgColor",    label:"Background" },
      { key:"fillColor",  label:"Fill"       },
      { key:"fill2Color", label:"Fill 2"     },
    ],
  },
  drift: {
    variants: [
      { type:"slider", key:"count", label:"Count", min:5,  max:40, step:1 },
      { type:"slider", key:"size",  label:"Size",  min:10, max:80, step:1 },
      { type:"slider", key:"blur",  label:"Blur",  min:0,  max:80, step:1 },
    ],
    colors: [
      { key:"bgColor", label:"Background" },
      { key:"color1",  label:"Color 1"    },
      { key:"color2",  label:"Color 2"    },
      { key:"color3",  label:"Color 3"    },
    ],
  },
  prism: {
    variants: [
      { type:"slider", key:"resolution", label:"Resolution", min:4,  max:18, step:1 },
      { type:"slider", key:"distortion", label:"Distortion", min:5,  max:90, step:1 },
    ],
    colors: [
      { key:"bgColor", label:"Background" },
      { key:"color1",  label:"Color 1"    },
      { key:"color2",  label:"Color 2"    },
      { key:"color3",  label:"Color 3"    },
    ],
  },
  weave: {
    variants: [
      { type:"seg", key:"style", label:"Pattern", options:[
        { label:"Dots",  icon:"⬤" },
        { label:"Hex",   icon:"⬡" },
        { label:"Cross", icon:"✚" },
      ]},
      { type:"slider", key:"size",    label:"Size",    min:10, max:60, step:1 },
      { type:"slider", key:"opacity", label:"Opacity", min:10, max:90, step:1 },
    ],
    colors: [
      { key:"bgColor", label:"Background" },
      { key:"color1",  label:"Color 1"    },
      { key:"color2",  label:"Color 2"    },
    ],
  },
  grain: {
    variants: [
      { type:"slider", key:"noise", label:"Noise",   min:10, max:90, step:1 },
      { type:"slider", key:"blend", label:"Blend",   min:10, max:90, step:1 },
    ],
    colors: [
      { key:"bgColor", label:"Background" },
      { key:"color1",  label:"Color 1"    },
      { key:"color2",  label:"Color 2"    },
    ],
  },
  contour: {
    variants: [
      { type:"slider", key:"levels",    label:"Lines",     min:4,  max:20, step:1 },
      { type:"slider", key:"amplitude", label:"Amplitude", min:10, max:90, step:1 },
      { type:"slider", key:"frequency", label:"Frequency", min:10, max:90, step:1 },
    ],
    colors: [
      { key:"bgColor", label:"Background" },
      { key:"color1",  label:"Color 1"    },
      { key:"color2",  label:"Color 2"    },
    ],
  },
  halo: {
    variants: [
      { type:"slider", key:"rings",  label:"Rings",  min:4,  max:16,  step:1 },
      { type:"slider", key:"spread", label:"Spread", min:30, max:100, step:1 },
      { type:"slider", key:"glow",   label:"Glow",   min:20, max:100, step:1 },
    ],
    colors: [
      { key:"bgColor", label:"Background" },
      { key:"color1",  label:"Color 1"    },
      { key:"color2",  label:"Color 2"    },
    ],
  },
  cascade: {
    variants: [
      { type:"slider", key:"steps",      label:"Steps",      min:3, max:12, step:1 },
      { type:"slider", key:"jaggedness", label:"Jaggedness", min:0, max:90, step:1 },
    ],
    colors: [
      { key:"bgColor", label:"Background" },
      { key:"color1",  label:"Color 1"    },
      { key:"color2",  label:"Color 2"    },
      { key:"color3",  label:"Color 3"    },
    ],
  },
};
