import React from "react";
import { useLang } from "./LanguageContext";
import { content } from "../i18n";

const Leadership = () => {
    const { t } = useLang();
    return (
        <section id="leadership" className="relative py-28 md:py-40 bg-[#080808] border-y border-[#1a1a1a]" data-testid="leadership-section">
            <div className="max-w-[1400px] mx-auto px-6 md:px-12">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 reveal">
                    <div className="lg:col-span-4">
                        <p className="eyebrow mb-6">{t(content.leadership.eyebrow)}</p>
                        <h2 className="font-serif text-4xl md:text-5xl text-white leading-[1.05]" data-testid="leadership-title">
                            {t(content.leadership.title)}
                        </h2>
                    </div>
                    <div className="lg:col-span-8">
                        <p className="text-gray-400 font-light text-lg leading-relaxed max-w-3xl">{t(content.leadership.intro)}</p>

                        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-px bg-[#1a1a1a]">
                            {content.leadership.members.map((m, i) => (
                                <div
                                    key={i}
                                    className="bg-[#080808] p-8 group transition-colors hover:bg-[#0f0f0f]"
                                    data-testid={`leader-${i}`}
                                >
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <p className="font-serif text-xl md:text-2xl text-white leading-tight">{m.name}</p>
                                            <p className="mt-3 text-[10px] uppercase tracking-[0.32em] text-[#E9B949]">{t(m.role)}</p>
                                        </div>
                                        <span className="text-gray-700 text-xs">{String(i + 1).padStart(2, "0")}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Leadership;
