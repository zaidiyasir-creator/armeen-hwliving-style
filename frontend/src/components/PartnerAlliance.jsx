import React from "react";
import { useLang } from "./LanguageContext";
import { ExternalLink } from "lucide-react";

const PARTNERS = [
    {
        name: "IZH Padu Resources Sdn. Bhd.",
        href: "https://www.izhpadu.com",
        display: "www.izhpadu.com",
        // Text monogram fallback (kept for IZH Padu — no logo asset on file)
        monogram: "IZ",
        domain: { en: "ICT Solutions Provider", bm: "Penyedia Penyelesaian ICT" },
    },
    {
        name: "HM Geomatics Sdn. Bhd.",
        href: "http://www.ljt.org.my/search-surveyors-prt/practices/HM%20GEOMATICS%20SDN%20BHD",
        display: { en: "Licensed Land Surveyors · Seremban", bm: "Juruukur Tanah Berlesen · Seremban" },
        logo: "/armeen/partners/hmgeomatics.png",
        logoTransparent: true,
        domain: { en: "Licensed Land Survey", bm: "Ukur Tanah Berlesen" },
    },
];

const PartnerAlliance = () => {
    const { t } = useLang();
    const labels = {
        eyebrow: { en: "Strategic Alliances", bm: "Pakatan Strategik" },
        title: { en: "United in craft.\nAligned in ambition.", bm: "Bersatu dalam keahlian.\nSelaras dalam aspirasi." },
        intro: {
            en: "Armeen HW Enterprise operates in strategic alliance with industry specialists — combining complementary capabilities across ICT solutions, land survey and engineering to deliver the most demanding national-scale commissions.",
            bm: "Armeen HW Enterprise beroperasi dalam pakatan strategik bersama pakar industri — menggabungkan keupayaan saling melengkapi merentas penyelesaian ICT, ukur tanah dan kejuruteraan bagi projek berskala nasional yang paling mencabar.",
        },
        partnerRole: { en: "Strategic Partner", bm: "Rakan Strategik" },
        visit: { en: "Visit Partner Site", bm: "Lawat Laman Rakan" },
    };

    return (
        <section id="alliance" className="relative py-24 md:py-32" data-testid="alliance-section">
            <div className="max-w-[1400px] mx-auto px-6 md:px-12">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start reveal">
                    {/* Left: heading */}
                    <div className="lg:col-span-5 lg:sticky lg:top-32">
                        <p className="eyebrow mb-6">{t(labels.eyebrow)}</p>
                        <h2 className="font-serif text-3xl md:text-4xl text-white leading-[1.1] whitespace-pre-line tracking-[-0.01em]" data-testid="alliance-title">
                            {t(labels.title)}
                        </h2>
                        <p className="mt-8 text-gray-400 font-light text-base md:text-lg leading-relaxed">{t(labels.intro)}</p>
                    </div>

                    {/* Right: partner cards */}
                    <div className="lg:col-span-7 space-y-5 md:space-y-6" data-testid="alliance-partners">
                        {PARTNERS.map((p, idx) => (
                            <a
                                key={p.name}
                                href={p.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group relative block border border-[#1a1a1a] hover:border-[#E9B949]/40 bg-[#080808] hover:bg-[#0c0c0c] p-7 md:p-9 transition-all duration-500 overflow-hidden"
                                data-testid={`alliance-partner-${idx}`}
                            >
                                {/* Gold accent rule */}
                                <span className="absolute left-0 top-0 bottom-0 w-1 bg-[#E9B949] origin-top scale-y-0 group-hover:scale-y-100 transition-transform duration-700"></span>

                                <div className="grid grid-cols-1 md:grid-cols-12 gap-5 md:gap-6 items-center">
                                    {/* Logo / Monogram */}
                                    <div className="md:col-span-3 flex md:justify-center">
                                        {p.logo ? (
                                            <div className={`relative w-24 h-24 md:w-28 md:h-28 border border-[#E9B949]/20 group-hover:border-[#E9B949]/60 transition-colors duration-500 flex items-center justify-center ${p.logoTransparent ? "bg-[#0a0a0a] p-2" : "bg-white p-3"}`}>
                                                <img
                                                    src={p.logo}
                                                    alt={`${p.name} logo`}
                                                    className="max-w-full max-h-full object-contain"
                                                    loading="lazy"
                                                    data-testid={`alliance-partner-${idx}-logo`}
                                                />
                                            </div>
                                        ) : (
                                            <div className="relative w-20 h-20 flex items-center justify-center border border-[#E9B949]/30 group-hover:border-[#E9B949] transition-colors duration-500">
                                                <span className="font-serif text-2xl text-[#E9B949] italic tracking-tight">{p.monogram}</span>
                                                <span className="absolute -top-1 -right-1 w-2 h-2 bg-[#E9B949] opacity-0 group-hover:opacity-100 transition-opacity"></span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Name + role */}
                                    <div className="md:col-span-6">
                                        <p className="eyebrow mb-2">{t(labels.partnerRole)} · {t(p.domain)}</p>
                                        <p className="font-serif text-xl md:text-2xl text-white leading-tight">{p.name}</p>
                                        <p className="mt-2 text-[11px] uppercase tracking-[0.32em] text-gray-500">
                                            {typeof p.display === "string" ? p.display : t(p.display)}
                                        </p>
                                    </div>

                                    {/* CTA */}
                                    <div className="md:col-span-3 md:text-right">
                                        <span className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.22em] text-[#E9B949] group-hover:gap-3 transition-all">
                                            {t(labels.visit)} <ExternalLink size={12} />
                                        </span>
                                    </div>
                                </div>
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default PartnerAlliance;
