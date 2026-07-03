"use client";

import type { LocaleCode } from "@/lib/i18n/locale";
import { LocaleProvider } from "@/lib/i18n/LocaleContext";

import { useAppSelector } from "@/lib/store/hooks";
import HeroSection from "@/components/pages/homepages/HeroSection";
import LogoCloud from "@/components/pages/homepages/LogoCloud";
import ServiceCards from "@/components/pages/homepages/ServiceCards";
import IndustryCards from "@/components/pages/homepages/IndustryCards";
import StatsBar from "@/components/pages/homepages/StatsBar";
import PortfolioGrid from "@/components/pages/homepages/PortfolioGrid";
import CtaCentered from "@/components/pages/homepages/CtaCentered";
import HeroSplit from "./HeroSplit";
import ServiceTable from "./ServiceTable";
import ProcessSteps from "./ProcessSteps";
import PricingTable from "./PricingTable";
import ComparisonTable from "./ComparisonTable";
import DynamicForm from "./DynamicForm";
import ContactInfo from "./ContactInfo";
import VideoEmbed from "@/components/pages/homepages/VideoEmbed";
import IndustryDetailCards from "./IndustryDetailCards";
import HeroCentered from "./HeroCentered";
import LetsTalkForm from "./LetsTalkForm";
import WhatToExpect from "./WhatToExpect";
import HeroSubPage from "./HeroSubPage";
import FeatureGridSection from "./FeatureGridSection";
import PracticalFlowSection from "./PracticalFlowSection";
import CtaSubPage from "./CtaSubPage";
import HeroWwcf from "./HeroWwcf";
import { PageBlock } from "@/lib/store/pages/pageType";

const sectionRegistry: Record<string, React.FC<{ block: PageBlock }>> = {
  hero: HeroSection,
  "hero-split": HeroSplit,
  "hero-centered": HeroCentered,
  "logo-cloud": LogoCloud,
  "service-cards": ServiceCards,
  "industry-cards": IndustryCards,
  "stats-bar": StatsBar,
  "portfolio-grid": PortfolioGrid,
  "cta-centered": CtaCentered,
  "service-table": ServiceTable,
  "process-steps": ProcessSteps,
  "pricing-table": PricingTable,
  "comparison-table": ComparisonTable,
  form: DynamicForm,
  "contact-info": ContactInfo,
  "video-embed": VideoEmbed,
  "industry-detail-cards": IndustryDetailCards,
  "lets-talk-form": LetsTalkForm,
  "what-to-expect": WhatToExpect,
  "hero-sub-page": HeroSubPage,
  "feature-grid": FeatureGridSection,
  "practical-flow": PracticalFlowSection,
  "cta-sub-page": CtaSubPage,
  "hero-wwcf": HeroWwcf,
};

export default function PageRenderer({ sections, locale }: { sections: PageBlock[]; locale: LocaleCode }) {
  const reduxSections = useAppSelector((state) => state.pages.currentPages?.content) as PageBlock[] | undefined;
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
