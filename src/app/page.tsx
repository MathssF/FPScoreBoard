"use client";

import LangFlags from "@/component/langFlags";
import { useLanguage } from "@/context/lang";

export default function Home() {
  const { language } = useLanguage() || "en";

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

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-zinc-900">
      <LangFlags />
      <main className="flex flex-col items-center justify-center border border-zinc-700 bg-zinc-200 rounded-xl p-12 text-center shadow-md">
        <h1 className="text-4xl font-bold text-zinc-900 mb-4">{title}</h1>
        <p className="text-lg text-zinc-700 max-w-md">{text}</p>
      </main>
    </div>
  );
}
