"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import EditableText from "@/components/shared/EditableText";

import { useLocale } from "@/lib/i18n/LocaleContext";
import { getLocalizedString, type LocalizedString } from "@/lib/i18n/locale";
import { useEditable } from "@/lib/store/pages/useEditable";
import { PageBlock } from "@/lib/store/pages/pageType";

interface IndustryCardsProps {
  sectionTitle: LocalizedString;
  sectionDescription: LocalizedString;
  industries: { slug: string; title: LocalizedString; image: string; description: LocalizedString; buttonText?: LocalizedString }[];
}

export default function IndustryCards({ block }: { block: PageBlock }) {
  const locale = useLocale();
  const props = block.props as unknown as IndustryCardsProps;
  const { isEditable, handleChange } = useEditable(block.id);

  const industries = (props.industries || []).map((ind) => ({
    ...ind,
    title: getLocalizedString(ind.title, locale),
    description: getLocalizedString(ind.description, locale),
    buttonText: ind.buttonText ? getLocalizedString(ind.buttonText, locale) : (locale === "hr" ? "Saznajte više" : "Learn More"),
  }));

  return (
    <section className="bg-white py-16 md:py-18">
      <div className="container-xl mx-auto">
        <div className="mx-auto mb-12 max-w-2xl text-center md:mb-16">
          <EditableText
            text={props.sectionTitle?.[locale] || ""}
            editable={isEditable}
            onChange={handleChange(`props.sectionTitle.${locale}`)}
            tag="h2"
            className="mb-4 text-3xl font-semibold leading-[1.2] text-[#223039] md:text-[40px]"
            multiline
          />
          <EditableText
            text={props.sectionDescription?.[locale] || ""}
            editable={isEditable}
            onChange={handleChange(`props.sectionDescription.${locale}`)}
            tag="p"
            className="text-base text-[#555555] md:text-lg"
            multiline
          />
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-4 lg:grid-cols-4">
          {industries.map((item, i) => {
            const raw = props.industries?.[i];
            return (
            <div key={item.slug} className="flex flex-col overflow-hidden rounded-[16px] bg-white transition-all duration-300 hover:-translate-y-1.5">
              <img src={item.image} alt={item.title} className="h-[220px] w-full object-cover" />
              <div className="flex flex-grow flex-col bg-[#F8F8F8] p-6 md:p-7">
                <EditableText
                  text={raw?.title?.[locale] || ""}
                  editable={isEditable}
                  onChange={handleChange(`props.industries.${i}.title.${locale}`)}
                  tag="h4"
                  className="mb-3 border-b border-[#DDDDDD] pb-4 text-[18px] font-semibold text-[#1F1F1F] md:text-[18px]"
                />
                <EditableText
                  text={raw?.description?.[locale] || ""}
                  editable={isEditable}
                  onChange={handleChange(`props.industries.${i}.description.${locale}`)}
                  tag="p"
                  className="mb-6 text-[14px] leading-relaxed text-[#666666] md:text-[15px]"
                  multiline
                />
                <div className="mt-auto">
                  <hr className="mb-4 border-gray-200" />
                  <Link href={`/who-we-create-for/${item.slug}`} className="group flex items-center gap-1 text-[15px] font-medium text-[#3aaa35] transition-all hover:underline">
                    <EditableText text={raw?.buttonText?.[locale] || (locale === "hr" ? "Saznajte više" : "Learn More")} editable={isEditable} onChange={handleChange(`props.industries.${i}.buttonText.${locale}`)} tag="span" /> <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>
            </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
