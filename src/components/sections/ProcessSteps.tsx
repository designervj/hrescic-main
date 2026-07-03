"use client";

import EditableText from "@/components/shared/EditableText";

import { useLocale } from "@/lib/i18n/LocaleContext";
import { getLocalizedString, type LocalizedString } from "@/lib/i18n/locale";
import { PageBlock } from "@/lib/store/pages/pageType";
import { useEditable } from "@/lib/store/pages/useEditable";

interface ProcessStepsProps {
  sectionTitle: LocalizedString;
  subheading: LocalizedString;
  steps: {
    title: LocalizedString;
    description: LocalizedString;
  }[];
}

export default function ProcessSteps({ block }: { block: PageBlock }) {
  const locale = useLocale();
  const props = block.props as unknown as ProcessStepsProps;
  const { isEditable, handleChange } = useEditable(block.id);

  return (
    <section className="container-xl mx-auto px-4 md:px-0">
      <div className="relative mt-4 overflow-hidden rounded-[16px] bg-[#1D2931]">
        <div className="mx-auto max-w-5xl px-6 py-12 text-center text-white sm:px-8 sm:py-16 lg:px-12 lg:py-16">
          <EditableText
            text={props.sectionTitle?.[locale] || ""}
            editable={isEditable}
            onChange={handleChange(`props.sectionTitle.${locale}`)}
            tag="h3"
            className="text-3xl font-light leading-tight md:text-4xl"
            multiline
          />
          <p className="mx-auto mt-5 text-sm font-normal leading-7 text-white/95 sm:text-base max-w-2xl">
            Every plan includes a one-time setup that fixes your <br className="hidden md:block" />
            foundation and a monthly rhythm that keeps your <br className="hidden md:block" />
            brand consistent and performing.
          </p>

          <div className="md:mt-40 mt-10 grid gap-8 text-left md:grid-cols-2 xl:grid-cols-4">
            {(props.steps || []).map((step, index) => (
              <div key={index} className="relative px-0 xl:px-4">
                <p className="max-w-[210px] text-[13px] leading-6 text-[#F1E7FF]">
                  <EditableText
                    text={step.title?.[locale] || ""}
                    editable={isEditable}
                    onChange={handleChange(`props.steps.${index}.title.${locale}`)}
                    tag="span"
                    className="font-semibold text-[#37C100]"
                  />{" "}
                  <EditableText
                    text={step.description?.[locale] || ""}
                    editable={isEditable}
                    onChange={handleChange(`props.steps.${index}.description.${locale}`)}
                    tag="span"
                  />
                </p>
                {index < (props.steps?.length ?? 0) - 1 && (
                  <span className="absolute right-0 top-1 hidden h-10 w-[2px] bg-[#37C100]/50 xl:block"></span>
                )}
              </div>
            ))}
          </div>

          <a href="#plans">
            <button className="mt-10 rounded-full bg-[#37C100] hover:bg-[#2d9802] px-8 py-3 text-sm font-medium text-white transition duration-300 hover:-translate-y-0.5">
              See Our Plans
            </button>
          </a>
        </div>
      </div>
    </section>
  );
}
