"use client";

import type { LocaleCode } from "@/lib/i18n/locale";
import { LocaleProvider } from "@/lib/i18n/LocaleContext";

import { useAppSelector } from "@/lib/store/hooks";
import HeroSubPage from "@/components/sections/HeroSubPage";
import FeatureGridSection from "@/components/sections/FeatureGridSection";
import PracticalFlowSection from "@/components/sections/PracticalFlowSection";
import PricingTable from "@/components/sections/PricingTable";
import CtaSubPage from "@/components/sections/CtaSubPage";
import { PageBlock } from "@/lib/store/pages/pageType";

const sectionRegistry: Record<string, React.FC<{ block: PageBlock }>> = {
  "hero-sub-page": HeroSubPage,
  "feature-grid": FeatureGridSection,
  "practical-flow": PracticalFlowSection,
  "pricing-table": PricingTable,
  "cta-sub-page": CtaSubPage,
};

export default function WhatWeDoSubPageRenderer({ sections, locale, slug }: { sections: PageBlock[]; locale: LocaleCode; slug: string }) {
  const currentPages = useAppSelector((state) => state.pages.currentPages);
  // Match the stored slug which may have a /sub/ infix (e.g. "what-we-do/sub/branding-strategy")
  const normalizedStored = currentPages?.slug?.replace(/\/sub\//g, '/') ?? '';
  const expectedSlug = `what-we-do/${slug}`;
  const reduxSections =
    normalizedStored === expectedSlug
      ? (currentPages!.content as PageBlock[] | undefined)
      : undefined;
  const activeSections = reduxSections ?? sections;
  return (
    <LocaleProvider locale={locale}>
      {activeSections.map((block) => {
        const Section = sectionRegistry[block.type];
        if (!Section) {
          console.warn(`Unknown section type: ${block.type}`);
          return null;
        }
        return <Section key={block.id} block={block} />;
      })}
    </LocaleProvider>
  );
}
