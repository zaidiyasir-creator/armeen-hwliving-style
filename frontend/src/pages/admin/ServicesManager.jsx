import React, { useEffect, useState, useRef } from "react";
import { api } from "../../api";
import { content } from "../../i18n";
import { Save, X, RotateCcw, Upload, FileText, Trash2, Image as ImageIcon } from "lucide-react";

const Field = ({ label, children }) => (
    <div>
        <p className="eyebrow mb-3">{label}</p>
        {children}
    </div>
);

const BiInput = ({ value, onChange, type = "input", placeholder = "" }) => {
    const T = type === "textarea" ? "textarea" : "input";
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {["en", "bm"].map((lng) => (
                <T
                    key={lng}
                    rows={type === "textarea" ? 3 : undefined}
                    value={value?.[lng] || ""}
                    onChange={(e) => onChange({ ...value, [lng]: e.target.value })}
                    placeholder={`${placeholder} (${lng.toUpperCase()})`}
                    className="w-full bg-transparent border border-[#27272A] focus:border-[#E9B949] text-white px-3 py-2.5 text-sm outline-none"
                />
            ))}
        </div>
    );
};

const ServicesManager = () => {
    const [overrides, setOverrides] = useState({}); // key -> override
    const [activeKey, setActiveKey] = useState(content.services.divisions[0].key);
    const [draft, setDraft] = useState(null);
    const [msg, setMsg] = useState("");
    const [busy, setBusy] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [uploadingImg, setUploadingImg] = useState(false);
    const fileInputRef = useRef(null);
    const imageInputRef = useRef(null);

    const handleCatalogUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (!/\.pdf$/i.test(file.name)) {
            setMsg("Only PDF files are allowed.");
            e.target.value = "";
            return;
        }
        setUploading(true); setMsg("");
        try {
            const form = new FormData();
            form.append("file", file);
            const { data } = await api.post("/uploads", form, { headers: { "Content-Type": "multipart/form-data" } });
            const niceLabel = file.name.replace(/\.[^.]+$/, "");
            setDraft((d) => ({
                ...d,
                catalogs: [...(d.catalogs || []), { url: data.url, filename: file.name, label: { en: niceLabel, bm: niceLabel } }],
            }));
            setMsg(`Uploaded ${file.name}. Remember to Save changes.`);
        } catch (err) {
            setMsg("Upload failed");
        } finally {
            setUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    };

    const handleImageUpload = async (e) => {
        const files = Array.from(e.target.files || []);
        if (files.length === 0) return;
        const valid = files.filter((f) => /\.(jpe?g|png|webp|gif)$/i.test(f.name));
        if (valid.length === 0) {
            setMsg("Only image files (jpg, png, webp, gif) are allowed.");
            e.target.value = "";
            return;
        }
        setUploadingImg(true); setMsg("");
        try {
            const uploaded = [];
            for (const file of valid) {
                const form = new FormData();
                form.append("file", file);
                const { data } = await api.post("/uploads", form, { headers: { "Content-Type": "multipart/form-data" } });
                const niceLabel = file.name.replace(/\.[^.]+$/, "");
                uploaded.push({ src: data.url, label: { en: niceLabel, bm: niceLabel } });
            }
            setDraft((d) => ({ ...d, gallery: [...(d.gallery || []), ...uploaded] }));
            setMsg(`Uploaded ${uploaded.length} image${uploaded.length > 1 ? "s" : ""}. Remember to Save changes.`);
        } catch (err) {
            setMsg("Image upload failed");
        } finally {
            setUploadingImg(false);
            if (imageInputRef.current) imageInputRef.current.value = "";
        }
    };

    const load = async () => {
        const { data } = await api.get("/services-overrides");
        const map = {};
        data.forEach((o) => { map[o.key] = o; });
        setOverrides(map);
    };
    useEffect(() => { load(); }, []);

    const startEdit = (key) => {
        const division = content.services.divisions.find((d) => d.key === key);
        const ov = overrides[key] || {};
        // Seed catalogs from override if present; otherwise from i18n defaults (mapped to {url, label}).
        let catalogs;
        if (Array.isArray(ov.catalogs)) {
            catalogs = ov.catalogs;
        } else if (Array.isArray(division.catalogs)) {
            catalogs = division.catalogs.map((c) => ({ url: c.src, label: c.label, filename: c.src.split("/").pop() }));
        } else {
            catalogs = [];
        }
        // Seed gallery similarly.
        let gallery;
        if (Array.isArray(ov.gallery)) {
            gallery = ov.gallery;
        } else if (Array.isArray(division.gallery)) {
            gallery = division.gallery;
        } else {
            gallery = [];
        }
        setDraft({
            key,
            title: ov.title || division.title,
            summary: ov.summary || division.summary,
            bullets: ov.bullets || division.bullets,
            catalogs,
            gallery,
        });
        setActiveKey(key);
    };

    useEffect(() => {
        startEdit(activeKey);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [overrides]);

    const save = async () => {
        setBusy(true); setMsg("");
        try {
            await api.put(`/services-overrides/${draft.key}`, draft);
            await load();
            setMsg("Saved.");
        } catch (e) {
            setMsg("Save failed");
        } finally { setBusy(false); }
    };

    const reset = async () => {
        if (!window.confirm("Reset this division to factory defaults?")) return;
        await api.delete(`/services-overrides/${draft.key}`);
        await load();
        setMsg("Reset.");
    };

    if (!draft) return null;

    return (
        <div data-testid="services-manager">
            <div className="flex items-center justify-between mb-8">
                <h2 className="font-serif text-3xl text-white">Services Editor</h2>
            </div>

            {msg && <div className="mb-4 text-[#E9B949] text-sm">{msg}</div>}

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Sidebar division list */}
                <div className="lg:col-span-3 space-y-1" data-testid="services-list">
                    {content.services.divisions.map((d, i) => {
                        const overridden = !!overrides[d.key];
                        return (
                            <button
                                key={d.key}
                                onClick={() => startEdit(d.key)}
                                className={`w-full text-left px-4 py-3 border transition-colors text-sm ${
                                    activeKey === d.key ? "border-[#E9B949] bg-[#E9B949]/5 text-white" : "border-[#1a1a1a] text-gray-400 hover:border-[#27272A]"
                                }`}
                                data-testid={`service-tab-${d.key}`}
                            >
                                <span className="text-[#E9B949] mr-2">{String(i + 1).padStart(2, "0")}</span>
                                {d.title.en}
                                {overridden && <span className="ml-2 text-[9px] text-[#E9B949] uppercase tracking-widest">edited</span>}
                            </button>
                        );
                    })}
                </div>

                {/* Editor */}
                <div className="lg:col-span-9 space-y-6 border border-[#1a1a1a] bg-[#0a0a0a] p-6" data-testid="services-editor">
                    <Field label="Title"><BiInput value={draft.title} onChange={(v) => setDraft({ ...draft, title: v })} placeholder="Division title" /></Field>
                    <Field label="Summary"><BiInput value={draft.summary} onChange={(v) => setDraft({ ...draft, summary: v })} type="textarea" placeholder="Short summary" /></Field>

                    <Field label="Capability Bullets">
                        <div className="space-y-2">
                            {(draft.bullets || []).map((b, i) => (
                                <div key={i} className="flex gap-2">
                                    <BiInput value={b} onChange={(v) => {
                                        const arr = [...draft.bullets]; arr[i] = v; setDraft({ ...draft, bullets: arr });
                                    }} placeholder="Bullet" />
                                    <button onClick={() => setDraft({ ...draft, bullets: draft.bullets.filter((_, idx) => idx !== i) })} className="text-gray-500 hover:text-red-400 px-2"><X size={14} /></button>
                                </div>
                            ))}
                            <button onClick={() => setDraft({ ...draft, bullets: [...draft.bullets, { en: "", bm: "" }] })} className="text-[10px] uppercase tracking-[0.28em] text-[#E9B949] hover:underline">
                                + Add bullet
                            </button>
                        </div>
                    </Field>

                    <Field label="PDF Catalogs">
                        <div className="space-y-3" data-testid="catalogs-editor">
                            {(draft.catalogs || []).length === 0 && (
                                <p className="text-xs text-gray-500 italic">No catalogs yet. Upload a PDF below — visitors will see a download button under this service.</p>
                            )}
                            {(draft.catalogs || []).map((c, i) => (
                                <div key={i} className="border border-[#1a1a1a] bg-[#080808] p-4 space-y-3" data-testid={`catalog-row-${i}`}>
                                    <div className="flex items-center justify-between gap-3">
                                        <a
                                            href={c.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-2 text-sm text-[#E9B949] hover:underline truncate"
                                            data-testid={`catalog-link-${i}`}
                                        >
                                            <FileText size={14} className="flex-shrink-0" />
                                            <span className="truncate">{c.filename || c.url.split("/").pop()}</span>
                                        </a>
                                        <button
                                            type="button"
                                            onClick={() => setDraft({ ...draft, catalogs: draft.catalogs.filter((_, idx) => idx !== i) })}
                                            className="text-gray-500 hover:text-red-400 text-[10px] uppercase tracking-[0.28em] flex items-center gap-1.5 flex-shrink-0"
                                            data-testid={`catalog-delete-${i}`}
                                        >
                                            <Trash2 size={12} /> Remove
                                        </button>
                                    </div>
                                    <BiInput
                                        value={c.label}
                                        onChange={(v) => {
                                            const arr = [...draft.catalogs];
                                            arr[i] = { ...arr[i], label: v };
                                            setDraft({ ...draft, catalogs: arr });
                                        }}
                                        placeholder="Catalog label"
                                    />
                                </div>
                            ))}
                            <div>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="application/pdf,.pdf"
                                    onChange={handleCatalogUpload}
                                    className="hidden"
                                    data-testid="catalog-file-input"
                                />
                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    disabled={uploading}
                                    className="btn-armeen-ghost"
                                    data-testid="catalog-upload-button"
                                >
                                    <Upload size={14} /> {uploading ? "Uploading…" : "Upload PDF Catalog"}
                                </button>
                            </div>
                        </div>
                    </Field>

                    <Field label="Gallery Images">
                        <div className="space-y-3" data-testid="gallery-editor">
                            {(draft.gallery || []).length === 0 && (
                                <p className="text-xs text-gray-500 italic">No gallery images yet. Upload photos below — they will appear in the public Services section under the Capability Spotlight area.</p>
                            )}
                            {(draft.gallery || []).length > 0 && (
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                    {(draft.gallery || []).map((g, i) => (
                                        <div key={i} className="border border-[#1a1a1a] bg-[#080808] overflow-hidden" data-testid={`gallery-row-${i}`}>
                                            <div className="relative aspect-[4/3] bg-[#050505]">
                                                <img src={g.src} alt={g.label?.en || ""} className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
                                                <button
                                                    type="button"
                                                    onClick={() => setDraft({ ...draft, gallery: draft.gallery.filter((_, idx) => idx !== i) })}
                                                    className="absolute top-2 right-2 w-7 h-7 bg-[#050505]/80 hover:bg-red-600 text-white flex items-center justify-center transition-colors"
                                                    data-testid={`gallery-delete-${i}`}
                                                    aria-label="Remove image"
                                                >
                                                    <Trash2 size={12} />
                                                </button>
                                            </div>
                                            <div className="p-2">
                                                <BiInput
                                                    value={g.label}
                                                    onChange={(v) => {
                                                        const arr = [...draft.gallery];
                                                        arr[i] = { ...arr[i], label: v };
                                                        setDraft({ ...draft, gallery: arr });
                                                    }}
                                                    placeholder="Image caption"
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                            <div>
                                <input
                                    ref={imageInputRef}
                                    type="file"
                                    accept="image/jpeg,image/png,image/webp,image/gif"
                                    multiple
                                    onChange={handleImageUpload}
                                    className="hidden"
                                    data-testid="gallery-file-input"
                                />
                                <button
                                    type="button"
                                    onClick={() => imageInputRef.current?.click()}
                                    disabled={uploadingImg}
                                    className="btn-armeen-ghost"
                                    data-testid="gallery-upload-button"
                                >
                                    <ImageIcon size={14} /> {uploadingImg ? "Uploading…" : "Upload Photos"}
                                </button>
                            </div>
                        </div>
                    </Field>

                    <div className="flex items-center gap-3 pt-4 border-t border-[#1a1a1a]">
                        <button onClick={save} disabled={busy} className="btn-armeen"><Save size={14} /> {busy ? "Saving…" : "Save changes"}</button>
                        <button onClick={reset} className="btn-armeen-ghost"><RotateCcw size={14} /> Reset to default</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ServicesManager;
