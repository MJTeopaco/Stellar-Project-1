"use client";

import { useState } from "react";
import { useFreighter } from "../hooks/useFreighter";
import { buildDonationTx, submitAndPoll } from "../lib/stellar";
import { CheckCircle2, Copy, ExternalLink, Loader2, Wallet, Users, Info, ShieldCheck, Check, Heart, Share2 } from "lucide-react";
import { Campaign } from "../lib/data";

export default function CrowdfundCard({ campaign }: { campaign: Campaign }) {
  const { address, isInstalled, connect, signTransaction } = useFreighter();
  const [amount, setAmount] = useState<string>("");
  const [status, setStatus] = useState<"idle" | "building" | "signing" | "submitting" | "polling" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [txHash, setTxHash] = useState<string>("");
  const [copied, setCopied] = useState(false);

  // Use state for live updates, initialized from props
  const [raised, setRaised] = useState(campaign.raised);
  const [donors, setDonors] = useState(campaign.donors);
  
  const goal = campaign.goal;
  const progressPercent = Math.min((raised / goal) * 100, 100);

  const formatAddress = (addr: string) => `${addr.slice(0, 5)}...${addr.slice(-4)}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(campaign.destinationAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDonate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!address) return;
    if (isNaN(Number(amount)) || Number(amount) <= 0) {
      setErrorMessage("Please enter a valid amount.");
      setStatus("error");
      return;
    }

    try {
      setErrorMessage("");
      setStatus("building");
      
      const xdr = await buildDonationTx(address, campaign.destinationAddress, amount);
      
      setStatus("signing");
      const signedXdr = await signTransaction(xdr);
      
      setStatus("submitting");
      setStatus("polling");
      const result = await submitAndPoll(signedXdr);
      
      setTxHash(result.hash);
      setRaised(prev => prev + Number(amount));
      setDonors(prev => prev + 1);
      setStatus("success");
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || "An error occurred during the transaction.");
      setStatus("error");
    }
  };

  const resetFlow = () => {
    setStatus("idle");
    setAmount("");
    setErrorMessage("");
    setTxHash("");
  };

  const setMaxAmount = () => {
    setAmount("50");
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl shadow-blue-900/10 overflow-hidden flex flex-col">
      {/* Progress Section */}
      <div className="p-6 md:p-8 border-b border-slate-800/60 bg-slate-900/50 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

        <div className="flex justify-between items-end mb-3 relative z-10">
          <div>
            <span className="text-4xl font-extrabold text-white tracking-tight">${raised.toLocaleString()}</span>
            <span className="text-slate-400 text-sm ml-2 font-medium">raised of ${goal.toLocaleString()}</span>
          </div>
        </div>

        <div className="w-full bg-slate-950 rounded-full h-3 mb-4 overflow-hidden shadow-inner border border-slate-800 relative z-10">
          <div 
            className="bg-gradient-to-r from-blue-500 via-indigo-400 to-blue-400 h-3 rounded-full transition-all duration-1000 ease-out relative" 
            style={{ width: `${progressPercent}%` }}
          >
            <div className="absolute top-0 right-0 bottom-0 left-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPgo8cmVjdCB3aWR0aD0iOCIgaGVpZ2h0PSI4IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMSI+PC9yZWN0Pgo8L3N2Zz4=')] opacity-30 mix-blend-overlay"></div>
          </div>
        </div>

        <div className="flex justify-between items-center text-sm font-medium relative z-10">
          <div className="flex items-center gap-1.5 text-slate-300">
            <Users className="w-4 h-4 text-blue-400" />
            {donors} unique donors
          </div>
          <span className="text-indigo-300 font-bold bg-indigo-500/10 px-2.5 py-0.5 rounded-md border border-indigo-500/20">
            {progressPercent.toFixed(1)}%
          </span>
        </div>
      </div>

      {/* Main Action Area */}
      <div className="p-6 md:p-8 flex flex-col gap-6 bg-slate-900">
        
        {/* Recipient Details */}
        <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-950/50 border border-slate-800">
          <div className="flex flex-col gap-1">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1">
              Beneficiary Address
              <ShieldCheck className="w-3 h-3 text-emerald-500" />
            </span>
            <div className="font-mono text-sm text-slate-200 font-medium tracking-tight">
              {formatAddress(campaign.destinationAddress)}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={handleCopy}
              className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors"
              title="Copy Address"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>
            <a 
              href={`https://stellar.expert/explorer/testnet/account/${campaign.destinationAddress}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors"
              title="View on Stellar Expert"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* State 1: Idle/Unconnected */}
        {!address && status === "idle" && (
          <div className="flex flex-col gap-4 py-4">
            <button 
              onClick={connect}
              disabled={!isInstalled}
              className="w-full bg-white hover:bg-slate-100 text-slate-900 font-bold py-4 px-6 rounded-2xl transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_25px_rgba(255,255,255,0.2)] active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3 text-lg"
            >
              <Wallet className="w-5 h-5" />
              {isInstalled ? "Connect Wallet to Donate" : "Install Freighter Wallet"}
            </button>
            <div className="flex items-center justify-center gap-2 text-sm text-slate-500">
              <span>or</span>
              <button className="underline decoration-slate-700 underline-offset-4 hover:text-slate-300 transition-colors">
                donate manually via address
              </button>
            </div>
          </div>
        )}

        {/* State 2 & Errors: Connected & Ready */}
        {address && (status === "idle" || status === "error") && (
          <form onSubmit={handleDonate} className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-slate-300">
                Donation Amount
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <span className="text-slate-400 font-bold text-xl">$</span>
                </div>
                <input
                  type="number"
                  step="0.0000001"
                  min="0"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-4 pl-9 pr-20 text-white text-2xl font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-inner"
                  placeholder="0.00"
                />
                <div className="absolute inset-y-0 right-2 flex items-center">
                  <button 
                    type="button"
                    onClick={setMaxAmount}
                    className="text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded-lg uppercase tracking-wider transition-colors"
                  >
                    Max
                  </button>
                </div>
              </div>
              <div className="flex justify-between items-center text-xs px-1">
                <span className="text-slate-500 font-medium">Native XLM (Testnet)</span>
                {amount && !isNaN(Number(amount)) && (
                  <span className="text-blue-400 font-medium">≈ ${(Number(amount) * 1.0).toFixed(2)} USD</span>
                )}
              </div>
            </div>

            {status === "error" && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-start gap-3">
                <Info className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                <p className="text-sm text-red-200">{errorMessage}</p>
              </div>
            )}

            <button 
              type="submit" 
              disabled={!amount}
              className="btn-primary w-full py-4 text-lg font-bold rounded-2xl mt-2 flex items-center justify-center gap-2"
            >
              <Heart className="w-5 h-5" />
              {status === "error" ? "Retry Donation" : "Submit Donation"}
            </button>
          </form>
        )}

        {/* State 3 & 4: Processing (Building, Signing, Polling) */}
        {(status === "building" || status === "signing" || status === "submitting" || status === "polling") && (
          <div className="flex flex-col items-center justify-center py-8 gap-6 text-center">
            <div className="relative w-20 h-20 flex items-center justify-center">
              <Loader2 className="w-12 h-12 text-blue-500 animate-spin absolute" />
              <div className="w-8 h-8 bg-blue-500/20 rounded-full animate-pulse"></div>
            </div>
            
            <div className="flex flex-col gap-2">
              <h3 className="text-xl font-bold text-white">
                {status === "building" && "Preparing Transaction..."}
                {status === "signing" && "Awaiting Signature"}
                {status === "submitting" && "Submitting to Network..."}
                {status === "polling" && "Validating on Blockchain..."}
              </h3>
              <p className="text-slate-400 text-sm max-w-[260px] mx-auto leading-relaxed">
                {status === "signing" && "Please open your Freighter extension and confirm the transaction to proceed."}
                {status === "polling" && "Waiting for ledger finality. This usually takes about 5 seconds on Stellar."}
              </p>
            </div>

            <div className="flex items-center gap-2 mt-4">
              <div className={`w-2 h-2 rounded-full ${status === "building" ? "bg-blue-400" : "bg-blue-600"}`}></div>
              <div className={`w-2 h-2 rounded-full ${status === "signing" ? "bg-blue-400 animate-pulse" : (status === "polling" || status === "submitting") ? "bg-blue-600" : "bg-slate-700"}`}></div>
              <div className={`w-2 h-2 rounded-full ${status === "polling" ? "bg-blue-400 animate-pulse" : "bg-slate-700"}`}></div>
            </div>
          </div>
        )}

        {/* State 5: Success */}
        {status === "success" && (
          <div className="flex flex-col items-center justify-center py-6 gap-6 text-center">
            <div className="w-20 h-20 bg-emerald-500/10 border-2 border-emerald-500/30 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(16,185,129,0.2)]">
              <CheckCircle2 className="w-10 h-10 text-emerald-400" />
            </div>
            
            <div className="flex flex-col gap-2">
              <h3 className="text-2xl font-bold text-white">Thank You!</h3>
              <p className="text-slate-300 text-sm max-w-[260px] mx-auto">
                Your donation has been successfully recorded on the Stellar ledger and sent directly to {campaign.beneficiary}.
              </p>
            </div>

            <div className="w-full p-4 bg-slate-950/50 border border-slate-800 rounded-2xl flex flex-col gap-2 items-center">
              <span className="text-xs text-slate-500 uppercase font-semibold tracking-wider">Transaction Hash</span>
              <a 
                href={`https://stellar.expert/explorer/testnet/tx/${txHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-mono text-blue-400 hover:text-blue-300 truncate w-full px-4 text-center transition-colors"
              >
                {txHash}
              </a>
            </div>

            <div className="flex flex-col sm:flex-row w-full gap-3 mt-2">
              <button 
                onClick={resetFlow}
                className="flex-1 bg-slate-800 hover:bg-slate-700 text-white font-semibold py-3 px-4 rounded-xl transition-colors"
              >
                Donate Again
              </button>
              <button className="flex-1 btn-primary py-3 px-4 rounded-xl flex items-center justify-center gap-2">
                <Share2 className="w-4 h-4" />
                Share
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
