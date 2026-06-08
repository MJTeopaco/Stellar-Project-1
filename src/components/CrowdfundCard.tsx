"use client";

import { useState } from "react";
import { useFreighter } from "../hooks/useFreighter";
import { buildDonationTx, submitAndPoll, DESTINATION_ADDRESS } from "../lib/stellar";

export default function CrowdfundCard() {
  const { address, isInstalled, connect, signTransaction } = useFreighter();
  const [amount, setAmount] = useState<string>("");
  const [status, setStatus] = useState<"idle" | "building" | "signing" | "submitting" | "polling" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [txHash, setTxHash] = useState<string>("");

  // Mock campaign data
  const goal = 5000;
  const [raised, setRaised] = useState(3420);
  const progressPercent = Math.min((raised / goal) * 100, 100);

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
      
      const xdr = await buildDonationTx(address, amount);
      
      setStatus("signing");
      const signedXdr = await signTransaction(xdr);
      
      setStatus("submitting");
      // Note: we can't get hash immediately until submitAndPoll finishes or we parse XDR.
      // We will just wait for it.
      setStatus("polling");
      const result = await submitAndPoll(signedXdr);
      
      setTxHash(result.hash);
      setRaised(prev => prev + Number(amount));
      setStatus("success");
      setAmount("");
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || "An error occurred during the transaction.");
      setStatus("error");
    }
  };

  return (
    <div className="glass-panel w-full max-w-lg mx-auto p-8 flex flex-col gap-6">
      {/* Campaign Info */}
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-2">Help Maria Walk Again</h2>
        <p className="text-slate-400 text-sm">
          Maria suffered a severe injury and needs funds for physical therapy and surgery.
          Every USDC (XLM on testnet) goes directly to her wallet with zero fees.
        </p>
      </div>

      <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
        <div className="flex justify-between items-end mb-2">
          <div>
            <span className="text-2xl font-bold text-white">${raised.toLocaleString()}</span>
            <span className="text-slate-400 text-sm ml-1">raised of ${goal.toLocaleString()} goal</span>
          </div>
          <span className="text-blue-400 font-semibold">{progressPercent.toFixed(1)}%</span>
        </div>
        <div className="w-full bg-slate-900 rounded-full h-3 mb-1 overflow-hidden">
          <div 
            className="bg-gradient-to-r from-blue-500 to-indigo-500 h-3 rounded-full transition-all duration-1000 ease-out" 
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <p className="text-xs text-slate-500 mt-2 break-all">
          Patient Wallet: {DESTINATION_ADDRESS}
        </p>
      </div>

      {/* Donation Flow */}
      {!address ? (
        <div className="flex flex-col items-center gap-4 py-4">
          <p className="text-slate-300">Connect your wallet to donate directly.</p>
          <button 
            onClick={connect}
            disabled={!isInstalled}
            className="btn-primary w-full"
          >
            {isInstalled ? "Connect Freighter Wallet" : "Please Install Freighter"}
          </button>
        </div>
      ) : (
        <form onSubmit={handleDonate} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              Donation Amount (USDC)
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400 font-bold">
                $
              </span>
              <input
                type="number"
                step="0.0000001"
                min="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                disabled={status !== "idle" && status !== "error" && status !== "success"}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl py-3 pl-8 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                placeholder="10.00"
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={status !== "idle" && status !== "error" && status !== "success" || !amount}
            className="btn-primary w-full mt-2 relative overflow-hidden"
          >
            {status === "idle" && "Donate Now"}
            {status === "building" && "Building Transaction..."}
            {status === "signing" && "Please Sign in Freighter..."}
            {status === "submitting" && "Submitting to Testnet..."}
            {status === "polling" && "Waiting for Finality (up to 60s)..."}
            {status === "success" && "Donate Again"}
            {status === "error" && "Retry Donation"}
            
            {status === "polling" && (
              <div className="absolute inset-0 bg-blue-600/20 animate-pulse" />
            )}
          </button>
        </form>
      )}

      {/* Status Messages */}
      {status === "error" && (
        <div className="p-4 bg-red-900/30 border border-red-800 rounded-xl text-red-200 text-sm">
          {errorMessage}
        </div>
      )}

      {status === "success" && (
        <div className="p-4 bg-green-900/30 border border-green-800 rounded-xl text-green-200 text-sm flex flex-col gap-2">
          <p className="font-semibold flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
            Donation Successful!
          </p>
          <p className="text-green-300/80 text-xs break-all">
            TxHash:{" "}
            <a 
              href={`https://stellar.expert/explorer/testnet/tx/${txHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-green-100"
            >
              {txHash}
            </a>
          </p>
        </div>
      )}
    </div>
  );
}
