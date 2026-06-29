import React, { useEffect, useState } from "react";
import { api } from "../../api";
import { Save, Loader2, CheckCircle2, RotateCcw, Phone, Mail, MapPin, Clock } from "lucide-react";

const DEFAULTS = {
    phone_primary: "019-336 7316",
    phone_secondary: "013-336 7316",
    email: "armeeniza@gmail.com",
    address: "No. 21, Tingkat 1, Jalan Durian Emas,\nBetaria Business Center,\n70100 Seremban, Negeri Sembilan Darul Khusus, Malaysia",
    hours_en: "Monday — Saturday · 09:00 — 18:00",
    hours_bm: "Isnin — Sabtu · 09:00 — 18:00",
};

const Field = ({ label, icon: Icon, children, hint }) => (
    <div>
        <div className="flex items-center gap-2 mb-3">
            {Icon && <Icon size={12} className="text-[#E9B949]" />}
            <label className="eyebrow">{label}</label>
        </div>
        {children}
        {hint && <p className="mt-2 text-[11px] text-gray-600">{hint}</p>}
    </div>
);

const Input = (props) => (
    <input
        type="text"
        {...props}
        className="w-full bg-transparent border border-[#27272A] focus:border-[#E9B949] text-white px-3 py-3 outline-none text-sm transition-colors"
    />
);

const Textarea = (props) => (
    <textarea
        rows={4}
        {...props}
        className="w-full bg-transparent border border-[#27272A] focus:border-[#E9B949] text-white px-3 py-3 outline-none text-sm transition-colors font-light leading-relaxed"
    />
);

const ContactManager = () => {
    const [contact, setContact] = useState({});
    const [busy, setBusy] = useState(false);
    const [msg, setMsg] = useState("");

    const load = async () => {
        try {
            const { data } = await api.get("/site-settings");
            setContact(data?.contact || {});
        } catch (e) {
            setMsg("Failed to load contact settings.");
        }
    };

    useEffect(() => { load(); }, []);

    const set = (k, v) => setContact((c) => ({ ...c, [k]: v }));

    const resetToDefaults = () => {
        setContact(DEFAULTS);
        setMsg('Defaults restored. Click "Save Changes" to publish.');
    };

    const save = async () => {
        setBusy(true); setMsg("");
        try {
            await api.put("/site-settings", { contact });
            setMsg("Saved.");
            await load();
        } catch (e) {
            setMsg("Save failed.");
        } finally {
            setBusy(false);
        }
    };

    return (
        <div data-testid="contact-manager" className="max-w-3xl">
            <div className="mb-10">
                <p className="eyebrow mb-3">Contact Section</p>
                <h2 className="font-serif text-3xl md:text-4xl text-white">Contact Information</h2>
                <p className="mt-3 text-gray-400 text-sm">
                    Edit the phone, email, registered office address and operating hours displayed on the public Contact section. Changes publish instantly after Save.
                </p>
            </div>

            <div className="border border-[#1a1a1a] bg-[#080808] p-6 md:p-8 space-y-7">
                <Field label="Primary Phone" icon={Phone} hint="Shown first. Tel link auto-uses the digits.">
                    <Input
                        value={contact.phone_primary ?? DEFAULTS.phone_primary}
                        onChange={(e) => set("phone_primary", e.target.value)}
                        placeholder={DEFAULTS.phone_primary}
                        data-testid="contact-phone-primary"
                    />
                </Field>

                <Field label="Secondary Phone" icon={Phone} hint="Optional — leave blank to hide.">
                    <Input
                        value={contact.phone_secondary ?? DEFAULTS.phone_secondary}
                        onChange={(e) => set("phone_secondary", e.target.value)}
                        placeholder={DEFAULTS.phone_secondary}
                        data-testid="contact-phone-secondary"
                    />
                </Field>

                <Field label="Correspondence Email" icon={Mail}>
                    <Input
                        type="email"
                        value={contact.email ?? DEFAULTS.email}
                        onChange={(e) => set("email", e.target.value)}
                        placeholder={DEFAULTS.email}
                        data-testid="contact-email"
                    />
                </Field>

                <Field label="Registered Office" icon={MapPin} hint="Line breaks preserved on the public site.">
                    <Textarea
                        value={contact.address ?? DEFAULTS.address}
                        onChange={(e) => set("address", e.target.value)}
                        placeholder={DEFAULTS.address}
                        data-testid="contact-address"
                    />
                </Field>

                <Field label="Operating Hours (English)" icon={Clock}>
                    <Input
                        value={contact.hours_en ?? DEFAULTS.hours_en}
                        onChange={(e) => set("hours_en", e.target.value)}
                        placeholder={DEFAULTS.hours_en}
                        data-testid="contact-hours-en"
                    />
                </Field>

                <Field label="Operating Hours (Bahasa Malaysia)" icon={Clock}>
                    <Input
                        value={contact.hours_bm ?? DEFAULTS.hours_bm}
                        onChange={(e) => set("hours_bm", e.target.value)}
                        placeholder={DEFAULTS.hours_bm}
                        data-testid="contact-hours-bm"
                    />
                </Field>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-3">
                <button type="button" onClick={save} disabled={busy} className="btn-armeen" data-testid="save-contact-settings">
                    {busy ? <><Loader2 size={14} className="animate-spin" /> Saving…</> : <><Save size={14} /> Save Changes</>}
                </button>
                <button type="button" onClick={resetToDefaults} className="btn-armeen-ghost" data-testid="reset-contact-defaults">
                    <RotateCcw size={14} /> Restore Defaults
                </button>
                {msg && (
                    <div className="border border-[#E9B949]/30 bg-[#E9B949]/5 text-[#E9B949] text-sm px-4 py-3 flex items-center gap-2" data-testid="contact-manager-msg">
                        <CheckCircle2 size={14} /> {msg}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ContactManager;
