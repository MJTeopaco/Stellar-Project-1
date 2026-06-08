import { useState, useCallback, useEffect } from 'react';
import { NETWORK_PASSPHRASE } from '../lib/stellar';

export function useFreighter() {
  const [address, setAddress] = useState<string | null>(null);
  const [isInstalled, setIsInstalled] = useState<boolean>(false);

  useEffect(() => {
    async function checkInstalled() {
      try {
        const freighter = await import('@stellar/freighter-api');
        const installed = await freighter.isConnected();
        setIsInstalled(installed.isConnected);
      } catch (e) {
        console.error("Freighter not available", e);
      }
    }
    checkInstalled();
  }, []);

  const connect = useCallback(async () => {
    try {
      const freighter = await import('@stellar/freighter-api');
      const { address: pubKey } = await freighter.requestAccess();
      if (pubKey) {
        setAddress(pubKey);
      }
    } catch (error) {
      console.error('Failed to connect Freighter:', error);
      throw new Error('Failed to connect Freighter wallet.');
    }
  }, []);

  const signTransaction = useCallback(async (xdr: string) => {
    try {
      const freighter = await import('@stellar/freighter-api');
      
      const response = await freighter.signTransaction(xdr, {
        networkPassphrase: NETWORK_PASSPHRASE,
      });

      // Freighter v6 returns an object
      if (typeof response === 'object' && response.signedTxXdr) {
        return response.signedTxXdr;
      } else if (typeof response === 'string') {
        // Fallback for older versions just in case
        return response;
      }
      
      throw new Error("Invalid signature format from Freighter.");
    } catch (error) {
      console.error('Failed to sign transaction:', error);
      throw error;
    }
  }, []);

  const disconnect = useCallback(() => {
    setAddress(null);
  }, []);

  return {
    address,
    isInstalled,
    connect,
    disconnect,
    signTransaction,
  };
}
