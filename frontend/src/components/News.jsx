import React, { useEffect, useState } from "react";
import { useLang } from "./LanguageContext";
import { api, resolveAsset } from "../api";
import { ArrowRight, X } from "lucide-react";

const News = () => {
    const { t, lang } = useLang();
    const [items, setItems] = useState([]);
    const [active, setActive] = useState(null);

    useEffect(() => {
        let mounted = true;
        api.get("/news?only_published=true")
            .then(({ data }) => { if (mounted) setItems(data); })
            .catch(() => {});
        return () => { mounted = false; };
    }, []);

    if (!items.length) return null;

    return (
        <section id="news" className="relative py-28 md:py-40" data-testid="news-section">
            <div className="max-w-[1400px] mx-auto px-6 md:px-12">
                <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-10 reveal">
                    <div>
                        <p className="eyebrow mb-6">{lang === "en" ? "Latest News" : "Berita Terkini"}</p>
                        <h2 className="font-serif text-4xl md:text-6xl text-white leading-[1] tracking-[-0.01em]" data-testid="news-title">
                            {lang === "en" ? "Dispatches from\nthe practice." : "Maklumat dari\npraktik kami."}
                        </h2>
                    </div>
                    <p className="text-gray-400 font-light text-lg max-w-md">
                        {lang === "en"
                            ? "Announcements, project milestones and industry insights — direct from the Armeen HW team."
                            : "Pengumuman, pencapaian projek dan pandangan industri — terus daripada pasukan Armeen HW."}
                    </p>
                </div>

                <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-[#1a1a1a]" data-testid="news-grid">
                    {items.slice(0, 6).map((n, i) => (
                        <button
                            key={n.id}
                            onClick={() => setActive(n)}
                            className="group text-left bg-[#0a0a0a] hover:bg-[#0f0f0f] transition-colors duration-500 overflow-hidden"
                            data-testid={`news-card-${i}`}
                        >
                            {n.cover_image && (
                                <div className="relative aspect-[16/10] overflow-hidden">
                                    <img
                                        src={resolveAsset(n.cover_image)}
                                        alt={t(n.title)}
                                        className="hover-img absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100"
                                        loading="lazy"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent"></div>
                                </div>
                            )}
                            <div className="p-7">
                                <div className="flex items-center gap-3">
                                    {n.tag && (
                                        <span className="text-[9px] uppercase tracking-[0.32em] text-[#E9B949] border border-[#E9B949]/30 px-2 py-1">{t(n.tag)}</span>
                                    )}
                                    <span className="text-[10px] uppercase tracking-[0.28em] text-gray-600">{(n.published_at || "").slice(0, 10)}</span>
                                </div>
                                <h3 className="mt-4 font-serif text-xl md:text-2xl text-white leading-tight group-hover:text-[#E9B949] transition-colors">
                                    {t(n.title)}
                                </h3>
                                {n.excerpt && (
                                    <p className="mt-4 text-gray-400 font-light text-sm leading-relaxed line-clamp-3">{t(n.excerpt)}</p>
                                )}
                                <div className="mt-6 flex items-center gap-2 text-[#E9B949] text-[10px] uppercase tracking-[0.32em]">
                                    {lang === "en" ? "Read More" : "Baca Lagi"} <ArrowRight size={12} />
                                </div>
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Modal */}
            {active && (
                <div className="fixed inset-0 z-[70] bg-[#050505]/95 backdrop-blur-xl overflow-y-auto" data-testid="news-modal" onClick={() => setActive(null)}>
                    <div className="max-w-3xl mx-auto px-6 md:px-12 py-16 md:py-24" onClick={(e) => e.stopPropagation()}>
                        <button
                            onClick={() => setActive(null)}
                            className="mb-10 text-gray-400 hover:text-[#E9B949] flex items-center gap-2 text-[11px] uppercase tracking-[0.28em]"
                            data-testid="news-modal-close"
                        >
                            <X size={14} /> Close
                        </button>
                        {active.cover_image && (
                            <img src={resolveAsset(active.cover_image)} alt="" className="w-full aspect-[16/9] object-cover mb-10 border border-[#1a1a1a]" />
                        )}
                        <div className="flex items-center gap-3 mb-6">
                            {active.tag && <span className="eyebrow">{t(active.tag)}</span>}
                            <span className="text-[10px] uppercase tracking-[0.28em] text-gray-500">{(active.published_at || "").slice(0, 10)}</span>
                        </div>
                        <h1 className="font-serif text-4xl md:text-5xl text-white leading-tight">{t(active.title)}</h1>
                        {active.excerpt && (
                            <p className="mt-8 font-serif text-xl text-gray-300 italic leading-relaxed">{t(active.excerpt)}</p>
                        )}
                        <div className="mt-10 text-gray-300 font-light leading-relaxed whitespace-pre-line text-lg">{t(active.body)}</div>
                    </div>
                </div>
            )}
        </section>
    );
};

export default News;
