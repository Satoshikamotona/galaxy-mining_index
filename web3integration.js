 
const Web3 = require('web3');


let web3;

async function connect() {
    if (window.ethereum) {
        try {
            await window.ethereum.request({ method: "eth_requestAccounts" });

            web3 = new Web3(window.ethereum);
           
            const accounts = await web3.eth.getAccounts();
            const networkId = await web3.eth.net.getId();

            // Met à jour le texte du bouton avec l'adresse et le réseau
            updateButtonWithAccountInfo(accounts[0], networkId);
        } catch (error) {
            console.error("L'utilisateur a refusé d'accorder l'accès", error);
        }
    } else {
        console.log("Non-Ethereum browser detected. You should consider trying MetaMask!");
    }
}

function updateButtonWithAccountInfo(account, networkId) {
    const connectButton = document.getElementById('connectWalletButton');
    const networkName = getNetworkName(networkId);

    connectButton.value = `${truncateAddress(account)} (${networkName})`;
}
function getNetworkName(networkId) {
    const networkNames = {
        '1': 'Ethereum Mainnet',
        '3': 'Ropsten Testnet',
        '4': 'Rinkeby Testnet',
        '5': 'Goerli Testnet',
        '42': 'Kovan Testnet',
        '56': 'Binance Smart Chain',
        '97': 'Binance Smart Chain Testnet', 
        '137': 'Polygon (Matic) Mainnet',


        // Ajoutez d'autres réseaux si nécessaire
    };

    return networkNames[networkId] || `Unknown Network (ID: ${networkId})`;
}

function showAccountDetails(account, networkId) {
    // Affiche l'adresse de l'utilisateur et les détails du réseau sur la page
    const accountElement = document.getElementById('accountAddress');
    const networkElement = document.getElementById('networkInfo');

    accountElement.textContent = `Address: ${account}`;
    networkElement.textContent = `Network: ${getNetworkName(networkId)}`;
}



// Gestionnaire d'événements pour le bouton Connect Wallet
document.addEventListener('DOMContentLoaded', function () {
    var connectButton = document.getElementById('connectWalletButton');
    if (connectButton) {
        connectButton.addEventListener('click', function (e) {
            e.preventDefault();
            connect();
        });
    }

});

function truncateAddress(address) {
    return address.substr(0, 6) + '...' + address.substr(-4);
}

const contractABI = [{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"referrers","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"referrer","type":"address"}],"name":"register","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"registrationFees","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"}];
const contractAddress = '0xaC048568bB07cA5C9BC7373c5c9227c3D4492343';

let contract;

function initContract() {
    contract = new web3.eth.Contract(contractABI, contractAddress);
}

async function registerUser(parrainAddress) {
    if (!web3) {
        console.log("Web3 n'est pas initialisé.");
        return;
    }

    try {
        // Récupère l'adresse de l'utilisateur connecté, qui sera utilisée comme msg.sender
        const accounts = await web3.eth.getAccounts();
        const userAddress = accounts[0];

        // Vérifiez si une adresse de parrain est fournie
        if (!parrainAddress) {
            console.log("Adresse du parrain non fournie.");
            return;
        }

        // Appelle la fonction register du contrat intelligent
        // L'adresse de l'utilisateur connecté est implicitement utilisée comme msg.sender
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
});

initContract();

