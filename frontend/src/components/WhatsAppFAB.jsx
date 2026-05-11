import React, { useState, useEffect } from "react";
import { useLang } from "./LanguageContext";
import { MessageCircle, X } from "lucide-react";

const phone = "60193367316";

const WhatsAppFAB = () => {
    const { lang } = useLang();
    const [open, setOpen] = useState(false);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const t = setTimeout(() => setVisible(true), 1800);
        return () => clearTimeout(t);
    }, []);

    const message = encodeURIComponent(
        lang === "en"
            ? "Hello Armeen HW Enterprise — I would like to enquire about your services."
            : "Salam Armeen HW Enterprise — saya ingin bertanya mengenai perkhidmatan anda.",
    );

    const labels = {
        teaser: lang === "en" ? "Chat with our team" : "Berbual dengan kami",
        title: lang === "en" ? "Reach us on WhatsApp" : "Hubungi kami di WhatsApp",
        body:
            lang === "en"
                ? "Our team typically replies within the working day. Tap below to start the conversation."
                : "Pasukan kami biasanya membalas dalam hari bekerja. Klik di bawah untuk mula berbual.",
        cta: lang === "en" ? "Start Chat" : "Mulakan Sembang",
        meta: lang === "en" ? "Mon — Sat · 09:00 – 18:00" : "Isnin — Sabtu · 09:00 – 18:00",
    };

    return (
        <div className={`fixed bottom-6 right-6 z-[60] transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"}`} data-testid="whatsapp-fab-wrapper">
            {/* Expanded card */}
            {open && (
                <div className="mb-4 w-[300px] bg-[#0a0a0a] border border-[#E9B949]/30 backdrop-blur-xl p-6 shadow-2xl" data-testid="whatsapp-card">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="eyebrow text-[10px]">{labels.title}</p>
                            <p className="mt-3 text-gray-300 font-light text-sm leading-relaxed">{labels.body}</p>
                        </div>
                        <button
                            onClick={() => setOpen(false)}
                            className="text-gray-500 hover:text-white transition"
                            aria-label="close"
                            data-testid="whatsapp-close"
                        >
                            <X size={18} />
                        </button>
                    </div>
                    <a
                        href={`https://wa.me/${phone}?text=${message}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-6 w-full inline-flex items-center justify-center gap-3 py-3 border border-[#E9B949] text-[#E9B949] text-[11px] uppercase tracking-[0.22em] font-medium hover:bg-[#E9B949] hover:text-[#050505] transition-colors"
                        data-testid="whatsapp-start-chat"
                    >
                        <MessageCircle size={14} />
                        {labels.cta}
                    </a>
                    <p className="mt-4 text-[10px] uppercase tracking-[0.28em] text-gray-600 text-center">{labels.meta}</p>
                </div>
            )}

            {/* FAB button */}
            <button
                onClick={() => setOpen(!open)}
                aria-label="WhatsApp"
                className="group relative flex items-center gap-3 pl-5 pr-6 py-4 bg-[#E9B949] text-[#050505] hover:bg-[#d4a338] transition-all duration-500 shadow-2xl shadow-[#E9B949]/20"
                data-testid="whatsapp-fab"
            >
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-[#E9B949] rounded-full animate-ping opacity-75"></span>
                <svg viewBox="0 0 32 32" className="w-5 h-5 fill-current">
                    <path d="M16.003 3C9.382 3 4 8.382 4 15.003c0 2.116.554 4.183 1.607 6.005L4 29l8.165-1.572a11.96 11.96 0 0 0 3.835.633h.003c6.62 0 12.003-5.383 12.003-12.004 0-3.205-1.247-6.218-3.514-8.485A11.92 11.92 0 0 0 16.003 3zm0 21.83a9.84 9.84 0 0 1-5.012-1.376l-.359-.214-4.844.933.967-4.722-.234-.371a9.83 9.83 0 0 1-1.509-5.077c0-5.448 4.434-9.881 9.886-9.881 2.64 0 5.119 1.029 6.988 2.898a9.81 9.81 0 0 1 2.895 6.989c-.001 5.448-4.434 9.821-9.778 9.821zm5.422-7.358c-.297-.149-1.757-.867-2.029-.966-.272-.099-.471-.149-.67.149-.198.297-.768.965-.94 1.163-.173.198-.347.223-.644.075-.297-.149-1.255-.463-2.39-1.475-.883-.788-1.479-1.761-1.652-2.058-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.149-.173.198-.297.297-.495.099-.198.05-.371-.025-.52-.074-.148-.67-1.615-.917-2.21-.242-.582-.487-.503-.67-.512-.173-.008-.371-.01-.57-.01a1.1 1.1 0 0 0-.8.371c-.272.297-1.039 1.015-1.039 2.477 0 1.461 1.064 2.872 1.213 3.07.149.198 2.097 3.2 5.077 4.487.71.305 1.263.487 1.695.624.712.227 1.36.194 1.871.118.571-.085 1.757-.717 2.005-1.41.248-.694.248-1.288.173-1.41-.074-.124-.272-.198-.57-.347z" />
                </svg>
                <span className="text-[11px] uppercase tracking-[0.22em] font-semibold whitespace-nowrap">{labels.teaser}</span>
            </button>
        </div>
    );
};

export default WhatsAppFAB;
