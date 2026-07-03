"use client";

import Button from "@/components/shared/Button";
import EditableText from "@/components/shared/EditableText";

import { useLocale } from "@/lib/i18n/LocaleContext";
import { getLocalizedString, type LocalizedString } from "@/lib/i18n/locale";
import { PageBlock } from "@/lib/store/pages/pageType";
import { useEditable } from "@/lib/store/pages/useEditable";

interface CtaCenteredProps {
  heading: LocalizedString;
  description: LocalizedString;
  buttonText: LocalizedString;
  buttonHref: string;
}

export default function CtaCentered({ block }: { block: PageBlock }) {
  const locale = useLocale();
  const props = block.props as unknown as CtaCenteredProps;
  const { isEditable, handleChange } = useEditable(block.id);

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto max-w-3xl text-center px-4">
        <EditableText
          text={props.heading?.[locale] || ""}
          editable={isEditable}
          onChange={handleChange(`props.heading.${locale}`)}
          tag="h2"
          className="text-3xl font-semibold leading-[1.2] text-[#223039] md:text-[40px]"
          multiline
        />
        <EditableText
          text={props.description?.[locale] || ""}
          editable={isEditable}
          onChange={handleChange(`props.description.${locale}`)}
          tag="p"
          className="mt-6 text-lg leading-relaxed text-[#555] max-w-3xl mx-auto"
          multiline
        />
        <div className="mt-10">
          <Button href={props.buttonHref}>
            <EditableText text={props.buttonText?.[locale] || ""} editable={isEditable} onChange={handleChange(`props.buttonText.${locale}`)} tag="span" />
          </Button>
        </div>
      </div>
    </section>
  );
}
