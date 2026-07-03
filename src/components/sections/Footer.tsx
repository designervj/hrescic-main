"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { Mail, Phone, MapPin, Linkedin, Instagram, Youtube, Facebook } from "lucide-react";
import footerData from "@/lib/data/pages/footerData.json";
import { getLocalizedString, type LocaleCode, type LocalizedString } from "@/lib/i18n/locale";

const iconMap: Record<string, React.ElementType> = {
  Email: Mail,
  Phone: Phone,
  MapPin: MapPin,
  LinkedIn: Linkedin,
  Instagram: Instagram,
  Facebook: Facebook,
  YouTube: Youtube,
};

export default function Footer({ locale }: { locale: LocaleCode }) {
  const pathname = usePathname();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const localePrefix = locale === "hr" ? "/hr" : "";
  const localizedHref = (href: string) => {
    if (href.startsWith("http") || href.startsWith("mailto") || href.startsWith("tel") || href === "#") return href;
    return `${localePrefix}${href}`;
  };

  if (pathname?.startsWith("/admin")) {
    return null;
  }

  if (!mounted) {
    return <footer className="relative bg-[#0F172A] pt-20 pb-10 overflow-hidden font-sans text-slate-300" />;
  }

  const year = new Date().getFullYear();
  const copyrightRaw = getLocalizedString(footerData.bottomBar.copyright as LocalizedString, locale);
  const copyright = copyrightRaw.replace("{year}", String(year));
  const madeWith = getLocalizedString(footerData.bottomBar.madeWith as LocalizedString, locale);

  const columns = (footerData.columns || []).map((col) => ({
    title: getLocalizedString(col.title as LocalizedString, locale),
    links: (col.links || []).map((link) => ({
      label: getLocalizedString(link.label as LocalizedString, locale),
      href: link.href,
      icon: (link as Record<string, unknown>).icon as string | undefined,
    })),
  }));

  return (
    <footer className="relative bg-[#0F172A] pt-20 pb-10 overflow-hidden font-sans text-slate-300 px-6">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#37c100]/20 to-transparent" />
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#37c100]/5 rounded-full blur-3xl" />
      <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-[#37c100]/5 rounded-full blur-3xl" />

      <div className="max-w-8xl mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="text-white text-lg font-semibold mb-5 tracking-tight">
                {col.title}
              </h4>
              {col.title === "Follow" || col.title === "Pratite nas" ? (
                <div className="flex gap-4">
                  {col.links.map((link) => {
                    const Icon = iconMap[link.icon || ""];
                    if (!Icon) return null;
                    return (
                      <a
                        key={link.label}
                        href={localizedHref(link.href)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-[#37c100] hover:border-[#37c100] hover:scale-110 transition-all duration-300 group"
                        aria-label={link.label}
                      >
                        <Icon className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors" />
                      </a>
                    );
                  })}
                </div>
              ) : (
                <ul className="space-y-1.5">
                  {col.links.map((link) => {
                    const Icon = link.icon ? iconMap[link.icon] : null;
                    return (
                      <li key={link.label}>
                        <a
                          href={localizedHref(link.href)}
                          className={`flex items-start gap-3 group hover:text-white transition-colors duration-300 text-base ${Icon ? "" : ""}`}
                          {...(link.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                        >
                          {Icon && (
                            <Icon className="w-5 h-5 mt-0.5 text-[#37c100] group-hover:scale-110 transition-transform shrink-0" />
                          )}
                          <span className={Icon ? "text-base" : "hover:text-white transition-colors duration-300 text-base"}>{link.label}</span>
                        </a>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          ))}
        </div>

        <div className="border-t border-white/10 mt-12 pt-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4 text-sm text-slate-300/80">
          <div className="flex flex-col gap-1">
            <p className="text-base font-normal italic">{copyright}</p>
          </div>
          <div className="flex flex-wrap justify-center md:justify-end gap-4 text-xs md:text-sm">
            <p className="text-[#37c100] font-medium leading-relaxed max-w-xs text-center md:text-right">
              {madeWith}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
