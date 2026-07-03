"use client";

import { useState, type FormEvent } from "react";

import { useLocale } from "@/lib/i18n/LocaleContext";
import { getLocalizedString, type LocalizedString } from "@/lib/i18n/locale";
import EditableText from "@/components/shared/EditableText";
import { useEditable } from "@/lib/store/pages/useEditable";
import { PageBlock } from "@/lib/store/pages/pageType";

interface FormField {
  id: string;
  type: string;
  name: string;
  label: LocalizedString;
  placeholder?: LocalizedString;
  required?: boolean;
  validation?: { minLength?: number; maxLength?: number; pattern?: string };
}

interface FormSettings {
  submitText: LocalizedString;
  recaptcha?: boolean;
}

interface FormSectionProps {
  formHeading: LocalizedString;
  formDescription: LocalizedString;
  successHeading: LocalizedString;
  successDescription: LocalizedString;
  successButtonText?: LocalizedString;
  form: {
    id: string;
    name: string;
    settings: FormSettings;
    fields: FormField[];
  };
}

export default function DynamicForm({ block }: { block: PageBlock }) {
  const locale = useLocale();
  const props = block.props as unknown as FormSectionProps;
  const { isEditable, handleChange } = useEditable(block.id);
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const fieldLayout = block.layout === "two_column" ? "grid grid-cols-1 md:grid-cols-2 gap-4" : "space-y-4";

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("submitting");
    const formData = new FormData(e.currentTarget);
    const submission: Record<string, string> = {};
    formData.forEach((value, key) => { submission[key] = String(value); });

    try {
      const res = await fetch("/api/form-data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pageSlug: window.location.pathname,
          sectionId: block.id,
          formId: props.form.id,
          formName: props.form.name,
          submission,
        }),
      });
      if (!res.ok) throw new Error("Failed to submit");
      setStatus("success");
    } catch {
      setStatus("error");
      setErrorMsg("Something went wrong. Please try again.");
    }
  };

  if (status === "success") {
    return (
      <section className="py-16 bg-white">
        <div className="container-xl mx-auto max-w-2xl text-center px-4">
          <EditableText
            text={props.successHeading?.[locale] || ""}
            editable={isEditable}
            onChange={handleChange(`props.successHeading.${locale}`)}
            tag="h2"
            className="text-3xl font-semibold text-[#223039] mb-4"
          />
          <EditableText
            text={props.successDescription?.[locale] || ""}
            editable={isEditable}
            onChange={handleChange(`props.successDescription.${locale}`)}
            tag="p"
            className="text-lg text-[#555555] mb-8"
            multiline
          />
          {(props.successButtonText?.[locale] || isEditable) && (
            <a href="/" className="inline-block rounded-full bg-[#41C717] hover:bg-[#3aa914] text-white px-6 py-3 text-sm font-medium transition-all">
              <EditableText
                text={props.successButtonText?.[locale] || ""}
                editable={isEditable}
                onChange={handleChange(`props.successButtonText.${locale}`)}
                tag="span"
                className=""
              />
            </a>
          )}
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-white">
      <div className="container-xl mx-auto max-w-3xl px-4">
        <div className="text-center mb-10">
          <EditableText
            text={props.formHeading?.[locale] || ""}
            editable={isEditable}
            onChange={handleChange(`props.formHeading.${locale}`)}
            tag="h2"
            className="text-3xl font-semibold text-[#223039] mb-4"
          />
          <EditableText
            text={props.formDescription?.[locale] || ""}
            editable={isEditable}
            onChange={handleChange(`props.formDescription.${locale}`)}
            tag="p"
            className="text-lg text-[#555555]"
            multiline
          />
        </div>
        <form onSubmit={handleSubmit} className={fieldLayout} noValidate>
          {props.form.fields.map((field) => {
            const label = getLocalizedString(field.label, locale);
            const placeholder = getLocalizedString(field.placeholder, locale);
            return (
              <div key={field.id}>
                <label htmlFor={field.id} className="block text-sm font-medium text-[#1F1F1F] mb-1">
                  {label}
                </label>
                {field.type === "textarea" ? (
                  <textarea
                    id={field.id}
                    name={field.name}
                    placeholder={placeholder}
                    required={field.required}
                    maxLength={field.validation?.maxLength}
                    minLength={field.validation?.minLength}
                    className="w-full h-[120px] px-4 py-3 rounded-lg border border-[#DDDDDD] text-[#1F1F1F] placeholder-[#666666] focus:border-[#41C717] focus:ring-2 focus:ring-[#41C717]/20 outline-none transition-all"
                  />
                ) : (
                  <input
                    id={field.id}
                    name={field.name}
                    type={field.type}
                    placeholder={placeholder}
                    required={field.required}
                    maxLength={field.validation?.maxLength}
                    minLength={field.validation?.minLength}
                    className="w-full h-[48px] px-4 rounded-lg border border-[#DDDDDD] text-[#1F1F1F] placeholder-[#666666] focus:border-[#41C717] focus:ring-2 focus:ring-[#41C717]/20 outline-none transition-all"
                  />
                )}
              </div>
            );
          })}
          <div className={block.layout === "two_column" ? "md:col-span-2" : ""}>
            {status === "error" && (
              <p className="text-sm text-red-500 mb-2">{errorMsg}</p>
            )}
            <button
              type="submit"
              disabled={status === "submitting"}
              className="w-full rounded-full bg-[#41C717] hover:bg-[#3aa914] disabled:opacity-50 text-white h-[48px] text-sm font-medium transition-all"
            >
              {status === "submitting" ? "Submitting..." : (
                <EditableText
                  text={props.form.settings.submitText?.[locale] || ""}
                  editable={isEditable}
                  onChange={handleChange(`props.form.settings.submitText.${locale}`)}
                  tag="span"
                  className=""
                />
              )}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
