import React, { useEffect, useState } from "react";
import { api, resolveAsset } from "../../api";
import { Plus, Trash2, Save, Upload, X, Edit3 } from "lucide-react";

const empty = () => ({
    slug: "",
    title: { en: "", bm: "" },
    category: { en: "", bm: "" },
    location: "",
    client: "",
    year: "",
    scope: { en: "", bm: "" },
    cover: "",
    gallery: [],
    summary: { en: "", bm: "" },
    highlights: [{ en: "", bm: "" }],
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

const ImageInput = ({ value, onChange }) => {
    const [up, setUp] = useState(false);
    const handle = async (e) => {
        const f = e.target.files?.[0];
        if (!f) return;
        setUp(true);
        try {
            const fd = new FormData(); fd.append("file", f);
            const { data } = await api.post("/uploads", fd, { headers: { "Content-Type": "multipart/form-data" } });
            onChange(data.url);
        } finally { setUp(false); }
    };
    return (
        <div className="space-y-2">
            <input value={value || ""} onChange={(e) => onChange(e.target.value)} placeholder="URL or upload" className="w-full bg-transparent border border-[#27272A] focus:border-[#E9B949] text-white px-3 py-2.5 text-sm outline-none" />
            <label className="inline-flex items-center gap-2 cursor-pointer text-[10px] uppercase tracking-[0.28em] text-gray-400 hover:text-[#E9B949]">
                <Upload size={12} /> {up ? "Uploading…" : "Upload"}
                <input type="file" accept="image/*" className="hidden" onChange={handle} />
            </label>
            {value && <img src={resolveAsset(value)} alt="" className="w-24 h-16 object-cover border border-[#27272A]" />}
        </div>
    );
};

const ProjectsManager = () => {
    const [items, setItems] = useState([]);
    const [editing, setEditing] = useState(null);
    const [msg, setMsg] = useState("");
    const [busy, setBusy] = useState(false);

    const load = async () => {
        const { data } = await api.get("/projects");
        setItems(data);
    };
    useEffect(() => { load(); }, []);

    const save = async () => {
        setBusy(true); setMsg("");
        try {
            // Filter empty highlights
            const payload = { ...editing, highlights: (editing.highlights || []).filter((h) => h.en || h.bm) };
            if (editing._existingSlug) {
                await api.put(`/projects/${editing._existingSlug}`, payload);
            } else {
                await api.post("/projects", payload);
            }
            setEditing(null);
            await load();
            setMsg("Saved.");
        } catch (e) {
            setMsg(typeof e.response?.data?.detail === "string" ? e.response.data.detail : "Save failed");
        } finally { setBusy(false); }
    };

    const del = async (slug) => {
        if (!window.confirm(`Delete project "${slug}"?`)) return;
        await api.delete(`/projects/${slug}`);
        await load();
    };

    return (
        <div data-testid="projects-manager">
            <div className="flex items-center justify-between mb-8">
                <h2 className="font-serif text-3xl text-white">Projects</h2>
                <button onClick={() => setEditing(empty())} className="btn-armeen" data-testid="project-new">
                    <Plus size={14} /> New
                </button>
            </div>

            {msg && <div className="mb-4 text-[#E9B949] text-sm">{msg}</div>}

            {!editing && (
                <div className="space-y-3" data-testid="projects-list">
                    {items.map((p) => (
                        <div key={p.slug} className="flex items-center gap-4 border border-[#1a1a1a] bg-[#0a0a0a] p-4" data-testid={`project-row-${p.slug}`}>
                            {p.cover && <img src={resolveAsset(p.cover)} alt="" className="w-24 h-16 object-cover border border-[#27272A] flex-shrink-0" />}
                            <div className="flex-1 min-w-0">
                                <p className="font-serif text-lg text-white truncate">{p.title?.en}</p>
                                <p className="text-xs text-gray-500 truncate">{p.category?.en} · {p.location}</p>
                                <p className="mt-1 text-[10px] uppercase tracking-[0.28em] text-gray-600">{p.slug}</p>
                            </div>
                            <button onClick={() => setEditing({ ...p, _existingSlug: p.slug })} className="text-gray-400 hover:text-[#E9B949]"><Edit3 size={16} /></button>
                            <button onClick={() => del(p.slug)} className="text-gray-400 hover:text-red-400"><Trash2 size={16} /></button>
                        </div>
                    ))}
                </div>
            )}

            {editing && (
                <div className="space-y-6 border border-[#1a1a1a] bg-[#0a0a0a] p-6" data-testid="project-editor">
                    <div className="flex items-center justify-between">
                        <p className="eyebrow">{editing._existingSlug ? "Edit Project" : "New Project"}</p>
                        <button onClick={() => setEditing(null)} className="text-gray-400 hover:text-white"><X size={18} /></button>
                    </div>

                    {!editing._existingSlug && (
                        <Field label="Slug (URL identifier — lowercase, hyphens only)">
                            <input value={editing.slug} onChange={(e) => setEditing({ ...editing, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-") })} className="w-full bg-transparent border border-[#27272A] text-white px-3 py-2.5 text-sm" placeholder="e.g. new-villa-bangsar" />
                        </Field>
                    )}

                    <Field label="Title"><BiInput value={editing.title} onChange={(v) => setEditing({ ...editing, title: v })} placeholder="Title" /></Field>
                    <Field label="Category"><BiInput value={editing.category} onChange={(v) => setEditing({ ...editing, category: v })} placeholder="Category" /></Field>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Field label="Location"><input value={editing.location} onChange={(e) => setEditing({ ...editing, location: e.target.value })} className="w-full bg-transparent border border-[#27272A] text-white px-3 py-2.5 text-sm" /></Field>
                        <Field label="Client"><input value={editing.client} onChange={(e) => setEditing({ ...editing, client: e.target.value })} className="w-full bg-transparent border border-[#27272A] text-white px-3 py-2.5 text-sm" /></Field>
                        <Field label="Year"><input value={editing.year} onChange={(e) => setEditing({ ...editing, year: e.target.value })} className="w-full bg-transparent border border-[#27272A] text-white px-3 py-2.5 text-sm" /></Field>
                    </div>

                    <Field label="Scope"><BiInput value={editing.scope} onChange={(v) => setEditing({ ...editing, scope: v })} placeholder="Scope" /></Field>
                    <Field label="Cover Image"><ImageInput value={editing.cover} onChange={(v) => setEditing({ ...editing, cover: v })} /></Field>
                    <Field label="Summary"><BiInput value={editing.summary} onChange={(v) => setEditing({ ...editing, summary: v })} type="textarea" placeholder="Project summary" /></Field>

                    <Field label="Gallery URLs (one per line)">
                        <textarea
                            value={(editing.gallery || []).join("\n")}
                            onChange={(e) => setEditing({ ...editing, gallery: e.target.value.split("\n").filter(Boolean) })}
                            rows={4}
                            className="w-full bg-transparent border border-[#27272A] text-white px-3 py-2.5 text-sm"
                            placeholder="/armeen/projects/p46_2.jpg"
                        />
                    </Field>

                    <Field label="Highlights">
                        <div className="space-y-2">
                            {(editing.highlights || []).map((h, i) => (
                                <div key={i} className="flex gap-2">
                                    <BiInput value={h} onChange={(v) => {
                                        const arr = [...editing.highlights];
                                        arr[i] = v;
                                        setEditing({ ...editing, highlights: arr });
                                    }} placeholder="Highlight" />
                                    <button onClick={() => setEditing({ ...editing, highlights: editing.highlights.filter((_, idx) => idx !== i) })} className="text-gray-500 hover:text-red-400 px-2"><X size={14} /></button>
                                </div>
                            ))}
                            <button onClick={() => setEditing({ ...editing, highlights: [...(editing.highlights || []), { en: "", bm: "" }] })} className="text-[10px] uppercase tracking-[0.28em] text-[#E9B949] hover:underline">
                                + Add highlight
                            </button>
                        </div>
                    </Field>

                    <div className="flex items-center gap-3">
                        <button onClick={save} disabled={busy} className="btn-armeen"><Save size={14} /> {busy ? "Saving…" : "Save"}</button>
                        <button onClick={() => setEditing(null)} className="btn-armeen-ghost">Cancel</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProjectsManager;
