import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Logo from "../components/Logo";
import { LogOut, Newspaper, FolderKanban, LayoutGrid, ArrowUpRight, KeyRound } from "lucide-react";
import NewsManager from "./admin/NewsManager";
import ProjectsManager from "./admin/ProjectsManager";
import ServicesManager from "./admin/ServicesManager";
import ChangePasswordModal from "./admin/ChangePasswordModal";

const tabs = [
    { key: "news", label: "News", icon: Newspaper },
    { key: "projects", label: "Projects", icon: FolderKanban },
    { key: "services", label: "Services", icon: LayoutGrid },
];

const AdminDashboard = () => {
    const { user, logout } = useAuth();
    const [tab, setTab] = useState("news");
    const [pwOpen, setPwOpen] = useState(false);
    const navigate = useNavigate();

    const doLogout = async () => {
        await logout();
        navigate("/admin/login");
    };

    return (
        <div className="min-h-screen bg-[#050505]" data-testid="admin-dashboard">
            {/* Header */}
            <header className="border-b border-[#1a1a1a] bg-[#050505]/90 backdrop-blur-xl sticky top-0 z-40">
                <div className="max-w-[1400px] mx-auto px-6 md:px-12 h-20 flex items-center justify-between">
                    <Link to="/admin" className="flex items-center gap-3">
                        <Logo className="h-12" />
                        <span className="text-[9px] uppercase tracking-[0.4em] text-gray-500 hidden md:inline-block border-l border-[#27272A] pl-3">Admin Console</span>
                    </Link>

                    <div className="flex items-center gap-4 md:gap-6">
                        <a href="/" target="_blank" rel="noopener noreferrer" className="text-[11px] uppercase tracking-[0.28em] text-gray-400 hover:text-[#E9B949] hidden sm:flex items-center gap-2" data-testid="view-site-link">
                            View Site <ArrowUpRight size={12} />
                        </a>
                        <span className="text-[11px] uppercase tracking-[0.28em] text-gray-500 hidden md:inline" data-testid="header-username">{user?.username}</span>
                        <button onClick={() => setPwOpen(true)} className="btn-armeen-ghost" data-testid="open-change-password">
                            <KeyRound size={14} /> <span className="hidden sm:inline">Change Password</span>
                        </button>
                        <button onClick={doLogout} className="btn-armeen-ghost" data-testid="logout-button">
                            <LogOut size={14} /> <span className="hidden sm:inline">Sign Out</span>
                        </button>
                    </div>
                </div>
            </header>

            <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-12">
                {/* Tabs */}
                <div className="flex gap-0 border-b border-[#1a1a1a] mb-12" data-testid="admin-tabs">
                    {tabs.map((t) => {
                        const Icon = t.icon;
                        const active = tab === t.key;
                        return (
                            <button
                                key={t.key}
                                onClick={() => setTab(t.key)}
                                className={`flex items-center gap-3 px-6 py-4 text-sm uppercase tracking-[0.22em] transition-colors border-b-2 -mb-px ${
                                    active ? "border-[#E9B949] text-[#E9B949]" : "border-transparent text-gray-500 hover:text-gray-300"
                                }`}
                                data-testid={`tab-${t.key}`}
                            >
                                <Icon size={14} /> {t.label}
                            </button>
                        );
                    })}
                </div>

                {tab === "news" && <NewsManager />}
                {tab === "projects" && <ProjectsManager />}
                {tab === "services" && <ServicesManager />}
            </div>

            <ChangePasswordModal open={pwOpen} onClose={() => setPwOpen(false)} />
        </div>
    );
};

export default AdminDashboard;
