import React, { useEffect, useRef, useState } from "react";
import { api } from "../../api";
import { Save, Loader2, CheckCircle2, RotateCcw, Plus, Trash2, Upload, Image as ImageIcon, ArrowUp, ArrowDown } from "lucide-react";

const DEFAULTS = [
    {
        name: "IZH Padu Resources Sdn. Bhd.",
        href: "https://www.izhpadu.com",
        display: { en: "www.izhpadu.com", bm: "www.izhpadu.com" },
        domain: { en: "ICT Solutions Provider", bm: "Penyedia Penyelesaian ICT" },
        monogram: "IZ",
        logo: "",
        logo_transparent: false,
    },
    {
        name: "HM Geomatics Sdn. Bhd.",
        href: "http://www.ljt.org.my/search-surveyors-prt/practices/HM%20GEOMATICS%20SDN%20BHD",
        display: { en: "Licensed Land Surveyors · Seremban", bm: "Juruukur Tanah Berlesen · Seremban" },
        domain: { en: "Licensed Land Survey", bm: "Ukur Tanah Berlesen" },
        logo: "/armeen/partners/hmgeomatics.png",
        logo_transparent: true,
        monogram: "",
    },
];

const Eyebrow = ({ children }) => <p className="eyebrow mb-2">{children}</p>;

const Input = (props) => (
    <input
        type="text"
        {...props}
        className="w-full bg-transparent border border-[#27272A] focus:border-[#E9B949] text-white px-3 py-2.5 outline-none text-sm transition-colors"
    />
);

const BiInput = ({ value, onChange, placeholder }) => (
    <div className="grid grid-cols-2 gap-2">
        <Input value={value?.en || ""} onChange={(e) => onChange({ ...(value || {}), en: e.target.value })} placeholder={`EN ${placeholder || ""}`} />
        <Input value={value?.bm || ""} onChange={(e) => onChange({ ...(value || {}), bm: e.target.value })} placeholder={`BM ${placeholder || ""}`} />
    </div>
);

const PartnerCard = ({ partner, index, total, onChange, onDelete, onMove }) => {
    const fileRef = useRef(null);
    const [uploading, setUploading] = useState(false);

    const handleLogo = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (!/\.(jpe?g|png|webp|gif|svg)$/i.test(file.name)) {
            alert("Logo must be an image (jpg, png, webp, gif, svg).");
            e.target.value = "";
            return;
        }
        setUploading(true);
        try {
            const form = new FormData();
            form.append("file", file);
            const { data } = await api.post("/uploads", form, { headers: { "Content-Type": "multipart/form-data" } });
            onChange({ ...partner, logo: data.url, logo_transparent: /\.png$/i.test(file.name) });
        } catch {
            alert("Upload failed");
        } finally {
            setUploading(false);
            if (fileRef.current) fileRef.current.value = "";
        }
    };

    return (
        <div className="border border-[#1a1a1a] bg-[#080808] p-5 md:p-6 space-y-4 relative" data-testid={`partner-row-${index}`}>
            <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase tracking-[0.32em] text-[#E9B949]">{String(index + 1).padStart(2, "0")}</span>
                    <span className="text-xs text-gray-500">Partner</span>
                </div>
                <div className="flex items-center gap-1">
                    <button type="button" onClick={() => onMove(index, -1)} disabled={index === 0} className="w-7 h-7 border border-[#27272A] hover:border-[#E9B949] text-gray-400 hover:text-[#E9B949] flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed transition-colors" data-testid={`partner-up-${index}`} title="Move up"><ArrowUp size={12} /></button>
                    <button type="button" onClick={() => onMove(index, 1)} disabled={index === total - 1} className="w-7 h-7 border border-[#27272A] hover:border-[#E9B949] text-gray-400 hover:text-[#E9B949] flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed transition-colors" data-testid={`partner-down-${index}`} title="Move down"><ArrowDown size={12} /></button>
                    <button type="button" onClick={() => onDelete(index)} className="w-7 h-7 border border-red-900/40 hover:bg-red-600 text-red-300 hover:text-white flex items-center justify-center transition-colors ml-2" data-testid={`partner-delete-${index}`} title="Delete partner"><Trash2 size={12} /></button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
                {/* Logo */}
                <div className="md:col-span-3">
                    <Eyebrow>Logo</Eyebrow>
                    <div className={`relative w-24 h-24 border border-[#E9B949]/20 flex items-center justify-center mb-3 ${partner.logo_transparent ? "bg-[#050505]" : "bg-white"}`}>
                        {partner.logo ? (
                            <img src={partner.logo} alt="" className="max-w-full max-h-full object-contain p-2" />
                        ) : partner.monogram ? (
                            <span className="font-serif text-2xl text-[#E9B949] italic">{partner.monogram}</span>
                        ) : (
                            <ImageIcon size={20} className="text-gray-600" />
                        )}
                    </div>
                    <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml" onChange={handleLogo} className="hidden" data-testid={`partner-logo-input-${index}`} />
                    <div className="flex flex-col gap-2">
                        <button type="button" onClick={() => fileRef.current?.click()} disabled={uploading} className="btn-armeen-ghost text-[10px]" data-testid={`partner-upload-logo-${index}`}>
                            {uploading ? <><Loader2 size={12} className="animate-spin" /> Uploading…</> : <><Upload size={12} /> {partner.logo ? "Replace" : "Upload"}</>}
                        </button>
                        {partner.logo && (
                            <button type="button" onClick={() => onChange({ ...partner, logo: "" })} className="text-[10px] uppercase tracking-[0.28em] text-gray-500 hover:text-red-400" data-testid={`partner-clear-logo-${index}`}>
                                Clear logo
                            </button>
                        )}
                        <label className="flex items-center gap-2 text-[11px] text-gray-400 mt-1">
                            <input
                                type="checkbox"
                                checked={!!partner.logo_transparent}
                                onChange={(e) => onChange({ ...partner, logo_transparent: e.target.checked })}
                                className="accent-[#E9B949]"
                                data-testid={`partner-transparent-${index}`}
                            />
                            Transparent logo
                        </label>
                    </div>
                </div>

                {/* Fields */}
                <div className="md:col-span-9 space-y-4">
                    <div>
                        <Eyebrow>Monogram fallback</Eyebrow>
                        <Input value={partner.monogram || ""} onChange={(e) => onChange({ ...partner, monogram: e.target.value })} placeholder="e.g. IZ (used if no logo uploaded)" data-testid={`partner-monogram-${index}`} />
                    </div>
                    <div>
                        <Eyebrow>Company Name</Eyebrow>
                        <Input value={partner.name || ""} onChange={(e) => onChange({ ...partner, name: e.target.value })} placeholder="e.g. ABC Sdn. Bhd." data-testid={`partner-name-${index}`} />
                    </div>
                    <div>
                        <Eyebrow>Role / Specialty (EN / BM)</Eyebrow>
                        <BiInput value={partner.domain} onChange={(v) => onChange({ ...partner, domain: v })} placeholder="role" />
                    </div>
                    <div>
                        <Eyebrow>Subtitle / URL Text (EN / BM)</Eyebrow>
                        <BiInput value={partner.display} onChange={(v) => onChange({ ...partner, display: v })} placeholder="subtitle" />
                    </div>
                    <div>
                        <Eyebrow>Visit Partner Site URL</Eyebrow>
                        <Input type="url" value={partner.href || ""} onChange={(e) => onChange({ ...partner, href: e.target.value })} placeholder="https://…" data-testid={`partner-href-${index}`} />
                    </div>
                </div>
            </div>
        </div>
    );
};

const PartnersManager = () => {
    const [partners, setPartners] = useState([]);
    const [busy, setBusy] = useState(false);
    const [msg, setMsg] = useState("");

    const load = async () => {
        try {
            const { data } = await api.get("/site-settings");
            const fromCMS = Array.isArray(data?.partners) && data.partners.length > 0 ? data.partners : DEFAULTS;
            setPartners(fromCMS);
        } catch {
            setPartners(DEFAULTS);
            setMsg("Failed to load. Showing defaults.");
        }
    };
    useEffect(() => { load(); }, []);

    const update = (i, p) => setPartners((arr) => arr.map((x, idx) => (idx === i ? p : x)));
    const remove = (i) => setPartners((arr) => arr.filter((_, idx) => idx !== i));
    const add = () => setPartners((arr) => [...arr, { name: "", href: "", display: { en: "", bm: "" }, domain: { en: "Strategic Partner", bm: "Rakan Strategik" }, monogram: "", logo: "", logo_transparent: false }]);
    const move = (i, dir) => setPartners((arr) => {
        const j = i + dir;
        if (j < 0 || j >= arr.length) return arr;
        const next = arr.slice();
        [next[i], next[j]] = [next[j], next[i]];
        return next;
    });

    const save = async () => {
        setBusy(true); setMsg("");
        try {
            await api.put("/site-settings", { partners });
            setMsg("Saved.");
            await load();
        } catch {
            setMsg("Save failed.");
        } finally { setBusy(false); }
    };

    return (
        <div data-testid="partners-manager" className="max-w-5xl">
            <div className="mb-10">
                <p className="eyebrow mb-3">Strategic Alliance</p>
                <h2 className="font-serif text-3xl md:text-4xl text-white">Partner Companies</h2>
                <p className="mt-3 text-gray-400 text-sm">
                    Add, edit, reorder or remove strategic partner cards. Logos with transparent backgrounds (PNG/SVG) render on dark; opaque logos render on white. Changes publish instantly after Save.
                </p>
            </div>

            <div className="space-y-4 mb-6">
                {partners.map((p, i) => (
                    <PartnerCard
                        key={i}
                        partner={p}
                        index={i}
                        total={partners.length}
                        onChange={(np) => update(i, np)}
                        onDelete={remove}
                        onMove={move}
                    />
                ))}
                {partners.length === 0 && (
                    <p className="text-gray-500 text-sm italic border border-dashed border-[#1a1a1a] px-6 py-10 text-center">No partners. Click Add Partner below to create your first one.</p>
                )}
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-[#1a1a1a]">
                <button type="button" onClick={add} className="btn-armeen-ghost" data-testid="add-partner-button">
                    <Plus size={14} /> Add Partner
                </button>
                <button type="button" onClick={save} disabled={busy} className="btn-armeen" data-testid="save-partners">
                    {busy ? <><Loader2 size={14} className="animate-spin" /> Saving…</> : <><Save size={14} /> Save Changes</>}
                </button>
                <button type="button" onClick={() => { setPartners(DEFAULTS); setMsg('Defaults restored. Click "Save Changes" to publish.'); }} className="btn-armeen-ghost" data-testid="reset-partners">
                    <RotateCcw size={14} /> Restore Defaults
                </button>
                {msg && (
                    <div className="border border-[#E9B949]/30 bg-[#E9B949]/5 text-[#E9B949] text-sm px-4 py-3 flex items-center gap-2" data-testid="partners-manager-msg">
                        <CheckCircle2 size={14} /> {msg}
                    </div>
                )}
            </div>
        </div>
    );
};

export default PartnersManager;
