import Link from "next/link";

export const metadata = { title: "Pricing — Vecctr" };

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-bg">
      <nav className="h-[56px] flex items-center justify-between px-10 bg-surface border-b border-border">
        <Link href="/" className="font-heading font-extrabold text-[18px] tracking-tight text-text">
          vecctr<span className="text-accent">.</span>
        </Link>
        <Link href="/generators" className="text-[13px] text-text-2 hover:text-text transition-colors">
          ← Back to generators
        </Link>
      </nav>
      <div className="max-w-[640px] mx-auto px-10 py-24 text-center">
        <p className="text-[11px] font-semibold tracking-[2.5px] uppercase text-accent mb-4">Pricing</p>
        <h1 className="font-heading font-extrabold text-[52px] tracking-[-3px] text-text mb-4">
          Simple. No surprises.
        </h1>
        <p className="text-[17px] text-text-2 font-light mb-16">
          Pricing coming soon. Everything is free while we&apos;re in beta.
        </p>
        <Link href="/generators"
          className="inline-flex items-center gap-2 bg-accent text-bg font-bold font-heading
                     text-[15px] px-7 py-3.5 rounded-sm hover:bg-accent-h transition-all">
          Start generating free →
        </Link>
      </div>
    </div>
  );
}
