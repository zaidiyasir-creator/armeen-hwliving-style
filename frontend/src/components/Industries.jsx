import React from "react";
import { useLang } from "./LanguageContext";
import { content } from "../i18n";

const Industries = () => {
    const { t } = useLang();
    return (
        <section id="industries" className="relative py-28 md:py-40" data-testid="industries-section">
            <div className="max-w-[1400px] mx-auto px-6 md:px-12">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 reveal">
                    <div className="lg:col-span-5">
                        <p className="eyebrow mb-6">{t(content.industries.eyebrow)}</p>
                        <h2 className="font-serif text-4xl md:text-5xl text-white leading-[1.05]" data-testid="industries-title">
                            {t(content.industries.title)}
                        </h2>
                    </div>
                    <div className="lg:col-span-7">
                        <ul className="divide-y divide-[#27272A]" data-testid="industries-list">
                            {content.industries.items.map((it, i) => (
                                <li key={i} className="py-6 flex items-center justify-between group">
                                    <div className="flex items-baseline gap-6">
                                        <span className="font-serif text-[#E9B949]/60 group-hover:text-[#E9B949] text-sm tracking-widest w-10 transition-colors">
                                            {String(i + 1).padStart(2, "0")}
                                        </span>
                                        <span className="font-serif text-2xl md:text-3xl text-gray-300 group-hover:text-white transition-colors">
                                            {t(it)}
                                        </span>
                                    </div>
                                    <span className="text-[#E9B949] opacity-0 group-hover:opacity-100 -translate-x-3 group-hover:translate-x-0 transition-all duration-500">→</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Industries;
