import React from "react";
import { useLang } from "./LanguageContext";
import { content } from "../i18n";

// Generic clients / partners — stylised as elegant editorial logo wall (text-mark based)
const clients = [
    "Bangi Heights Development",
    "DS Consultant",
    "Jurukur Teras",
    "UM Land",
    "Zaharah Kidam Foundation",
    "Masjid Tuanku Ja'afar",
    "BHDSB Group",
];

const testimonialContent = {
    title: { en: "Voices of trust.", bm: "Suara kepercayaan." },
    eyebrow: { en: "Trusted by Discerning Clients", bm: "Dipercayai oleh Pelanggan Bijaksana" },
    quotes: [
        {
            quote: {
                en: "Armeen HW delivered our office build-out at Betaria with the precision and quiet professionalism we expect from senior consulting practices. Timelines met, finish flawless.",
                bm: "Armeen HW menyiapkan ruang pejabat kami di Betaria dengan ketepatan dan profesionalisme yang tenang seperti yang kami harapkan dari praktik konsultansi senior. Tarikh dipatuhi, kemasan tanpa cela.",
            },
            author: "DS Consultant Sdn Bhd",
            role: { en: "Office Build-out, Seremban", bm: "Pembinaan Pejabat, Seremban" },
        },
        {
            quote: {
                en: "Heritage joinery is unforgiving. Their Rumah Gadang craftsmanship at our Jempol resort blended tradition with engineering — a rare standard in today's market.",
                bm: "Joinery warisan tidak pemaaf. Kemahiran Rumah Gadang mereka di resort Jempol kami menggabungkan tradisi dengan kejuruteraan — piawai jarang ditemui di pasaran hari ini.",
            },
            author: "Private Resort Commission",
            role: { en: "Rumah Gadang & Chalets, Jempol", bm: "Rumah Gadang & Chalet, Jempol" },
        },
        {
            quote: {
                en: "From PABX to perimeter civil — having a single accountable partner across construction and ICT saved us months of coordination overhead.",
                bm: "Daripada PABX hingga kerja perimeter awam — mempunyai satu rakan bertanggungjawab merentas pembinaan dan ICT menyelamatkan kami berbulan-bulan kerja penyelarasan.",
            },
            author: "Jurukur Teras Sdn Bhd",
            role: { en: "SPD & Network Programme", bm: "Program SPD & Rangkaian" },
        },
    ],
};

const Testimonials = () => {
    const { t } = useLang();
    return (
        <section id="testimonials" className="relative py-28 md:py-40 bg-[#050505]/40 backdrop-blur-[1px]" data-testid="testimonials-section">
            <div className="max-w-[1400px] mx-auto px-6 md:px-12">
                <div className="max-w-3xl reveal">
                    <p className="eyebrow mb-6">{t(testimonialContent.eyebrow)}</p>
                    <h2 className="font-serif text-4xl md:text-5xl text-white leading-[1.05]" data-testid="testimonials-title">
                        {t(testimonialContent.title)}
                    </h2>
                </div>

                {/* Quotes */}
                <div className="mt-16 grid grid-cols-1 lg:grid-cols-3 gap-px bg-[#1a1a1a]" data-testid="testimonials-grid">
                    {testimonialContent.quotes.map((q, i) => (
                        <div key={i} className="bg-[#050505] p-10 group hover:bg-[#0c0c0c] transition-colors duration-500" data-testid={`testimonial-${i}`}>
                            <span className="font-serif text-6xl text-[#E9B949] leading-none">“</span>
                            <p className="mt-4 font-serif text-xl md:text-[22px] text-gray-200 italic leading-snug">
                                {t(q.quote)}
                            </p>
                            <div className="mt-10 pt-6 border-t border-[#27272A]">
                                <p className="text-white text-sm font-medium tracking-wide">{q.author}</p>
                                <p className="mt-2 text-[10px] uppercase tracking-[0.28em] text-gray-500">{t(q.role)}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Client wall */}
                <div className="mt-24">
                    <p className="eyebrow text-center mb-10">— {t({ en: "Selected Clients & Partners", bm: "Pelanggan & Rakan Pilihan" })} —</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 items-center justify-items-center gap-6 md:gap-10 opacity-70" data-testid="client-wall">
                        {clients.map((c, i) => (
                            <span
                                key={i}
                                className="font-serif text-sm md:text-base text-gray-400 hover:text-[#E9B949] transition-colors duration-500 text-center tracking-wide italic"
                                data-testid={`client-${i}`}
                            >
                                {c}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Testimonials;
