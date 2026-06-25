import React, { useEffect, useState } from "react";
import { useLang } from "./LanguageContext";
import { content } from "../i18n";
import { api } from "../api";
import { Download } from "lucide-react";

const About = () => {
    const { t, lang } = useLang();
    const [profileUrl, setProfileUrl] = useState("/armeen/company-profile.pdf");

    useEffect(() => {
        api.get("/site-settings")
            .then(({ data }) => {
                if (data?.company_profile_url) setProfileUrl(data.company_profile_url);
            })
            .catch(() => {});
    }, []);

    return (
        <section id="about" className="relative py-28 md:py-40" data-testid="about-section">
            <div className="max-w-[1400px] mx-auto px-6 md:px-12">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24">
                    {/* Left column */}
                    <div className="lg:col-span-5 reveal">
                        <p className="eyebrow mb-6">{t(content.about.eyebrow)}</p>
                        <h2 className="font-serif text-4xl md:text-5xl leading-[1.05] tracking-[-0.01em] text-white whitespace-pre-line" data-testid="about-title">
                            {t(content.about.title)}
                        </h2>
                        <span className="gold-rule mt-10 block"></span>

                        {/* Download Company Profile */}
                        <a
                            href={profileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            download
                            className="mt-10 inline-flex items-center gap-4 group"
                            data-testid="download-profile-pdf"
                        >
                            <span className="w-12 h-12 border border-[#E9B949]/40 flex items-center justify-center text-[#E9B949] group-hover:bg-[#E9B949] group-hover:text-[#050505] transition-all duration-500">
                                <Download size={16} />
                            </span>
                            <span className="text-[11px] uppercase tracking-[0.28em] text-gray-300 group-hover:text-[#E9B949] transition-colors">
                                {lang === "en" ? "Download Company Profile (PDF)" : "Muat Turun Profil Syarikat (PDF)"}
                            </span>
                        </a>
                    </div>

                    {/* Right column */}
                    <div className="lg:col-span-7 reveal">
                        <p className="text-lg md:text-xl leading-relaxed text-gray-400 font-light" data-testid="about-intro">
                            {t(content.about.intro)}
                        </p>

                        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-10">
                            <div className="border-l border-[#E9B949]/30 pl-6">
                                <p className="eyebrow mb-3">{t(content.about.vision_label)}</p>
                                <p className="text-gray-300 leading-relaxed font-light">{t(content.about.vision)}</p>
                            </div>
                            <div className="border-l border-[#E9B949]/30 pl-6">
                                <p className="eyebrow mb-3">{t(content.about.mission_label)}</p>
                                <p className="text-gray-300 leading-relaxed font-light">{t(content.about.mission)}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats row */}
                <div className="mt-24 md:mt-32 grid grid-cols-2 md:grid-cols-4 reveal" data-testid="about-stats">
                    {content.about.stats.map((s, i) => (
                        <div
                            key={i}
                            className={`py-8 px-4 md:px-8 border-t border-[#27272A] ${
                                i !== 0 ? "md:border-l md:border-l-[#27272A]" : ""
                            }`}
                        >
                            <div className="font-serif text-5xl md:text-6xl text-[#E9B949] font-light tracking-tight">{s.value}</div>
                            <div className="mt-3 text-[10px] uppercase tracking-[0.32em] text-gray-500">{t(s.label)}</div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default About;
