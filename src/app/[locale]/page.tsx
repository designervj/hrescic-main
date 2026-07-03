import { getLocalizedString, type LocaleCode } from "@/lib/i18n/locale";

import HomePageRenderer from "@/components/pages/homepages/HomePageRenderer";
import type { Metadata } from "next";
import { PageBlock } from "@/lib/store/pages/pageType";

const API_BASE = "https://kalptree.xyz/api/cms";

async function fetchPageContent(slug: string) {
  const res = await fetch(`${API_BASE}/pages?slug=${slug}`, {
    headers: {
      accept: "application/json",
      "x-tenant-db": "kp_hrescic",
    },
    next: { revalidate: 60 },
  });
  if (!res.ok) throw new Error(`Failed to fetch page: ${res.status}`);
  const body = await res.json();
  const page = body?.data ?? (Array.isArray(body) ? body[0] : body);

  return {
    sections: (Array.isArray(page?.content) ? page.content : []) as PageBlock[],
    metaTitle: page?.metaTitle ?? null,
    metaDescription: page?.metaDescription ?? null,
  };
}

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const { metaTitle, metaDescription } = await fetchPageContent("home");
  return {
    title: metaTitle ? getLocalizedString(metaTitle, locale as LocaleCode) : "",
    description: metaDescription ? getLocalizedString(metaDescription, locale as LocaleCode) : "",
  };
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  const { sections } = await fetchPageContent("home");
  return (
    <main>
      <HomePageRenderer sections={sections} locale={locale as LocaleCode} />
    </main>
  );
}
