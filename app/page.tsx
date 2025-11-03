import Image from "next/image";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-900">
      <main className="flex flex-col items-center justify-center border border-zinc-700 bg-zinc-200 rounded-xl p-12 text-center shadow-md">
        <h1 className="text-4xl font-bold text-zinc-900 mb-4">
          FPScoreBoard!
        </h1>
        <p className="text-lg text-zinc-700 max-w-md">
          Seu painel de visualização de Estatísticas de CS2, usando o MatchZy!
        </p>
      </main>
    </div>
  );
}