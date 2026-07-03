"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Play, ArrowRight } from "lucide-react";
import YouTube, { type YouTubeProps } from "react-youtube";
import Link from "next/link";
import Button from "@/components/shared/Button";
import EditableText from "@/components/shared/EditableText";

import { useLocale } from "@/lib/i18n/LocaleContext";
import { getLocalizedString, type LocalizedString } from "@/lib/i18n/locale";
import { useEditable } from "@/lib/store/pages/useEditable";
import { PageBlock } from "@/lib/store/pages/pageType";

interface ServiceCardsProps {
  sectionTitle: LocalizedString;
  sectionDescription: LocalizedString;
  services: { title: LocalizedString; description: LocalizedString; color: string; href: string }[];
}

export default function ServiceCards({ block }: { block: PageBlock }) {
  const locale = useLocale();
  const props = block.props as unknown as ServiceCardsProps;
  const { isEditable, handleChange } = useEditable(block.id);
  const showreelBlock = block.content?.find((c) => c.type === "video-embed");
  const youtubeId = String(showreelBlock?.props?.youtubeId || "s879lJLEfW8");

  const sectionTitle = getLocalizedString(props.sectionTitle, locale);
  const sectionDescription = getLocalizedString(props.sectionDescription, locale);

  const [expanded, setExpanded] = useState(false);
  const [loadVideo, setLoadVideo] = useState(false);

  const localePrefix = locale === "hr" ? "/hr" : "";
  const localizedHref = (href: string) => {
    if (href.startsWith("http") || href.startsWith("#")) return href;
    return `${localePrefix}${href}`;
  };

  const getButtonText = (index: number, locale: string) => {
    const texts = [
      { en: "Explore branding services", hr: "Istražite usluge brendiranja" },
      { en: "Explore web services", hr: "Istražite web usluge" },
      { en: "Explore marketing services", hr: "Istražite marketinške usluge" },
      { en: "See full services", hr: "Pogledajte sve usluge" },
    ];
    const item = texts[index] || { en: "Explore services", hr: "Istražite usluge" };
    return locale === "hr" ? item.hr : item.en;
  };

  const ytOpts: YouTubeProps["opts"] = useMemo(
    () => ({
      width: "100%", height: "100%",
      playerVars: { autoplay: 1, controls: 1, rel: 0, modestbranding: 1 },
    }),
    []
  );

  useEffect(() => {
    const handler = () => {
      const target = document.getElementById("showreel-section");
      if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
      setTimeout(() => { setExpanded(true); setLoadVideo(true); }, 700);
    };
    window.addEventListener("open-showreel", handler);
    return () => window.removeEventListener("open-showreel", handler);
  }, []);

  return (
    <section id="showreel-section" className="scroll-mt-24 bg-white px-4 py-16 md:px-10 md:py-10">
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
            className="text-lg text-[#555555] md:text-lg"
            multiline
          />
        </div>

        <motion.div layout transition={{ duration: 0.7, ease: "easeInOut" }}
          className={expanded ? "grid grid-cols-1 gap-8 items-start" : "grid grid-cols-1 gap-12 items-start lg:grid-cols-[55%_45%]"}
        >
          <motion.div layout transition={{ duration: 0.7, ease: "easeInOut" }}
            className={expanded
              ? "relative h-[400px] w-full overflow-hidden rounded-2xl bg-[#3E0577] md:h-[600px]"
              : "relative flex h-[400px] w-full flex-col justify-between overflow-hidden rounded-2xl bg-[#3E0577] md:h-[450px]"
            }
          >
            {!loadVideo && (
              <>
                <img
                  src={`https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`}
                  alt="Showreel placeholder"
                  className="absolute inset-0 h-full w-full object-cover opacity-90 transition-opacity hover:opacity-100"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/10">
                  <button onClick={() => { setExpanded(true); setLoadVideo(true); }}
                    className="flex h-20 w-20 items-center justify-center rounded-full bg-black/20 text-white backdrop-blur-sm transition-all hover:bg-black/40 hover:scale-105"
                    aria-label="Play showreel" type="button"
                  >
                    <Play className="h-8 w-8 fill-white ml-1" />
                  </button>
                </div>
              </>
            )}
            {loadVideo && (
              <div className="absolute inset-0">
                <YouTube videoId={youtubeId} opts={ytOpts} className="h-[600px] w-full" iframeClassName="h-full w-full" onPlay={() => setExpanded(true)} />
              </div>
            )}
          </motion.div>

          <motion.div layout transition={{ duration: 0.7, ease: "easeInOut" }}
            className={expanded ? "grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4" : "grid grid-cols-1 gap-6 sm:grid-cols-2"}
          >
            {(props.services || []).map((rawService, i) => {
              return (
              <motion.div layout key={i} className="flex h-full flex-col rounded-2xl border border-none bg-[#F3F3F3] p-6">
                <EditableText
                  text={rawService?.title?.[locale] || ""}
                  editable={isEditable}
                  onChange={handleChange(`props.services.${i}.title.${locale}`)}
                  tag="h4"
                  className="mb-2 text-lg font-bold text-[#1F1F1F]"
                />
                <EditableText
                  text={rawService?.description?.[locale] || ""}
                  editable={isEditable}
                  onChange={handleChange(`props.services.${i}.description.${locale}`)}
                  tag="p"
                  className="mb-4 text-md text-[#4B4B4B]"
                  multiline
                />
                <hr className="mt-auto" />
                <Link 
                  href={localizedHref(rawService.href)} 
                  className="group flex items-center gap-1.5 pt-2 text-sm font-semibold text-[#37C100] transition-all hover:text-[#2d9802]"
                >
                  <span>{getButtonText(i, locale)}</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </motion.div>
            );
            })}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
