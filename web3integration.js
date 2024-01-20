// Importation de Web3 (si vous utilisez un module bundler comme Webpack)
// Sinon, Web3 sera disponible globalement grâce à la balise <script> dans votre HTML
// import Web3 from "web3"; 

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
