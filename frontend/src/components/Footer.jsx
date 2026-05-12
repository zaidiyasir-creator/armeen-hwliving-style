import React from "react";
import { useLang } from "./LanguageContext";
import { content } from "../i18n";
import Logo from "./Logo";

const Footer = () => {
    const { t, lang } = useLang();
    const year = new Date().getFullYear();
    return (
        <footer className="relative bg-[#050505] pt-24 pb-12 border-t border-[#E9B949]/20" data-testid="site-footer">
            <div className="max-w-[1400px] mx-auto px-6 md:px-12">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
                    <div className="md:col-span-5">
                        <Logo className="h-20 md:h-24 mb-6" />
                        <p className="text-[10px] uppercase tracking-[0.4em] text-gray-500 mb-6">NS0146183-A · Established 2015</p>
                        <p className="font-serif text-2xl text-gray-300 italic leading-snug max-w-md">
                            {t(content.footer.tagline)}
                        </p>
                    </div>

                    <div className="md:col-span-3">
                        <p className="eyebrow mb-5">{lang === "en" ? "Practice" : "Praktik"}</p>
                        <ul className="space-y-3 text-sm font-light">
                            {["about","services","capabilities","portfolio"].map((k) => (
                                <li key={k}>
                                    <a href={`#${k}`} className="text-gray-400 hover:text-[#E9B949] transition-colors" data-testid={`footer-link-${k}`}>
                                        {t(content.nav[k])}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="md:col-span-4">
                        <p className="eyebrow mb-5">{lang === "en" ? "Contact" : "Hubungi"}</p>
                        <ul className="space-y-3 text-sm font-light text-gray-400">
                            <li><a href="tel:+60193367316" className="hover:text-[#E9B949] transition-colors">+60 19-336 7316 / 013-336 7316</a></li>
                            <li><a href="mailto:armeeniza@gmail.com" className="hover:text-[#E9B949] transition-colors">armeeniza@gmail.com</a></li>
                            <li className="leading-relaxed">
                                No. 21, Tingkat 1, Jalan Durian Emas,<br/>Betaria Business Center,<br/>70100 Seremban, Negeri Sembilan
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="mt-20 pt-8 border-t border-[#1a1a1a] flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-[11px] uppercase tracking-[0.28em] text-gray-600">
                    <p data-testid="footer-copy">© {year} Armeen HW Enterprise. {t(content.footer.rights)}</p>
                    <p>{t(content.footer.reg)}</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
