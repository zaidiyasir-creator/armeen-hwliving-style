import React from "react";
import { useLang } from "./LanguageContext";
import { ExternalLink } from "lucide-react";

const PartnerAlliance = () => {
    const { t, lang } = useLang();
    const labels = {
        eyebrow: { en: "Strategic Alliance", bm: "Pakatan Strategik" },
        title: { en: "United in craft.\nAligned in ambition.", bm: "Bersatu dalam keahlian.\nSelaras dalam aspirasi." },
        intro: {
            en: "Armeen HW Enterprise operates in strategic alliance with IZH Padu Resources Sdn. Bhd. — a partnership that combines complementary capabilities across construction, technology and resources for the most demanding national-scale commissions.",
            bm: "Armeen HW Enterprise beroperasi dalam pakatan strategik bersama IZH Padu Resources Sdn. Bhd. — perkongsian yang menggabungkan keupayaan saling melengkapi merentas pembinaan, teknologi dan sumber bagi projek berskala nasional yang paling mencabar.",
        },
        partnerName: "IZH Padu Resources Sdn. Bhd.",
        partnerRole: { en: "Strategic Partner", bm: "Rakan Strategik" },
        visit: { en: "Visit Partner Site", bm: "Lawat Laman Rakan" },
    };

    return (
        <section id="alliance" className="relative py-24 md:py-32" data-testid="alliance-section">
            <div className="max-w-[1400px] mx-auto px-6 md:px-12">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center reveal">
                    {/* Left: heading */}
                    <div className="lg:col-span-5">
                        <p className="eyebrow mb-6">{t(labels.eyebrow)}</p>
                        <h2 className="font-serif text-3xl md:text-4xl text-white leading-[1.1] whitespace-pre-line tracking-[-0.01em]" data-testid="alliance-title">
                            {t(labels.title)}
                        </h2>
                    </div>

                    {/* Right: partner card */}
                    <div className="lg:col-span-7">
                        <p className="text-gray-400 font-light text-base md:text-lg leading-relaxed">{t(labels.intro)}</p>

                        <a
                            href="https://www.izhpadu.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-10 group relative block border border-[#1a1a1a] hover:border-[#E9B949]/40 bg-[#080808] hover:bg-[#0c0c0c] p-8 md:p-10 transition-all duration-500 overflow-hidden"
                            data-testid="alliance-partner-link"
                        >
                            {/* Yellow accent rule */}
                            <span className="absolute left-0 top-0 bottom-0 w-1 bg-[#E9B949] origin-top scale-y-0 group-hover:scale-y-100 transition-transform duration-700"></span>

                            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 items-center">
                                {/* Monogram */}
                                <div className="md:col-span-2 flex md:justify-center">
                                    <div className="relative w-16 h-16 flex items-center justify-center border border-[#E9B949]/30 group-hover:border-[#E9B949] transition-colors duration-500">
                                        <span className="font-serif text-2xl text-[#E9B949] italic tracking-tight">IZ</span>
                                        <span className="absolute -top-1 -right-1 w-2 h-2 bg-[#E9B949] opacity-0 group-hover:opacity-100 transition-opacity"></span>
                                    </div>
                                </div>

                                {/* Name + role */}
                                <div className="md:col-span-7">
                                    <p className="eyebrow mb-2">{t(labels.partnerRole)}</p>
                                    <p className="font-serif text-2xl md:text-3xl text-white leading-tight">{labels.partnerName}</p>
                                    <p className="mt-2 text-[11px] uppercase tracking-[0.32em] text-gray-500">www.izhpadu.com</p>
                                </div>

                                {/* CTA */}
                                <div className="md:col-span-3 md:text-right">
                                    <span className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.22em] text-[#E9B949] group-hover:gap-3 transition-all">
                                        {t(labels.visit)} <ExternalLink size={12} />
                                    </span>
                                </div>
                            </div>
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default PartnerAlliance;
