"use client";

import EditableText from "@/components/shared/EditableText";
import { useEditable } from "@/lib/store/pages/useEditable";

import { useLocale } from "@/lib/i18n/LocaleContext";
import type { LocalizedString } from "@/lib/i18n/locale";
import MasonryShuffleBlocks from "./MasonryShuffleBlocks";
import { PageBlock } from "@/lib/store/pages/pageType";

interface HeroSubPageProps {
  heading: LocalizedString;
  subheading: LocalizedString;
  primaryButtonText: LocalizedString;
  primaryButtonHref: string;
  secondaryButtonText: LocalizedString;
  secondaryButtonHref: string;
  reviewNote: LocalizedString;
}

export default function HeroSubPage({ block }: { block: PageBlock }) {
  const locale = useLocale();
  const props = block.props as unknown as HeroSubPageProps;
  const { isEditable, handleChange } = useEditable(block.id);

  return (
    <section className="w-full px-0 pt-3 sm:px-4 lg:px-5 pb-0 md:pb-8">
      <div className="container-xl mx-auto">
        <div className="relative overflow-hidden rounded-[18px] mx-4 md:mx-0 bg-[#1D2931] lg:rounded-[20px]">
          <div className="grid md:grid-cols-[55%_45%] gap-10 items-center px-6 md:px-16 py-20">
            <div className="max-w-xl">
              <EditableText
                text={props.heading?.[locale] || ""}
                editable={isEditable}
                onChange={handleChange(`props.heading.${locale}`)}
                tag="h1"
                className="text-white font-sans text-3xl sm:text-4xl lg:text-[50px] leading-tight mb-6 whitespace-pre-line"
                multiline
              />
              <EditableText
                text={props.subheading?.[locale] || ""}
                editable={isEditable}
                onChange={handleChange(`props.subheading.${locale}`)}
                tag="p"
                className="text-gray-300 text-sm sm:text-base max-w-md mb-6 leading-relaxed"
                multiline
              />
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <a href={props.primaryButtonHref}>
                  <button className="bg-[#37C100] hover:bg-[#2d9802] text-white md:px-8 md:py-3.5 px-6 py-3 rounded-full text-xs md:text-sm font-semibold transition-all">
                    <EditableText
                      text={props.primaryButtonText?.[locale] || ""}
                      editable={isEditable}
                      onChange={handleChange(`props.primaryButtonText.${locale}`)}
                      tag="span"
                    />
                  </button>
                </a>
                <a href={props.secondaryButtonHref}>
                  <button className="flex items-center gap-2 bg-[#FFFFFF1A] hover:bg-[#37C100] hover:text-white text-white md:px-8 md:py-3.5 px-6 py-3 rounded-full text-xs md:text-sm transition-all">
                    <EditableText
                      text={props.secondaryButtonText?.[locale] || ""}
                      editable={isEditable}
                      onChange={handleChange(`props.secondaryButtonText.${locale}`)}
                      tag="span"
                    />
                  </button>
                </a>
              </div>
              <EditableText
                text={props.reviewNote?.[locale] || ""}
                editable={isEditable}
                onChange={handleChange(`props.reviewNote.${locale}`)}
                tag="p"
                className="mt-4 text-[13px] text-white/60 italic"
              />
            </div>
            <MasonryShuffleBlocks />
          </div>
        </div>
      </div>
    </section>
  );
}
