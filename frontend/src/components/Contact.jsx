import React from "react";
import { useLang } from "./LanguageContext";
import { content } from "../i18n";
import { Phone, Mail, MapPin, Clock } from "lucide-react";

const Contact = () => {
    const { t, lang } = useLang();
    return (
        <section id="contact" className="relative py-28 md:py-40 bg-[#080808] border-t border-[#1a1a1a]" data-testid="contact-section">
            <div className="absolute inset-0 opacity-30">
                <img
                    src="https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=crop&w=2000&q=80"
                    alt=""
                    className="w-full h-full object-cover grayscale"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-[#080808] via-[#080808]/85 to-[#080808]"></div>
            </div>

            <div className="relative max-w-[1400px] mx-auto px-6 md:px-12">
                <div className="max-w-4xl reveal">
                    <p className="eyebrow mb-6">{t(content.contact.eyebrow)}</p>
                    <h2 className="font-serif text-5xl md:text-7xl text-white leading-[1] tracking-[-0.01em]" data-testid="contact-title">
                        {t(content.contact.title)}
                    </h2>
                    <p className="mt-10 max-w-2xl text-gray-400 font-light text-lg leading-relaxed">{t(content.contact.sub)}</p>
                </div>

                <div className="mt-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-[#1a1a1a]" data-testid="contact-grid">
                    <div className="bg-[#080808] p-8 group hover:bg-[#0f0f0f] transition-colors">
                        <Phone className="w-5 h-5 text-[#E9B949]" />
                        <p className="eyebrow mt-6">{t(content.contact.phone_label)}</p>
                        <a href="tel:+60193367316" className="block mt-4 font-serif text-xl text-white hover:text-[#E9B949] transition-colors" data-testid="contact-phone-1">019-336 7316</a>
                        <a href="tel:+60133367316" className="block mt-1 font-serif text-xl text-gray-300 hover:text-[#E9B949] transition-colors" data-testid="contact-phone-2">013-336 7316</a>
                    </div>
                    <div className="bg-[#080808] p-8 group hover:bg-[#0f0f0f] transition-colors">
                        <Mail className="w-5 h-5 text-[#E9B949]" />
                        <p className="eyebrow mt-6">{t(content.contact.email_label)}</p>
                        <a href="mailto:armeeniza@gmail.com" className="block mt-4 font-serif text-xl text-white hover:text-[#E9B949] transition-colors break-all" data-testid="contact-email">armeeniza@gmail.com</a>
                    </div>
                    <div className="bg-[#080808] p-8 group hover:bg-[#0f0f0f] transition-colors md:col-span-2 lg:col-span-1">
                        <MapPin className="w-5 h-5 text-[#E9B949]" />
                        <p className="eyebrow mt-6">{t(content.contact.office_label)}</p>
                        <p className="mt-4 text-white font-light leading-relaxed whitespace-pre-line text-sm" data-testid="contact-address">
                            {content.contact.office}
                        </p>
                    </div>
                    <div className="bg-[#080808] p-8 group hover:bg-[#0f0f0f] transition-colors">
                        <Clock className="w-5 h-5 text-[#E9B949]" />
                        <p className="eyebrow mt-6">{t(content.contact.hours_label)}</p>
                        <p className="mt-4 font-serif text-xl text-white leading-tight" data-testid="contact-hours">{t(content.contact.hours)}</p>
                    </div>
                </div>

                {/* Google Maps embed */}
                <div className="mt-12 relative border border-[#1a1a1a]" data-testid="contact-map">
                    <p className="eyebrow absolute -top-3 left-6 bg-[#080808] px-3 z-10">
                        {lang === "en" ? "Find Us" : "Cari Kami"}
                    </p>
                    <iframe
                        title="Armeen HW Enterprise — Seremban office"
                        src="https://www.google.com/maps?q=Betaria+Business+Center,+Jalan+Durian+Emas,+70100+Seremban,+Negeri+Sembilan&output=embed"
                        className="w-full h-[420px] grayscale-[0.85] contrast-125 brightness-75 hover:grayscale-0 hover:brightness-100 transition-all duration-1000"
                        style={{ border: 0, filter: "invert(0.85) hue-rotate(180deg) contrast(0.95)" }}
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        allowFullScreen
                    ></iframe>
                </div>
            </div>
        </section>
    );
};

export default Contact;
