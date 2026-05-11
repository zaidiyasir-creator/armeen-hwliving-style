import React, { useState } from "react";
import { useLang } from "./LanguageContext";
import { content } from "../i18n";
import { HardHat, ServerCog } from "lucide-react";

const Services = () => {
    const { t } = useLang();
    const [tab, setTab] = useState("construction");

    const section = tab === "construction" ? content.services.construction : content.services.it;

    return (
        <section id="services" className="relative py-28 md:py-40 bg-[#0a0a0a] border-y border-[#1a1a1a]" data-testid="services-section">
            <div className="max-w-[1400px] mx-auto px-6 md:px-12">
                <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-10 reveal">
                    <div>
                        <p className="eyebrow mb-6">{t(content.services.eyebrow)}</p>
                        <h2 className="font-serif text-4xl md:text-6xl text-white leading-[1] tracking-[-0.01em]" data-testid="services-title">
                            {t(content.services.title)}
                        </h2>
                        <p className="mt-8 max-w-2xl text-gray-400 font-light text-lg leading-relaxed">{t(content.services.sub)}</p>
                    </div>
                </div>

                {/* Tab switcher */}
                <div className="mt-16 flex flex-col sm:flex-row gap-0 border-y border-[#27272A]" data-testid="services-tabs">
                    <button
                        onClick={() => setTab("construction")}
                        data-testid="tab-construction"
                        className={`flex-1 flex items-center gap-4 py-6 px-6 text-left transition-all duration-500 group ${
                            tab === "construction" ? "bg-[#111111]" : "hover:bg-[#0e0e0e]"
                        }`}
                    >
                        <HardHat className={`w-5 h-5 ${tab === "construction" ? "text-[#E9B949]" : "text-gray-500"}`} />
                        <div>
                            <p className="eyebrow mb-1" style={{ color: tab === "construction" ? "#E9B949" : "#6B7280" }}>
                                01 / Discipline
                            </p>
                            <p className={`font-serif text-xl md:text-2xl ${tab === "construction" ? "text-white" : "text-gray-500"}`}>
                                {t(content.services.construction.heading)}
                            </p>
                        </div>
                    </button>
                    <div className="hidden sm:block w-px bg-[#27272A]"></div>
                    <button
                        onClick={() => setTab("it")}
                        data-testid="tab-it"
                        className={`flex-1 flex items-center gap-4 py-6 px-6 text-left transition-all duration-500 group ${
                            tab === "it" ? "bg-[#111111]" : "hover:bg-[#0e0e0e]"
                        }`}
                    >
                        <ServerCog className={`w-5 h-5 ${tab === "it" ? "text-[#E9B949]" : "text-gray-500"}`} />
                        <div>
                            <p className="eyebrow mb-1" style={{ color: tab === "it" ? "#E9B949" : "#6B7280" }}>
                                02 / Discipline
                            </p>
                            <p className={`font-serif text-xl md:text-2xl ${tab === "it" ? "text-white" : "text-gray-500"}`}>
                                {t(content.services.it.heading)}
                            </p>
                        </div>
                    </button>
                </div>

                {/* Items grid */}
                <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-[#1a1a1a]" data-testid="services-items">
                    {section.items.map((item, i) => (
                        <div
                            key={i}
                            className="group relative bg-[#0a0a0a] p-8 md:p-10 transition-all duration-500 hover:bg-[#111111]"
                            data-testid={`service-${tab}-${i}`}
                        >
                            <div className="font-serif text-[10px] uppercase tracking-[0.4em] text-[#E9B949]">
                                {String(i + 1).padStart(2, "0")}
                            </div>
                            <h3 className="font-serif text-2xl md:text-[26px] text-white mt-6 leading-tight">
                                {t(item.title)}
                            </h3>
                            <p className="mt-5 text-gray-400 font-light leading-relaxed text-[15px]">
                                {t(item.desc)}
                            </p>
                            <div className="absolute bottom-0 left-0 h-px w-0 group-hover:w-full bg-[#E9B949] transition-all duration-700"></div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Services;
