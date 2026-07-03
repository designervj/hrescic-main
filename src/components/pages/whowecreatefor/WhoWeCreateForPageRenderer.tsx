"use client";

import type { LocaleCode } from "@/lib/i18n/locale";
import { LocaleProvider } from "@/lib/i18n/LocaleContext";

import { useAppSelector } from "@/lib/store/hooks";
import HeroWwcf from "@/components/sections/HeroWwcf";
import LogoCloud from "@/components/pages/homepages/LogoCloud";
import IndustryDetailCards from "@/components/sections/IndustryDetailCards";
import { PageBlock } from "@/lib/store/pages/pageType";

const sectionRegistry: Record<string, React.FC<{ block: PageBlock }>> = {
  "hero-wwcf": HeroWwcf,
  "logo-cloud": LogoCloud,
  "industry-detail-cards": IndustryDetailCards,
};

export default function WhoWeCreateForPageRenderer({ sections, locale }: { sections: PageBlock[]; locale: LocaleCode }) {
  const currentPages = useAppSelector((state) => state.pages.currentPages);
  // Only use Redux currentPages content if its slug matches this page
  const reduxSections =
    currentPages?.slug === "who-we-create-for"
      ? (currentPages.content as PageBlock[] | undefined)
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
