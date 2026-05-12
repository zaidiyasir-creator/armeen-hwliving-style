import React, { useEffect, useState } from "react";
import { useLang } from "./LanguageContext";
import { content } from "../i18n";
import Logo from "./Logo";
import { Menu, X, ChevronDown } from "lucide-react";

const BrandMark = () => (
    <a href="/#top" className="flex items-center group" data-testid="brand-mark">
        <Logo className="h-14 md:h-16 transition-transform duration-500 group-hover:scale-[1.02]" />
    </a>
);

const Header = () => {
    const { lang, setLang, t } = useLang();
    const [scrolled, setScrolled] = useState(false);
    const [open, setOpen] = useState(false);
    const [hovered, setHovered] = useState(null); // dropdown key
    const [mobileOpen, setMobileOpen] = useState(null); // mobile-expanded submenu key

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 24);
        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    // Build nav items
    const aboutItems = [
        { href: "/#about", label: { en: "The Practice", bm: "Falsafah Kami" } },
        { href: "/#leadership", label: { en: "Leadership", bm: "Kepimpinan" } },
        { href: "/#news", label: { en: "Latest News", bm: "Berita Terkini" } },
    ];

    const serviceItems = content.services.divisions.map((d) => ({
        href: `/#services-${d.key}`,
        label: d.title,
    }));

    const credentialItems = [
        { href: "/#certifications", label: { en: "Certifications", bm: "Pensijilan" } },
        { href: "/#testimonials", label: { en: "Testimonials", bm: "Testimoni" } },
    ];

    const navStructure = [
        { key: "about", label: { en: "About", bm: "Profil" }, items: aboutItems },
        { key: "services", label: { en: "Services", bm: "Perkhidmatan" }, items: serviceItems, wide: true },
        { key: "capabilities", label: { en: "Capabilities", bm: "Keupayaan" }, href: "/#capabilities" },
        { key: "portfolio", label: { en: "Portfolio", bm: "Projek" }, href: "/#portfolio" },
        { key: "credentials", label: { en: "Credentials", bm: "Kepercayaan" }, items: credentialItems },
        { key: "contact", label: { en: "Contact", bm: "Hubungi" }, href: "/#contact" },
    ];

    const closeMobile = () => { setOpen(false); setMobileOpen(null); };

    return (
        <header
            data-testid="site-header"
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
                scrolled ? "bg-[#050505]/90 backdrop-blur-xl border-b border-[#E9B949]/15" : "bg-transparent"
            }`}
        >
            <div className="max-w-[1400px] mx-auto px-6 md:px-12 flex items-center justify-between h-20">
                <BrandMark />

                {/* Desktop nav */}
                <nav className="hidden lg:flex items-center gap-8" data-testid="primary-nav">
                    {navStructure.map((n) => {
                        if (!n.items) {
                            return (
                                <a
                                    key={n.key}
                                    href={n.href}
                                    data-testid={`nav-${n.key}`}
                                    className="link-underline text-[11px] uppercase tracking-[0.28em] text-gray-300 hover:text-white transition-colors py-2"
                                >
                                    {t(n.label)}
                                </a>
                            );
                        }
                        // Dropdown nav item
                        const isHov = hovered === n.key;
                        return (
                            <div
                                key={n.key}
                                className="relative"
                                onMouseEnter={() => setHovered(n.key)}
                                onMouseLeave={() => setHovered(null)}
                                data-testid={`nav-group-${n.key}`}
                            >
                                <button
                                    className={`flex items-center gap-1.5 text-[11px] uppercase tracking-[0.28em] py-2 transition-colors ${
                                        isHov ? "text-[#E9B949]" : "text-gray-300 hover:text-white"
                                    }`}
                                    data-testid={`nav-${n.key}-trigger`}
                                >
                                    {t(n.label)}
                                    <ChevronDown size={11} className={`transition-transform duration-300 ${isHov ? "rotate-180 text-[#E9B949]" : ""}`} />
                                </button>

                                {/* Dropdown panel */}
                                <div
                                    className={`absolute top-full left-1/2 -translate-x-1/2 pt-3 transition-all duration-300 ${
                                        isHov ? "opacity-100 visible translate-y-0" : "opacity-0 invisible -translate-y-2 pointer-events-none"
                                    }`}
                                    data-testid={`nav-${n.key}-menu`}
                                >
                                    <div className={`bg-[#080808]/95 backdrop-blur-xl border border-[#E9B949]/20 shadow-2xl shadow-[#E9B949]/5 ${n.wide ? "min-w-[480px] p-3" : "min-w-[280px] p-3"}`}>
                                        <ul className={n.wide ? "grid grid-cols-2 gap-1" : "space-y-1"}>
                                            {n.items.map((item, i) => (
                                                <li key={i}>
                                                    <a
                                                        href={item.href}
                                                        className="block px-4 py-3 text-sm text-gray-300 hover:text-[#E9B949] hover:bg-[#E9B949]/5 transition-all border-l-2 border-transparent hover:border-[#E9B949]"
                                                        data-testid={`nav-${n.key}-item-${i}`}
                                                    >
                                                        <span className="text-[#E9B949] text-[9px] tracking-[0.32em] mr-3 inline-block">{String(i + 1).padStart(2, "0")}</span>
                                                        {t(item.label)}
                                                    </a>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </nav>

                <div className="flex items-center gap-6">
                    <div className="hidden md:flex items-center gap-1 text-[11px] tracking-[0.22em]" data-testid="lang-switcher">
                        <button data-testid="lang-en" onClick={() => setLang("en")} className={`px-2 py-1 transition-colors ${lang === "en" ? "text-[#E9B949]" : "text-gray-500 hover:text-gray-200"}`}>EN</button>
                        <span className="text-gray-700">/</span>
                        <button data-testid="lang-bm" onClick={() => setLang("bm")} className={`px-2 py-1 transition-colors ${lang === "bm" ? "text-[#E9B949]" : "text-gray-500 hover:text-gray-200"}`}>BM</button>
                    </div>

                    <a href="/#contact" className="hidden md:inline-flex btn-armeen" data-testid="header-cta">
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

            {/* Mobile nav drawer */}
            {open && (
                <div className="lg:hidden bg-[#050505] border-t border-[#27272A] max-h-[80vh] overflow-y-auto" data-testid="mobile-nav">
                    <div className="px-6 py-6 flex flex-col gap-1">
                        {navStructure.map((n) => {
                            if (!n.items) {
                                return (
                                    <a
                                        key={n.key}
                                        href={n.href}
                                        onClick={closeMobile}
                                        className="block py-3 text-sm uppercase tracking-[0.28em] text-gray-300 border-b border-[#1a1a1a]"
                                        data-testid={`mobile-nav-${n.key}`}
                                    >
                                        {t(n.label)}
                                    </a>
                                );
                            }
                            const isExp = mobileOpen === n.key;
                            return (
                                <div key={n.key} className="border-b border-[#1a1a1a]">
                                    <button
                                        onClick={() => setMobileOpen(isExp ? null : n.key)}
                                        className="w-full flex items-center justify-between py-3 text-sm uppercase tracking-[0.28em] text-gray-300"
                                        data-testid={`mobile-nav-${n.key}-trigger`}
                                    >
                                        {t(n.label)}
                                        <ChevronDown size={12} className={`transition-transform ${isExp ? "rotate-180 text-[#E9B949]" : ""}`} />
                                    </button>
                                    {isExp && (
                                        <ul className="pb-3 pl-4 space-y-1" data-testid={`mobile-nav-${n.key}-menu`}>
                                            {n.items.map((it, i) => (
                                                <li key={i}>
                                                    <a
                                                        href={it.href}
                                                        onClick={closeMobile}
                                                        className="block py-2 text-sm text-gray-400 hover:text-[#E9B949]"
                                                        data-testid={`mobile-nav-${n.key}-item-${i}`}
                                                    >
                                                        <span className="text-[#E9B949] text-[10px] mr-2">{String(i + 1).padStart(2, "0")}</span>
                                                        {t(it.label)}
                                                    </a>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            );
                        })}
                        <div className="flex gap-3 pt-4">
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
