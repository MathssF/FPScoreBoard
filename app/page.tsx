import Image from "next/image";
"use client";
import { useState } from "react";

export default function Home() {
  const [language, setLanguage] = useState<"pt" | "en" | "es">("pt");

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

  const { title, text } = translations[language];

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-900">
      <main className="flex flex-col items-center justify-center border border-zinc-700 bg-zinc-200 rounded-xl p-12 text-center shadow-md">
        <div className="mb-6">
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value as "pt" | "en" | "es")}
            className="rounded-md border border-zinc-400 bg-white px-3 py-2 text-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-600"
          >
            <option value="en">English</option>
            <option value="pt">Português Brasileiro</option>
            <option value="es">Español</option>
          </select>
        </div>

        <h1 className="text-4xl font-bold text-zinc-900 mb-4">{title}</h1>
        <p className="text-lg text-zinc-700 max-w-md">{text}</p>
      </main>
    </div>
  );
}