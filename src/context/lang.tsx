"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

interface LanguageContextType {
  language: string;
  setLanguage: (lang: string) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<string>("en");

  // Busca idioma inicial via API (server → client)
  useEffect(() => {
    async function loadLang() {
      try {
        const res = await fetch("/api/config");
        const data = await res.json();
        setLanguage((data.options?.lang || data.lang || "en").toLowerCase());
      } catch (error) {
        console.error("Erro ao carregar idioma:", error);
        setLanguage("en");
      }
    }
    loadLang();
  }, []);

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage deve ser usado dentro de LanguageProvider");
  
  return ctx;
}
