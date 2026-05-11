import React, { useEffect, useState } from "react";
import { api } from "../../api";
import { content } from "../../i18n";
import { Save, X, RotateCcw } from "lucide-react";

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
        setDraft({
            key,
            title: ov.title || division.title,
            summary: ov.summary || division.summary,
            bullets: ov.bullets || division.bullets,
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
