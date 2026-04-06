"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { GENERATORS } from "@/lib/generatorMeta";
import { DEFAULT_PARAMS, renderGenerator } from "@/lib/generators";

const THUMB_SEEDS = [10777, 21333, 31999, 42555, 53111, 63777, 74333, 84999, 95555, 10611];

function cn(...c: (string | false | undefined | null)[]) { return c.filter(Boolean).join(" "); }

export function GeneratorsGallery() {
  const router = useRouter();
  const [filter, setFilter] = useState<"all" | "free" | "pro">("all");

  const visible = GENERATORS.filter(g =>
    filter === "all" ? true : filter === "free" ? g.free : !g.free
  );

  const surprise = () => {
    const free = GENERATORS.filter(g => g.free);
    const pick = free[Math.floor(Math.random() * free.length)];
    router.push(`/generator/${pick.slug}`);
  };

  return (
    <div className="min-h-screen bg-bg">

      {/* nav */}
      <nav className="h-[56px] flex items-center justify-between px-10
                      bg-surface border-b border-border sticky top-0 z-10">
        <Link href="/" className="font-heading font-extrabold text-[18px] text-text tracking-tight">
          vecctr<span className="text-accent">.</span>
        </Link>
        <div className="flex items-center gap-3">
          <button onClick={surprise}
            className="flex items-center gap-2 text-[13px] font-medium text-text-2
                       bg-surface2 border border-border hover:border-border2 hover:text-text
                       px-3.5 py-2 rounded-sm transition-all">
            <span>🎲</span> Surprise me
          </button>
          <Link href="/pricing"
            className="text-[13px] font-medium text-text-2 hover:text-text transition-colors px-3">
            Pricing
          </Link>
          <Link href="#"
            className="text-[13px] font-semibold text-bg bg-accent hover:bg-accent-h
                       px-4 py-2 rounded-sm transition-all">
            Sign up free
          </Link>
        </div>
      </nav>

      <div className="max-w-[1200px] mx-auto px-10 py-16">

        {/* header */}
        <div className="mb-12">
          <p className="text-[11px] font-semibold tracking-[2px] uppercase text-accent mb-3">
            Generators
          </p>
          <h1 className="font-heading font-extrabold text-[48px] tracking-[-2.5px] leading-none text-text mb-4">
            Pick your canvas.
          </h1>
          <p className="text-[17px] text-text-2 font-light max-w-md leading-relaxed">
            Ten distinct generators. Each one built to make something unforgettable.
          </p>
        </div>

        {/* filter tabs */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex bg-surface border border-border rounded-sm p-[3px] gap-[2px]">
            {(["all","free","pro"] as const).map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={cn(
                  "px-4 py-1.5 rounded-[5px] text-[12px] font-semibold capitalize transition-all",
                  filter === f
                    ? "bg-surface3 text-text shadow-sm"
                    : "text-text-2 hover:text-text"
                )}
              >
                {f === "all" ? `All (${GENERATORS.length})` :
                 f === "free" ? `Free (${GENERATORS.filter(g=>g.free).length})` :
                 `Pro (${GENERATORS.filter(g=>!g.free).length})`}
              </button>
            ))}
          </div>
        </div>

        {/* grid */}
        <div className="grid grid-cols-4 gap-4">
          {visible.map((gen, i) => {
            const idx = GENERATORS.findIndex(g => g.slug === gen.slug);
            const thumb = renderGenerator(gen.slug, 400, 180, THUMB_SEEDS[idx], DEFAULT_PARAMS[gen.slug], "bottom");
            return (
              <Link
                key={gen.slug}
                href={`/generator/${gen.slug}`}
                className={cn(
                  "group block bg-surface border border-border rounded-lg overflow-hidden",
                  "transition-all duration-300 hover:-translate-y-1",
                  "hover:border-accent/30 hover:shadow-2xl hover:shadow-black/40"
                )}
              >
                {/* preview */}
                <div className="relative h-[160px] overflow-hidden">
                  <div
                    className="w-full h-full group-hover:scale-[1.03] transition-transform duration-500"
                    dangerouslySetInnerHTML={{ __html: thumb }}
                  />
                  {!gen.free && (
                    <div className="absolute inset-0 bg-bg/30" />
                  )}
                  {!gen.free && (
                    <span className="absolute top-2.5 right-2.5 text-[10px] font-bold tracking-wider
                                     text-accent bg-bg/80 border border-border backdrop-blur-sm
                                     px-2 py-1 rounded">
                      PRO
                    </span>
                  )}
                </div>

                {/* info */}
                <div className="p-4 border-t border-border">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-heading font-bold text-[14px] text-text tracking-tight">
                      {gen.name}
                    </h3>
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none"
                      className="text-text-3 group-hover:text-accent transition-colors duration-200">
                      <path d="M3 7h8M7 3l4 4-4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <p className="text-[12px] text-text-2 font-light leading-relaxed">
                    {gen.desc}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>

        {/* pro upsell */}
        <div className="mt-16 bg-surface border border-border rounded-xl p-10 text-center
                        relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent pointer-events-none" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 h-px w-48
                          bg-gradient-to-r from-transparent via-accent to-transparent" />
          <div className="relative">
            <p className="text-[11px] font-semibold tracking-[2px] uppercase text-accent mb-3">Pro plan</p>
            <h2 className="font-heading font-extrabold text-[32px] tracking-[-1.5px] text-text mb-3">
              Unlock all 4 premium generators.
            </h2>
            <p className="text-text-2 text-[15px] font-light mb-6 max-w-sm mx-auto">
              Plus SVG export, CSS snippets, saved palettes, and generation history.
            </p>
            <Link href="/pricing"
              className="inline-flex items-center gap-2 bg-accent text-bg font-bold font-heading
                         text-[14px] px-6 py-3 rounded-sm hover:bg-accent-h transition-all
                         hover:-translate-y-[1px]">
              See pricing →
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
