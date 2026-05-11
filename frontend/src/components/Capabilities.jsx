import React from "react";
import { useLang } from "./LanguageContext";
import { content } from "../i18n";

const Capabilities = () => {
    const { t } = useLang();
    return (
        <section id="capabilities" className="relative py-28 md:py-40" data-testid="capabilities-section">
            <div className="max-w-[1400px] mx-auto px-6 md:px-12">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 items-start">
                    <div className="lg:col-span-5 lg:sticky lg:top-32 reveal">
                        <p className="eyebrow mb-6">{t(content.capabilities.eyebrow)}</p>
                        <h2 className="font-serif text-4xl md:text-5xl text-white leading-[1.05]" data-testid="capabilities-title">
                            {t(content.capabilities.title)}
                        </h2>
                        <div className="mt-12 relative overflow-hidden hidden lg:block">
                            <img
                                src="https://images.unsplash.com/photo-1581094288338-2314dddb7ece?auto=format&fit=crop&w=1600&q=80"
                                alt="Engineering blueprint"
                                className="w-full h-[420px] object-cover opacity-70 grayscale"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent"></div>
                        </div>
                    </div>

                    <div className="lg:col-span-7 reveal">
                        <div className="divide-y divide-[#27272A]">
                            {content.capabilities.items.map((cap, i) => (
                                <div key={i} className="py-8 group" data-testid={`capability-${i}`}>
                                    <div className="flex items-baseline gap-6">
                                        <span className="font-serif text-[#E9B949] text-sm tracking-widest w-10">
                                            {String(i + 1).padStart(2, "0")}
                                        </span>
                                        <h3 className="font-serif text-2xl md:text-3xl text-white leading-tight">
                                            {t(cap.title)}
                                        </h3>
                                    </div>
                                    <p className="mt-4 ml-16 text-gray-400 font-light leading-relaxed max-w-2xl">
                                        {t(cap.desc)}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Capabilities;
