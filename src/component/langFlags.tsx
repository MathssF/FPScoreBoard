"use client";

import { useLanguage } from "@/context/lang";

export default function LangFlags() {
  const { language, setLanguage } = useLanguage();

  const handleChange = (lang: "pt" | "en" | "es") => {
    setLanguage(lang);
  };

  const flags = [
    { code: "en", label: "English", url: "https://flagcdn.com/us.svg" },
    { code: "pt", label: "Português Brasileiro", url: "https://flagcdn.com/br.svg" },
    { code: "es", label: "Español", url: "https://flagcdn.com/ar.svg" },
  ] as const;

  return (
    <div className="absolute top-4 right-6 flex gap-3">
      {flags.map((flag) => (
        <button
          key={flag.code}
          onClick={() => handleChange(flag.code)}
          className={`w-8 h-8 rounded-full border-2 ${
            language === flag.code ? "border-white" : "border-transparent"
          }`}
        >
          <img src={flag.url} alt={flag.label} className="rounded-full" />
        </button>
      ))}
    </div>
  );
}
