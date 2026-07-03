"use client";

import React, { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import headerData from "@/lib/data/pages/headerData.json";
import { getLocalizedString, type LocaleCode, type LocalizedString } from "@/lib/i18n/locale";

interface NavItem {
  label: LocalizedString;
  href: string;
  children?: { label: LocalizedString; href: string }[];
}

interface CtaButton {
  label: LocalizedString;
  href: string;
}

// Subcategories data for each core service (localized)
const subcategoriesData: Record<string, { label: LocalizedString; href: string }[]> = {
  "/what-we-do/branding-strategy": [
    { label: { en: "Brand Strategy & Positioning", hr: "Strategija i Pozicioniranje Brenda" }, href: "/what-we-do/branding-strategy#positioning" },
    { label: { en: "Visual Identity", hr: "Vizualni Identitet" }, href: "/what-we-do/branding-strategy#visual-identity" },
    { label: { en: "Packaging & Print Design", hr: "Dizajn Ambalaže i Tiska" }, href: "/what-we-do/branding-strategy#packaging" },
    { label: { en: "Brand Architecture", hr: "Arhitektura Brenda" }, href: "/what-we-do/branding-strategy#architecture" },
  ],
  "/what-we-do/web-digital": [
    { label: { en: "UX/UI Design", hr: "UX/UI Dizajn" }, href: "/what-we-do/web-digital#ux-ui" },
    { label: { en: "Web Development", hr: "Razvoj Web Stranica" }, href: "/what-we-do/web-digital#development" },
    { label: { en: "E-Commerce Systems", hr: "E-Commerce Sustavi" }, href: "/what-we-do/web-digital#ecommerce" },
    { label: { en: "SEO & Performance", hr: "SEO i Izvedba" }, href: "/what-we-do/web-digital#seo" },
  ],
  "/what-we-do/content-marketing": [
    { label: { en: "Content Strategy", hr: "Strategija Sadržaja" }, href: "/what-we-do/content-marketing#strategy" },
    { label: { en: "Social Media Management", hr: "Vođenje Društvenih Mreža" }, href: "/what-we-do/content-marketing#social" },
    { label: { en: "Copywriting & Messaging", hr: "Copywriting i Poruke" }, href: "/what-we-do/content-marketing#copywriting" },
    { label: { en: "Digital Campaigns", hr: "Digitalne Kampanje" }, href: "/what-we-do/content-marketing#campaigns" },
  ],
  "/what-we-do/ai-video-production": [
    { label: { en: "AI Video Generation", hr: "Generiranje AI Videa" }, href: "/what-we-do/ai-video-production#generation" },
    { label: { en: "Automated Video Ads", hr: "Automatski Video Oglasi" }, href: "/what-we-do/ai-video-production#ads" },
    { label: { en: "Post-Production", hr: "Postprodukcija" }, href: "/what-we-do/ai-video-production#post" },
    { label: { en: "Video Localization", hr: "Lokalizacija Videa" }, href: "/what-we-do/ai-video-production#localization" },
  ],
};

// Selected Case Studies data for each core industry (localized)
const caseStudiesData: Record<string, { label: LocalizedString; href: string }[]> = {
  "/who-we-create-for/tourism-travel": [
    { label: { en: "MyRent", hr: "MyRent" }, href: "/who-we-create-for/myrent" },
  ],
  "/who-we-create-for/education-e-learning": [
    { label: { en: "CDC", hr: "CDC" }, href: "/who-we-create-for/cdc" },
    { label: { en: "EXPO – Life far and beyond", hr: "EXPO – Life far and beyond" }, href: "/who-we-create-for/expo-life-far-beyond" },
  ],
  "/who-we-create-for/health-pharma-beauty": [
    { label: { en: "L'Oréal", hr: "L'Oréal" }, href: "/who-we-create-for/loreal" },
    { label: { en: "Poliderma", hr: "Poliderma" }, href: "/who-we-create-for/poliderma" },
  ],
  "/who-we-create-for/local-boutique-brands": [
    { label: { en: "Castania", hr: "Castania" }, href: "/who-we-create-for/castania" },
    { label: { en: "NAVADA", hr: "NAVADA" }, href: "/who-we-create-for/navada" },
    { label: { en: "Minglanje v Klancu", hr: "Minglanje v Klancu" }, href: "/who-we-create-for/minglanje-v-klanjcu" },
    { label: { en: "IDS", hr: "IDS" }, href: "/who-we-create-for/ids" },
  ],
};

export default function Header({ locale }: { locale: LocaleCode }) {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  
  // Menu and language dropdown states
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [hoveredService, setHoveredService] = useState<string>("/what-we-do/branding-strategy");
  const [hoveredIndustry, setHoveredIndustry] = useState<string>("/who-we-create-for/tourism-travel");
  const [langOpen, setLangOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const navItems = (headerData.navigation as NavItem[]).map((item) => ({
    ...item,
    label: getLocalizedString(item.label, locale),
    children: item.children?.map((child) => ({
      ...child,
      label: getLocalizedString(child.label, locale),
    })),
  }));

  const ctaLabel = getLocalizedString((headerData as { ctaButton: CtaButton }).ctaButton.label, locale);

  const localePrefix = locale === "hr" ? "/hr" : "";
  const localizedHref = (href: string) => `${localePrefix}${href}`;

  // Generate link to switch language while preserving current page pathname
  const getLanguageLink = (targetLocale: LocaleCode) => {
    if (!pathname) return "/";
    const segments = pathname.split("/");
    if (segments[1] === "en" || segments[1] === "hr") {
      segments[1] = targetLocale;
    } else {
      return `/${targetLocale}${pathname}`;
    }
    return segments.join("/");
  };

  if (pathname?.startsWith("/admin")) {
    return null;
  }

  // Pre-fetching specific menu items to render structured custom sub-menus
  const whatWeDoItem = navItems.find((item) => item.href === "/what-we-do");
  const whoWeCreateForItem = navItems.find((item) => item.href === "/who-we-create-for");
  const activeSubcategories = subcategoriesData[hoveredService] || [];
  const activeCaseStudies = caseStudiesData[hoveredIndustry] || [];

  if (!mounted) {
    return (
      <header className="sticky top-0 z-50 w-full bg-white">
        <div className="relative border-b border-gray-100">
          <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-20">
              <div className="flex-shrink-0">
                <Link href={localizedHref("/")} className="flex items-center gap-2">
                  <img
                    src={headerData.logo.src}
                    alt={headerData.logo.alt}
                    className="h-8 w-auto"
                  />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header 
      className="sticky top-0 z-50 w-full bg-white"
      onMouseLeave={() => {
        setActiveMenu(null);
        setLangOpen(false);
      }}
    >
      <div className="relative border-b border-gray-100">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 md:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link href={localizedHref("/")} className="flex items-center gap-2">
                <img
                  src={headerData.logo.src}
                  alt={headerData.logo.alt}
                  className="h-8 w-auto"
                />
              </Link>
            </div>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-6">
              {navItems.map((item) => {
                const isActive = pathname === localizedHref(item.href) || pathname?.startsWith(localizedHref(item.href) + "/");
                const isWhatWeDo = item.href === "/what-we-do";
                const isWhoWeCreateFor = item.href === "/who-we-create-for";
                const isLetsTalk = item.href === "/lets-talk";

                return (
                  <div
                    key={item.label}
                    className="relative py-6"
                    onMouseEnter={() => {
                      if (isWhatWeDo) setActiveMenu("what-we-do");
                      else if (isWhoWeCreateFor) setActiveMenu("who-we-create-for");
                      else if (isLetsTalk) setActiveMenu("lets-talk");
                      else setActiveMenu(null);
                    }}
                  >
                    <Link
                      href={localizedHref(item.href)}
                      className={`group/link text-[14px] font-medium transition-colors relative inline-block ${
                        isActive || 
                        (activeMenu === "what-we-do" && isWhatWeDo) || 
                        (activeMenu === "who-we-create-for" && isWhoWeCreateFor) ||
                        (activeMenu === "lets-talk" && isLetsTalk)
                          ? "text-gray-900"
                          : "text-[#555] hover:text-gray-900"
                      }`}
                    >
                      {item.label}
                      <span
                        className={`pointer-events-none absolute left-0 -bottom-1 h-[2px] rounded-full transition-all duration-200 ${
                          isActive || 
                          (activeMenu === "what-we-do" && isWhatWeDo) || 
                          (activeMenu === "who-we-create-for" && isWhoWeCreateFor) ||
                          (activeMenu === "lets-talk" && isLetsTalk)
                            ? "w-full bg-[#37c100]"
                            : "w-0 bg-[#37c100] group-hover/link:w-full"
                        }`}
                      />
                    </Link>
                  </div>
                );
              })}

              {/* Book a Demo Button */}
              <Link
                href={localizedHref(headerData.ctaButton.href)}
                className="bg-[#37C100] hover:bg-[#2d9802] text-white px-6 py-3 rounded-full text-sm font-semibold transition-all duration-150 shadow-sm"
              >
                {ctaLabel}
              </Link>

              {/* Language Switcher */}
              <div 
                className="relative py-6 ml-1"
                onMouseEnter={() => setLangOpen(true)}
              >
                <button
                  onClick={() => setLangOpen(!langOpen)}
                  className="flex items-center gap-1 text-[14px] font-semibold text-[#555] hover:text-gray-900 transition-colors uppercase"
                >
                  <span>{locale}</span>
                  <svg
                    className={`w-3 h-3 transition-transform duration-200 ${langOpen ? "rotate-180" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2.5"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                <div
                  className={`absolute right-0 top-full pt-2 z-50 transition-all duration-200 ease-out origin-top-right ${
                    langOpen
                      ? "opacity-100 translate-y-0 pointer-events-auto"
                      : "opacity-0 -translate-y-2 pointer-events-none"
                  }`}
                >
                  <div className="bg-white rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.08)] border border-gray-100 py-2 min-w-[130px]">
                    <Link
                      href={getLanguageLink("en")}
                      className={`flex items-center justify-between px-4 py-2.5 text-[14px] font-medium transition-colors ${
                        locale === "en"
                          ? "text-[#37c100] bg-gray-50 font-semibold"
                          : "text-[#555] hover:text-gray-900 hover:bg-gray-50"
                      }`}
                      onClick={() => setLangOpen(false)}
                    >
                      <span>English</span>
                      {locale === "en" && <span className="w-1.5 h-1.5 rounded-full bg-[#37c100]" />}
                    </Link>
                    <Link
                      href={getLanguageLink("hr")}
                      className={`flex items-center justify-between px-4 py-2.5 text-[14px] font-medium transition-colors ${
                        locale === "hr"
                          ? "text-[#37c100] bg-gray-50 font-semibold"
                          : "text-[#555] hover:text-gray-900 hover:bg-gray-50"
                      }`}
                      onClick={() => setLangOpen(false)}
                    >
                      <span>Hrvatski</span>
                      {locale === "hr" && <span className="w-1.5 h-1.5 rounded-full bg-[#37c100]" />}
                    </Link>
                  </div>
                </div>
              </div>
            </nav>

            {/* Mobile toggle */}
            <div className="md:hidden">
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="text-gray-700 p-2"
              >
                {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mega Menu for What We Do */}
        <div 
          className={`absolute top-full left-0 w-full bg-white border-b border-gray-100 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.08)] z-40 transition-all duration-200 ease-out origin-top ${
            activeMenu === "what-we-do"
              ? "opacity-100 translate-y-0 pointer-events-auto"
              : "opacity-0 -translate-y-2 pointer-events-none"
          }`}
          onMouseEnter={() => setActiveMenu("what-we-do")}
          onMouseLeave={() => {
            setActiveMenu(null);
            setHoveredService("/what-we-do/branding-strategy"); // Reset to default
          }}
        >
          <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            {/* Header Title inside Menu */}
            <div className="mb-6">
              <h2 className="text-[24px] font-bold text-gray-900 tracking-tight">
                {locale === "hr" ? "Što Radimo" : "What We Do"}
              </h2>
            </div>
            
            <div className="grid grid-cols-12 gap-8 border-t border-gray-100 pt-8">
              {/* Left Column: Core Services */}
              <div className="col-span-4 pr-8 border-r border-gray-100">
                <span className="text-[14px] font-bold text-gray-400 tracking-wider uppercase block mb-4">
                  {locale === "hr" ? "KLJUČNE USLUGE" : "CORE SERVICES"}
                </span>
                
                <div className="flex flex-col gap-1.5">
                  {whatWeDoItem?.children?.map((child) => {
                    const isHovered = hoveredService === child.href;
                    return (
                      <div
                        key={child.href}
                        onMouseEnter={() => setHoveredService(child.href)}
                        className="w-full"
                      >
                        <Link
                          href={localizedHref(child.href)}
                          className={`flex items-center justify-between w-full px-4 py-3 rounded-xl text-[15px] font-semibold transition-all duration-150 ${
                            isHovered
                              ? "bg-gray-100 text-[#37c100]"
                              : "text-gray-600 hover:text-gray-900 hover:bg-gray-50/50"
                          }`}
                        >
                          <span>{child.label}</span>
                          <span className={`text-[12px] transition-transform duration-200 ${isHovered ? "translate-x-1" : "opacity-0"}`}>
                            →
                          </span>
                        </Link>
                      </div>
                    );
                  })}
                </div>
              </div>
              
              {/* Right Column: Subcategories */}
              <div className="col-span-8 pl-8">
                <span className="text-[11px] font-bold text-gray-400 tracking-wider uppercase block mb-5">
                  {locale === "hr" ? "PODKATEGORIJE" : "SUBCATEGORIES"}
                </span>
                
                <div className="grid grid-cols-2 gap-x-12 gap-y-6">
                  {activeSubcategories.map((sub, index) => (
                    <Link
                      key={index}
                      href={localizedHref(sub.href)}
                      className="group/sub flex flex-col gap-1 py-1"
                    >
                      <span className="text-[15px] font-semibold text-gray-900 group-hover/sub:text-[#37c100] transition-colors duration-150">
                        {getLocalizedString(sub.label, locale)}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mega Menu for Who We Create For */}
        <div 
          className={`absolute top-full left-0 w-full bg-white border-b border-gray-100 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.08)] z-40 transition-all duration-200 ease-out origin-top ${
            activeMenu === "who-we-create-for"
              ? "opacity-100 translate-y-0 pointer-events-auto"
              : "opacity-0 -translate-y-2 pointer-events-none"
          }`}
          onMouseEnter={() => setActiveMenu("who-we-create-for")}
          onMouseLeave={() => {
            setActiveMenu(null);
            setHoveredIndustry("/who-we-create-for/tourism-travel"); // Reset to default
          }}
        >
          <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            {/* Header Title inside Menu */}
            <div className="mb-6">
              <h2 className="text-[24px] font-bold text-gray-900 tracking-tight">
                {locale === "hr" ? "Za Koga Stvaramo" : "Who We Create For"}
              </h2>
            </div>
            
            <div className="grid grid-cols-12 gap-8 border-t border-gray-100 pt-8">
              {/* Left Column: Core Industries */}
              <div className="col-span-4 pr-8 border-r border-gray-100">
                <span className="text-[14px] font-bold text-gray-400 tracking-wider uppercase block mb-4">
                  {locale === "hr" ? "KLJUČNE INDUSTRIJE" : "CORE INDUSTRIES"}
                </span>
                
                <div className="flex flex-col gap-1.5">
                  {whoWeCreateForItem?.children?.map((child) => {
                    const isHovered = hoveredIndustry === child.href;
                    return (
                      <div
                        key={child.href}
                        onMouseEnter={() => setHoveredIndustry(child.href)}
                        className="w-full"
                      >
                        <Link
                          href={localizedHref(child.href)}
                          className={`flex items-center justify-between w-full px-4 py-3 rounded-xl text-[15px] font-semibold transition-all duration-150 ${
                            isHovered
                              ? "bg-gray-100 text-[#37c100]"
                              : "text-gray-600 hover:text-gray-900 hover:bg-gray-50/50"
                          }`}
                        >
                          <span>{child.label}</span>
                          <span className={`text-[12px] transition-transform duration-200 ${isHovered ? "translate-x-1" : "opacity-0"}`}>
                            →
                          </span>
                        </Link>
                      </div>
                    );
                  })}
                </div>
              </div>
              
              {/* Right Column: Case Studies */}
              <div className="col-span-8 pl-8">
                <span className="text-[11px] font-bold text-gray-400 tracking-wider uppercase block mb-5">
                  {locale === "hr" ? "ODABRANI PRIMJERI PRAKSE" : "SELECTED CASE STUDIES"}
                </span>
                
                <div className="grid grid-cols-2 gap-x-12 gap-y-6">
                  {activeCaseStudies.map((sub, index) => (
                    <Link
                      key={index}
                      href={localizedHref(sub.href)}
                      className="group/sub flex flex-col gap-1 py-1"
                    >
                      <span className="text-[15px] font-semibold text-gray-900 group-hover/sub:text-[#37c100] transition-colors duration-150">
                        {getLocalizedString(sub.label, locale)}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mega Menu for Let's Talk */}
        <div 
          className={`absolute top-full left-0 w-full bg-white border-b border-gray-100 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.08)] z-40 transition-all duration-200 ease-out origin-top ${
            activeMenu === "lets-talk"
              ? "opacity-100 translate-y-0 pointer-events-auto"
              : "opacity-0 -translate-y-2 pointer-events-none"
          }`}
          onMouseEnter={() => setActiveMenu("lets-talk")}
          onMouseLeave={() => {
            setActiveMenu(null);
          }}
        >
          <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            {/* Header Title inside Menu */}
            <div className="mb-6">
              <h2 className="text-[24px] font-bold text-gray-900 tracking-tight">
                {locale === "hr" ? "Kontakt" : "Let's Talk"}
              </h2>
            </div>
            
            <div className="grid grid-cols-12 gap-8 border-t border-gray-100 pt-4 pb-4">
              <div className="col-span-12">
                <span className="text-[15px] font-bold text-[#37c100] tracking-wider uppercase block mb-5">
                  {locale === "hr" ? "KONTAKT I DEMO" : "CONTACT & DEMO"}
                </span>
                
                <div className="grid grid-cols-2 gap-x-12 gap-y-6">
                  <Link
                    href={localizedHref("/lets-talk#demo")}
                    className="group/talk flex flex-col gap-1 py-1"
                  >
                    <span className="text-[15px] font-semibold text-gray-900 group-hover/talk:text-[#37c100] transition-colors duration-150">
                      {locale === "hr" ? "Rezerviraj Besplatni Demo" : "Book a Free Demo"}
                    </span>
                  </Link>
                  <Link
                    href={localizedHref("/lets-talk#ask")}
                    className="group/talk flex flex-col gap-1 py-1"
                  >
                    <span className="text-[15px] font-semibold text-gray-900 group-hover/talk:text-[#37c100] transition-colors duration-150">
                      {locale === "hr" ? "Pitaj Nas Bilo Što" : "Ask Us Anything"}
                    </span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out bg-white w-full absolute border-b border-gray-100 shadow-lg ${
            mobileOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0 pointer-events-none"
          }`}
        >
          <nav className="flex flex-col px-4 pt-2 pb-6 space-y-4">
            {navItems.map((item) => (
              <div key={item.label}>
                <Link
                  href={localizedHref(item.href)}
                  onClick={() => setMobileOpen(false)}
                  className="text-base font-semibold text-gray-900 hover:text-[#37c100] block py-1"
                >
                  {item.label}
                </Link>
                {item.children && item.children.length > 0 && (
                  <div className="ml-4 mt-2 space-y-2 mb-3 border-l-2 border-gray-100 pl-3">
                    {item.children.map((child) => (
                      <Link
                        key={child.label}
                        href={localizedHref(child.href)}
                        onClick={() => setMobileOpen(false)}
                        className="block text-sm font-medium text-gray-600 hover:text-[#37c100]"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            
            <div className="pt-2">
              <Link
                href={localizedHref(headerData.ctaButton.href)}
                onClick={() => setMobileOpen(false)}
                className="bg-[#37c100] hover:bg-[#2d9802] text-white w-full py-3 rounded-full text-sm font-semibold text-center block transition-all"
              >
                {ctaLabel}
              </Link>
            </div>

            {/* Mobile Language Switcher */}
            <div className="border-t border-gray-100 pt-4 flex items-center justify-around">
              <Link
                href={getLanguageLink("en")}
                onClick={() => setMobileOpen(false)}
                className={`text-sm font-semibold px-4 py-2 rounded-lg transition-all ${
                  locale === "en" ? "bg-gray-100 text-[#37c100]" : "text-gray-500 hover:text-gray-900"
                }`}
              >
                English (EN)
              </Link>
              <Link
                href={getLanguageLink("hr")}
                onClick={() => setMobileOpen(false)}
                className={`text-sm font-semibold px-4 py-2 rounded-lg transition-all ${
                  locale === "hr" ? "bg-gray-100 text-[#37c100]" : "text-gray-500 hover:text-gray-900"
                }`}
              >
                Hrvatski (HR)
              </Link>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}
