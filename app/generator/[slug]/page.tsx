import { GENERATORS } from "@/lib/generatorMeta";
import { GeneratorEditor } from "@/components/generator/GeneratorEditor";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return GENERATORS.map((g) => ({ slug: g.slug }));
}

export default async function GeneratorPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const gen = GENERATORS.find((g) => g.slug === slug);
  if (!gen) notFound();
  return <GeneratorEditor initialSlug={slug} />;
}
