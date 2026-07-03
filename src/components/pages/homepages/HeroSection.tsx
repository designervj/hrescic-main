"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { FaPlay } from "react-icons/fa";
import Button from "@/components/shared/Button";
import EditableText from "@/components/shared/EditableText";

import { useLocale } from "@/lib/i18n/LocaleContext";
import { getLocalizedString, type LocalizedString } from "@/lib/i18n/locale";
import { useEditable } from "@/lib/store/pages/useEditable";
import { PageBlock } from "@/lib/store/pages/pageType";

interface HeroProps {
  heading: LocalizedString;
  subheading: LocalizedString;
  primaryButtonText: LocalizedString;
  primaryButtonHref: string;
  secondaryButtonText: LocalizedString;
  secondaryButtonHref: string;
  backgroundOverlay?: string;
}

type Slot = { slotId: string; className: string };
type Tile = { id: number; image: string; action?: string };
type AssignedTile = { tile: Tile; slot: Slot };

const shuffle = <T,>(arr: T[]) => {
  const a = [...arr];
  let i = a.length;
  while (i) {
    const j = Math.floor(Math.random() * i--);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

const slots: Slot[] = [
  { slotId: "large", className: "col-span-1 row-span-2" },
  { slotId: "top", className: "col-start-2 row-start-1" },
  { slotId: "middle", className: "col-start-2 row-start-2" },
  { slotId: "bottom-left", className: "col-start-1 row-start-3 justify-self-end w-[110px]" },
  { slotId: "bottom-right", className: "col-start-2 row-start-3" },
];

const tileData: Tile[] = [
  { id: 1, image: "/assets/Image/exo-turtle.jpg", action: "exo" },
  { id: 2, image: "/assets/Image/revitalift-jar.png", action: "revitalift" },
  { id: 3, image: "/assets/Image/img1.png" },
  { id: 4, image: "/assets/Image/img4.png" },
  { id: 5, image: "/assets/Image/img5.png" },
];

const MasonryShuffleBlocks: React.FC = () => {
  const [assigned, setAssigned] = useState<AssignedTile[]>(() =>
    tileData.map((tile, i) => ({ tile, slot: slots[i] }))
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setAssigned((prev) => {
        const shuffledSlots = shuffle(slots);
        return tileData.map((tile, i) => ({ tile, slot: shuffledSlots[i] }));
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="hidden md:flex w-full justify-end">
      <div
        className="grid gap-3 lg:gap-4"
        style={{ gridTemplateColumns: "1.08fr 1fr", gridTemplateRows: "120px 120px 120px" }}
      >
        {assigned.map(({ tile, slot }) => {
          const showPlay = slot.slotId === "top" || slot.slotId === "middle";
          return (
            <motion.div
              key={tile.id}
              layout
              transition={{ layout: { duration: 1.1, type: "spring", stiffness: 180, damping: 20 } }}
              className={`relative overflow-hidden rounded-[18px] bg-white/5 cursor-pointer hover:opacity-90 transition-opacity ${slot.className}`}
            >
              <img src={tile.image} alt="" className="h-full w-full object-cover" />
              {showPlay && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 backdrop-blur-md border border-white/20">
                    <FaPlay className="ml-[2px] text-white text-xs" />
                  </div>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default function HeroSection({ block }: { block: PageBlock }) {
  const locale = useLocale();
  const props = block.props as unknown as HeroProps;
  const { isEditable, handleChange } = useEditable(block.id);
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  if (!mounted) {
    return (
      <section className="w-full pt-3">
        <div className="container-xl mx-auto">
          <div className="relative overflow-hidden rounded-[18px] bg-[#1D2931] lg:rounded-[20px] min-h-[430px]" />
        </div>
      </section>
    );
  }

  return (
    <section className="w-full pt-3">
      <div className="container-xl mx-auto">
        <div className="relative overflow-hidden rounded-[18px] bg-[#1D2931] lg:rounded-[20px]">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -left-20 top-10 h-72 w-72 rounded-full bg-[#1E3442]/40 blur-3xl" />
            <div className="absolute right-0 top-0 h-80 w-80 rounded-full bg-[#0E1921]/50 blur-3xl" />
          </div>
          <div className="relative grid min-h-[430px] items-center gap-12 px-6 py-8 sm:px-8 sm:py-10 md:px-8 lg:grid-cols-[1.02fr_.98fr] lg:gap-10 lg:px-14 lg:py-16">
            <div className="max-w-[525px] lg:ps-1">
              <EditableText
                text={props.heading?.[locale] || ""}
                editable={isEditable}
                onChange={handleChange(`props.heading.${locale}`)}
                tag="h1"
                className="font-sans text-[34px] font-[500] leading-[1.2] tracking-[-0.02em] text-white sm:text-[42px] md:text-[48px] lg:text-[50px] xl:text-[50px]"
                multiline
              />
              <EditableText
                text={props.subheading?.[locale] || ""}
                editable={isEditable}
                onChange={handleChange(`props.subheading.${locale}`)}
                tag="p"
                className="mt-6 max-w-[470px] text-[14px] leading-7 text-white/80 sm:text-[15px] lg:text-[18px]"
                multiline
              />
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Button href={props.primaryButtonHref}>
                  <EditableText text={props.primaryButtonText?.[locale] || ""} editable={isEditable} onChange={handleChange(`props.primaryButtonText.${locale}`)} tag="span" />
                </Button>
                <Button href={props.secondaryButtonHref} variant="secondary">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full">
                    <FaPlay className="text-[12px]" />
                  </span>
                  <EditableText text={props.secondaryButtonText?.[locale] || ""} editable={isEditable} onChange={handleChange(`props.secondaryButtonText.${locale}`)} tag="span" />
                </Button>
              </div>
            </div>
            <div className="w-full">
              <MasonryShuffleBlocks />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
