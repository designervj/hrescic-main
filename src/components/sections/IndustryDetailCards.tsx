"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { useLocale } from "@/lib/i18n/LocaleContext";
import { getLocalizedString, type LocalizedString } from "@/lib/i18n/locale";
import EditableText from "@/components/shared/EditableText";
import { useEditable } from "@/lib/store/pages/useEditable";
import { PageBlock } from "@/lib/store/pages/pageType";

interface IndustryDetailCardsProps {
  sectionTitle: LocalizedString;
  sectionSubtext: LocalizedString;
  industries: {
    slug: string;
    image: string;
    title: LocalizedString;
    pain: LocalizedString;
    painQuestion: LocalizedString;
    painReason: LocalizedString;
    need: LocalizedString;
    needText: LocalizedString;
    stats: LocalizedString;
    suggestedPlan: LocalizedString;
    href: string;
  }[];
}

export default function IndustryDetailCards({ block }: { block: PageBlock }) {
  const locale = useLocale();
  const props = block.props as unknown as IndustryDetailCardsProps;
  const { isEditable, handleChange } = useEditable(block.id);

  return (
    <section className="bg-[#F8F8F8] py-16 md:py-20">
      <div className="container-xl mx-auto px-4">
        <div className="text-center mb-12">
          <EditableText
            text={props.sectionTitle?.[locale] || ""}
            editable={isEditable}
            onChange={handleChange(`props.sectionTitle.${locale}`)}
            tag="h2"
            className="text-2xl sm:text-3xl md:text-[36px] font-light text-[#1D2931] mb-3"
          />
          <EditableText
            text={props.sectionSubtext?.[locale] || ""}
            editable={isEditable}
            onChange={handleChange(`props.sectionSubtext.${locale}`)}
            tag="p"
            className="text-[15px] sm:text-base text-[#555] max-w-3xl mx-auto"
            multiline
          />
        </div>

        <div className="grid grid-cols-1 gap-8">
          {(props.industries || []).map((industry, i) => (
            <div key={industry.slug} className="bg-white rounded-[20px] overflow-hidden border border-gray-100 transition-all duration-300 hover:shadow-lg">
              <div className="grid md:grid-cols-2">
                <div className="h-[280px] md:h-full min-h-[300px] overflow-hidden">
                  <img
                    src={industry.image}
                    alt={industry.title?.[locale] || ""}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6 md:p-8 lg:p-10 flex flex-col justify-center">
                  <EditableText
                    text={industry.title?.[locale] || ""}
                    editable={isEditable}
                    onChange={handleChange(`props.industries.${i}.title.${locale}`)}
                    tag="h3"
                    className="text-2xl font-semibold text-[#1D2931] mb-5"
                  />

                  <div className="space-y-4">
                    <div>
                      <EditableText
                        text={industry.pain?.[locale] || ""}
                        editable={isEditable}
                        onChange={handleChange(`props.industries.${i}.pain.${locale}`)}
                        tag="p"
                        className="text-sm font-semibold text-[#666] uppercase tracking-wider mb-1"
                      />
                      <EditableText
                        text={industry.painQuestion?.[locale] || ""}
                        editable={isEditable}
                        onChange={handleChange(`props.industries.${i}.painQuestion.${locale}`)}
                        tag="p"
                        className="text-sm text-[#555] leading-relaxed"
                        multiline
                      />
                    </div>
                    <div>
                      <EditableText
                        text={industry.painReason?.[locale] || ""}
                        editable={isEditable}
                        onChange={handleChange(`props.industries.${i}.painReason.${locale}`)}
                        tag="p"
                        className="text-sm font-semibold text-[#666] uppercase tracking-wider mb-1"
                      />
                      <EditableText
                        text={industry.need?.[locale] || ""}
                        editable={isEditable}
                        onChange={handleChange(`props.industries.${i}.need.${locale}`)}
                        tag="p"
                        className="text-sm text-[#555] leading-relaxed"
                        multiline
                      />
                    </div>
                    <div>
                      <EditableText
                        text={industry.needText?.[locale] || ""}
                        editable={isEditable}
                        onChange={handleChange(`props.industries.${i}.needText.${locale}`)}
                        tag="p"
                        className="text-sm font-semibold text-[#666] uppercase tracking-wider mb-1"
                      />
                    </div>
                    <div className="pt-2">
                      <EditableText
                        text={industry.stats?.[locale] || ""}
                        editable={isEditable}
                        onChange={handleChange(`props.industries.${i}.stats.${locale}`)}
                        tag="span"
                        className="inline-block bg-[#37C100]/10 text-[#37C100] text-sm font-semibold px-3 py-1 rounded-full"
                      />
                    </div>
                  </div>

                  <div className="mt-6 pt-5 border-t border-gray-100 flex items-center justify-between">
                    <span className="text-sm text-[#666]">Suggested: <EditableText
                      text={industry.suggestedPlan?.[locale] || ""}
                      editable={isEditable}
                      onChange={handleChange(`props.industries.${i}.suggestedPlan.${locale}`)}
                      tag="span"
                      className="font-semibold"
                    /></span>
                    <Link href={industry.href} className="group flex items-center gap-1 text-sm font-medium text-[#37C100] hover:text-[#2d9802]">
                      See {industry.title?.[locale]?.split(" ")[0] || ""} Projects <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
