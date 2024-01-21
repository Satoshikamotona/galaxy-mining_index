const Web3 = require('web3');


const contractABI = [{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"referrers","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"referrer","type":"address"}],"name":"register","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"registrationFees","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"}];
const contractAddress = '0xaC048568bB07cA5C9BC7373c5c9227c3D4492343';

const myContract = new web3.eth.Contract(contractABI, contractAddress);




async function connectWallet() {
    if (window.ethereum) {
        try {

            await window.ethereum.request({ method: 'eth_requestAccounts' });


            web3 = new Web3(window.ethereum);

            // Récupère les informations du compte et du réseau
            const accounts = await web3.eth.getAccounts();
            const networkId = await web3.eth.net.getId();
            const networkName = getNetworkName(networkId);
            const truncatedAddress = truncateAddress(accounts[0]);

            // Met à jour le bouton de connexion avec les informations de l'utilisateur
            updateConnectButton(`${truncatedAddress} (${networkName})`);
            console.log("Portefeuille connecté:", accounts[0], "Réseau:", networkName);
        } catch (error) {
            console.error("L'utilisateur a refusé d'accorder l'accès");
        }
    } else {
        console.log("Non-Ethereum browser detected. You should consider trying MetaMask!");
    }
}


    function getNetworkName(networkId) {
        const networkNames = {
            '1': 'Ethereum Mainnet',
            '56': 'Binance Smart Chain',
            // Ajoutez d'autres ID de réseau si nécessaire
        };
        return networkNames[networkId] || `Network ID: ${networkId}`;
    }

    function truncateAddress(address) {
        return address.substr(0, 6) + '...' + address.substr(-4);
    }

    function updateConnectButton(text) {
        const connectButton = document.getElementById('connectWalletButton');
        connectButton.value = text;
    }

    document.addEventListener('DOMContentLoaded', function () {
        var connectButton = document.getElementById('connectWalletButton');
        if (connectButton) {
            connectButton.addEventListener('click', connectWallet);
        }
    });

    document.addEventListener('DOMContentLoaded', function () {
        const registrationForm = document.getElementById('registrationForm');
        if (registrationForm) {
            registrationForm.addEventListener('submit', async function (e) {
                e.preventDefault();
                const parrainAddress = document.getElementById('parrain').value;
                await registerUser(parrainAddress);
            });
        }
    });
    
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
    
            // Envoie une transaction au contrat intelligent
            await myContract.methods.register(parrainAddress).send({ from: userAddress });
            console.log("Inscription réussie avec le parrain:", parrainAddress);
        } catch (error) {
            console.error("Erreur lors de l'inscription :", error);
        }
    }
    
