"use client";
import { useEffect, useState } from "react";

export default function Home() {
  const [language, setLanguage] = useState<"pt" | "en" | "es">("en");

  // Busca o idioma inicial do arquivo database.json via API
  useEffect(() => {
    async function fetchLang() {
      try {
        const res = await fetch("/api/config");
        const data = await res.json();
        setLanguage(data.lang || "en");
      } catch {
        setLanguage("en");
      }
    }
    fetchLang();
  }, []);

  // Textos traduzidos
  const translations = {
    pt: {
      title: "FPScoreBoard!",
      text: "Seu painel de visualização de Estatísticas de CS2, usando o MatchZy!",
    },
    en: {
      title: "FPScoreBoard!",
      text: "Your CS2 stats visualization dashboard, powered by MatchZy!",
    },
    es: {
      title: "FPScoreBoard!",
      text: "Tu panel de visualización de estadísticas de CS2, usando MatchZy!",
    },
  };

  const { title, text } = translations[language] || translations.en;

  // Função para trocar idioma manualmente
  const handleLanguageChange = (lang: "pt" | "en" | "es") => {
    setLanguage(lang);
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-zinc-900">
      {/* Seletor de bandeiras */}
      <div className="absolute top-4 right-6 flex gap-3">
        <button
          onClick={() => handleLanguageChange("en")}
          className={`w-8 h-8 rounded-full border-2 ${
            language === "en" ? "border-white" : "border-transparent"
          }`}
        >
          <img
            src="https://flagcdn.com/us.svg"
            alt="English"
            className="rounded-full"
          />
        </button>
        <button
          onClick={() => handleLanguageChange("pt")}
          className={`w-8 h-8 rounded-full border-2 ${
            language === "pt" ? "border-white" : "border-transparent"
          }`}
        >
          <img
            src="https://flagcdn.com/br.svg"
            alt="Português Brasileiro"
            className="rounded-full"
          />
        </button>
        <button
          onClick={() => handleLanguageChange("es")}
          className={`w-8 h-8 rounded-full border-2 ${
            language === "es" ? "border-white" : "border-transparent"
          }`}
        >
          <img
            src="https://flagcdn.com/ar.svg"
            alt="Español"
            className="rounded-full"
          />
        </button>
      </div>

      {/* Conteúdo principal */}
      <main className="flex flex-col items-center justify-center border border-zinc-700 bg-zinc-200 rounded-xl p-12 text-center shadow-md">
        <h1 className="text-4xl font-bold text-zinc-900 mb-4">{title}</h1>
        <p className="text-lg text-zinc-700 max-w-md">{text}</p>
      </main>
    </div>
  );
}
