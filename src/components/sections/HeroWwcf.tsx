"use client";

import EditableText from "@/components/shared/EditableText";
import { useEditable } from "@/lib/store/pages/useEditable";

import { useLocale } from "@/lib/i18n/LocaleContext";
import type { LocalizedString } from "@/lib/i18n/locale";
import { PageBlock } from "@/lib/store/pages/pageType";

interface HeroWwcfProps {
  heading: LocalizedString;
  highlight: LocalizedString;
  primaryButtonText: LocalizedString;
  primaryButtonHref: string;
  secondaryButtonText: LocalizedString;
  secondaryButtonHref: string;
}

export default function HeroWwcf({ block }: { block: PageBlock }) {
  const locale = useLocale();
  const props = block.props as unknown as HeroWwcfProps;
  const { isEditable, handleChange } = useEditable(block.id);

  return (
    <section className="relative bg-white pt-20 pb-8 md:pt-28 md:pb-12 overflow-hidden">
      <div className="container-xl mx-auto px-4 text-center max-w-4xl">
        <EditableText
          text={props.heading?.[locale] || ""}
          editable={isEditable}
          onChange={handleChange(`props.heading.${locale}`)}
          tag="h1"
          className="text-3xl sm:text-4xl md:text-[50px] font-semibold leading-[1.15] text-[#1D2931] mb-4"
          multiline
        />
        <EditableText
          text={props.highlight?.[locale] || ""}
          editable={isEditable}
          onChange={handleChange(`props.highlight.${locale}`)}
          tag="p"
          className="text-xl sm:text-2xl md:text-[28px] text-[#37C100] font-medium mb-8 leading-snug"
          multiline
        />
        <div className="flex flex-wrap items-center justify-center gap-4">
          <a href={props.primaryButtonHref}>
            <button className="bg-[#37C100] hover:bg-[#2d9802] text-white px-8 py-3.5 rounded-full text-sm font-semibold transition-all">
              <EditableText
                text={props.primaryButtonText?.[locale] || ""}
                editable={isEditable}
                onChange={handleChange(`props.primaryButtonText.${locale}`)}
                tag="span"
              />
            </button>
          </a>
          <a href={props.secondaryButtonHref}>
            <button className="border border-[#37C100] text-[#1D2931] hover:bg-[#37C100] hover:text-white px-8 py-3.5 rounded-full text-sm font-semibold transition-all">
              <EditableText
                text={props.secondaryButtonText?.[locale] || ""}
                editable={isEditable}
                onChange={handleChange(`props.secondaryButtonText.${locale}`)}
                tag="span"
              />
            </button>
          </a>
        </div>
      </div>
    </section>
  );
}
