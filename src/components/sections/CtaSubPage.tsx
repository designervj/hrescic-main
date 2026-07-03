"use client";

import EditableText from "@/components/shared/EditableText";
import { useEditable } from "@/lib/store/pages/useEditable";

import { useLocale } from "@/lib/i18n/LocaleContext";
import type { LocalizedString } from "@/lib/i18n/locale";
import { PageBlock } from "@/lib/store/pages/pageType";

interface CtaSubPageProps {
  headline: LocalizedString;
  subtext: LocalizedString;
}

export default function CtaSubPage({ block }: { block: PageBlock }) {
  const locale = useLocale();
  const props = block.props as unknown as CtaSubPageProps;
  const { isEditable, handleChange } = useEditable(block.id);

  return (
    <section className="w-full pb-14 mb-8 md:mt-10 mt-20 px-4 md:px-0">
      <div className="md:max-w-[80%] max-w-[100%] mx-auto bg-gray-100 rounded-2xl text-center px-6 py-16 md:py-20">
        <EditableText
          text={props.headline?.[locale] || ""}
          editable={isEditable}
          onChange={handleChange(`props.headline.${locale}`)}
          tag="span"
          className="text-2xl sm:text-3xl md:text-[36px] font-semibold text-[#2F2A4A] mb-5 block"
          multiline
        />

        <EditableText
          text={props.subtext?.[locale] || ""}
          editable={isEditable}
          onChange={handleChange(`props.subtext.${locale}`)}
          tag="p"
          className="text-sm md:text-base text-[#6B6785] mb-8 mt-6"
          multiline
        />

        <div className="flex justify-center items-center gap-4 flex-wrap">
          <a href="/lets-talk#demo">
            <button className="bg-[#37c100] hover:bg-[#2d9802] text-white px-6 py-3 rounded-full text-sm font-medium transition-all">
              Book a Free Demo
            </button>
          </a>
          <a href="/lets-talk#ask">
            <button className="border bg-[#37c1000a] border-[#37c1004d] text-[#2f2a4a] px-6 py-3 rounded-full text-sm font-medium hover:bg-white transition-all">
              Ask Us Anything
            </button>
          </a>
        </div>
      </div>
    </section>
  );
}
