"use client";

import Button from "@/components/shared/Button";
import EditableText from "@/components/shared/EditableText";
import { useEditable } from "@/lib/store/pages/useEditable";

import { useLocale } from "@/lib/i18n/LocaleContext";
import type { LocalizedString } from "@/lib/i18n/locale";
import { PageBlock } from "@/lib/store/pages/pageType";

interface HeroCenteredProps {
  heading: LocalizedString;
  subheading?: LocalizedString;
  highlight?: LocalizedString;
  primaryButtonText?: LocalizedString;
  primaryButtonHref?: string;
  secondaryButtonText?: LocalizedString;
  secondaryButtonHref?: string;
}

export default function HeroCentered({ block }: { block: PageBlock }) {
  const locale = useLocale();
  const props = block.props as unknown as HeroCenteredProps;
  const { isEditable, handleChange } = useEditable(block.id);

  return (
    <section className="pt-14 bg-white">
      <div className=" mx-auto text-start max-w-6xl px-4">
        <EditableText
          text={props.heading?.[locale] || ""}
          editable={isEditable}
          onChange={handleChange(`props.heading.${locale}`)}
          tag="h1"
          className="text-4xl md:text-[50px] font-semibold leading-[1.2] text-[#223039] mb-6"
        />
        {props.highlight && (
          <EditableText
            text={props.highlight?.[locale] || ""}
            editable={isEditable}
            onChange={handleChange(`props.highlight.${locale}`)}
            tag="p"
            className="text-[#41C717] text-xl  font-medium mb-0"
          />
        )}
        {props.subheading && (
          <EditableText
            text={props.subheading?.[locale] || ""}
            editable={isEditable}
            onChange={handleChange(`props.subheading.${locale}`)}
            tag="p"
            className="text-lg text-[#555555] max-w-xl  text-start mb-0"
            multiline
          />
        )}
        {(props.primaryButtonText || props.secondaryButtonText) && (
          <div className="flex flex-wrap items-center justify-center gap-4">
            {props.primaryButtonText && (
              <Button href={props.primaryButtonHref}>
                <EditableText
                  text={props.primaryButtonText?.[locale] || ""}
                  editable={isEditable}
                  onChange={handleChange(`props.primaryButtonText.${locale}`)}
                  tag="span"
                />
              </Button>
            )}
            {props.secondaryButtonText && (
              <Button variant="outline" href={props.secondaryButtonHref}>
                <EditableText
                  text={props.secondaryButtonText?.[locale] || ""}
                  editable={isEditable}
                  onChange={handleChange(`props.secondaryButtonText.${locale}`)}
                  tag="span"
                />
              </Button>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
