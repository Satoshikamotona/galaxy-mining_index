const web3 = new Web3(window.ethereum);

const contractABI = [[{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"referrers","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"referrer","type":"address"}],"name":"register","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"registrationFees","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"}]]; // Votre ABI ici
const contractAddress = '0xaC048568bB07cA5C9BC7373c5c9227c3D4492343'; // Votre adresse de contrat ici

const contract = new web3.eth.Contract(contractABI, contractAddress);

document.getElementById('registrationForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const parrainAddress = document.getElementById('parrain').value;
    try {
        const accounts = await web3.eth.getAccounts();
        await contract.methods.register(parrainAddress).send({ from: accounts[0] });
        console.log("Inscription réussie");
    } catch (error) {
        console.error("Erreur lors de l'inscription :", error);
    }
});
