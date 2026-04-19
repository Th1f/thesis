import Link from "next/link";
import { HydrateClient } from "~/trpc/server";
import { ChatPanel } from "./_components/ChatPanel";
import { Evaluator } from "./_components/Evaluator";

export default async function Home() {
  return (
    <HydrateClient>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#212121] to-[#36373f] px-4 text-white">
        <div className="flex w-full flex-col items-center justify-center gap-4 transition-all duration-1000 ease-in-out">
          <div className="flex w-full flex-col items-center justify-center transition-all duration-1000 ease-in-out">
            <h1 className="mb-4 mt-8 text-6xl font-bold transition-all duration-1000 ease-in-out">
              Thesis App
            </h1>
            <Link
              href="/solver"
              className="mb-2 rounded-xl border border-blue-500/50 bg-blue-600/20 px-6 py-3 text-sm font-semibold text-blue-300 transition-all hover:bg-blue-600/40 hover:text-white"
            >
              ✦ Try the New Multi-Agent LP Solver →
            </Link>
          </div>
          <Evaluator />
          <ChatPanel />
        </div>
      </main>
    </HydrateClient>
  );
}
