import React, { useEffect, useState } from "react";
import { useLang } from "./LanguageContext";
import { content } from "../i18n";
import { Menu, X } from "lucide-react";

const navIds = [
    { id: "about", key: "about" },
    { id: "services", key: "services" },
    { id: "capabilities", key: "capabilities" },
    { id: "portfolio", key: "portfolio" },
    { id: "certifications", key: "certifications" },
    { id: "contact", key: "contact" },
];

const BrandMark = () => (
    <a href="#top" className="flex items-center gap-3 group" data-testid="brand-mark">
        <span className="relative w-9 h-9 flex items-center justify-center bg-[#E9B949] text-[#050505] transition-transform duration-500 group-hover:rotate-3">
            <svg viewBox="0 0 32 32" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.6">
                <path d="M4 28 L16 6 L28 28 Z" />
                <path d="M11 28 V20 H21 V28" />
            </svg>
        </span>
        <span className="leading-none">
            <span className="block font-serif text-lg tracking-wider text-white">ARMEEN <span className="italic font-normal">HW</span></span>
            <span className="block text-[9px] tracking-[0.4em] uppercase text-gray-500 mt-0.5">Enterprise · Est 2015</span>
        </span>
    </a>
);

const Header = () => {
    const { lang, setLang, t } = useLang();
    const [scrolled, setScrolled] = useState(false);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 24);
        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    return (
        <header
            data-testid="site-header"
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
                scrolled ? "bg-[#050505]/85 backdrop-blur-xl border-b border-[#E9B949]/15" : "bg-transparent"
            }`}
        >
            <div className="max-w-[1400px] mx-auto px-6 md:px-12 flex items-center justify-between h-20">
                <BrandMark />

                <nav className="hidden lg:flex items-center gap-10" data-testid="primary-nav">
                    {navIds.map((n) => (
                        <a
                            key={n.id}
                            href={`#${n.id}`}
                            data-testid={`nav-${n.id}`}
                            className="link-underline text-[11px] uppercase tracking-[0.28em] text-gray-300 hover:text-white transition-colors"
                        >
                            {t(content.nav[n.key])}
                        </a>
                    ))}
                </nav>

                <div className="flex items-center gap-6">
                    <div className="hidden md:flex items-center gap-1 text-[11px] tracking-[0.22em]" data-testid="lang-switcher">
                        <button
                            data-testid="lang-en"
                            onClick={() => setLang("en")}
                            className={`px-2 py-1 transition-colors ${lang === "en" ? "text-[#E9B949]" : "text-gray-500 hover:text-gray-200"}`}
                        >
                            EN
                        </button>
                        <span className="text-gray-700">/</span>
                        <button
                            data-testid="lang-bm"
                            onClick={() => setLang("bm")}
                            className={`px-2 py-1 transition-colors ${lang === "bm" ? "text-[#E9B949]" : "text-gray-500 hover:text-gray-200"}`}
                        >
                            BM
                        </button>
                    </div>

                    <a href="#contact" className="hidden md:inline-flex btn-armeen" data-testid="header-cta">
                        {lang === "en" ? "Enquire" : "Hubungi"}
                    </a>

                    <button
                        className="lg:hidden text-gray-200"
                        onClick={() => setOpen(!open)}
                        data-testid="mobile-menu-toggle"
                        aria-label="menu"
                    >
                        {open ? <X size={22} /> : <Menu size={22} />}
                    </button>
                </div>
            </div>

            {open && (
                <div className="lg:hidden bg-[#050505] border-t border-[#27272A]" data-testid="mobile-nav">
                    <div className="px-6 py-8 flex flex-col gap-5">
                        {navIds.map((n) => (
                            <a
                                key={n.id}
                                href={`#${n.id}`}
                                onClick={() => setOpen(false)}
                                className="text-sm uppercase tracking-[0.28em] text-gray-300"
                                data-testid={`mobile-nav-${n.id}`}
                            >
                                {t(content.nav[n.key])}
                            </a>
                        ))}
                        <div className="flex gap-3 pt-4 border-t border-[#27272A]">
                            <button onClick={() => setLang("en")} className={`text-xs tracking-[0.22em] ${lang === "en" ? "text-[#E9B949]" : "text-gray-500"}`}>EN</button>
                            <button onClick={() => setLang("bm")} className={`text-xs tracking-[0.22em] ${lang === "bm" ? "text-[#E9B949]" : "text-gray-500"}`}>BM</button>
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
};

export default Header;
