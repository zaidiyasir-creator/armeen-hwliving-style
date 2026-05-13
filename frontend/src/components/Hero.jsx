import React from "react";
import { useLang } from "./LanguageContext";
import { content } from "../i18n";
import { ChevronDown } from "lucide-react";

const Hero = () => {
    const { t, lang } = useLang();
    return (
        <section id="top" className="relative min-h-screen overflow-hidden" data-testid="hero-section">
            {/* Background image */}
            <div className="absolute inset-0 overflow-hidden">
                <picture>
                    <source srcSet="/armeen/hero.webp" type="image/webp" />
                    <img
                        src="/armeen/hero.png"
                        alt="Architectural skyline at night"
                        className="w-full h-full object-cover ken-burns"
                    />
                </picture>
                <div className="absolute inset-0 bg-gradient-to-b from-[#050505]/40 via-[#050505]/30 to-[#050505]" />
                <div className="absolute inset-0 grain"></div>
            </div>

            {/* Top hairline */}
            <div className="absolute top-28 left-12 right-12 hidden lg:flex items-center justify-between text-[10px] tracking-[0.35em] uppercase text-gray-500">
                <span>Negeri Sembilan · Malaysia</span>
                <span className="flex-1 mx-8 h-px bg-[#E9B949]/30"></span>
                <span>Construction · Civil · Digital</span>
            </div>

            <div className="relative z-10 max-w-[1400px] mx-auto px-5 md:px-12 pt-40 md:pt-44 lg:pt-48 pb-20 md:pb-32 min-h-screen flex flex-col justify-end w-full">
                <div className="max-w-4xl">
                    <p className="eyebrow mb-5 md:mb-6" data-testid="hero-eyebrow">{t(content.hero.eyebrow)}</p>
                    <h1 className="font-montserrat text-[1.625rem] sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl leading-[1] tracking-[-0.02em] text-white font-medium" data-testid="hero-title">
                        <span className="block uppercase font-medium">{t(content.hero.title_a)}</span>
                        <span className="block italic text-[#E9B949]/95 font-medium mt-2">{t(content.hero.title_b)}</span>
                    </h1>
                    <p className="mt-6 md:mt-10 max-w-2xl text-sm md:text-xl leading-relaxed text-gray-400 font-light" data-testid="hero-sub">
                        {t(content.hero.sub)}
                    </p>

                    <div className="mt-10 md:mt-12 flex flex-col sm:flex-row gap-5 sm:gap-6">
                        <a href="#about" className="btn-armeen" data-testid="hero-cta-discover">
                            {t(content.hero.cta1)}
                            <span className="text-current">→</span>
                        </a>
                        <a href="#services" className="btn-armeen-ghost" data-testid="hero-cta-services">
                            {t(content.hero.cta2)}
                            <span>→</span>
                        </a>
                    </div>
                </div>

                {/* Scroll indicator */}
                <div className="hidden md:flex items-center gap-3 absolute right-12 bottom-16 text-[10px] uppercase tracking-[0.4em] text-gray-500">
                    <span>{lang === "en" ? "Scroll" : "Tatal"}</span>
                    <span className="w-12 h-px bg-[#E9B949]/40"></span>
                    <ChevronDown size={14} className="text-[#E9B949]" />
                </div>
            </div>
        </section>
    );
};

export default Hero;
