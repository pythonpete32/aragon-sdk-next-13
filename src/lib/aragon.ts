// src/lib/aragon.ts

import {
  ContextParams,
  TokenVotingClient,
  Client,
  Context,
} from "@aragon/sdk-client";
import { Signer, Wallet } from "ethers";

const WEB3_PROVIDER_URL: { [key: number]: string } = {
  1: "https://rpc.ankr.com/eth",
  5: "https://rpc.ankr.com/eth_goerli",
  137: "https://rpc.ankr.com/polygon",
  80001: "https://rpc.ankr.com/polygon_mumbai",
};

interface AragonClients {
  context: Context;
  baseClient: Client;
  tokenVotingClient: TokenVotingClient;
}

export function getAragonClients(
  chainId: number,
  signer?: Signer
): AragonClients {
  signer = signer ?? Wallet.createRandom();

  const aragonSDKContextParams: ContextParams = {
    network: chainId,
    signer,
    web3Providers: WEB3_PROVIDER_URL[chainId],
  };

  const contextInstance = new Context(aragonSDKContextParams);

  return {
    context: contextInstance,
    baseClient: new Client(contextInstance),
    tokenVotingClient: new TokenVotingClient(contextInstance),
  };
}
