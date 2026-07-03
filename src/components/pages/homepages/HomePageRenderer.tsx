"use client";

import type { LocaleCode } from "@/lib/i18n/locale";
import { LocaleProvider } from "@/lib/i18n/LocaleContext";

import { useAppSelector } from "@/lib/store/hooks";
import HeroSection from "./HeroSection";
import LogoCloud from "./LogoCloud";
import ServiceCards from "./ServiceCards";
import IndustryCards from "./IndustryCards";
import StatsBar from "./StatsBar";
import PortfolioGrid from "./PortfolioGrid";
import CtaCentered from "./CtaCentered";
import { PageBlock } from "@/lib/store/pages/pageType";

function findBlock(sections: PageBlock[], type: string) {
  return sections.find((b) => b.type === type);
}

export default function HomePageRenderer({ sections, locale }: { sections: PageBlock[]; locale: LocaleCode }) {
  const currentPages = useAppSelector((state) => state.pages.currentPages);
  // Only use Redux currentPages content if its slug matches this page
  const reduxSections =
    currentPages?.slug === "home"
      ? (currentPages.content as PageBlock[] | undefined)
      : undefined;
  const s = reduxSections ?? sections;
  return (
    <LocaleProvider locale={locale}>
      {findBlock(s, "hero") && <HeroSection block={findBlock(s, "hero")!} />}
      {findBlock(s, "logo-cloud") && <LogoCloud block={findBlock(s, "logo-cloud")!} />}
      {findBlock(s, "service-cards") && <ServiceCards block={findBlock(s, "service-cards")!} />}
      {findBlock(s, "industry-cards") && <IndustryCards block={findBlock(s, "industry-cards")!} />}
      {findBlock(s, "stats-bar") && <StatsBar block={findBlock(s, "stats-bar")!} />}
      {findBlock(s, "portfolio-grid") && <PortfolioGrid block={findBlock(s, "portfolio-grid")!} />}
      {findBlock(s, "cta-centered") && <CtaCentered block={findBlock(s, "cta-centered")!} />}
    </LocaleProvider>
  );
}
