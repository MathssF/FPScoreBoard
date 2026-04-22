"use client";

import { useLanguage } from "@/context/lang";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Header() {
  const { language } = useLanguage();
  const [showConfig, setShowConfig] = useState(false);

  useEffect(() => {
    async function checkNeedConfig() {
      try {
        const res = await fetch("/api/config-status", { cache: "no-store" });
        const data = await res.json();
        if (data.needConfig) {
          setShowConfig(true);
        }
      } catch (err) {
        setShowConfig(true);
      }
    }
    checkNeedConfig();
  }, []);

  const translations = {
    pt: {
      home: "Início",
      match: "Partidas",
      players: "Jogadores",
      config: "Config",
    },
    en: {
      home: "Home",
      match: "Matchs",
      players: "Players",
      config: "Config",
    },
    es: {
      home: "Inicio",
      match: "Juegos",
      players: "Jogadores",
      config: "Config",
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
          {showConfig && (
            <Link href="/start-config" className="hover:text-green-400 transition-colors text-green-400">
              {t.config}
            </Link>
          )}
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
