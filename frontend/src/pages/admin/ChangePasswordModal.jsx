import React, { useState, useEffect } from "react";
import { api } from "../../api";
import { useAuth } from "../../contexts/AuthContext";
import { X, KeyRound, Check, Loader2 } from "lucide-react";

const ChangePasswordModal = ({ open, onClose }) => {
    const { logout } = useAuth();
    const [current, setCurrent] = useState("");
    const [next, setNext] = useState("");
    const [confirm, setConfirm] = useState("");
    const [err, setErr] = useState("");
    const [busy, setBusy] = useState(false);
    const [done, setDone] = useState(false);

    useEffect(() => {
        if (!open) {
            setCurrent(""); setNext(""); setConfirm(""); setErr(""); setBusy(false); setDone(false);
        }
    }, [open]);

    if (!open) return null;

    const submit = async (e) => {
        e.preventDefault();
        setErr("");
        if (next.length < 8) {
            setErr("New password must be at least 8 characters.");
            return;
        }
        if (next !== confirm) {
            setErr("New password and confirmation do not match.");
            return;
        }
        setBusy(true);
        try {
            await api.post("/auth/change-password", { current_password: current, new_password: next });
            setDone(true);
            // Sign out after 1.5s so user logs back in with the new password
            setTimeout(async () => {
                await logout();
                window.location.href = "/admin/login";
            }, 1500);
        } catch (e) {
            const detail = e.response?.data?.detail;
            setErr(typeof detail === "string" ? detail : "Failed to change password.");
        } finally {
            setBusy(false);
        }
    };

    return (
        <div
            className="fixed inset-0 z-[100] bg-[#050505]/90 backdrop-blur-md flex items-center justify-center p-4"
            onClick={onClose}
            data-testid="change-password-modal"
            role="dialog"
            aria-modal="true"
        >
            <div
                className="relative w-full max-w-md bg-[#0a0a0a] border border-[#1a1a1a] p-8"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    type="button"
                    onClick={onClose}
                    className="absolute top-4 right-4 w-9 h-9 border border-[#27272A] hover:border-[#E9B949] hover:text-[#E9B949] text-gray-500 flex items-center justify-center transition-colors"
                    aria-label="Close"
                    data-testid="change-password-close"
                >
                    <X size={16} />
                </button>

                <div className="flex items-center gap-3 mb-6">
                    <span className="w-11 h-11 border border-[#E9B949]/40 text-[#E9B949] flex items-center justify-center">
                        <KeyRound size={16} />
                    </span>
                    <div>
                        <p className="eyebrow">Security</p>
                        <h2 className="font-serif text-2xl text-white mt-1">Change Password</h2>
                    </div>
                </div>

                {done ? (
                    <div className="flex flex-col items-center text-center py-6" data-testid="change-password-success">
                        <span className="w-12 h-12 border border-[#E9B949] bg-[#E9B949]/10 text-[#E9B949] flex items-center justify-center mb-4">
                            <Check size={18} />
                        </span>
                        <p className="text-white font-light">Password updated.</p>
                        <p className="mt-2 text-xs uppercase tracking-[0.28em] text-gray-500">Signing you out…</p>
                    </div>
                ) : (
                    <form onSubmit={submit} className="space-y-4" data-testid="change-password-form">
                        <div>
                            <label className="eyebrow block mb-2">Current Password</label>
                            <input
                                type="password"
                                value={current}
                                onChange={(e) => setCurrent(e.target.value)}
                                required
                                autoComplete="current-password"
                                className="w-full bg-transparent border border-[#27272A] focus:border-[#E9B949] text-white px-3 py-3 outline-none text-sm"
                                data-testid="current-password-input"
                            />
                        </div>
                        <div>
                            <label className="eyebrow block mb-2">New Password</label>
                            <input
                                type="password"
                                value={next}
                                onChange={(e) => setNext(e.target.value)}
                                required
                                minLength={8}
                                autoComplete="new-password"
                                className="w-full bg-transparent border border-[#27272A] focus:border-[#E9B949] text-white px-3 py-3 outline-none text-sm"
                                data-testid="new-password-input"
                                placeholder="Minimum 8 characters"
                            />
                        </div>
                        <div>
                            <label className="eyebrow block mb-2">Confirm New Password</label>
                            <input
                                type="password"
                                value={confirm}
                                onChange={(e) => setConfirm(e.target.value)}
                                required
                                autoComplete="new-password"
                                className="w-full bg-transparent border border-[#27272A] focus:border-[#E9B949] text-white px-3 py-3 outline-none text-sm"
                                data-testid="confirm-password-input"
                            />
                        </div>

                        {err && (
                            <div className="border border-red-900/40 bg-red-950/30 text-red-300 text-sm px-3 py-2.5" data-testid="change-password-error">{err}</div>
                        )}

                        <div className="flex items-center gap-3 pt-2">
                            <button
                                type="submit"
                                disabled={busy}
                                className="btn-armeen disabled:opacity-50"
                                data-testid="change-password-submit"
                            >
                                {busy ? <><Loader2 size={14} className="animate-spin" /> Updating…</> : <>Update Password →</>}
                            </button>
                            <button
                                type="button"
                                onClick={onClose}
                                className="text-[11px] uppercase tracking-[0.28em] text-gray-500 hover:text-gray-300"
                                data-testid="change-password-cancel"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default ChangePasswordModal;
