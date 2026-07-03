"use client";

import EditableText from "@/components/shared/EditableText";

import { useLocale } from "@/lib/i18n/LocaleContext";
import { getLocalizedString, type LocalizedString } from "@/lib/i18n/locale";
import { PageBlock } from "@/lib/store/pages/pageType";
import { useEditable } from "@/lib/store/pages/useEditable";

interface PricingTableProps {
  sectionTitle: LocalizedString;
  sectionSubtitle: LocalizedString;
  plans: {
    name: LocalizedString;
    problemSolved: LocalizedString;
    subText?: LocalizedString;
    foundation: LocalizedString[];
    monthly: LocalizedString[];
    idealIf: LocalizedString;
    ctaText: LocalizedString;
    ctaHref: string;
  }[];
}

export default function PricingTable({ block }: { block: PageBlock }) {
  const locale = useLocale();
  const props = block.props as unknown as PricingTableProps;
  const { isEditable, handleChange } = useEditable(block.id);

  const bgColors = ["bg-[#F5F7FA]", "bg-[#EEF1F4]", "bg-[#E9EDF2]", "bg-[#E3E8EF]"];

  return (
    <section id="plans" className="container-xl mx-auto mt-14 px-4 py-16 sm:px-6 md:mt-0 lg:px-8">
      <div className="mb-12 text-center">
        <EditableText
          text={props.sectionTitle?.[locale] || ""}
          editable={isEditable}
          onChange={handleChange(`props.sectionTitle.${locale}`)}
          tag="h2"
          className="text-3xl font-light tracking-tight text-[#2f2f2f] md:text-4xl"
          multiline
        />
        <EditableText
          text={props.sectionSubtitle?.[locale] || ""}
          editable={isEditable}
          onChange={handleChange(`props.sectionSubtitle.${locale}`)}
          tag="p"
          className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-[#6b7280] md:text-base"
          multiline
        />
      </div>

      <div className="grid gap-5 px-4 md:grid-cols-2 md:px-0 xl:grid-cols-4">
        {(props.plans || []).map((plan, index) => (
          <div
            key={index}
            className={`${bgColors[index % bgColors.length]} flex min-h-[540px] flex-col rounded-[16px] px-5 py-5`}
          >
            <p className="text-[13px] font-medium text-[#6b7280]">Plan</p>
            <div className="mt-6">
              <EditableText
                text={plan.name?.[locale] || ""}
                editable={isEditable}
                onChange={handleChange(`props.plans.${index}.name.${locale}`)}
                tag="h4"
                className="text-[20px] font-bold tracking-tight text-[#1D2931]"
              />
              <div className="mt-3 h-px w-full bg-[#d1d5db]"></div>
              <EditableText
                text={plan.problemSolved?.[locale] || ""}
                editable={isEditable}
                onChange={handleChange(`props.plans.${index}.problemSolved.${locale}`)}
                tag="p"
                className="mt-3 text-[14px] leading-7 text-[#4b5563] font-normal"
                multiline
              />
            </div>

            <div className="mt-6 flex-1 flex flex-col">
              <div className="h-px w-full bg-[#d1d5db] mb-4"></div>
              {plan.subText && (
                <EditableText
                  text={plan.subText?.[locale] || ""}
                  editable={isEditable}
                  onChange={handleChange(`props.plans.${index}.subText.${locale}`)}
                  tag="p"
                  className="text-[12px] text-[#6b7280] mb-4 font-normal"
                  multiline
                />
              )}

              <div className="space-y-4 flex-1">
                {plan.foundation && plan.foundation.length > 0 && (
                  <div>
                    <h5 className="text-[12px] font-semibold text-[#374151]">
                      One-time foundation:
                    </h5>
                    <ul className="mt-2 list-disc pl-5 text-[11px] text-[#4b5563] space-y-1 font-normal">
                      {plan.foundation.map((item, idx) => (
                        <li key={idx}>
                          <EditableText
                            text={item?.[locale] || ""}
                            editable={isEditable}
                            onChange={handleChange(`props.plans.${index}.foundation.${idx}.${locale}`)}
                            tag="span"
                          />
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {plan.monthly && plan.monthly.length > 0 && (
                  <div>
                    <h5 className="text-[12px] font-semibold text-[#374151]">
                      Monthly rhythm (light):
                    </h5>
                    <ul className="mt-2 list-disc pl-5 text-[11px] text-[#4b5563] space-y-1 font-normal">
                      {plan.monthly.map((item, idx) => (
                        <li key={idx}>
                          <EditableText
                            text={item?.[locale] || ""}
                            editable={isEditable}
                            onChange={handleChange(`props.plans.${index}.monthly.${idx}.${locale}`)}
                            tag="span"
                          />
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-6 border-t border-[#d1d5db] pt-4">
              <h4 className="text-[15px] font-semibold text-[#1D2931]">
                Ideal if you want:
              </h4>
              <EditableText
                text={plan.idealIf?.[locale] || ""}
                editable={isEditable}
                onChange={handleChange(`props.plans.${index}.idealIf.${locale}`)}
                tag="p"
                className="mt-2 text-[14px] text-[#4b5563] font-normal leading-relaxed"
                multiline
              />
              <a href={plan.ctaHref}>
                <button className="mx-auto my-6 flex rounded-full bg-[#1D2931] px-5 py-2 text-[12px] font-medium text-white transition-all hover:bg-black duration-300">
                  <EditableText
                    text={plan.ctaText?.[locale] || ""}
                    editable={isEditable}
                    onChange={handleChange(`props.plans.${index}.ctaText.${locale}`)}
                    tag="span"
                  />
                </button>
              </a>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 text-center">
        <a
          href="/lets-talk#ask"
          className="rounded-full bg-[#37C100] px-6 py-3 text-sm font-medium text-white transition-all hover:bg-[#2d9802] inline-block duration-300"
        >
          Ask Us Anything
        </a>
      </div>
    </section>
  );
}
