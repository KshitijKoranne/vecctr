"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { GENERATORS, CANVAS_PRESETS, DIRECTIONS, CONTROLS, type GeneratorSlug } from "@/lib/generatorMeta";
import { DEFAULT_PARAMS, renderGenerator, type GeneratorParams } from "@/lib/generators";

// ─── tiny helpers ───────────────────────────────────────────────
function cn(...classes: (string | false | undefined | null)[]) {
  return classes.filter(Boolean).join(" ");
}

// ─── THUMB SEEDS ────────────────────────────────────────────────
const THUMB_SEEDS = [10777, 21333, 31999, 42555, 53111, 63777, 74333, 84999, 95555, 10611];

interface Props { initialSlug: string }

export function GeneratorEditor({ initialSlug }: Props) {
  const router = useRouter();

  // ── state ──────────────────────────────────────────────────────
  const [activeSlug, setActiveSlug]   = useState<GeneratorSlug>(initialSlug as GeneratorSlug);
  const [seed,       setSeed]         = useState(() => Math.floor(Math.random() * 99999));
  const [canvasW,    setCanvasW]      = useState(900);
  const [canvasH,    setCanvasH]      = useState(600);
  const [direction,  setDirection]    = useState("bottom");
  const [params,     setParams]       = useState<Record<string, GeneratorParams>>(() => {
    const copy: Record<string, GeneratorParams> = {};
    GENERATORS.forEach(g => { copy[g.slug] = { ...DEFAULT_PARAMS[g.slug] } as GeneratorParams; });
    return copy;
  });
  const [toast,     setToast]         = useState<string | null>(null);
  const [copiedSvg, setCopiedSvg]     = useState(false);

  // ── derived ────────────────────────────────────────────────────
  const activeGen  = GENERATORS.find(g => g.slug === activeSlug)!;
  const activeCtrl = CONTROLS[activeSlug];
  const svgString  = renderGenerator(activeSlug, canvasW, canvasH, seed, params[activeSlug], direction);

  // ── canvas fit ─────────────────────────────────────────────────
  const wrapRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  const fitCanvas = useCallback(() => {
    if (!wrapRef.current) return;
    const { clientWidth: ww, clientHeight: wh } = wrapRef.current;
    const s = Math.min((ww - 64) / canvasW, (wh - 64) / canvasH);
    setScale(Math.min(s, 1));
  }, [canvasW, canvasH]);

  useEffect(() => {
    fitCanvas();
    window.addEventListener("resize", fitCanvas);
    return () => window.removeEventListener("resize", fitCanvas);
  }, [fitCanvas]);

  // ── toast ──────────────────────────────────────────────────────
  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  // ── switch generator ───────────────────────────────────────────
  const switchGen = (slug: GeneratorSlug) => {
    setActiveSlug(slug);
    setSeed(Math.floor(Math.random() * 99999));
    router.replace(`/generator/${slug}`, { scroll: false });
  };

  // ── randomise ──────────────────────────────────────────────────
  const randomise = () => setSeed(Math.floor(Math.random() * 99999));

  // ── param update ───────────────────────────────────────────────
  const updateParam = (key: string, value: number | string) => {
    setParams(prev => ({
      ...prev,
      [activeSlug]: { ...prev[activeSlug], [key]: value },
    }));
  };

  // ── download PNG ───────────────────────────────────────────────
  const downloadPng = () => {
    const blob = new Blob([svgString], { type: "image/svg+xml" });
    const url  = URL.createObjectURL(blob);
    const img  = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width  = canvasW;
      canvas.height = canvasH;
      canvas.getContext("2d")!.drawImage(img, 0, 0);
      canvas.toBlob(b => {
        if (!b) return;
        const a = document.createElement("a");
        a.href     = URL.createObjectURL(b);
        a.download = `vecctr-${activeSlug}-${seed}.png`;
        a.click();
        showToast("PNG downloaded");
      }, "image/png");
      URL.revokeObjectURL(url);
    };
    img.src = url;
  };

  // ── download SVG ───────────────────────────────────────────────
  const downloadSvg = () => {
    const blob = new Blob([svgString], { type: "image/svg+xml" });
    const a    = document.createElement("a");
    a.href     = URL.createObjectURL(blob);
    a.download = `vecctr-${activeSlug}-${seed}.svg`;
    a.click();
    showToast("SVG downloaded");
  };

  // ── copy SVG ───────────────────────────────────────────────────
  const copySvg = () => {
    navigator.clipboard.writeText(svgString).then(() => {
      setCopiedSvg(true);
      showToast("SVG copied to clipboard");
      setTimeout(() => setCopiedSvg(false), 2000);
    });
  };

  // ──────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col h-screen overflow-hidden bg-bg">

      {/* ── TOPBAR ── */}
      <header className="h-[52px] flex-shrink-0 flex items-center gap-3 px-4
                         bg-surface border-b border-border z-10">
        <Link href="/generators"
          className="flex items-center gap-2 text-text-2 hover:text-text text-[12px]
                     font-medium bg-surface2 border border-border hover:border-border2
                     px-3 py-1.5 rounded-sm transition-all duration-150">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M7.5 2L3.5 6 7.5 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          All generators
        </Link>

        <div className="w-px h-5 bg-border" />

        <Link href="/" className="font-heading font-extrabold text-[17px] text-text tracking-tight">
          vecctr<span className="text-accent">.</span>
        </Link>

        <div className="w-px h-5 bg-border" />

        <span className="font-heading font-bold text-[14px] text-text tracking-tight">
          {activeGen.name}
        </span>

        <div className="flex-1" />

        {!activeGen.free && (
          <span className="text-[11px] font-semibold text-accent bg-accent/10
                           border border-accent/20 px-2.5 py-1 rounded-sm tracking-wide">
            PRO
          </span>
        )}
      </header>

      {/* ── BODY ── */}
      <div className="flex flex-1 overflow-hidden">

        {/* ── LEFT ── */}
        <aside className="w-[210px] flex-shrink-0 bg-surface border-r border-border
                          overflow-y-auto">
          <p className="px-3.5 pt-3.5 pb-2 text-[10px] font-semibold tracking-[1.8px]
                        uppercase text-text-3">
            Generators
          </p>

          <div className="pb-3">
            {GENERATORS.map((gen, idx) => {
              const thumb = renderGenerator(
                gen.slug, 200, 72,
                THUMB_SEEDS[idx],
                params[gen.slug],
                "bottom"
              );
              return (
                <button
                  key={gen.slug}
                  onClick={() => switchGen(gen.slug as GeneratorSlug)}
                  className={cn(
                    "block w-full mx-0 mb-1.5 rounded-[9px] overflow-hidden",
                    "border-2 transition-all duration-150 cursor-pointer",
                    "hover:-translate-y-[1px]",
                    activeSlug === gen.slug
                      ? "border-accent"
                      : "border-transparent hover:border-border2"
                  )}
                >
                  {/* thumbnail */}
                  <div className="relative h-[68px] overflow-hidden">
                    <div
                      className="w-full h-full"
                      dangerouslySetInnerHTML={{ __html: thumb }}
                    />
                    {!gen.free && (
                      <span className="absolute top-1.5 right-1.5 text-[9px] font-bold
                                       text-accent bg-bg/80 border border-border
                                       px-1.5 py-0.5 rounded backdrop-blur-sm tracking-wide">
                        PRO
                      </span>
                    )}
                  </div>
                  {/* label */}
                  <div className="bg-surface2 px-2.5 py-1.5 flex items-center justify-between">
                    <span className="font-heading font-bold text-[12px] text-text tracking-tight">
                      {gen.name}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </aside>

        {/* ── CANVAS ── */}
        <main
          ref={wrapRef}
          className="flex-1 relative flex items-center justify-center overflow-hidden"
          style={{
            background: "#0A0A0C",
            backgroundImage: "radial-gradient(circle, #2C2C3066 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        >
          {/* canvas box */}
          <div
            className="relative overflow-hidden shadow-2xl"
            style={{
              width:  canvasW * scale,
              height: canvasH * scale,
              boxShadow: "0 0 0 1px #2C2C30, 0 24px 64px rgba(0,0,0,0.6)",
              borderRadius: 2,
              transition: "width 0.25s, height 0.25s",
            }}
          >
            <div
              style={{ width: canvasW, height: canvasH, transform: `scale(${scale})`, transformOrigin: "top left" }}
              dangerouslySetInnerHTML={{ __html: svgString }}
            />
          </div>

          {/* dice */}
          <DiceButton onClick={randomise} />

          {/* size badge */}
          <div className="absolute bottom-7 right-5 text-[11px] text-text-2
                          bg-bg/80 border border-border rounded px-2.5 py-1
                          backdrop-blur-sm font-body">
            {canvasW} × {canvasH}
          </div>
        </main>

        {/* ── RIGHT PANEL ── */}
        <aside className="w-[288px] flex-shrink-0 bg-surface border-l border-border
                          overflow-y-auto flex flex-col">

          {/* CANVAS SIZE */}
          <PanelSection title="Canvas">
            <div className="grid grid-cols-2 gap-1.5">
              {CANVAS_PRESETS.map(p => (
                <button
                  key={p.label}
                  onClick={() => { setCanvasW(p.w); setCanvasH(p.h); }}
                  className={cn(
                    "rounded-sm border text-left px-2.5 py-2 transition-all duration-150",
                    canvasW === p.w && canvasH === p.h
                      ? "bg-accent/10 border-accent/35 text-accent"
                      : "bg-surface2 border-border text-text-2 hover:bg-surface3 hover:text-text hover:border-border2"
                  )}
                >
                  <span className="text-[12px] font-semibold font-heading block">{p.label}</span>
                  <span className={cn(
                    "text-[10px] block mt-0.5",
                    canvasW === p.w && canvasH === p.h ? "text-accent/60" : "text-text-3"
                  )}>{p.sub}</span>
                </button>
              ))}
            </div>
          </PanelSection>

          {/* VARIANTS */}
          <PanelSection title="Variants">
            {activeCtrl.variants.map((ctrl) => {
              const p = params[activeSlug] as unknown as Record<string, number>;

              if (ctrl.type === "slider") {
                return (
                  <div key={ctrl.key} className="mb-3.5 last:mb-0">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[11px] font-medium text-text-2">{ctrl.label}</span>
                      <span className="text-[11px] font-bold text-text font-heading
                                       bg-surface2 border border-border rounded px-2 py-0.5 min-w-[32px] text-center">
                        {p[ctrl.key]}
                      </span>
                    </div>
                    <input
                      type="range"
                      min={ctrl.min}
                      max={ctrl.max}
                      step={ctrl.step}
                      value={p[ctrl.key]}
                      onChange={e => updateParam(ctrl.key, parseFloat(e.target.value))}
                    />
                  </div>
                );
              }

              if (ctrl.type === "seg") {
                return (
                  <div key={ctrl.key} className="mb-3.5 last:mb-0">
                    <p className="text-[11px] font-medium text-text-2 mb-1.5">{ctrl.label}</p>
                    <div className="flex bg-surface2 border border-border rounded-sm p-[3px] gap-[2px]">
                      {ctrl.options.map((opt, i) => (
                        <button
                          key={i}
                          onClick={() => updateParam(ctrl.key, i)}
                          className={cn(
                            "flex-1 flex flex-col items-center gap-1 py-1.5 rounded-[5px]",
                            "text-[11px] font-medium transition-all duration-150",
                            p[ctrl.key] === i
                              ? "bg-surface3 text-text shadow-sm"
                              : "text-text-2 hover:text-text"
                          )}
                        >
                          <span className="text-[15px] leading-none">{opt.icon}</span>
                          <span>{opt.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                );
              }
            })}
          </PanelSection>

          {/* DIRECTION — only for generators with direction */}
          {activeGen.hasDirection && (
            <PanelSection title="Direction">
              <div className="grid grid-cols-4 gap-1.5">
                {DIRECTIONS.map(d => (
                  <button
                    key={d.key}
                    title={d.title}
                    onClick={() => setDirection(d.key)}
                    className={cn(
                      "aspect-square flex items-center justify-center rounded-sm border",
                      "text-[16px] transition-all duration-150",
                      direction === d.key
                        ? "bg-accent/10 border-accent/35 text-accent"
                        : "bg-surface2 border-border text-text-2 hover:bg-surface3 hover:text-text hover:border-border2"
                    )}
                  >
                    {d.label}
                  </button>
                ))}
              </div>
            </PanelSection>
          )}

          {/* COLOR */}
          <PanelSection title="Color">
            {activeCtrl.colors.map(({ key, label }) => {
              const p = params[activeSlug] as unknown as Record<string, string>;
              const val = p[key] || "#000000";
              return (
                <ColorRow
                  key={key}
                  label={label}
                  value={val}
                  onChange={hex => updateParam(key, hex)}
                />
              );
            })}
          </PanelSection>

          {/* DOWNLOAD — pinned to bottom */}
          <div className="mt-auto border-t border-border p-[18px]">
            <p className="text-[10px] font-semibold tracking-[1.8px] uppercase text-text-3 mb-3">
              Download
            </p>
            <div className="grid grid-cols-2 gap-2 mb-2">
              <button
                onClick={downloadSvg}
                className="flex items-center justify-center gap-1.5 py-2.5 rounded-sm
                           bg-accent text-bg text-[13px] font-bold font-heading
                           hover:bg-accent-h transition-all hover:-translate-y-[1px]"
              >
                <DownloadIcon /> SVG
              </button>
              <button
                onClick={downloadPng}
                className="flex items-center justify-center gap-1.5 py-2.5 rounded-sm
                           bg-surface2 border border-border text-text text-[13px] font-bold font-heading
                           hover:bg-surface3 hover:border-border2 transition-all hover:-translate-y-[1px]"
              >
                <DownloadIcon /> PNG
              </button>
            </div>
            <button
              onClick={copySvg}
              className={cn(
                "w-full flex items-center justify-center gap-2 py-2 rounded-sm border",
                "text-[12px] font-medium transition-all duration-150",
                copiedSvg
                  ? "border-green text-green"
                  : "border-border text-text-2 hover:border-border2 hover:text-text"
              )}
            >
              {copiedSvg ? (
                <><CheckIcon /> Copied to clipboard</>
              ) : (
                <><CopyIcon /> Copy SVG code</>
              )}
            </button>
            <p className="mt-2.5 text-[10px] text-text-3 text-center leading-relaxed">
              PNG is always free.{" "}
              <Link href="/pricing" className="text-accent hover:underline">
                Upgrade for SVG
              </Link>{" "}
              & code export.
            </p>
          </div>
        </aside>
      </div>

      {/* ── TOAST ── */}
      <div className={cn(
        "fixed bottom-8 left-1/2 -translate-x-1/2 z-50",
        "bg-surface3 border border-border2 text-text text-[13px] font-medium",
        "px-5 py-2.5 rounded-lg shadow-xl whitespace-nowrap",
        "transition-all duration-300 pointer-events-none",
        toast ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
      )}>
        {toast}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// SUB-COMPONENTS
// ─────────────────────────────────────────────

function PanelSection({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(true);
  return (
    <div className="border-b border-border">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-[18px] py-3.5
                   text-[10px] font-semibold tracking-[1.8px] uppercase text-text-3
                   hover:text-text-2 transition-colors duration-150"
      >
        {title}
        <svg
          width="10" height="10" viewBox="0 0 10 10" fill="none"
          className={cn("transition-transform duration-200", !open && "-rotate-90")}
        >
          <path d="M2 4l3 3 3-3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
      {open && <div className="px-[18px] pb-[18px]">{children}</div>}
    </div>
  );
}

function ColorRow({ label, value, onChange }: { label: string; value: string; onChange: (hex: string) => void }) {
  const pickerRef = useRef<HTMLInputElement>(null);
  const [hex, setHex] = useState(value.replace("#", "").toUpperCase());

  useEffect(() => {
    setHex(value.replace("#", "").toUpperCase());
  }, [value]);

  const handleHexInput = (v: string) => {
    const clean = v.replace(/[^0-9a-fA-F]/g, "").slice(0, 6);
    setHex(clean.toUpperCase());
    if (clean.length === 6) onChange("#" + clean);
  };

  return (
    <div className="flex items-center gap-2.5 mb-2.5 last:mb-0">
      <span className="text-[11px] font-medium text-text-2 w-[72px] flex-shrink-0">{label}</span>
      <div
        className="flex flex-1 items-center gap-2 bg-surface2 border border-border
                   rounded-sm px-2.5 py-[5px] hover:border-border2 transition-colors
                   cursor-pointer"
        onClick={() => pickerRef.current?.click()}
      >
        <div
          className="w-[18px] h-[18px] rounded flex-shrink-0 border border-white/10"
          style={{ background: value }}
        />
        <span className="text-[11px] text-text-3 font-medium">#</span>
        <input
          type="text"
          value={hex}
          onChange={e => handleHexInput(e.target.value)}
          onClick={e => e.stopPropagation()}
          className="flex-1 bg-transparent text-[12px] font-bold text-text font-heading
                     outline-none uppercase tracking-wider w-0 min-w-0"
          spellCheck={false}
        />
        {/* hidden native picker */}
        <input
          ref={pickerRef}
          type="color"
          value={value}
          onChange={e => onChange(e.target.value)}
          className="w-0 h-0 opacity-0 absolute"
        />
        <button
          onClick={e => { e.stopPropagation(); pickerRef.current?.click(); }}
          className="text-text-3 hover:text-text-2 transition-colors ml-auto flex-shrink-0"
        >
          <EyeIcon />
        </button>
      </div>
    </div>
  );
}

function DiceButton({ onClick }: { onClick: () => void }) {
  const [spinning, setSpinning] = useState(false);
  const handleClick = () => {
    setSpinning(true);
    onClick();
    setTimeout(() => setSpinning(false), 400);
  };
  return (
    <button
      onClick={handleClick}
      title="Randomize"
      className="absolute bottom-7 left-1/2 -translate-x-1/2
                 w-[52px] h-[52px] rounded-full
                 bg-surface border border-border2 text-text text-[22px]
                 flex items-center justify-center
                 shadow-xl transition-all duration-200
                 hover:border-accent hover:shadow-accent/20 hover:scale-105
                 active:scale-95"
    >
      <span
        className={cn("inline-block transition-transform", spinning && "animate-spin")}
        style={spinning ? { animationDuration: "0.4s", animationTimingFunction: "cubic-bezier(0.36,0.07,0.19,0.97)" } : {}}
      >
        ⚄
      </span>
    </button>
  );
}

// ── icons ──────────────────────────────────────────────────────
function DownloadIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
      <path d="M6.5 2v7M3.5 6.5l3 3 3-3M2 10.5h9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
function CopyIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <rect x="4" y="4" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.2"/>
      <path d="M8 4V2.5A1.5 1.5 0 006.5 1H2.5A1.5 1.5 0 001 2.5v4A1.5 1.5 0 002.5 8H4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
    </svg>
  );
}
function CheckIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
function EyeIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M1 7s2.5-5 6-5 6 5 6 5-2.5 5-6 5-6-5-6-5z" stroke="currentColor" strokeWidth="1.2"/>
      <circle cx="7" cy="7" r="2" stroke="currentColor" strokeWidth="1.2"/>
    </svg>
  );
}
