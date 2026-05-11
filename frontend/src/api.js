import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

export const api = axios.create({
    baseURL: `${BACKEND_URL}/api`,
});

// Attach Bearer token (fallback when cookies aren't shared)
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("armeen_token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

export const API_BASE = `${BACKEND_URL}/api`;

export const resolveAsset = (url) => {
    if (!url) return "";
    if (url.startsWith("http://") || url.startsWith("https://")) return url;
    if (url.startsWith("/api/uploads/")) return `${BACKEND_URL}${url}`;
    return url; // public assets like /armeen/...
};
