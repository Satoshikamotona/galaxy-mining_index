import Web3 from 'web3';

// Définition de l'URL RPC pour BSC Mainnet
const BSC_MAINNET_RPC = 'https://bsc-dataseed.binance.org/';
const web3 = new Web3(new Web3.providers.HttpProvider(BSC_MAINNET_RPC));

// Définition de l'ABI et de l'adresse du contrat
const contractABI = [{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"referrers","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"referrer","type":"address"}],"name":"register","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"registrationFees","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"}];
const contractAddress = '0xaC048568bB07cA5C9BC7373c5c9227c3D4492343';

let contract;

// Initialisation du contrat
function initContract() {
    contract = new web3.eth.Contract(contractABI, contractAddress);
    console.log("Contrat initialisé", contract);
}

// Fonction pour se connecter au portefeuille de l'utilisateur
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

// Met à jour le texte du bouton avec l'adresse et le réseau
function updateButtonWithAccountInfo(account, networkId) {
    const connectButton = document.getElementById('connectWalletButton');
    const networkName = getNetworkName(networkId);
    connectButton.value = `${truncateAddress(account)} (${networkName})`;
}

// Récupère le nom du réseau
function getNetworkName(networkId) {
    const networkNames = {
        '1': 'Ethereum Mainnet',
        '3': 'Ropsten Testnet',
        // ... autres réseaux ...
        '56': 'Binance Smart Chain',
        '137': 'Polygon (Matic) Mainnet',
    };
    return networkNames[networkId] || `Unknown Network (ID: ${networkId})`;
}

// Tronque l'adresse pour l'affichage
function truncateAddress(address) {
    return address.substr(0, 6) + '...' + address.substr(-4);
}

// Fonction pour enregistrer un utilisateur avec l'adresse de son parrain
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

// Gestionnaire d'événements pour le formulaire d'inscription
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
