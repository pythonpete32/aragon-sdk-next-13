# Aragon SDK + NextJS 13

> Part 2 Add Aragon SDK

## Install the Aragon SDK

Install the Aragon SDK and ethers v5

```bash
pnpm install @aragon/sdk-client ethers@legacy-v5
```

## useEthersSigner

Wagmi uses viem but the Aragon SDK currently supports ethers v5

```bash
mkdir src/hooks ; touch src/hooks/useEthersSigner.ts
```

```typescript
// src/hooks/useEthersSigner.ts

import { Signer, providers } from "ethers";
import { useState, useEffect } from "react";
import { getWalletClient } from "@wagmi/core";

interface EthersSigner {
  signer: Signer | undefined;
  loading: boolean;
  error: Error | undefined;
}

export function useEthersSigner(chainId?: number): EthersSigner {
  const [signer, setSigner] = useState<Signer | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | undefined>(undefined);

  useEffect(() => {
    (async () => {
      try {
        const walletClient = await getWalletClient({ chainId: chainId ?? 1 });
        if (!walletClient) {
          setSigner(undefined);
          setLoading(false);
          console.error("No wallet client found");
          return;
        }

        const { account, chain, transport } = walletClient;
        const network = {
          chainId: chain.id,
          name: chain.name,
          ensAddress: chain.contracts?.ensRegistry?.address,
        };
        const provider = new providers.Web3Provider(transport, network);
        setSigner(provider.getSigner(account.address));
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    })();
  }, [chainId]);

  return { signer, loading, error };
}
```

## Setup Aragon SDK

1. First create a function that creates the Aragon Clients

```bash
touch src/lib/aragon.ts
```

```typescript
// ./src/lib/aragon.ts

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
```

