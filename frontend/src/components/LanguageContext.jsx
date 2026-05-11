import React, { createContext, useContext, useState, useCallback } from "react";

const LanguageContext = createContext({ lang: "en", setLang: () => {}, t: (x) => x });

export const LanguageProvider = ({ children }) => {
    const [lang, setLang] = useState("en");

    const t = useCallback(
        (obj) => {
            if (!obj) return "";
            if (typeof obj === "string") return obj;
            return obj[lang] ?? obj.en ?? "";
        },
        [lang],
    );

    return (
        <LanguageContext.Provider value={{ lang, setLang, t }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLang = () => useContext(LanguageContext);
