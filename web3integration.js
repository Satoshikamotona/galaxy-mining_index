import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";
import Web3 from 'web3';

// Configuration pour WalletConnect
const providerOptions = {
  walletconnect: {
    package: WalletConnectProvider,
    options: {
      infuraId: "votre_infura_id" 
    }
  }
};

// Initialisation de Web3Modal
const web3Modal = new Web3Modal({
  network: "mainnet", // ou 'binance' pour Binance Smart Chain
  cacheProvider: true, // Si vous souhaitez que le choix du portefeuille soit conservé
  providerOptions // options de fournisseur configurées
});

let web3;

async function connect() {
  const provider = await web3Modal.connect();
  web3 = new Web3(provider);

  provider.on("accountsChanged", (accounts) => {
    console.log(accounts);
  });

  provider.on("chainChanged", (chainId) => {
    console.log(chainId);
  });

  provider.on("disconnect", (error) => {
    console.log(error);
  });
}

document.querySelector('#connectWalletButton').addEventListener('click', () => {
  connect();
});

const bscMainnet = {
    chainId: 56, // ID de la chaîne pour BSC Mainnet
    name: 'Binance Smart Chain',
    currency: 'BNB',
    explorerUrl: 'https://bscscan.com',
    rpcUrl: 'https://bsc-dataseed.binance.org/'
  };
  
// Configuration de Web3Modal (à ajuster selon votre intégration de Web3Modal)
const modal = createWeb3Modal({
  ethersConfig: defaultConfig({ metadata }),
  chains: [bscMainnet]
});

// ABI et adresse du contrat
const contractABI = [{"inputs":[], "stateMutability":"nonpayable", "type":"constructor"}, /* ... autres éléments de l'ABI ... */];
const contractAddress = '0xaC048568bB07cA5C9BC7373c5c9227c3D4492343';


let contract;

// Initialisation du contrat
function initContract() {
  contract = new web3.eth.Contract(contractABI, contractAddress);
  console.log("Contrat initialisé", contract);
}

// Connexion au portefeuille
async function connect() {
  if (window.ethereum) {
    try {
      await window.ethereum.request({ method: "eth_requestAccounts" });
      web3 = new Web3(window.ethereum);

      const accounts = await web3.eth.getAccounts();
      const networkId = await web3.eth.net.getId();

      updateButtonWithAccountInfo(accounts[0], networkId);
    } catch (error) {
      console.error("L'utilisateur a refusé d'accorder l'accès", error);
    }
  } else {
    console.log("Non-Ethereum browser detected. You should consider trying MetaMask!");
  }
}

// Mise à jour du bouton de connexion
function updateButtonWithAccountInfo(account, networkId) {
  const connectButton = document.getElementById('connectWalletButton');
  const networkName = getNetworkName(networkId);

  connectButton.value = `${truncateAddress(account)} (${networkName})`;
}

// Récupération du nom du réseau
function getNetworkName(networkId) {
  const networkNames = {
    '1': 'Ethereum Mainnet',
    '56': 'Binance Smart Chain'
  };

  return networkNames[networkId] || `Unknown Network (ID: ${networkId})`;
}

// Tronquer l'adresse pour l'affichage
function truncateAddress(address) {
  return address.substr(0, 6) + '...' + address.substr(-4);
}

// Enregistrer un utilisateur avec l'adresse du parrain
async function registerUser(parrainAddress) {
  if (!web3) {
    console.log("Web3 n'est pas initialisé.");
    return;
  }
  try {
    const accounts = await web3.eth.getAccounts();
    const userAddress = accounts[0];
    if (!parrainAddress) {
      console.log("Adresse du parrain non fournie.");
      return;
    }
    await contract.methods.register(parrainAddress).send({ from: userAddress });
    console.log("Inscription réussie avec le parrain:", parrainAddress);
  } catch (error) {
    console.error("Erreur lors de l'inscription :", error);
  }
}

// Gestionnaires d'événements
document.addEventListener('DOMContentLoaded', function () {
  var registrationForm = document.getElementById('registrationForm');
  if (registrationForm) {
    registrationForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const parrainAddress = document.getElementById('parrain').value;
      registerUser(parrainAddress);
    });
  }
  initContract();
});

document.querySelector('w3m-button').addEventListener('click', () => {
  modal.open();
});
