import CrowdfundCard from "@/components/CrowdfundCard";

export default function Home() {
  return (
    <main className="min-h-screen w-full flex flex-col items-center justify-center p-4 py-12">
      <div className="w-full max-w-4xl flex flex-col items-center justify-center gap-8">
        <header className="text-center flex flex-col items-center">
          <div className="bg-blue-900/40 border border-blue-800 text-blue-200 px-4 py-1 rounded-full text-xs font-semibold mb-4 tracking-wider uppercase">
            Zero-Fee Stellar Crowdfund
          </div>
          <h1 className="text-5xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-300">
            MedFund
          </h1>
          <p className="text-slate-400 text-lg max-w-lg">
            Direct, transparent, and fee-less medical crowdfunding on the Stellar network.
          </p>
        </header>

        <CrowdfundCard />

        <footer className="mt-8 text-center text-sm text-slate-500">
          Powered by Stellar & Freighter
        </footer>
      </div>
    </main>
  );
}
