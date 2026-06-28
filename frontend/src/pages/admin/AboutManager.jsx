import React, { useEffect, useRef, useState } from "react";
import { api } from "../../api";
import { Upload, FileText, Trash2, Save, Loader2, CheckCircle2, Image as ImageIcon } from "lucide-react";

const BiInput = ({ value, onChange, placeholder }) => (
    <div className="grid grid-cols-2 gap-2">
        <input
            type="text"
            value={value?.en || ""}
            onChange={(e) => onChange({ ...(value || {}), en: e.target.value })}
            placeholder={`EN ${placeholder || ""}`}
            className="bg-transparent border border-[#27272A] focus:border-[#E9B949] text-white text-xs px-2 py-2 outline-none"
        />
        <input
            type="text"
            value={value?.bm || ""}
            onChange={(e) => onChange({ ...(value || {}), bm: e.target.value })}
            placeholder={`BM ${placeholder || ""}`}
            className="bg-transparent border border-[#27272A] focus:border-[#E9B949] text-white text-xs px-2 py-2 outline-none"
        />
    </div>
);

const AboutManager = () => {
    const [settings, setSettings] = useState({});
    const [busy, setBusy] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [uploadingImg, setUploadingImg] = useState(false);
    const [msg, setMsg] = useState("");
    const fileInputRef = useRef(null);
    const imageInputRef = useRef(null);

    const load = async () => {
        try {
            const { data } = await api.get("/site-settings");
            setSettings(data || {});
        } catch (e) {
            setMsg("Failed to load settings.");
        }
    };

    useEffect(() => { load(); }, []);

    const handleUpload = async (e) => {
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
            setSettings((s) => ({ ...s, company_profile_url: data.url, company_profile_filename: file.name }));
            setMsg(`Uploaded ${file.name}. Click "Save changes" to publish.`);
        } catch (err) {
            setMsg("Upload failed.");
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
            setSettings((s) => ({ ...s, about_gallery: [...(s.about_gallery || []), ...uploaded] }));
            setMsg(`Uploaded ${uploaded.length} photo${uploaded.length > 1 ? "s" : ""}. Click "Save changes" to publish.`);
        } catch (err) {
            setMsg("Image upload failed.");
        } finally {
            setUploadingImg(false);
            if (imageInputRef.current) imageInputRef.current.value = "";
        }
    };

    const handleRemovePdf = () => {
        setSettings((s) => ({ ...s, company_profile_url: "", company_profile_filename: "" }));
        setMsg('Removed. Click "Save changes" to publish.');
    };

    const save = async () => {
        setBusy(true); setMsg("");
        try {
            await api.put("/site-settings", {
                company_profile_url: settings.company_profile_url || "",
                company_profile_filename: settings.company_profile_filename || "",
                about_gallery: settings.about_gallery || [],
            });
            setMsg("Saved.");
            await load();
        } catch (e) {
            setMsg("Save failed.");
        } finally {
            setBusy(false);
        }
    };

    return (
        <div data-testid="about-manager" className="max-w-4xl">
            <div className="mb-10">
                <p className="eyebrow mb-3">About Section</p>
                <h2 className="font-serif text-3xl md:text-4xl text-white">Manage About Content</h2>
                <p className="mt-3 text-gray-400 text-sm">
                    Upload the company profile PDF and the photos that appear in the About section on the public site. All changes publish instantly after Save.
                </p>
            </div>

            {/* Company Profile PDF */}
            <div className="border border-[#1a1a1a] bg-[#080808] p-6 md:p-8 space-y-6 mb-8">
                <div>
                    <p className="eyebrow mb-3">Company Profile PDF</p>
                    {settings.company_profile_url ? (
                        <a
                            href={settings.company_profile_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-3 text-[#E9B949] hover:underline"
                            data-testid="current-company-profile"
                        >
                            <FileText size={16} />
                            <span>{settings.company_profile_filename || settings.company_profile_url.split("/").pop()}</span>
                        </a>
                    ) : (
                        <p className="text-gray-500 text-sm italic">
                            No file uploaded yet. Public site is using the default <code className="text-gray-400">/armeen/company-profile.pdf</code>.
                        </p>
                    )}
                </div>

                <div className="border-t border-[#1a1a1a] pt-6 flex flex-wrap gap-3">
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="application/pdf,.pdf"
                        onChange={handleUpload}
                        className="hidden"
                        data-testid="about-pdf-input"
                    />
                    <button type="button" onClick={() => fileInputRef.current?.click()} disabled={uploading} className="btn-armeen-ghost" data-testid="upload-company-profile">
                        {uploading ? <><Loader2 size={14} className="animate-spin" /> Uploading…</> : <><Upload size={14} /> Upload New PDF</>}
                    </button>
                    {settings.company_profile_url && (
                        <button type="button" onClick={handleRemovePdf} className="btn-armeen-ghost text-red-300 border-red-900/40 hover:border-red-500" data-testid="remove-company-profile">
                            <Trash2 size={14} /> Remove
                        </button>
                    )}
                </div>
            </div>

            {/* About Gallery Photos */}
            <div className="border border-[#1a1a1a] bg-[#080808] p-6 md:p-8 space-y-6 mb-8">
                <div>
                    <p className="eyebrow mb-3">About Section Photos</p>
                    <p className="text-gray-500 text-xs">
                        These photos display as a gallery strip in the public About section (below the intro, above the stats). Recommended: 3–6 high-quality landscape photos.
                    </p>
                </div>

                {(settings.about_gallery || []).length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3" data-testid="about-gallery-grid">
                        {(settings.about_gallery || []).map((g, i) => (
                            <div key={i} className="border border-[#1a1a1a] bg-[#050505] overflow-hidden" data-testid={`about-gallery-item-${i}`}>
                                <div className="relative aspect-[4/3]">
                                    <img src={g.src} alt={g.label?.en || ""} className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
                                    <button
                                        type="button"
                                        onClick={() => setSettings((s) => ({ ...s, about_gallery: s.about_gallery.filter((_, idx) => idx !== i) }))}
                                        className="absolute top-2 right-2 w-7 h-7 bg-[#050505]/80 hover:bg-red-600 text-white flex items-center justify-center transition-colors"
                                        data-testid={`about-gallery-delete-${i}`}
                                        aria-label="Remove photo"
                                    >
                                        <Trash2 size={12} />
                                    </button>
                                </div>
                                <div className="p-2">
                                    <BiInput
                                        value={g.label}
                                        onChange={(v) => {
                                            const arr = [...settings.about_gallery];
                                            arr[i] = { ...arr[i], label: v };
                                            setSettings((s) => ({ ...s, about_gallery: arr }));
                                        }}
                                        placeholder="caption"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {(settings.about_gallery || []).length === 0 && (
                    <p className="text-gray-500 text-sm italic">No photos uploaded yet.</p>
                )}

                <div className="border-t border-[#1a1a1a] pt-6">
                    <input
                        ref={imageInputRef}
                        type="file"
                        accept="image/jpeg,image/png,image/webp,image/gif"
                        multiple
                        onChange={handleImageUpload}
                        className="hidden"
                        data-testid="about-photo-input"
                    />
                    <button type="button" onClick={() => imageInputRef.current?.click()} disabled={uploadingImg} className="btn-armeen-ghost" data-testid="upload-about-photos">
                        {uploadingImg ? <><Loader2 size={14} className="animate-spin" /> Uploading…</> : <><ImageIcon size={14} /> Upload Photos</>}
                    </button>
                </div>
            </div>

            {/* Save bar */}
            <div className="flex items-center gap-3">
                <button type="button" onClick={save} disabled={busy} className="btn-armeen" data-testid="save-about-settings">
                    {busy ? <><Loader2 size={14} className="animate-spin" /> Saving…</> : <><Save size={14} /> Save Changes</>}
                </button>
                {msg && (
                    <div className="border border-[#E9B949]/30 bg-[#E9B949]/5 text-[#E9B949] text-sm px-4 py-3 flex items-center gap-2" data-testid="about-manager-msg">
                        <CheckCircle2 size={14} /> {msg}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AboutManager;
