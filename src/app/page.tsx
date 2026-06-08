import { campaigns } from "@/lib/data";
import { Heart, TrendingUp, Clock, Users, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen w-full bg-slate-950 text-slate-100 selection:bg-blue-500/30 pb-20">
      {/* Top Navigation */}
      <nav className="w-full border-b border-slate-800/60 bg-slate-950/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <Heart className="w-6 h-6 text-blue-500 fill-blue-500" />
            <span className="font-heading font-bold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-300">
              MedFund
            </span>
          </Link>
          <div className="flex gap-4">
            <button className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
              Explore
            </button>
            <button className="btn-primary py-1.5 px-4 text-sm font-bold rounded-lg shadow-none">
              Start a Campaign
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative overflow-hidden border-b border-slate-800/50">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28 relative z-10 flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-sm font-medium text-slate-300 mb-6">
            <TrendingUp className="w-4 h-4 text-blue-400" />
            Zero fees. Direct to Patient. Powered by Stellar.
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 font-heading max-w-4xl leading-tight">
            Fund Medical Needs <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Directly on Chain</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mb-10 leading-relaxed">
            Discover verified patients in need. Send USDC or XLM directly to their wallets with zero intermediaries and zero platform fees.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <a href="#explore" className="btn-primary py-4 px-8 text-lg font-bold rounded-xl flex items-center justify-center gap-2">
              Explore Campaigns <ArrowRight className="w-5 h-5" />
            </a>
            <button className="bg-slate-900 hover:bg-slate-800 border border-slate-700 text-white py-4 px-8 text-lg font-bold rounded-xl transition-colors">
              How it Works
            </button>
          </div>
        </div>
      </div>

      {/* Explore Section */}
      <div id="explore" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold font-heading mb-2">Urgent Campaigns</h2>
            <p className="text-slate-400">Help verified patients reach their recovery goals.</p>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-sm font-medium text-slate-400">
            <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> Ending Soon</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {campaigns.map((campaign) => {
            const progress = Math.min((campaign.raised / campaign.goal) * 100, 100);
            
            return (
              <Link 
                href={`/campaign/${campaign.id}`} 
                key={campaign.id}
                className="bg-slate-900/50 border border-slate-800 hover:border-slate-700 rounded-3xl overflow-hidden group transition-all hover:shadow-2xl hover:shadow-blue-900/10 flex flex-col"
              >
                <div className="relative h-48 overflow-hidden">
                  <div className="absolute top-3 left-3 z-10 bg-slate-900/80 backdrop-blur-md border border-slate-700 text-xs font-semibold px-2.5 py-1 rounded-lg flex items-center gap-1.5 shadow-xl">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
                    {campaign.urgency}
                  </div>
                  <div 
                    className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-700 opacity-80"
                    style={{ backgroundImage: `url(${campaign.image})` }}
                  ></div>
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent"></div>
                </div>
                
                <div className="p-6 flex flex-col flex-1">
                  <h3 className="text-xl font-bold font-heading mb-2 group-hover:text-blue-400 transition-colors line-clamp-2">
                    {campaign.title}
                  </h3>
                  <p className="text-sm text-slate-400 mb-6 line-clamp-2 flex-1">
                    {campaign.shortDescription}
                  </p>
                  
                  <div>
                    <div className="flex justify-between items-end mb-2">
                      <div className="font-bold text-lg text-white">
                        ${campaign.raised.toLocaleString()} <span className="text-xs text-slate-500 font-medium tracking-wide uppercase">raised</span>
                      </div>
                      <span className="text-blue-400 text-sm font-bold">{progress.toFixed(0)}%</span>
                    </div>
                    <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden shadow-inner border border-slate-800">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2 rounded-full" 
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-slate-800/60 flex items-center justify-between text-xs font-medium text-slate-400">
                    <div className="flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-slate-500" />
                      {campaign.donors} donors
                    </div>
                    <div className="text-slate-300 bg-slate-800 px-2 py-1 rounded-md">
                      Goal: ${campaign.goal.toLocaleString()}
                    </div>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </main>
  );
}
