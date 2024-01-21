var registration = function () {
    'use strict';
    const initialiseABI = function () {
        const contractAddress="0xdF1273A5e3372701B97A1580dD856FeF00deF7EB"
        const abi=[{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"referrers","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"referrer","type":"address"}],"name":"register","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"registrationFees","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"}];
        var balance_MAIN = "400000000000000";
        const contract = new web3.eth.Contract(abi, contractAddress)

        return {
            'address':contractAddress,
            'abi':abi,
            'balance_MAIN':balance_MAIN,
            'contract':contract
        }
    };

    const getAccount= async function(){
        const accounts = await window.web3.eth.getAccounts();
        return accounts[0];
    };
    const initialiseEtheruim = async function () {
        if (window.ethereum) {
            window.web3 = new Web3(ethereum);
            try {
                /*await ethereum.request({
                    method: 'eth_requestAccounts'
                });*/
                var networkid = await web3.eth.net.getId()
                if (networkid !== 56) {
                    alert('Connect to BNB Mainnet Network');
                } else {
                    var id_user = $('#id_user_smart').text();
                }
        console.log(networkid)
            } catch (error) {
                $('#spinner_dashboard').hide()
                alert('Error: Out of Gas: please reload this page')
                console.log(error)
            }
        } else if (window.web3) {
            window.web3 = new Web3(web3.currentProvider);
            web3.eth.sendTransaction({/* ... */});
        } else {
            alert('Requires ETH purse to interact smart contract You should consider trying MetaMask!');

        }
    };

    document.addEventListener('DOMContentLoaded', function () {
        const registrationForm = document.getElementById('registrationForm');
        if (registrationForm) {
            registrationForm.addEventListener('submit', async function (e) {
                e.preventDefault();
                const parrainAddress = document.getElementById('parrain').value;
                await registerUser(parrainAddress);
            });
        }
        initContract();
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
    
    function initContract() {
        myContract = new web3.eth.Contract(contractABI, contractAddress);
        console.log("Contrat initialisé", myContract);
    }
    
 
jQuery(document).ready(function() {
    'use strict';
    registration.init();
});
jQuery(window).on('load',function () {
    'use strict';
    registration.load();
});


}
