"use client";

import EditableText from "@/components/shared/EditableText";

import { useLocale } from "@/lib/i18n/LocaleContext";
import { getLocalizedString, type LocalizedString } from "@/lib/i18n/locale";
import { PageBlock } from "@/lib/store/pages/pageType";
import { useEditable } from "@/lib/store/pages/useEditable";

interface ComparisonTableProps {
  sectionTitle: LocalizedString;
  sectionSubtitle: LocalizedString;
  features: {
    name: LocalizedString;
    start: LocalizedString;
    grow: LocalizedString;
    scale: LocalizedString;
    custom: LocalizedString;
  }[];
}

const planKeys = ["start", "grow", "scale", "custom"] as const;

export default function ComparisonTable({ block }: { block: PageBlock }) {
  const locale = useLocale();
  const props = block.props as unknown as ComparisonTableProps;
  const { isEditable, handleChange } = useEditable(block.id);

  return (
    <section className="container-xl mx-auto py-16 space-y-6">
      <div className="text-center mb-12">
        <EditableText
          text={props.sectionTitle?.[locale] || ""}
          editable={isEditable}
          onChange={handleChange(`props.sectionTitle.${locale}`)}
          tag="h2"
          className="text-3xl md:text-4xl font-light tracking-tight text-gray-800"
          multiline
        />
        <EditableText
          text={props.sectionSubtitle?.[locale] || ""}
          editable={isEditable}
          onChange={handleChange(`props.sectionSubtitle.${locale}`)}
          tag="p"
          className="mt-4 max-w-2xl mx-auto text-lg text-gray-600"
          multiline
        />
      </div>

      <div className="overflow-hidden">
        <div className="px-5 sm:px-8 lg:px-0 py-0">
          <div className="rounded-2xl bg-white border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <div className="min-w-[720px]">
                {/* Header Row */}
                <div className="grid grid-cols-[1.6fr_1fr_1fr_1fr_1fr] text-xs md:text-sm font-semibold text-[#37c100] bg-gray-50/50">
                  <div className="px-4 py-3 border-b border-gray-200 text-left">
                    Feature / Element
                  </div>
                  <div className="px-4 py-3 border-b border-gray-200 text-left">
                    START
                  </div>
                  <div className="px-4 py-3 border-b border-gray-200 text-left">
                    GROW
                  </div>
                  <div className="px-4 py-3 border-b border-gray-200 text-left">
                    SCALE
                  </div>
                  <div className="px-4 py-3 border-b border-gray-200 text-left">
                    CUSTOM
                  </div>
                </div>

                {/* Body Rows */}
                {(props.features || []).map((feature, index) => {
                  const bgClass = index % 2 === 0 ? "bg-white/80" : "bg-transparent";
                  return (
                    <div
                      key={index}
                      className={`grid grid-cols-[1.6fr_1fr_1fr_1fr_1fr] text-xs md:text-sm text-[#4A4267] ${bgClass} hover:bg-gray-50/50 transition-colors duration-200`}
                    >
                      <div className="px-4 py-3 border-b border-gray-100 font-semibold text-gray-900">
                        <EditableText
                          text={feature.name?.[locale] || ""}
                          editable={isEditable}
                          onChange={handleChange(`props.features.${index}.name.${locale}`)}
                          tag="span"
                        />
                      </div>
                      {planKeys.map((key) => (
                        <div
                          key={key}
                          className="px-4 py-3 border-b border-gray-100 font-normal"
                        >
                          <EditableText
                            text={(feature as any)[key]?.[locale] || ""}
                            editable={isEditable}
                            onChange={handleChange(`props.features.${index}.${key}.${locale}`)}
                            tag="span"
                          />
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
