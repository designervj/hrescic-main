"use client";

import type { LocaleCode } from "@/lib/i18n/locale";
import { LocaleProvider } from "@/lib/i18n/LocaleContext";
import type { PageBlock } from "@/lib/store/pages/pageType";
import { useAppSelector } from "@/lib/store/hooks";
import HeroSplit from "@/components/sections/HeroSplit";
import LogoCloud from "@/components/pages/homepages/LogoCloud";
import ServiceTable from "@/components/sections/ServiceTable";
import ProcessSteps from "@/components/sections/ProcessSteps";
import PricingTable from "@/components/sections/PricingTable";
import ComparisonTable from "@/components/sections/ComparisonTable";
import CtaSubPage from "@/components/sections/CtaSubPage";

function findBlock(sections: PageBlock[], type: string) {
  return sections.find((b) => b.type === type);
}

export default function WhatWeDoPageRenderer({ sections, locale }: { sections: PageBlock[]; locale: LocaleCode }) {
  const currentPages = useAppSelector((state) => state.pages.currentPages);

  // Only use Redux currentPages content if its slug matches this page
  const reduxSections =
    currentPages?.slug === "what-we-do"
      ? (currentPages.content as PageBlock[] | undefined)
      : undefined;

  const s = reduxSections ?? sections;

  return (
    <LocaleProvider locale={locale}>
      {findBlock(s, "hero-split") && <HeroSplit block={findBlock(s, "hero-split")!} />}
      {findBlock(s, "logo-cloud") && <LogoCloud block={findBlock(s, "logo-cloud")!} />}
      {findBlock(s, "service-table") && <ServiceTable block={findBlock(s, "service-table")!} />}
      {findBlock(s, "process-steps") && <ProcessSteps block={findBlock(s, "process-steps")!} />}
      {findBlock(s, "pricing-table") && <PricingTable block={findBlock(s, "pricing-table")!} />}
      {findBlock(s, "comparison-table") && <ComparisonTable block={findBlock(s, "comparison-table")!} />}
      {findBlock(s, "cta-sub-page") && <CtaSubPage block={findBlock(s, "cta-sub-page")!} />}
    </LocaleProvider>
  );
}
