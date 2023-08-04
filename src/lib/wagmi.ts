// src/lib/wagmi.ts

import { getDefaultWallets } from "@rainbow-me/rainbowkit";
import { configureChains, createConfig } from "wagmi";
import { goerli, mainnet, polygon, polygonMumbai } from "wagmi/chains";
import { publicProvider } from "wagmi/providers/public";
import { alchemyProvider } from "wagmi/providers/alchemy";

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [mainnet, polygon, goerli, polygonMumbai],
  [
    publicProvider(),
    alchemyProvider({ apiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY ?? "" }),
  ]
);

const { connectors } = getDefaultWallets({
  appName: "Aragon SDK Example App",
  chains,
  projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_ID ?? "",
});

const config = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
  webSocketPublicClient,
});

export { config, chains };
