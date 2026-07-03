import { getLocalizedString, type LocaleCode } from "@/lib/i18n/locale";

import WhatWeDoSubPageRenderer from "@/components/pages/whatwedo/WhatWeDoSubPageRenderer";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageBlock } from "@/lib/store/pages/pageType";

const API_BASE = "https://kalptree.xyz/api/cms";
const validSlugs = ["branding-strategy", "web-digital", "content-marketing", "ai-video-production"] as const;

async function fetchSubPageContent(slug: string) {
  const res = await fetch(`${API_BASE}/pages?slug=what-we-do/${slug}`, {
    headers: {
      accept: "application/json",
      "x-tenant-db": "kp_hrescic",
    },
    next: { revalidate: 60 },
  });
  if (!res.ok) return null;
  const body = await res.json();
  const page = body?.data ?? (Array.isArray(body) ? body[0] : body);
  return {
    sections: (Array.isArray(page?.content) ? page.content : []) as PageBlock[],
    metaTitle: page?.metaTitle ?? null,
    metaDescription: page?.metaDescription ?? null,
  };
}

interface Props {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateStaticParams() {
  return validSlugs.flatMap((slug) => [
    { locale: "en", slug },
    { locale: "hr", slug },
  ]);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!validSlugs.includes(slug as typeof validSlugs[number])) return {};
  const data = await fetchSubPageContent(slug);
  if (!data?.metaTitle) return {};
  return {
    title: getLocalizedString(data.metaTitle, locale as LocaleCode),
    description: data.metaDescription ? getLocalizedString(data.metaDescription, locale as LocaleCode) : "",
  };
}

export default async function SubPage({ params }: Props) {
  const { locale, slug } = await params;
  if (!validSlugs.includes(slug as typeof validSlugs[number])) notFound();
  const data = await fetchSubPageContent(slug);
  if (!data) notFound();
  return (
    <main>
      <WhatWeDoSubPageRenderer sections={data.sections} locale={locale as LocaleCode} slug={slug} />
    </main>
  );
}
