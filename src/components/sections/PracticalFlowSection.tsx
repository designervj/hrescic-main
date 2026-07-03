"use client";

import EditableText from "@/components/shared/EditableText";

import { useLocale } from "@/lib/i18n/LocaleContext";
import { getLocalizedString, type LocalizedString } from "@/lib/i18n/locale";
import { PageBlock } from "@/lib/store/pages/pageType";
import { useEditable } from "@/lib/store/pages/useEditable";

interface FlowStep {
  highlight: LocalizedString;
  text: LocalizedString;
}

interface PracticalFlowSectionProps {
  headline: LocalizedString;
  subtext: LocalizedString;
  items: FlowStep[];
}

export default function PracticalFlowSection({ block }: { block: PageBlock }) {
  const locale = useLocale();
  const props = block.props as unknown as PracticalFlowSectionProps;
  const { isEditable, handleChange } = useEditable(block.id);

  return (
    <section className="container-xl mx-auto py-8 sm:px-6 lg:px-8">
      <div className="relative overflow-hidden rounded-[20px] mx-4 md:mx-0 bg-[#1D2931]">
        <div className="mx-auto max-w-5xl px-6 py-12 text-center text-white sm:px-8 sm:py-16 lg:px-12 lg:py-20">
          <EditableText
            text={props.headline?.[locale] || ""}
            editable={isEditable}
            onChange={handleChange(`props.headline.${locale}`)}
            tag="h3"
            className="text-3xl font-light leading-tight md:text-5xl mb-6"
            multiline
          />

          <EditableText
            text={props.subtext?.[locale] || ""}
            editable={isEditable}
            onChange={handleChange(`props.subtext.${locale}`)}
            tag="p"
            className="mx-auto mt-4 max-w-2xl text-[15px] leading-7 text-white/80 sm:text-base mb-16"
            multiline
          />

          <div className="grid gap-12 text-left md:grid-cols-2 xl:grid-cols-4">
            {(props.items || []).map((step, index) => (
              <div key={index} className="relative px-0 xl:px-4">
                <p className="max-w-[240px] text-[14px] leading-7 text-white/90">
                  <EditableText
                    text={step.highlight?.[locale] || ""}
                    editable={isEditable}
                    onChange={handleChange(`props.items.${index}.highlight.${locale}`)}
                    tag="span"
                    className="font-bold text-[#37C100]"
                  />{" "}
                  <EditableText
                    text={step.text?.[locale] || ""}
                    editable={isEditable}
                    onChange={handleChange(`props.items.${index}.text.${locale}`)}
                    tag="span"
                  />
                </p>

                {index !== (props.items?.length ?? 0) - 1 && (
                  <span className="absolute right-0 top-1 hidden h-12 w-[1px] bg-white/10 xl:block" />
                )}
              </div>
            ))}
          </div>

          <div className="mt-16">
            <a href="/lets-talk#demo">
              <button className="rounded-full bg-[#37C100] hover:bg-[#2d9802] px-10 py-4 text-sm font-semibold text-white transition-all transform hover:-translate-y-1">
                Book a Strategy Call
              </button>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
