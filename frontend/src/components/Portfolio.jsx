import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useLang } from "./LanguageContext";
import { content } from "../i18n";
import { api, resolveAsset } from "../api";

const Portfolio = () => {
    const { t, lang } = useLang();
    const [projects, setProjects] = useState([]);

    useEffect(() => {
        let mounted = true;
        api.get("/projects")
            .then(({ data }) => { if (mounted) setProjects(data); })
            .catch(() => {});
        return () => { mounted = false; };
    }, []);

    const featured = projects.slice(0, 6);

    return (
        <section id="portfolio" className="relative py-28 md:py-40 bg-[#080808]/85 backdrop-blur-[2px] border-y border-[#1a1a1a]" data-testid="portfolio-section">
            <div className="max-w-[1400px] mx-auto px-6 md:px-12">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16 reveal">
                    <div>
                        <p className="eyebrow mb-6">{t(content.portfolio.eyebrow)}</p>
                        <h2 className="font-serif text-4xl md:text-6xl text-white leading-[1] tracking-[-0.01em] whitespace-pre-line" data-testid="portfolio-title">
                            {t(content.portfolio.title)}
                        </h2>
                    </div>
                    <div className="flex items-end">
                        <p className="text-gray-400 font-light leading-relaxed text-lg max-w-lg">{t(content.portfolio.sub)}</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8" data-testid="portfolio-grid">
                    {featured.map((p, i) => (
                        <Link
                            key={p.slug}
                            to={`/projects/${p.slug}`}
                            className="group relative block aspect-[4/5] overflow-hidden bg-[#0a0a0a] border border-[#1a1a1a] reveal"
                            data-testid={`portfolio-item-${i}`}
                        >
                            {p.cover && (
                                <img
                                    src={resolveAsset(p.cover)}
                                    alt={t(p.title)}
                                    className="hover-img absolute inset-0 w-full h-full object-cover opacity-75 group-hover:opacity-95 transition-opacity duration-700"
                                    loading="lazy"
                                />
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/30 to-transparent"></div>
                            <div className="absolute top-6 left-6 right-6 flex items-center justify-between">
                                <span className="text-[9px] uppercase tracking-[0.4em] text-[#E9B949] bg-[#050505]/80 backdrop-blur-sm px-3 py-1.5 border border-[#E9B949]/30">
                                    {t(p.category)}
                                </span>
                                <span className="text-gray-500 text-xs">{String(i + 1).padStart(2, "0")}</span>
                            </div>
                            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                                <h3 className="font-serif text-xl md:text-2xl text-white leading-tight">
                                    {t(p.title)}
                                </h3>
                                <div className="mt-4 flex items-center gap-2 text-[#E9B949] text-[10px] uppercase tracking-[0.32em] opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                    {lang === "en" ? "View Project" : "Lihat Projek"} <span>→</span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                {projects.length > 0 && (
                    <div className="mt-16 text-center reveal">
                        <Link to={`/projects/${projects[0].slug}`} className="btn-armeen" data-testid="explore-all-projects">
                            {lang === "en" ? "Explore All Projects" : "Terokai Semua Projek"}
                            <span>→</span>
                        </Link>
                    </div>
                )}
            </div>
        </section>
    );
};

export default Portfolio;
