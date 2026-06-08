import { rpc, Networks, Asset, TransactionBuilder, Operation } from '@stellar/stellar-sdk';

export const NETWORK_PASSPHRASE = Networks.TESTNET;
export const RPC_URL = process.env.NEXT_PUBLIC_SOROBAN_RPC ?? 'https://soroban-testnet.stellar.org';
export const HORIZON_URL = process.env.NEXT_PUBLIC_HORIZON_URL ?? 'https://horizon-testnet.stellar.org';

export const server = new rpc.Server(RPC_URL);

export const DESTINATION_ADDRESS = 'GDLS5FYEH73Z4OEOARXGAZRR7TQA2Q4NNLX5PX365V3SBKQDZUN2Z6F3';
export const XLM = Asset.native();

/**
 * Builds a donation transaction transferring native XLM (labeled as USDC in UI).
 */
export async function buildDonationTx(senderPubKey: string, amount: string): Promise<string> {
  const account = await server.getAccount(senderPubKey);
  
  let operation;
  try {
    const res = await fetch(`https://horizon-testnet.stellar.org/accounts/${DESTINATION_ADDRESS}`);
    if (res.status === 404) {
      operation = Operation.createAccount({
        destination: DESTINATION_ADDRESS,
        startingBalance: amount,
      });
    } else {
      operation = Operation.payment({
        destination: DESTINATION_ADDRESS,
        asset: Asset.native(),
        amount: amount,
      });
    }
  } catch (err) {
    operation = Operation.payment({
      destination: DESTINATION_ADDRESS,
      asset: Asset.native(),
      amount: amount,
    });
  }
  
  const tx = new TransactionBuilder(account, {
    fee: "100",
    networkPassphrase: NETWORK_PASSPHRASE,
  })
    .addOperation(operation)
    .setTimeout(300)
    .build();

  return tx.toXDR();
}

/**
 * Submits the transaction and polls for finality up to 60 seconds.
 */
export async function submitAndPoll(signedTxXdr: string): Promise<{ hash: string, response: rpc.Api.GetTransactionResponse }> {
  // Parse XDR to Transaction object
  const transaction = TransactionBuilder.fromXDR(signedTxXdr, NETWORK_PASSPHRASE);
  const submitRes = await server.sendTransaction(transaction as any);
  
  if (submitRes.status === 'ERROR') {
    throw new Error('Transaction submission failed: ' + JSON.stringify((submitRes as any).errorResultXdr || submitRes.errorResult));
  }
  
  // Poll for finality
  const hash = submitRes.hash;
  const startTime = Date.now();
  const maxWait = 60 * 1000;
  
  while (Date.now() - startTime < maxWait) {
    const txResponse = await server.getTransaction(hash);
    if (txResponse.status === rpc.Api.GetTransactionStatus.SUCCESS) {
      return { hash, response: txResponse };
    }
    if (txResponse.status === rpc.Api.GetTransactionStatus.FAILED) {
      throw new Error('Transaction failed on-chain.');
    }
    // NOT_FOUND means it's still pending
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
  
  throw new Error('Transaction polling timed out after 60 seconds.');
}
