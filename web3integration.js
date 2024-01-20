// Importation de Web3 (si vous utilisez un module bundler comme Webpack)
// Sinon, Web3 sera disponible globalement grâce à la balise <script> dans votre HTML
// import Web3 from "web3"; 

let web3;

async function connect() {
    if (window.ethereum) {
        try {

            await window.ethereum.request({ method: "eth_requestAccounts" });

            // Initialise Web3
            web3 = new Web3(window.ethereum);

           
            const accounts = await web3.eth.getAccounts();
            const networkId = await web3.eth.net.getId();
            const networkType = await web3.eth.net.getNetworkType();

            // Affiche l'adresse et le réseau
            showAccountDetails(accounts[0], networkId, networkType);
        } catch (error) {
            console.error("L'utilisateur a refusé d'accorder l'accès", error);
        }
    } else {
        console.log("Non-Ethereum browser detected. You should consider trying MetaMask!");
    }
}

function showAccountDetails(account, networkId, networkType) {
    // Affiche l'adresse de l'utilisateur et les détails du réseau sur la page
    const accountElement = document.getElementById('accountAddress');
    const networkElement = document.getElementById('networkInfo');

    accountElement.textContent = `Address: ${account}`;
    networkElement.textContent = `Network ID: ${networkId}, Network Type: ${networkType}`;
}


// Votre code d'initialisation Web3 et la fonction connect() restent les mêmes

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

