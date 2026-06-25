import React, { useEffect, useRef, useState } from "react";
import { api } from "../../api";
import { Upload, FileText, Trash2, Save, Loader2, CheckCircle2 } from "lucide-react";

const AboutManager = () => {
    const [settings, setSettings] = useState({});
    const [busy, setBusy] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [msg, setMsg] = useState("");
    const fileInputRef = useRef(null);

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

    const handleRemove = () => {
        setSettings((s) => ({ ...s, company_profile_url: "", company_profile_filename: "" }));
        setMsg('Removed. Click "Save changes" to publish.');
    };

    const save = async () => {
        setBusy(true); setMsg("");
        try {
            await api.put("/site-settings", {
                company_profile_url: settings.company_profile_url || "",
                company_profile_filename: settings.company_profile_filename || "",
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
        <div data-testid="about-manager" className="max-w-3xl">
            <div className="mb-10">
                <p className="eyebrow mb-3">About Section</p>
                <h2 className="font-serif text-3xl md:text-4xl text-white">Company Profile</h2>
                <p className="mt-3 text-gray-400 text-sm">
                    Upload the company profile PDF that visitors can download from the About section. Replacing the PDF here will instantly update the public site after saving.
                </p>
            </div>

            <div className="border border-[#1a1a1a] bg-[#080808] p-6 md:p-8 space-y-6">
                <div>
                    <p className="eyebrow mb-3">Current File</p>
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
                            No file uploaded yet. Public site is using the default <code className="text-gray-400">/armeen/company-profile.pdf</code> bundled with the build.
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
                    <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploading}
                        className="btn-armeen-ghost"
                        data-testid="upload-company-profile"
                    >
                        {uploading ? <><Loader2 size={14} className="animate-spin" /> Uploading…</> : <><Upload size={14} /> Upload New PDF</>}
                    </button>

                    {settings.company_profile_url && (
                        <button
                            type="button"
                            onClick={handleRemove}
                            className="btn-armeen-ghost text-red-300 border-red-900/40 hover:border-red-500"
                            data-testid="remove-company-profile"
                        >
                            <Trash2 size={14} /> Remove
                        </button>
                    )}

                    <button
                        type="button"
                        onClick={save}
                        disabled={busy}
                        className="btn-armeen"
                        data-testid="save-company-profile"
                    >
                        {busy ? <><Loader2 size={14} className="animate-spin" /> Saving…</> : <><Save size={14} /> Save Changes</>}
                    </button>
                </div>

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
