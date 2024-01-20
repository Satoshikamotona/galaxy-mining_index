// Importation de Web3 (si vous utilisez un module bundler comme Webpack)
// Sinon, Web3 sera disponible globalement grâce à la balise <script> dans votre HTML
// import Web3 from "web3"; 

let web3;

async function connect() {
    if (window.ethereum) {
        try {
            await window.ethereum.request({ method: "eth_requestAccounts" });
            web3 = new Web3(window.ethereum);
            console.log("Connecté au portefeuille Ethereum");
        } catch (error) {
            console.error("L'utilisateur a refusé d'accorder l'accès", error);
        }
    } else if (window.web3) {
        web3 = new Web3(window.web3.currentProvider);
    } else {
        console.log("Non-Ethereum browser detected. You should consider trying MetaMask!");
    }
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

    // ... Autre code JavaScript ...
});

connectButton.addEventListener('click', function (e) {
    e.preventDefault();
    console.log("Bouton Connect Wallet cliqué");
    connect();
});

document.getElementById('connectWalletButton').addEventListener('click', function(e) {
    e.preventDefault();
    alert('Bouton cliqué!');
});
