import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { api } from "../api";

const AuthContext = createContext({ user: null, loading: true, login: async () => {}, logout: async () => {} });

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const refresh = useCallback(async () => {
        const token = localStorage.getItem("armeen_token");
        if (!token) {
            setUser(null);
            setLoading(false);
            return;
        }
        try {
            const { data } = await api.get("/auth/me");
            setUser(data);
        } catch {
            localStorage.removeItem("armeen_token");
            setUser(null);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        refresh();
    }, [refresh]);

    const login = async (email, password) => {
        const { data } = await api.post("/auth/login", { email, password });
        if (data.access_token) localStorage.setItem("armeen_token", data.access_token);
        setUser({ email: data.email, name: data.name, role: data.role });
        return data;
    };

    const logout = async () => {
        try { await api.post("/auth/logout"); } catch {}
        localStorage.removeItem("armeen_token");
        setUser(null);
    };

    return <AuthContext.Provider value={{ user, loading, login, logout, refresh }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
