"use client";

import { useLanguage } from "@/context/lang";
import Link from "next/link";

export default function Header() {
  const { language } = useLanguage();

  const translations = {
    pt: {
      home: "Início",
      match: "Partidas",
      players: "Jogadores",
    },
    en: {
      home: "Home",
      match: "Matchs",
      players: "Players",
    },
    es: {
      home: "Inicio",
      match: "Juegos",
      players: "Jogadores",
    },
  };

  const t = translations[language as keyof typeof translations] || translations.en;

  return (
    <header className="absolute top-0 left-0 w-full bg-zinc-800 text-white flex items-center justify-between px-6 py-3 shadow-md">
      {/* Lado esquerdo - Logo / Título */}
      <div className="flex items-center gap-3">
        <div className="bg-zinc-700 rounded-md px-3 py-1 font-bold text-lg">
          FPScoreBoard
        </div>
        <nav className="hidden md:flex gap-6 text-sm font-medium">
          <Link href="/" className="hover:text-zinc-300 transition-colors">
            {t.home}
          </Link>
          <Link href="/dashboard/matchs-stats" className="hover:text-zinc-300 transition-colors">
            {t.match}
          </Link>
          <Link href="/dashboard/players-matchs" className="hover:text-zinc-300 transition-colors">
            {t.players}
          </Link>
        </nav>
      </div>

      {/* Lado direito - Bandeiras */}
      <div className="relative">
        {/* LangFlags já tem posição absoluta no top-right,
            então aqui podemos apenas reservar o espaço para ele */}
        <div className="w-[120px] h-8"></div>
      </div>
    </header>
  );
}
