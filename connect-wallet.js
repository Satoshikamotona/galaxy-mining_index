import {
    EthereumClient,
    w3mConnectors,
    w3mProvider,
    WagmiCore,
    WagmiCoreChains,
    WagmiCoreConnectors,
} from "https://unpkg.com/@web3modal/ethereum@2.5.0";

import { Web3Modal } from "https://unpkg.com/@web3modal/html@2.5.0";

// 0. Import wagmi dependencies
const { mainnet, polygon, avalanche, arbitrum } = WagmiCoreChains;
const { configureChains, createConfig,getAccount } = WagmiCore;

// 1. Define chains
const chains = [mainnet, polygon, avalanche, arbitrum];
const projectId = "b43449a9d44014e3810186373002c014";

// 2. Configure wagmi client
const { publicClient } = configureChains(chains, [w3mProvider({ projectId })]);
const wagmiConfig = createConfig({
    autoConnect: true,
    connectors: [
        ...w3mConnectors({ chains, version: 2, projectId }),
        new WagmiCoreConnectors.CoinbaseWalletConnector({
            chains,
            options: {
                appName: "GALAXYMINING",
            },
        }),
    ],
    publicClient,
});

// 3. Create ethereum and modal clients
const ethereumClient = new EthereumClient(wagmiConfig, chains);
export const web3Modal = new Web3Modal(
    {
        projectId,
        walletImages: {
            safe: "https://pbs.twimg.com/profile_images/1566773491764023297/IvmCdGnM_400x400.jpg",
        },
    },
    ethereumClient
);


  