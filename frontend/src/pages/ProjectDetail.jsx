import React from "react";
import { Link, useParams, Navigate } from "react-router-dom";
import { useLang } from "../components/LanguageContext";
import { findProject, projects } from "../data/projects";
import { ArrowLeft, MapPin, Calendar, Briefcase, Wrench } from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useReveal } from "../hooks/useReveal";

const ProjectDetail = () => {
    const { slug } = useParams();
    const { t, lang } = useLang();
    useReveal();
    const project = findProject(slug);

    if (!project) return <Navigate to="/" replace />;

    const idx = projects.findIndex((p) => p.slug === slug);
    const next = projects[(idx + 1) % projects.length];
    const prev = projects[(idx - 1 + projects.length) % projects.length];

    return (
        <>
            <Header />
            <main className="bg-[#050505]" data-testid="project-detail">
                {/* Cinematic hero */}
                <section className="relative h-[78vh] min-h-[620px] flex items-end overflow-hidden">
                    <img
                        src={project.cover}
                        alt={t(project.title)}
                        className="absolute inset-0 w-full h-full object-cover opacity-70"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-[#050505]/60 via-[#050505]/30 to-[#050505]"></div>
                    <div className="absolute inset-0 grain"></div>

                    <div className="relative max-w-[1400px] mx-auto px-6 md:px-12 pb-20 w-full z-10">
                        <Link to="/#portfolio" className="inline-flex items-center gap-3 text-[11px] uppercase tracking-[0.28em] text-gray-400 hover:text-[#E9B949] transition-colors mb-10" data-testid="back-link">
                            <ArrowLeft size={14} />
                            {lang === "en" ? "Back to Portfolio" : "Kembali ke Portfolio"}
                        </Link>
                        <p className="eyebrow mb-6" data-testid="project-category">{t(project.category)}</p>
                        <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl text-white leading-[1] tracking-[-0.02em] max-w-5xl" data-testid="project-title">
                            {t(project.title)}
                        </h1>
                    </div>
                </section>

                {/* Meta strip */}
                <section className="border-y border-[#1a1a1a]">
                    <div className="max-w-[1400px] mx-auto px-6 md:px-12 grid grid-cols-2 md:grid-cols-4 gap-px bg-[#1a1a1a]">
                        {[
                            { icon: MapPin, label: { en: "Location", bm: "Lokasi" }, value: project.location },
                            { icon: Briefcase, label: { en: "Client", bm: "Pelanggan" }, value: project.client },
                            { icon: Calendar, label: { en: "Year", bm: "Tahun" }, value: project.year },
                            { icon: Wrench, label: { en: "Scope", bm: "Skop" }, value: t(project.scope) },
                        ].map((m, i) => (
                            <div key={i} className="bg-[#050505] p-6 md:p-8" data-testid={`project-meta-${i}`}>
                                <m.icon className="w-4 h-4 text-[#E9B949]" />
                                <p className="eyebrow mt-4">{t(m.label)}</p>
                                <p className="mt-3 font-serif text-base md:text-lg text-white leading-snug">{m.value}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Summary + highlights */}
                <section className="py-24 md:py-32">
                    <div className="max-w-[1400px] mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24">
                        <div className="lg:col-span-7 reveal">
                            <p className="eyebrow mb-6">{lang === "en" ? "Project Brief" : "Ringkasan Projek"}</p>
                            <p className="font-serif text-2xl md:text-3xl text-white leading-relaxed font-light">{t(project.summary)}</p>
                        </div>
                        <div className="lg:col-span-5 reveal">
                            <p className="eyebrow mb-6">{lang === "en" ? "Highlights" : "Sorotan"}</p>
                            <ul className="divide-y divide-[#27272A]">
                                {project.highlights.map((h, i) => (
                                    <li key={i} className="py-5 flex items-baseline gap-5" data-testid={`highlight-${i}`}>
                                        <span className="font-serif text-[#E9B949] text-sm tracking-widest">{String(i + 1).padStart(2, "0")}</span>
                                        <span className="text-gray-300 font-light leading-relaxed">{t(h)}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </section>

                {/* Gallery */}
                <section className="py-16 md:py-24 bg-[#080808] border-y border-[#1a1a1a]" data-testid="project-gallery">
                    <div className="max-w-[1400px] mx-auto px-6 md:px-12">
                        <p className="eyebrow mb-8">{lang === "en" ? "Gallery" : "Galeri"}</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                            {project.gallery.map((src, i) => (
                                <div key={i} className={`relative overflow-hidden group ${i === 0 ? "md:col-span-2 aspect-[21/9]" : "aspect-[4/3]"}`}>
                                    <img
                                        src={src}
                                        alt=""
                                        className="hover-img absolute inset-0 w-full h-full object-cover opacity-85 group-hover:opacity-100 transition-opacity duration-700"
                                        loading="lazy"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Prev / Next */}
                <section className="py-24">
                    <div className="max-w-[1400px] mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-2 gap-12">
                        <Link to={`/projects/${prev.slug}`} className="group" data-testid="prev-project">
                            <p className="eyebrow mb-4">{lang === "en" ? "Previous Project" : "Projek Sebelumnya"}</p>
                            <p className="font-serif text-2xl md:text-3xl text-gray-300 group-hover:text-[#E9B949] transition-colors leading-tight">
                                ← {t(prev.title)}
                            </p>
                        </Link>
                        <Link to={`/projects/${next.slug}`} className="group md:text-right" data-testid="next-project">
                            <p className="eyebrow mb-4">{lang === "en" ? "Next Project" : "Projek Seterusnya"}</p>
                            <p className="font-serif text-2xl md:text-3xl text-gray-300 group-hover:text-[#E9B949] transition-colors leading-tight">
                                {t(next.title)} →
                            </p>
                        </Link>
                    </div>
                </section>
            </main>
            <Footer />
        </>
    );
};

export default ProjectDetail;
