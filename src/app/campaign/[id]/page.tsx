import CrowdfundCard from "@/components/CrowdfundCard";
import { getCampaignById } from "@/lib/data";
import { BadgeCheck, Heart, Share2, ShieldCheck, User, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function CampaignPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const campaign = getCampaignById(id);

  if (!campaign) {
    notFound();
  }

  return (
    <main className="min-h-screen w-full bg-slate-950 text-slate-100 selection:bg-blue-500/30 pb-20">
      {/* Top Navigation / Branding */}
      <nav className="w-full border-b border-slate-800/60 bg-slate-950/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <Heart className="w-6 h-6 text-blue-500 fill-blue-500" />
            <span className="font-heading font-bold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-300">
              MedFund
            </span>
          </Link>
          <div className="flex gap-4">
            <Link href="/" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
              Explore
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Grid Layout */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 lg:pt-8">
        
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors mb-6">
          <ArrowLeft className="w-4 h-4" />
          Back to all campaigns
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
          
          {/* Left Column: Media, Title, Story */}
          <div className="lg:col-span-7 xl:col-span-8 flex flex-col gap-8">
            
            {/* Title Section */}
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold uppercase tracking-wider mb-4">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                {campaign.urgency}
              </div>
              <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-4 font-heading">
                {campaign.title}
              </h1>
            </div>

            {/* Media Placeholder */}
            <div className="w-full aspect-video bg-slate-800 rounded-3xl overflow-hidden relative shadow-2xl border border-slate-700/50 group">
              <div className="absolute inset-0 bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center">
                <div 
                  className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-overlay group-hover:scale-105 transition-transform duration-700"
                  style={{ backgroundImage: `url(${campaign.image})` }}
                ></div>
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent"></div>
              </div>
            </div>

            {/* Verification Block */}
            <div className="flex flex-col sm:flex-row gap-4 p-5 rounded-2xl bg-slate-900/50 border border-slate-800 backdrop-blur-sm">
              <div className="flex items-center gap-4 flex-1">
                <div className="w-12 h-12 rounded-full bg-blue-900/50 border border-blue-500/30 flex items-center justify-center shrink-0">
                  <User className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <p className="text-sm text-slate-400">Organizer</p>
                  <p className="font-semibold text-slate-100 flex items-center gap-1">
                    {campaign.organizer}
                    <BadgeCheck className="w-4 h-4 text-blue-500" />
                  </p>
                </div>
              </div>
              <div className="hidden sm:block w-px bg-slate-800"></div>
              <div className="flex items-center gap-4 flex-1">
                <div className="w-12 h-12 rounded-full bg-emerald-900/50 border border-emerald-500/30 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-6 h-6 text-emerald-400" />
                </div>
                <div>
                  <p className="text-sm text-slate-400">Beneficiary</p>
                  <p className="font-semibold text-slate-100 flex items-center gap-1">
                    {campaign.beneficiary}
                    <span className="text-[10px] uppercase bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full ml-1">Verified</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Story Section */}
            <article className="prose prose-invert prose-slate max-w-none prose-headings:font-heading prose-a:text-blue-400 hover:prose-a:text-blue-300">
              <h3 className="text-2xl font-bold border-b border-slate-800 pb-2 mb-4">The Story</h3>
              {campaign.fullStory.map((paragraph, idx) => (
                <p key={idx} className="text-slate-300 leading-relaxed text-lg">{paragraph}</p>
              ))}
              
              <div className="mt-8 p-6 rounded-2xl bg-blue-950/20 border border-blue-900/50 flex gap-4">
                <ShieldCheck className="w-8 h-8 text-blue-400 shrink-0" />
                <div>
                  <h4 className="text-blue-200 font-semibold mb-1 mt-0">Trust & Transparency</h4>
                  <p className="text-sm text-blue-300/80 mb-0">
                    All funds are sent directly to the verified beneficiary wallet via on-chain transactions. You can verify every single donation publicly on the Stellar ledger.
                  </p>
                </div>
              </div>
            </article>
          </div>

          {/* Right Column: Sticky Donation Panel */}
          <div className="lg:col-span-5 xl:col-span-4 relative">
            <div className="sticky top-24">
              <CrowdfundCard campaign={campaign} />
              
              {/* Share & Report */}
              <div className="mt-6 flex items-center justify-between px-2">
                <button className="flex items-center gap-2 text-sm text-slate-400 hover:text-slate-200 transition-colors">
                  <Share2 className="w-4 h-4" />
                  Share Campaign
                </button>
                <button className="text-sm text-slate-500 hover:text-slate-400 transition-colors underline decoration-slate-700 underline-offset-4">
                  Report campaign
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}
