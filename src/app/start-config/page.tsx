"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function StartConfig() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const [lang, setLang] = useState("en");
  const [dataSource, setDataSource] = useState<"api" | "mysql">("mysql");
  
  const [host, setHost] = useState("");
  const [port, setPort] = useState("3306");
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [name, setName] = useState("");
  
  const [apiBase, setApiBase] = useState("");
  const [apiMap, setApiMap] = useState("maps");
  const [apiMatches, setApiMatches] = useState("matches");
  const [apiPlayerMatches, setApiPlayerMatches] = useState("players");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lang,
          dataSource,
          host,
          port,
          user,
          pass,
          name,
          altData: apiBase,
          apiMap,
          apiMatches,
          apiPlayerMatches,
        }),
      });

      const data = await res.json();

      if (data.success) {
        router.push("/");
      } else {
        setError(data.error || "Erro ao salvar configuração");
      }
    } catch (err) {
      setError("Erro ao conectar com o servidor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-900 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <h1 className="text-3xl font-bold text-zinc-100 mb-2 text-center">
          FPScoreBoard Setup
        </h1>
        <p className="text-zinc-400 text-center mb-6">
          Configure your database or API connection
        </p>

        <form onSubmit={handleSubmit} className="bg-zinc-800 rounded-xl p-6 space-y-6 border border-zinc-700">
          {error && (
            <div className="bg-red-500/20 border border-red-500 text-red-400 px-4 py-2 rounded-md text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-zinc-300 mb-2 font-medium">Language / Idioma</label>
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value)}
              className="w-full px-4 py-2 bg-zinc-700 border border-zinc-600 rounded-md text-zinc-100 focus:outline-none focus:border-blue-500"
            >
              <option value="en">English</option>
              <option value="pt">Português</option>
              <option value="es">Español</option>
            </select>
          </div>

          <div>
            <label className="block text-zinc-300 mb-2 font-medium">Data Source / Fonte de Dados</label>
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setDataSource("mysql")}
                className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
                  dataSource === "mysql"
                    ? "bg-blue-600 text-white"
                    : "bg-zinc-700 text-zinc-300 hover:bg-zinc-600"
                }`}
              >
                MySQL
              </button>
              <button
                type="button"
                onClick={() => setDataSource("api")}
                className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
                  dataSource === "api"
                    ? "bg-blue-600 text-white"
                    : "bg-zinc-700 text-zinc-300 hover:bg-zinc-600"
                }`}
              >
                API
              </button>
            </div>
          </div>

          {dataSource === "mysql" ? (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-zinc-300 mb-1 text-sm">Host</label>
                  <input
                    type="text"
                    value={host}
                    onChange={(e) => setHost(e.target.value)}
                    placeholder="localhost"
                    className="w-full px-3 py-2 bg-zinc-700 border border-zinc-600 rounded-md text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-zinc-300 mb-1 text-sm">Port</label>
                  <input
                    type="text"
                    value={port}
                    onChange={(e) => setPort(e.target.value)}
                    placeholder="3306"
                    className="w-full px-3 py-2 bg-zinc-700 border border-zinc-600 rounded-md text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-zinc-300 mb-1 text-sm">User / Usuário</label>
                <input
                  type="text"
                  value={user}
                  onChange={(e) => setUser(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-700 border border-zinc-600 rounded-md text-zinc-100 focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-zinc-300 mb-1 text-sm">Password / Senha</label>
                <input
                  type="password"
                  value={pass}
                  onChange={(e) => setPass(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-700 border border-zinc-600 rounded-md text-zinc-100 focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-zinc-300 mb-1 text-sm">Database Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-700 border border-zinc-600 rounded-md text-zinc-100 focus:outline-none focus:border-blue-500"
                />
              </div>
            </>
          ) : (
            <>
              <div>
                <label className="block text-zinc-300 mb-1 text-sm">API Base URL</label>
                <input
                  type="text"
                  value={apiBase}
                  onChange={(e) => setApiBase(e.target.value)}
                  placeholder="https://api.example.com"
                  className="w-full px-3 py-2 bg-zinc-700 border border-zinc-600 rounded-md text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-blue-500"
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-zinc-300 mb-1 text-sm">Maps Endpoint</label>
                  <input
                    type="text"
                    value={apiMap}
                    onChange={(e) => setApiMap(e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-700 border border-zinc-600 rounded-md text-zinc-100 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-zinc-300 mb-1 text-sm">Matches Endpoint</label>
                  <input
                    type="text"
                    value={apiMatches}
                    onChange={(e) => setApiMatches(e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-700 border border-zinc-600 rounded-md text-zinc-100 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-zinc-300 mb-1 text-sm">Player Matches</label>
                  <input
                    type="text"
                    value={apiPlayerMatches}
                    onChange={(e) => setApiPlayerMatches(e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-700 border border-zinc-600 rounded-md text-zinc-100 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-green-600 hover:bg-green-700 disabled:bg-zinc-600 text-white font-bold rounded-md transition-colors"
          >
            {loading ? "Saving..." : "Save Configuration"}
          </button>
        </form>
      </div>
    </div>
  );
}
