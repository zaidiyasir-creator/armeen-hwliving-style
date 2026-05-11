import React, { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Lock, Mail } from "lucide-react";

const formatError = (detail) => {
    if (detail == null) return "Something went wrong.";
    if (typeof detail === "string") return detail;
    if (Array.isArray(detail)) return detail.map((e) => e?.msg || JSON.stringify(e)).join(" ");
    return String(detail);
};

const AdminLogin = () => {
    const { user, login } = useAuth();
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [err, setErr] = useState("");
    const [busy, setBusy] = useState(false);

    if (user) return <Navigate to="/admin" replace />;

    const submit = async (e) => {
        e.preventDefault();
        setErr("");
        setBusy(true);
        try {
            await login(email, password);
            navigate("/admin");
        } catch (e) {
            setErr(formatError(e.response?.data?.detail) || "Login failed");
        } finally {
            setBusy(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#050505] flex items-center justify-center px-6" data-testid="admin-login-page">
            <div className="absolute inset-0 opacity-30">
                <div className="absolute inset-0 bg-gradient-to-br from-[#E9B949]/5 to-transparent"></div>
            </div>
            <div className="relative w-full max-w-md">
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-3">
                        <span className="w-10 h-10 flex items-center justify-center bg-[#E9B949] text-[#050505]">
                            <svg viewBox="0 0 32 32" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.6">
                                <path d="M4 28 L16 6 L28 28 Z" />
                                <path d="M11 28 V20 H21 V28" />
                            </svg>
                        </span>
                        <span className="font-serif text-xl text-white tracking-wider">ARMEEN <span className="italic">HW</span></span>
                    </div>
                    <p className="eyebrow mt-6">Admin Console</p>
                    <h1 className="mt-3 font-serif text-3xl text-white">Sign in to continue</h1>
                </div>

                <form onSubmit={submit} className="space-y-5" data-testid="admin-login-form">
                    <div>
                        <label className="eyebrow block mb-3">Email</label>
                        <div className="relative">
                            <Mail size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full bg-transparent border border-[#27272A] focus:border-[#E9B949] text-white pl-11 pr-4 py-3.5 outline-none transition-colors"
                                placeholder="admin@armeenhw.com"
                                data-testid="login-email"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="eyebrow block mb-3">Password</label>
                        <div className="relative">
                            <Lock size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full bg-transparent border border-[#27272A] focus:border-[#E9B949] text-white pl-11 pr-4 py-3.5 outline-none transition-colors"
                                placeholder="••••••••"
                                data-testid="login-password"
                            />
                        </div>
                    </div>

                    {err && (
                        <div className="border border-red-900/40 bg-red-950/30 text-red-300 text-sm px-4 py-3" data-testid="login-error">{err}</div>
                    )}

                    <button
                        type="submit"
                        disabled={busy}
                        className="w-full btn-armeen justify-center disabled:opacity-50"
                        data-testid="login-submit"
                    >
                        {busy ? "Signing in…" : "Sign In"}
                        <span>→</span>
                    </button>
                </form>

                <p className="mt-12 text-center text-[10px] uppercase tracking-[0.32em] text-gray-600">
                    <a href="/" className="hover:text-[#E9B949]">← Back to site</a>
                </p>
            </div>
        </div>
    );
};

export default AdminLogin;
