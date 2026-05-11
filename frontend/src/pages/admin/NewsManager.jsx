import React, { useEffect, useState } from "react";
import { api, resolveAsset } from "../../api";
import { Plus, Trash2, Save, Upload, X, Edit3 } from "lucide-react";

const empty = () => ({
    title: { en: "", bm: "" },
    excerpt: { en: "", bm: "" },
    body: { en: "", bm: "" },
    cover_image: "",
    tag: { en: "", bm: "" },
    published: true,
    published_at: new Date().toISOString().slice(0, 16), // YYYY-MM-DDTHH:mm
});

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
                    rows={type === "textarea" ? 4 : undefined}
                    value={value?.[lng] || ""}
                    onChange={(e) => onChange({ ...value, [lng]: e.target.value })}
                    placeholder={`${placeholder} (${lng.toUpperCase()})`}
                    className="w-full bg-transparent border border-[#27272A] focus:border-[#E9B949] text-white px-3 py-2.5 text-sm outline-none transition-colors"
                />
            ))}
        </div>
    );
};

const ImageInput = ({ value, onChange }) => {
    const [uploading, setUploading] = useState(false);
    const handleFile = async (e) => {
        const f = e.target.files?.[0];
        if (!f) return;
        setUploading(true);
        try {
            const fd = new FormData();
            fd.append("file", f);
            const { data } = await api.post("/uploads", fd, { headers: { "Content-Type": "multipart/form-data" } });
            onChange(data.url);
        } finally {
            setUploading(false);
        }
    };
    return (
        <div className="space-y-3">
            <input
                value={value || ""}
                onChange={(e) => onChange(e.target.value)}
                placeholder="https://… or /api/uploads/…"
                className="w-full bg-transparent border border-[#27272A] focus:border-[#E9B949] text-white px-3 py-2.5 text-sm outline-none"
            />
            <label className="inline-flex items-center gap-2 cursor-pointer text-[10px] uppercase tracking-[0.28em] text-gray-400 hover:text-[#E9B949]">
                <Upload size={12} /> {uploading ? "Uploading…" : "Upload image"}
                <input type="file" accept="image/*" className="hidden" onChange={handleFile} />
            </label>
            {value && (
                <img src={resolveAsset(value)} alt="" className="w-32 h-20 object-cover border border-[#27272A]" />
            )}
        </div>
    );
};

const NewsManager = () => {
    const [items, setItems] = useState([]);
    const [editing, setEditing] = useState(null);
    const [busy, setBusy] = useState(false);
    const [msg, setMsg] = useState("");

    const load = async () => {
        const { data } = await api.get("/news?only_published=false");
        setItems(data);
    };
    useEffect(() => { load(); }, []);

    const save = async () => {
        setBusy(true); setMsg("");
        try {
            const payload = { ...editing };
            // Normalize datetime-local back to ISO with Z (UTC)
            if (payload.published_at && payload.published_at.length === 16) {
                payload.published_at = new Date(payload.published_at).toISOString();
            }
            if (editing.id) {
                await api.put(`/news/${editing.id}`, payload);
            } else {
                await api.post("/news", payload);
            }
            setEditing(null);
            await load();
            setMsg("Saved.");
        } catch (e) {
            setMsg(e.response?.data?.detail || "Save failed");
        } finally {
            setBusy(false);
        }
    };

    const del = async (id) => {
        if (!window.confirm("Delete this news item?")) return;
        await api.delete(`/news/${id}`);
        await load();
    };

    return (
        <div data-testid="news-manager">
            <div className="flex items-center justify-between mb-8">
                <h2 className="font-serif text-3xl text-white">News & Announcements</h2>
                <button onClick={() => setEditing(empty())} className="btn-armeen" data-testid="news-new">
                    <Plus size={14} /> New
                </button>
            </div>

            {msg && <div className="mb-4 text-[#E9B949] text-sm">{msg}</div>}

            {!editing && (
                <div className="space-y-3" data-testid="news-list">
                    {items.length === 0 && <p className="text-gray-500 font-light">No news yet. Click "New" to create your first announcement.</p>}
                    {items.map((n) => {
                        const pubAt = n.published_at ? new Date(n.published_at) : null;
                        const scheduled = n.published && pubAt && pubAt > new Date();
                        return (
                        <div key={n.id} className="flex items-center gap-4 border border-[#1a1a1a] bg-[#0a0a0a] p-4" data-testid={`news-row-${n.id}`}>
                            {n.cover_image && (
                                <img src={resolveAsset(n.cover_image)} alt="" className="w-20 h-14 object-cover border border-[#27272A] flex-shrink-0" />
                            )}
                            <div className="flex-1 min-w-0">
                                <p className="font-serif text-lg text-white truncate">{n.title?.en}</p>
                                <p className="text-xs text-gray-500 truncate">{n.excerpt?.en}</p>
                                <p className="mt-1 text-[10px] uppercase tracking-[0.28em] text-gray-600 flex items-center gap-2">
                                    <span className={scheduled ? "text-[#E9B949]" : n.published ? "text-green-500/80" : "text-gray-500"}>
                                        {scheduled ? "Scheduled" : n.published ? "Published" : "Draft"}
                                    </span>
                                    <span>·</span>
                                    <span>{pubAt ? pubAt.toLocaleString() : ""}</span>
                                </p>
                            </div>
                            <button onClick={() => setEditing({ ...n, published_at: pubAt ? new Date(pubAt.getTime() - pubAt.getTimezoneOffset() * 60000).toISOString().slice(0,16) : "" })} className="text-gray-400 hover:text-[#E9B949]" data-testid={`news-edit-${n.id}`}><Edit3 size={16} /></button>
                            <button onClick={() => del(n.id)} className="text-gray-400 hover:text-red-400" data-testid={`news-delete-${n.id}`}><Trash2 size={16} /></button>
                        </div>
                    );})}
                </div>
            )}

            {editing && (
                <div className="space-y-6 border border-[#1a1a1a] bg-[#0a0a0a] p-6" data-testid="news-editor">
                    <div className="flex items-center justify-between">
                        <p className="eyebrow">{editing.id ? "Edit Item" : "New Item"}</p>
                        <button onClick={() => setEditing(null)} className="text-gray-400 hover:text-white"><X size={18} /></button>
                    </div>

                    <Field label="Title (EN / BM)"><BiInput value={editing.title} onChange={(v) => setEditing({ ...editing, title: v })} placeholder="Title" /></Field>
                    <Field label="Tag (optional)"><BiInput value={editing.tag} onChange={(v) => setEditing({ ...editing, tag: v })} placeholder="Tag" /></Field>
                    <Field label="Excerpt"><BiInput value={editing.excerpt} onChange={(v) => setEditing({ ...editing, excerpt: v })} type="textarea" placeholder="Short excerpt" /></Field>
                    <Field label="Body"><BiInput value={editing.body} onChange={(v) => setEditing({ ...editing, body: v })} type="textarea" placeholder="Full body" /></Field>
                    <Field label="Cover Image"><ImageInput value={editing.cover_image} onChange={(v) => setEditing({ ...editing, cover_image: v })} /></Field>

                    <Field label="Publish Date & Time (future date = scheduled)">
                        <input
                            type="datetime-local"
                            value={editing.published_at || ""}
                            onChange={(e) => setEditing({ ...editing, published_at: e.target.value })}
                            className="w-full bg-transparent border border-[#27272A] focus:border-[#E9B949] text-white px-3 py-2.5 text-sm outline-none"
                            data-testid="news-publish-at"
                        />
                        <p className="mt-2 text-[10px] uppercase tracking-[0.28em] text-gray-600">
                            Set a future date to schedule auto-publish · Site time treated as UTC
                        </p>
                    </Field>

                    <Field label="Status">
                        <label className="flex items-center gap-3 text-gray-300">
                            <input type="checkbox" checked={editing.published} onChange={(e) => setEditing({ ...editing, published: e.target.checked })} />
                            Published (visible on website when publish date is reached)
                        </label>
                    </Field>

                    <div className="flex items-center gap-3">
                        <button onClick={save} disabled={busy} className="btn-armeen" data-testid="news-save">
                            <Save size={14} /> {busy ? "Saving…" : "Save"}
                        </button>
                        <button onClick={() => setEditing(null)} className="btn-armeen-ghost">Cancel</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default NewsManager;
