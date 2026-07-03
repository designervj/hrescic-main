"use client";

import type { LocaleCode } from "@/lib/i18n/locale";
import { LocaleProvider } from "@/lib/i18n/LocaleContext";
import type { PageBlock } from "@/lib/store/pages/pageType";
import { useAppSelector } from "@/lib/store/hooks";
import HeroCentered from "@/components/sections/HeroCentered";
import LetsTalkForm from "@/components/sections/LetsTalkForm";
import WhatToExpect from "@/components/sections/WhatToExpect";

function findBlock(sections: PageBlock[], type: string) {
  return sections.find((b) => b.type === type);
}

export default function LetsTalkPageRenderer({ sections, locale }: { sections: PageBlock[]; locale: LocaleCode }) {
  const currentPages = useAppSelector((state) => state.pages.currentPages);

  // Only use Redux currentPages content if its slug matches this page
  const reduxSections =
    currentPages?.slug === "lets-talk"
      ? (currentPages.content as PageBlock[] | undefined)
      : undefined;

  const s = reduxSections ?? sections;

  return (
    <LocaleProvider locale={locale}>
      {findBlock(s, "hero-centered") && <HeroCentered block={findBlock(s, "hero-centered")!} />}
      {findBlock(s, "lets-talk-form") && <LetsTalkForm block={findBlock(s, "lets-talk-form")!} />}
      {findBlock(s, "what-to-expect") && <WhatToExpect block={findBlock(s, "what-to-expect")!} />}
    </LocaleProvider>
  );
}
