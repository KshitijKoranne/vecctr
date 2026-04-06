"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { GENERATORS } from "@/lib/generatorMeta";
import { DEFAULT_PARAMS, renderGenerator } from "@/lib/generators";

const THUMB_SEEDS = [10777, 21333, 31999, 42555, 53111, 63777, 74333, 84999, 95555, 10611];
const HERO_SEEDS  = [28471, 59302, 13847, 73621, 42190, 88453, 31075, 64829, 17634, 50291];

function cn(...c: (string | false | undefined | null)[]) { return c.filter(Boolean).join(" "); }

export function LandingPage() {
  const [heroSvg, setHeroSvg]           = useState("");
  const [heroGenIdx, setHeroGenIdx]     = useState(0);
  const [heroFade, setHeroFade]         = useState(true);
  const [scrolled, setScrolled]         = useState(false);
  const heroTimerRef                    = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  // hero cycling
  useEffect(() => {
    const W = typeof window !== "undefined" ? window.innerWidth : 1440;
    const H = typeof window !== "undefined" ? window.innerHeight : 900;
    const gen = GENERATORS[heroGenIdx];
    setHeroSvg(renderGenerator(gen.slug, W, H, HERO_SEEDS[heroGenIdx], DEFAULT_PARAMS[gen.slug], "bottom"));
  }, [heroGenIdx]);

  useEffect(() => {
    heroTimerRef.current = setTimeout(() => {
      setHeroFade(false);
      setTimeout(() => {
        setHeroGenIdx(i => (i + 1) % GENERATORS.length);
        setHeroFade(true);
      }, 600);
    }, 5000);
    return () => clearTimeout(heroTimerRef.current);
  }, [heroGenIdx]);

  // nav scroll
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <div className="bg-bg text-text">

      {/* ── NAV ── */}
      <nav className={cn(
        "fixed top-0 left-0 right-0 z-50 h-[64px] flex items-center justify-between px-12",
        "transition-all duration-300",
        scrolled ? "bg-bg/90 backdrop-blur-xl border-b border-border" : ""
      )}>
        <Link href="/" className="font-heading font-extrabold text-[20px] tracking-tight">
          vecctr<span className="text-accent">.</span>
        </Link>
        <div className="flex items-center gap-8">
          <Link href="/generators" className="text-[14px] text-text-2 hover:text-text transition-colors">Generators</Link>
          <Link href="#how"        className="text-[14px] text-text-2 hover:text-text transition-colors">How it works</Link>
          <Link href="/pricing"    className="text-[14px] text-text-2 hover:text-text transition-colors">Pricing</Link>
        </div>
        <div className="flex items-center gap-3">
          <Link href="#"
            className="text-[13px] font-medium text-text-2 border border-border
                       hover:border-border2 hover:text-text px-4 py-2 rounded-sm transition-all">
            Sign in
          </Link>
          <Link href="/generators"
            className="text-[13px] font-semibold text-bg bg-accent hover:bg-accent-h
                       px-4 py-2 rounded-sm transition-all hover:-translate-y-[1px]">
            Start free →
          </Link>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">

        {/* live background */}
        <div
          className="absolute inset-0 transition-opacity duration-[600ms]"
          style={{ opacity: heroFade ? 1 : 0 }}
          dangerouslySetInnerHTML={{ __html: heroSvg }}
        />

        {/* gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b
          from-bg/40 via-bg/20 to-bg pointer-events-none" />

        {/* content */}
        <div className="relative z-10 text-center px-6 max-w-[820px] mx-auto
                        animate-[fadeUp_1s_cubic-bezier(0.16,1,0.3,1)_both]">
          <div className="inline-flex items-center gap-2 bg-accent/10 border border-accent/20
                          text-accent text-[11px] font-semibold tracking-[1px] uppercase
                          px-4 py-2 rounded-full mb-10">
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
            10 generators · free to use
          </div>

          <h1 className="font-heading font-extrabold leading-none tracking-[-4px] mb-6
                         text-[clamp(56px,9vw,100px)] text-text">
            Beautiful<br />
            backgrounds,<br />
            <span className="text-accent">instantly.</span>
          </h1>

          <p className="text-[clamp(16px,2vw,20px)] text-text-2 font-light leading-relaxed
                        max-w-[500px] mx-auto mb-12">
            Generate stunning SVG design assets for websites, apps,
            presentations, and social media. No design skills required.
          </p>

          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Link href="/generators"
              className="inline-flex items-center gap-2.5 bg-accent text-bg font-bold font-heading
                         text-[16px] px-8 py-4 rounded-[10px] hover:bg-accent-h transition-all
                         hover:-translate-y-[2px] hover:shadow-[0_12px_32px_rgba(245,166,35,0.28)]">
              Start generating free
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M2 7h10M7 2l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
            <Link href="#how"
              className="inline-flex items-center gap-2 text-[15px] text-text font-medium
                         bg-white/6 border border-white/10 backdrop-blur-sm
                         px-8 py-4 rounded-[10px] hover:bg-white/10 transition-all">
              See how it works
            </Link>
          </div>

          <p className="mt-6 text-[12px] text-text-3">
            Free forever · No credit card · <span className="text-text-2">Export PNG instantly</span>
          </p>
        </div>

        {/* scroll indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col
                        items-center gap-2 text-text-3 text-[10px] tracking-[2px] uppercase">
          <div className="w-px h-10 bg-gradient-to-b from-accent/60 to-transparent
                          animate-[pulse_2s_infinite]" />
          scroll
        </div>
      </section>

      {/* ── GENERATORS PREVIEW ── */}
      <section className="py-28 px-12 max-w-[1300px] mx-auto">
        <div className="flex items-end justify-between mb-16">
          <div>
            <p className="text-[11px] font-semibold tracking-[2.5px] uppercase text-accent mb-3">Generators</p>
            <h2 className="font-heading font-extrabold text-[clamp(32px,4vw,52px)]
                           tracking-[-2.5px] leading-none text-text mb-4">
              Shape the infinite.
            </h2>
            <p className="text-[17px] text-text-2 font-light max-w-md leading-relaxed">
              Ten distinct generators, each producing a visual style unlike anything else.
            </p>
          </div>
          <SurpriseMeButton />
        </div>

        <div className="grid grid-cols-5 gap-3.5">
          {GENERATORS.map((gen, i) => {
            const thumb = renderGenerator(gen.slug, 360, 160, THUMB_SEEDS[i], DEFAULT_PARAMS[gen.slug], "bottom");
            return (
              <Link
                key={gen.slug}
                href={`/generator/${gen.slug}`}
                className={cn(
                  "group block bg-surface border border-border rounded-lg overflow-hidden",
                  "transition-all duration-300 hover:-translate-y-1.5",
                  "hover:border-accent/30 hover:shadow-[0_16px_48px_rgba(0,0,0,0.5)]"
                )}
              >
                <div className="relative overflow-hidden h-[140px]">
                  <div
                    className="w-full h-full transition-transform duration-500 group-hover:scale-[1.05]"
                    dangerouslySetInnerHTML={{ __html: thumb }}
                  />
                  {!gen.free && (
                    <>
                      <div className="absolute inset-0 bg-bg/25" />
                      <span className="absolute top-2 right-2 text-[9px] font-bold tracking-wider
                                       text-accent bg-bg/80 border border-border backdrop-blur-sm
                                       px-1.5 py-0.5 rounded">PRO</span>
                    </>
                  )}
                </div>
                <div className="px-3.5 py-3 border-t border-border">
                  <p className="font-heading font-bold text-[13px] text-text tracking-tight mb-0.5">
                    {gen.name}
                  </p>
                  <p className="text-[11px] text-text-2 font-light leading-snug line-clamp-1">
                    {gen.desc}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="text-center mt-8">
          <Link href="/generators"
            className="inline-flex items-center gap-2 text-[13px] font-medium text-text-2
                       hover:text-text transition-colors">
            View all generators
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M2 6h8M6 2l4 4-4 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how" className="py-28 bg-surface border-y border-border">
        <div className="max-w-[1100px] mx-auto px-12 grid grid-cols-2 gap-20 items-center">
          <div>
            <p className="text-[11px] font-semibold tracking-[2.5px] uppercase text-accent mb-3">How it works</p>
            <h2 className="font-heading font-extrabold text-[clamp(32px,4vw,48px)]
                           tracking-[-2px] leading-none text-text mb-12">
              Three steps<br />to stunning.
            </h2>
            <div className="space-y-8">
              {[
                { n:"1", title:"Pick a generator", body:"Choose from 10 carefully crafted generators, each producing a distinct visual style — from soft gradients to topographic maps." },
                { n:"2", title:"Tweak & randomize", body:"Adjust colors, complexity, and density. Hit the dice button to discover something unexpected. Every click is a new visual." },
                { n:"3", title:"Export & use anywhere", body:"Download PNG instantly, free. Upgrade for clean SVG, CSS snippets, and copy-to-clipboard." },
              ].map(s => (
                <div key={s.n} className="flex gap-5">
                  <div className="flex-shrink-0 w-10 h-10 rounded-[10px] bg-accent/10 border border-accent/20
                                  flex items-center justify-center font-heading font-extrabold text-[14px] text-accent">
                    {s.n}
                  </div>
                  <div>
                    <h4 className="font-heading font-bold text-[16px] text-text tracking-tight mb-1.5">{s.title}</h4>
                    <p className="text-[14px] text-text-2 font-light leading-relaxed">{s.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* app mockup */}
          <AppMockup />
        </div>
      </section>

      {/* ── USE CASES ── */}
      <section className="py-28 px-12">
        <div className="max-w-[1100px] mx-auto">
          <div className="grid grid-cols-2 gap-16 items-end mb-14">
            <div>
              <p className="text-[11px] font-semibold tracking-[2.5px] uppercase text-accent mb-3">Use cases</p>
              <h2 className="font-heading font-extrabold text-[clamp(32px,4vw,48px)]
                             tracking-[-2px] leading-none text-text">
                Built for every canvas.
              </h2>
            </div>
            <p className="text-[17px] text-text-2 font-light leading-relaxed">
              Whether you're shipping a product, publishing a post, or pitching investors — Vecctr has a background for that.
            </p>
          </div>
          <div className="grid grid-cols-4 gap-4">
            {[
              { icon:"🌐", title:"Website Backgrounds", desc:"Hero sections, login screens, and product showcases that actually stand out." },
              { icon:"📱", title:"Social Media",        desc:"LinkedIn headers, Instagram posts, Twitter banners — sized and ready." },
              { icon:"📊", title:"Presentations",       desc:"Slide decks that don't look like everyone else's. Brand-matched, every time." },
              { icon:"✍️", title:"Blog Covers",         desc:"Unique featured images for every post. Never stare at a blank cover again." },
            ].map(uc => (
              <div key={uc.title}
                className="bg-surface border border-border rounded-lg p-6
                           hover:bg-surface2 transition-colors duration-200">
                <span className="text-[28px] block mb-4">{uc.icon}</span>
                <h3 className="font-heading font-bold text-[14px] text-text tracking-tight mb-2">{uc.title}</h3>
                <p className="text-[12px] text-text-2 font-light leading-relaxed">{uc.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING TEASER ── */}
      <section className="py-20 bg-surface border-y border-border">
        <div className="max-w-[800px] mx-auto px-12">
          <div className="text-center mb-12">
            <p className="text-[11px] font-semibold tracking-[2.5px] uppercase text-accent mb-3">Pricing</p>
            <h2 className="font-heading font-extrabold text-[clamp(32px,4vw,48px)]
                           tracking-[-2px] leading-none text-text mb-3">
              Simple. No surprises.
            </h2>
            <p className="text-[17px] text-text-2 font-light">Start free. Upgrade when you need more.</p>
          </div>
          <div className="grid grid-cols-2 gap-5">

            {/* Free */}
            <div className="bg-bg border border-border rounded-xl p-8">
              <p className="text-[11px] font-bold tracking-[1.5px] uppercase text-text-2 mb-5">Free</p>
              <div className="font-heading font-extrabold text-[48px] tracking-[-3px] text-text leading-none mb-1">₹0</div>
              <p className="text-[12px] text-text-3 mb-6">forever, no card required</p>
              <div className="h-px bg-border mb-6" />
              <ul className="space-y-2.5 mb-8">
                {["6 generators","PNG export (clean)","Preset canvas sizes","Unlimited generations"].map(f => (
                  <li key={f} className="flex items-center gap-2.5 text-[13px] text-text-2">
                    <span className="w-[18px] h-[18px] rounded-full bg-green/15 flex items-center justify-center text-[10px] text-green flex-shrink-0">✓</span>
                    {f}
                  </li>
                ))}
                {["SVG export","CSS & code export","4 premium generators","Saved palettes"].map(f => (
                  <li key={f} className="flex items-center gap-2.5 text-[13px] text-text-3">
                    <span className="w-[18px] h-[18px] rounded-full bg-surface2 flex items-center justify-center text-[10px] text-text-3 flex-shrink-0">—</span>
                    {f}
                  </li>
                ))}
              </ul>
              <Link href="/generators"
                className="block w-full text-center py-3 rounded-sm bg-surface2 border border-border
                           text-text text-[14px] font-semibold hover:bg-surface3 transition-all">
                Start for free
              </Link>
            </div>

            {/* Pro */}
            <div className="bg-bg border border-accent/30 rounded-xl p-8 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent pointer-events-none" />
              <div className="relative">
                <p className="text-[11px] font-bold tracking-[1.5px] uppercase text-accent mb-5">Pro</p>
                <div className="font-heading font-extrabold text-[48px] tracking-[-3px] text-text leading-none mb-1">
                  <span className="text-[22px] font-semibold align-super mr-0.5">₹</span>TBD
                </div>
                <p className="text-[12px] text-text-3 mb-6">per month · billed monthly</p>
                <div className="h-px bg-border mb-6" />
                <ul className="space-y-2.5 mb-8">
                  {["All 10 generators","PNG + SVG export","Custom canvas sizes","Unlimited generations","CSS & code export","React/Tailwind snippets","Saved color palettes","Generation history"].map(f => (
                    <li key={f} className="flex items-center gap-2.5 text-[13px] text-text-2">
                      <span className="w-[18px] h-[18px] rounded-full bg-green/15 flex items-center justify-center text-[10px] text-green flex-shrink-0">✓</span>
                      {f}
                    </li>
                  ))}
                </ul>
                <Link href="/pricing"
                  className="block w-full text-center py-3 rounded-sm bg-accent text-bg
                             text-[14px] font-bold font-heading hover:bg-accent-h transition-all
                             hover:-translate-y-[1px]">
                  Get Pro →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="py-32 text-center relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                          w-[500px] h-[280px] bg-accent/8 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-[540px] mx-auto px-6">
          <h2 className="font-heading font-extrabold text-[clamp(36px,5vw,62px)]
                         tracking-[-3px] leading-none text-text mb-5">
            Your next background<br />is one click away.
          </h2>
          <p className="text-[17px] text-text-2 font-light mb-10">
            No design skills. No Figma. Just pick, tweak, and export.
          </p>
          <Link href="/generators"
            className="inline-flex items-center gap-2.5 bg-accent text-bg font-bold font-heading
                       text-[16px] px-8 py-4 rounded-[10px] hover:bg-accent-h transition-all
                       hover:-translate-y-[2px] hover:shadow-[0_12px_32px_rgba(245,166,35,0.28)]">
            Open a generator
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M2 7h10M7 2l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
          <p className="mt-4 text-[12px] text-text-3">Free forever · No account needed to start</p>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-border px-12 py-8 flex items-center justify-between">
        <Link href="/" className="font-heading font-extrabold text-[16px] tracking-tight text-text">
          vecctr<span className="text-accent">.</span>
        </Link>
        <div className="flex gap-7">
          {[["Generators","/generators"],["Pricing","/pricing"],["Terms","#"],["Privacy","#"]].map(([l,h]) => (
            <Link key={l} href={h} className="text-[12px] text-text-3 hover:text-text-2 transition-colors">{l}</Link>
          ))}
        </div>
        <p className="text-[12px] text-text-3">© 2025 KJR Labs · vecctr.in</p>
      </footer>

    </div>
  );
}

// ─────────────────────────────────────────────
// SURPRISE ME BUTTON
// ─────────────────────────────────────────────
function SurpriseMeButton() {
  const router = useRouter();
  const [spinning, setSpinning] = useState(false);
  const go = () => {
    setSpinning(true);
    const free = GENERATORS.filter(g => g.free);
    const pick = free[Math.floor(Math.random() * free.length)];
    setTimeout(() => { router.push(`/generator/${pick.slug}`); }, 300);
  };
  return (
    <button onClick={go}
      className="flex items-center gap-2.5 text-[13px] font-medium text-text-2
                 bg-surface2 border border-border hover:border-border2 hover:text-text
                 px-4 py-2.5 rounded-sm transition-all self-end">
      <span className={cn("text-[15px]", spinning && "animate-spin")}
        style={spinning ? { animationDuration:"0.3s" } : {}}>🎲</span>
      Surprise me
    </button>
  );
}

// ─────────────────────────────────────────────
// APP MOCKUP
// ─────────────────────────────────────────────
function AppMockup() {
  const [idx, setIdx] = useState(0);
  const svgPreview = renderGenerator(
    GENERATORS[idx % GENERATORS.length].slug, 340, 180,
    HERO_SEEDS[idx % GENERATORS.length],
    DEFAULT_PARAMS[GENERATORS[idx % GENERATORS.length].slug],
    "bottom"
  );

  useEffect(() => {
    const t = setInterval(() => setIdx(i => (i + 1) % GENERATORS.length), 3500);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="bg-surface2 border border-border rounded-xl overflow-hidden aspect-[4/3]
                    flex items-center justify-center">
      <div className="w-[90%] bg-bg rounded-xl border border-border overflow-hidden shadow-2xl">
        {/* title bar */}
        <div className="h-8 bg-surface flex items-center px-3 gap-1.5 border-b border-border">
          <div className="w-2.5 h-2.5 rounded-full bg-[#FF5F57]" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#28C840]" />
        </div>
        {/* editor */}
        <div className="flex h-[180px]">
          {/* canvas preview */}
          <div className="flex-1 overflow-hidden transition-opacity duration-500"
            dangerouslySetInnerHTML={{ __html: svgPreview }} />
          {/* sidebar mockup */}
          <div className="w-[88px] border-l border-border p-2.5 flex flex-col gap-1.5">
            {[80,45,90,55,70,40,65,85].map((w,i) => (
              <div key={i}
                className={cn("h-1.5 rounded-full",
                  i % 3 === 1 ? "bg-accent/30" : "bg-border")}
                style={{ width:`${w}%` }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
