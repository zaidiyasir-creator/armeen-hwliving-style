import React, { useState } from "react";
import { useLang } from "./LanguageContext";
import { content } from "../i18n";
import { Expand, X } from "lucide-react";

const Leadership = () => {
    const { t, lang } = useLang();
    const [zoom, setZoom] = useState(false);

    return (
        <section id="leadership" className="relative py-28 md:py-40 bg-[#080808] border-y border-[#1a1a1a]" data-testid="leadership-section">
            <div className="max-w-[1400px] mx-auto px-6 md:px-12">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 reveal">
                    <div className="lg:col-span-4">
                        <p className="eyebrow mb-6">{t(content.leadership.eyebrow)}</p>
                        <h2 className="font-serif text-4xl md:text-5xl text-white leading-[1.05]" data-testid="leadership-title">
                            {t(content.leadership.title)}
                        </h2>
                        <p className="mt-8 text-gray-400 font-light leading-relaxed">{t(content.leadership.intro)}</p>
                    </div>

                    <div className="lg:col-span-8">
                        <button
                            type="button"
                            onClick={() => setZoom(true)}
                            className="group relative block w-full overflow-hidden border border-[#1a1a1a] bg-[#0a0a0a] cursor-zoom-in"
                            data-testid="org-chart-trigger"
                            aria-label="Open organizational chart"
                        >
                            <img
                                src="/armeen/org-chart.png"
                                alt={lang === "en" ? "Armeen HW Enterprise — Company Organizational Chart" : "Armeen HW Enterprise — Carta Organisasi Syarikat"}
                                className="w-full h-auto block transition-transform duration-700 group-hover:scale-[1.02]"
                                loading="lazy"
                                data-testid="org-chart-image"
                            />
                            <div className="pointer-events-none absolute top-4 right-4 flex items-center gap-2 bg-[#050505]/85 backdrop-blur-sm border border-[#E9B949]/40 px-3 py-2 text-[#E9B949] opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <Expand size={12} />
                                <span className="text-[9px] uppercase tracking-[0.32em]">{lang === "en" ? "Click to enlarge" : "Klik untuk besarkan"}</span>
                            </div>
                        </button>
                    </div>
                </div>
            </div>

            {/* Lightbox */}
            {zoom && (
                <div
                    className="fixed inset-0 z-[100] bg-[#050505]/95 backdrop-blur-md flex items-center justify-center p-4 md:p-10 cursor-zoom-out overflow-auto"
                    onClick={() => setZoom(false)}
                    data-testid="org-chart-lightbox"
                    role="dialog"
                    aria-modal="true"
                >
                    <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); setZoom(false); }}
                        className="fixed top-6 right-6 z-10 w-11 h-11 border border-[#E9B949]/60 hover:bg-[#E9B949] hover:text-[#050505] text-[#E9B949] flex items-center justify-center transition-colors"
                        aria-label="Close"
                        data-testid="org-chart-lightbox-close"
                    >
                        <X size={18} />
                    </button>
                    <img
                        src="/armeen/org-chart.png"
                        alt={lang === "en" ? "Armeen HW Enterprise — Company Organizational Chart" : "Armeen HW Enterprise — Carta Organisasi Syarikat"}
                        className="max-w-full md:max-w-5xl w-full h-auto border border-[#1a1a1a]"
                        onClick={(e) => e.stopPropagation()}
                        data-testid="org-chart-lightbox-image"
                    />
                </div>
            )}
        </section>
    );
};

export default Leadership;
