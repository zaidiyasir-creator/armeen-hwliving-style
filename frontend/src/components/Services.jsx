import React, { useState, useEffect } from "react";
import { useLang } from "./LanguageContext";
import { content } from "../i18n";
import { api } from "../api";
import { HardHat, Zap, ServerCog, Video, Gift, PlugZap, Shirt, Plus, Minus, Clapperboard, Download, Play, X } from "lucide-react";

const iconMap = { HardHat, Zap, ServerCog, Video, Gift, PlugZap, Shirt };

const Services = () => {
    const { t, lang } = useLang();
    const [open, setOpen] = useState(0);
    const [overrides, setOverrides] = useState({});
    const [lightbox, setLightbox] = useState(null); // { src, label }

    useEffect(() => {
        let mounted = true;
        api.get("/services-overrides")
            .then(({ data }) => {
                if (!mounted) return;
                const map = {};
                data.forEach((o) => { map[o.key] = o; });
                setOverrides(map);
            })
            .catch(() => {});
        return () => { mounted = false; };
    }, []);

    // Auto-open a division when URL hash matches "#services-<key>"
    useEffect(() => {
        const handler = () => {
            const h = window.location.hash;
            if (h && h.startsWith("#services-")) {
                const key = h.replace("#services-", "");
                const idx = content.services.divisions.findIndex((d) => d.key === key);
                if (idx >= 0) {
                    setOpen(idx);
                    setTimeout(() => {
                        const el = document.querySelector(`[data-testid='division-${key}']`);
                        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
                    }, 200);
                }
            }
        };
        handler();
        window.addEventListener("hashchange", handler);
        return () => window.removeEventListener("hashchange", handler);
    }, []);

    const divisions = content.services.divisions.map((d) => {
        const ov = overrides[d.key];
        if (!ov) return d;
        // Map override catalogs (url -> src) so they render identically to defaults.
        // Admin can explicitly clear catalogs/gallery by saving an empty array.
        let catalogs = d.catalogs;
        if (Array.isArray(ov.catalogs)) {
            catalogs = ov.catalogs.length > 0
                ? ov.catalogs.map((c) => ({ src: c.url, label: c.label }))
                : undefined;
        }
        let gallery = d.gallery;
        if (Array.isArray(ov.gallery)) {
            gallery = ov.gallery.length > 0 ? ov.gallery : undefined;
        }
        return {
            ...d,
            title: ov.title || d.title,
            summary: ov.summary || d.summary,
            bullets: ov.bullets || d.bullets,
            catalogs,
            gallery,
        };
    });

    return (
        <section id="services" className="relative py-28 md:py-40 bg-[#0a0a0a] border-y border-[#1a1a1a]" data-testid="services-section">
            <div className="max-w-[1400px] mx-auto px-6 md:px-12">
                {/* Header */}
                <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-10 reveal">
                    <div>
                        <p className="eyebrow mb-6">{t(content.services.eyebrow)}</p>
                        <h2 className="font-serif text-4xl md:text-6xl text-white leading-[1] tracking-[-0.01em]" data-testid="services-title">
                            {t(content.services.title)}
                        </h2>
                        <p className="mt-8 max-w-2xl text-gray-400 font-light text-lg leading-relaxed">{t(content.services.sub)}</p>
                    </div>
                    <div className="hidden lg:block text-right text-[10px] uppercase tracking-[0.4em] text-gray-600">
                        {lang === "en" ? "Seven Divisions" : "Tujuh Bahagian"}
                        <div className="mt-2 font-serif text-[#E9B949] text-3xl">07</div>
                    </div>
                </div>

                {/* Divisions accordion */}
                <div className="mt-16 border-t border-[#1a1a1a]" data-testid="services-divisions">
                    {divisions.map((d, i) => {
                        const Icon = iconMap[d.icon] || HardHat;
                        const isOpen = open === i;
                        return (
                            <div
                                key={d.key}
                                className={`border-b border-[#1a1a1a] transition-colors duration-500 ${isOpen ? "bg-[#0f0f0f]" : "hover:bg-[#0d0d0d]"}`}
                                data-testid={`division-${d.key}`}
                            >
                                {/* Row header */}
                                <button
                                    onClick={() => setOpen(isOpen ? -1 : i)}
                                    className="w-full grid grid-cols-12 items-center gap-4 py-8 md:py-10 px-2 md:px-4 text-left"
                                    data-testid={`division-toggle-${d.key}`}
                                    aria-expanded={isOpen}
                                >
                                    <div className="col-span-2 md:col-span-1 flex items-center gap-3">
                                        <span className="font-serif text-[#E9B949]/60 text-sm tracking-[0.32em]">
                                            {String(i + 1).padStart(2, "0")}
                                        </span>
                                    </div>
                                    <div className="col-span-2 md:col-span-1 hidden md:flex">
                                        <Icon className={`w-5 h-5 ${isOpen ? "text-[#E9B949]" : "text-gray-500"} transition-colors`} />
                                    </div>
                                    <div className="col-span-8 md:col-span-8">
                                        <h3 className={`font-serif text-2xl md:text-[32px] leading-tight tracking-tight transition-colors ${isOpen ? "text-white" : "text-gray-300"}`}>
                                            {t(d.title)}
                                        </h3>
                                    </div>
                                    <div className="col-span-2 md:col-span-2 flex justify-end">
                                        <span
                                            className={`w-10 h-10 border flex items-center justify-center transition-all duration-500 ${
                                                isOpen
                                                    ? "border-[#E9B949] bg-[#E9B949] text-[#050505]"
                                                    : "border-[#27272A] text-gray-500"
                                            }`}
                                        >
                                            {isOpen ? <Minus size={14} /> : <Plus size={14} />}
                                        </span>
                                    </div>
                                </button>

                                {/* Expanded body */}
                                <div
                                    className={`grid transition-all duration-700 ease-out overflow-hidden ${
                                        isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                                    }`}
                                >
                                    <div className="min-h-0">
                                        <div className="pb-12 px-2 md:px-4 grid grid-cols-1 md:grid-cols-12 gap-10">
                                            <div className="md:col-span-7 md:col-start-3">
                                                <p className="text-lg md:text-xl text-gray-300 font-light leading-relaxed">
                                                    {t(d.summary)}
                                                </p>

                                                {/* Coming soon video placeholder for production */}
                                                {d.videoComingSoon && (
                                                    <div className="mt-8 flex items-center gap-4 border border-[#E9B949]/20 bg-[#E9B949]/5 px-5 py-4">
                                                        <Clapperboard className="w-5 h-5 text-[#E9B949]" />
                                                        <div>
                                                            <p className="eyebrow mb-1">{lang === "en" ? "Reel — Coming Soon" : "Reel — Akan Datang"}</p>
                                                            <p className="text-sm text-gray-400 font-light">
                                                                {lang === "en"
                                                                    ? "Production showreel by our in-house cinematographer to be added shortly."
                                                                    : "Showreel produksi oleh sinematografer dalaman kami akan ditambah tidak lama lagi."}
                                                            </p>
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Production showreel videos */}
                                                {d.videos && (
                                                    <div className="mt-10" data-testid={`division-${d.key}-videos`}>
                                                        <p className="eyebrow mb-5 flex items-center gap-2">
                                                            <Clapperboard className="w-3.5 h-3.5" />
                                                            {lang === "en" ? "Production Showreel" : "Showreel Produksi"}
                                                        </p>
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                                                            {d.videos.map((v, vi) => (
                                                                <div key={vi} className="group relative aspect-video bg-[#080808] border border-[#1a1a1a] overflow-hidden" data-testid={`division-${d.key}-video-${vi}`}>
                                                                    <video
                                                                        src={v.src}
                                                                        poster={v.poster}
                                                                        controls
                                                                        preload="metadata"
                                                                        className="w-full h-full object-cover"
                                                                    >
                                                                        Your browser does not support the video tag.
                                                                    </video>
                                                                    <div className="absolute top-4 left-4 bg-[#050505]/80 backdrop-blur-sm border border-[#E9B949]/30 px-3 py-1.5 pointer-events-none">
                                                                        <span className="text-[9px] uppercase tracking-[0.32em] text-[#E9B949]">{t(v.label)}</span>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Equipment catalogs download */}
                                                {d.catalogs && (
                                                    <div className="mt-10" data-testid={`division-${d.key}-catalogs`}>
                                                        <p className="eyebrow mb-5 flex items-center gap-2">
                                                            <Download className="w-3.5 h-3.5" />
                                                            {lang === "en" ? "Equipment Catalogs" : "Katalog Peralatan"}
                                                        </p>
                                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-[#1a1a1a]">
                                                            {d.catalogs.map((c, ci) => (
                                                                <a
                                                                    key={ci}
                                                                    href={c.src}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    download
                                                                    className="bg-[#080808] hover:bg-[#0f0f0f] p-6 flex items-center justify-between group transition-colors"
                                                                    data-testid={`division-${d.key}-catalog-${ci}`}
                                                                >
                                                                    <div>
                                                                        <p className="font-serif text-lg text-white group-hover:text-[#E9B949] transition-colors">{t(c.label)}</p>
                                                                        <p className="mt-1 text-[10px] uppercase tracking-[0.28em] text-gray-500">PDF · {lang === "en" ? "Download" : "Muat Turun"}</p>
                                                                    </div>
                                                                    <div className="w-10 h-10 border border-[#27272A] group-hover:border-[#E9B949] group-hover:bg-[#E9B949] group-hover:text-[#050505] text-gray-500 flex items-center justify-center transition-all duration-500">
                                                                        <Download size={14} />
                                                                    </div>
                                                                </a>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Product showcase (e.g. EV charger) */}
                                                {d.showcase && (
                                                    <div className="mt-10" data-testid={`division-${d.key}-showcase`}>
                                                        <p className="eyebrow mb-5">{lang === "en" ? "Featured Product" : "Produk Pilihan"}</p>
                                                        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 md:gap-10 items-center border border-[#1a1a1a] bg-[#080808] p-6 md:p-8">
                                                            <div className="md:col-span-2">
                                                                <div className="relative aspect-square bg-[#050505] overflow-hidden">
                                                                    <img
                                                                        src={d.showcase.image}
                                                                        alt={t(d.showcase.caption)}
                                                                        className="absolute inset-0 w-full h-full object-cover"
                                                                        loading="lazy"
                                                                    />
                                                                </div>
                                                            </div>
                                                            <div className="md:col-span-3 space-y-4">
                                                                <span className="eyebrow">{lang === "en" ? "Showcase" : "Pameran"}</span>
                                                                <p className="font-serif text-2xl md:text-3xl text-white leading-tight">{t(d.showcase.caption)}</p>
                                                                <div className="pt-4">
                                                                    <a href="#contact" className="btn-armeen-ghost">
                                                                        {lang === "en" ? "Enquire About Installation" : "Bertanya Tentang Pemasangan"}
                                                                        <span>→</span>
                                                                    </a>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Image gallery (e.g. IT division) */}
                                                {d.gallery && (
                                                    <div className="mt-10" data-testid={`division-${d.key}-gallery`}>
                                                        <p className="eyebrow mb-5">{lang === "en" ? "Capability Spotlight" : "Sorotan Keupayaan"}</p>
                                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
                                                            {d.gallery.map((g, gi) => (
                                                                <button
                                                                    type="button"
                                                                    key={gi}
                                                                    onClick={() => setLightbox({ src: g.src, label: t(g.label) })}
                                                                    className={`group relative overflow-hidden border border-[#1a1a1a] bg-[#080808] cursor-zoom-in ${gi === 0 ? "md:col-span-2 aspect-[16/9]" : "aspect-[4/3]"}`}
                                                                    data-testid={`division-${d.key}-gallery-${gi}`}
                                                                    aria-label={t(g.label)}
                                                                >
                                                                    <img
                                                                        src={g.src}
                                                                        alt={t(g.label)}
                                                                        loading="lazy"
                                                                        className="hover-img absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-700"
                                                                    />
                                                                    <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent pointer-events-none"></div>
                                                                    <div className="absolute bottom-0 left-0 right-0 p-4 md:p-5 text-left pointer-events-none">
                                                                        <span className="text-[9px] uppercase tracking-[0.32em] text-[#E9B949]">{String(gi + 1).padStart(2, "0")}</span>
                                                                        <p className="mt-1.5 font-serif text-base md:text-lg text-white leading-tight">{t(g.label)}</p>
                                                                    </div>
                                                                </button>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="md:col-span-3">
                                                <p className="eyebrow mb-5">{lang === "en" ? "Capabilities" : "Keupayaan"}</p>
                                                <ul className="space-y-3">
                                                    {d.bullets.map((b, bi) => (
                                                        <li
                                                            key={bi}
                                                            className="flex items-start gap-3 text-gray-400 font-light text-[15px] leading-snug"
                                                            data-testid={`division-${d.key}-bullet-${bi}`}
                                                        >
                                                            <span className="text-[#E9B949] mt-1.5 flex-shrink-0">—</span>
                                                            <span>{t(b)}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Lightbox */}
            {lightbox && (
                <div
                    className="fixed inset-0 z-[100] bg-[#050505]/95 backdrop-blur-md flex items-center justify-center p-4 md:p-12 cursor-zoom-out"
                    onClick={() => setLightbox(null)}
                    data-testid="services-lightbox"
                    role="dialog"
                    aria-modal="true"
                >
                    <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); setLightbox(null); }}
                        className="absolute top-6 right-6 w-11 h-11 border border-[#E9B949]/60 hover:bg-[#E9B949] hover:text-[#050505] text-[#E9B949] flex items-center justify-center transition-colors"
                        aria-label="Close"
                        data-testid="services-lightbox-close"
                    >
                        <X size={18} />
                    </button>
                    <figure className="max-w-6xl w-full" onClick={(e) => e.stopPropagation()}>
                        <img
                            src={lightbox.src}
                            alt={lightbox.label}
                            className="w-full max-h-[80vh] object-contain border border-[#1a1a1a]"
                            data-testid="services-lightbox-image"
                        />
                        <figcaption className="mt-4 text-center">
                            <span className="eyebrow text-[#E9B949]">{lightbox.label}</span>
                        </figcaption>
                    </figure>
                </div>
            )}
        </section>
    );
};

export default Services;
