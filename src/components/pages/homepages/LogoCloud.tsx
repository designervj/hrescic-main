"use client";

import EditableText from "@/components/shared/EditableText";

import { useLocale } from "@/lib/i18n/LocaleContext";
import { getLocalizedString, type LocalizedString } from "@/lib/i18n/locale";
import { PageBlock } from "@/lib/store/pages/pageType";
import { useEditable } from "@/lib/store/pages/useEditable";

interface LogoCloudProps {
  sectionTitle: LocalizedString;
  logos: { src: string; alt: string }[];
}

export default function LogoCloud({ block }: { block: PageBlock }) {
  const locale = useLocale();
  const props = block.props as unknown as LogoCloudProps;
  const { isEditable, handleChange } = useEditable(block.id);
  const logoList = props.logos || [];
  const mid = Math.ceil(logoList.length / 2);
  const topRow = logoList.slice(0, mid);
  const bottomRow = logoList.slice(mid);

  return (
    <section className="w-full bg-white py-8 sm:py-10 lg:pt-4 lg:pb-12">
      <div className="container-xl mx-auto">
        <div className="mb-7 flex justify-center">
          <EditableText
            text={props.sectionTitle?.[locale] || ""}
            editable={isEditable}
            onChange={handleChange(`props.sectionTitle.${locale}`)}
            tag="p"
            className="text-center text-[13px] italic font-normal text-[#666666] sm:text-[15px]"
          />
        </div>
        <div className="space-y-5">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7">
            {topRow.map((brand, index) => (
              <div key={`top-${index}`} className="flex h-[80px] w-full items-center justify-center rounded-2xl bg-white px-4 transition-all duration-300 hover:-translate-y-0.5">
                <img src={brand.src} alt={brand.alt} className="max-h-[34px] w-auto max-w-full object-contain grayscale transition duration-300 hover:grayscale-0" />
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6 px-4 md:px-0">
            {bottomRow.map((brand, index) => (
              <div key={`bottom-${index}`} className="flex h-[80px] w-full items-center justify-center rounded-2xl bg-white px-4 transition-all duration-300 hover:-translate-y-0.5">
                <img src={brand.src} alt={brand.alt} className="max-h-[34px] w-auto max-w-full object-contain grayscale transition duration-300 hover:grayscale-0" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
