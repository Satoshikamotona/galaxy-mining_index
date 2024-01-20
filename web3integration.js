import WalletConnectProvider from "@walletconnect/web3-provider";
import Web3Modal from "web3modal";
import Web3 from 'web3';

const providerOptions = {
  walletconnect: {
    package: WalletConnectProvider,
    options: {
      rpc: {
        56: 'https://bsc-dataseed.binance.org/' // URL RPC pour Binance Smart Chain
      }
    }
  }
};

const web3Modal = new Web3Modal({
  network: "binance",
  cacheProvider: true,
  providerOptions
});

let web3;
let contract;

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

document.getElementById('connectWalletButton').addEventListener('click', connect);

const contractABI = [{"inputs":[], "stateMutability":"nonpayable", "type":"constructor"}, /* ... autres éléments de l'ABI ... */];
const contractAddress = '0xaC048568bB07cA5C9BC7373c5c9227c3D4492343';

function initContract() {
  contract = new web3.eth.Contract(contractABI, contractAddress);
  console.log("Contrat initialisé", contract);
}

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
