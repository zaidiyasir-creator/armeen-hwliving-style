import React, { useEffect, useState } from "react";
import { useLang } from "./LanguageContext";
import { content } from "../i18n";
import { api } from "../api";
import Logo from "./Logo";

const DEFAULTS = {
    phone_primary: "019-336 7316",
    phone_secondary: "013-336 7316",
    email: "armeeniza@gmail.com",
    address: "No. 21, Tingkat 1, Jalan Durian Emas,\nBetaria Business Center,\n70100 Seremban, Negeri Sembilan",
};

const telLink = (display) => "tel:+60" + (display || "").replace(/\D/g, "").replace(/^0/, "");
const formatPhone = (display) => {
    if (!display) return "";
    return "+60 " + display.replace(/^0/, "");
};

const Footer = () => {
    const { t, lang } = useLang();
    const [c, setC] = useState(DEFAULTS);
    const year = new Date().getFullYear();

    useEffect(() => {
        api.get("/site-settings")
            .then(({ data }) => {
                const ci = data?.contact || {};
                setC({
                    phone_primary: ci.phone_primary || DEFAULTS.phone_primary,
                    phone_secondary: ci.phone_secondary ?? DEFAULTS.phone_secondary,
                    email: ci.email || DEFAULTS.email,
                    address: ci.address || DEFAULTS.address,
                });
            })
            .catch(() => {});
    }, []);

    const phoneCombined = c.phone_secondary
        ? `${formatPhone(c.phone_primary)} / ${c.phone_secondary}`
        : formatPhone(c.phone_primary);

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
                            <li>
                                <a href={telLink(c.phone_primary)} className="hover:text-[#E9B949] transition-colors" data-testid="footer-phone">
                                    {phoneCombined}
                                </a>
                            </li>
                            <li>
                                <a href={`mailto:${c.email}`} className="hover:text-[#E9B949] transition-colors break-all" data-testid="footer-email">
                                    {c.email}
                                </a>
                            </li>
                            <li className="leading-relaxed whitespace-pre-line" data-testid="footer-address">
                                {c.address}
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
