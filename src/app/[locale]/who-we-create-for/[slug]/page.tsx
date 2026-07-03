import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getLocalizedString, type LocaleCode } from "@/lib/i18n/locale";
import IndustrySubPage from "@/components/sections/who-we-create-for/IndustrySubPage";
import CaseStudyPage from "@/components/sections/who-we-create-for/CaseStudyPage";

const API_BASE = "https://kalptree.xyz/api/cms";
const industrySlugs = ["tourism-travel", "education-e-learning", "health-pharma-beauty", "local-boutique-brands"] as const;
const caseStudySlugs = ["myrent", "cdc", "castania", "poliderma", "expo-life-far-beyond", "loreal", "navada", "minglanje-v-klanjcu", "ids"] as const;
const allSlugs = [...industrySlugs, ...caseStudySlugs];

type Slug = typeof allSlugs[number];

async function fetchPageData(slug: string) {
  const res = await fetch(`${API_BASE}/pages?slug=who-we-create-for/${slug}`, {
    headers: {
      accept: "application/json",
      "x-tenant-db": "kp_hrescic",
    },
    next: { revalidate: 60 },
  });
  if (!res.ok) return null;
  const body = await res.json();
  const page = body?.data ?? (Array.isArray(body) ? body[0] : body);
  const content = Array.isArray(page?.content) ? page.content[0] : null;
  return {
    props: (content?.props ?? null) as Record<string, unknown> | null,
    metaTitle: page?.metaTitle ?? null,
    metaDescription: page?.metaDescription ?? null,
  };
}

interface Props {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateStaticParams() {
  return allSlugs.flatMap((slug) => [
    { locale: "en", slug },
    { locale: "hr", slug },
  ]);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!allSlugs.includes(slug as Slug)) return {};
  const data = await fetchPageData(slug);
  if (!data?.metaTitle) return {};
  return {
    title: getLocalizedString(data.metaTitle as { en: string; hr?: string }, locale as LocaleCode),
    description: data.metaDescription ? getLocalizedString(data.metaDescription as { en: string; hr?: string }, locale as LocaleCode) : "",
  };
}

function isLocalizedString(value: unknown): value is { en: string; hr?: string } {
  return typeof value === "object" && value !== null && "en" in value && typeof (value as Record<string, unknown>).en === "string";
}

function resolveLocaleStrings(obj: Record<string, unknown>, locale: LocaleCode): Record<string, unknown> {
  if (typeof obj !== "object" || obj === null) return obj;
  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(obj)) {
    if (isLocalizedString(value)) {
      result[key] = getLocalizedString(value, locale);
    } else if (Array.isArray(value)) {
      result[key] = value.map((item) => {
        if (isLocalizedString(item)) return getLocalizedString(item, locale);
        if (typeof item === "object" && item !== null) return resolveLocaleStrings(item as Record<string, unknown>, locale);
        return item;
      });
    } else if (typeof value === "object" && value !== null) {
      result[key] = resolveLocaleStrings(value as Record<string, unknown>, locale);
    } else {
      result[key] = value;
    }
  }
  return result;
}

export default async function WhoWeCreateForSlugPage({ params }: Props) {
  const { locale, slug } = await params;
  if (!allSlugs.includes(slug as Slug)) notFound();
  const data = await fetchPageData(slug);
  if (!data?.props) notFound();
  const localeCode = locale as LocaleCode;
  const resolvedData = resolveLocaleStrings(data.props, localeCode);

  const isIndustry = (industrySlugs as readonly string[]).includes(slug);
  const Component = isIndustry ? IndustrySubPage : CaseStudyPage;

  return (
    <main>
      <Component data={resolvedData as never} />
    </main>
  );
}
