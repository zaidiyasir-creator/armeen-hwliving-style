import React from "react";
import { useLang } from "./LanguageContext";
import { content } from "../i18n";

const Certifications = () => {
    const { t } = useLang();
    return (
        <section id="certifications" className="relative py-28 md:py-40" data-testid="certifications-section">
            <div className="max-w-[1400px] mx-auto px-6 md:px-12">
                <div className="text-center max-w-3xl mx-auto reveal">
                    <p className="eyebrow mb-6">{t(content.certifications.eyebrow)}</p>
                    <h2 className="font-serif text-4xl md:text-5xl text-white leading-[1.05] tracking-[-0.01em]" data-testid="cert-title">
                        {t(content.certifications.title)}
                    </h2>
                    <p className="mt-8 text-gray-400 font-light text-lg leading-relaxed">{t(content.certifications.intro)}</p>
                </div>

                <div className="mt-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-[#1a1a1a]" data-testid="cert-grid">
                    {content.certifications.items.map((c, i) => (
                        <div
                            key={i}
                            className="group relative p-10 bg-[#0a0a0a] hover:bg-[#111111] transition-colors duration-500"
                            data-testid={`cert-${c.code.toLowerCase().replace(/\s+/g, "-")}`}
                        >
                            <div className="flex items-baseline justify-between">
                                <span className="font-serif text-3xl md:text-4xl text-[#E9B949] tracking-tight">{c.code}</span>
                                <span className="text-[10px] uppercase tracking-[0.32em] text-gray-600">{String(i + 1).padStart(2, "0")}</span>
                            </div>
                            <div className="mt-6 h-px w-12 bg-[#E9B949]/40 group-hover:w-24 transition-all duration-700"></div>
                            <p className="mt-6 text-gray-400 font-light leading-relaxed text-[15px]">{t(c.desc)}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Certifications;
