const fs = require('fs');
const Web3 = require('web3');
const web3 = new Web3('https://mainnet.infura.io/v3/YOUR_INFURA_PROJECT_ID'); // Use your Infura Project ID

document.getElementById('walletForm').addEventListener('submit', function(e){
    e.preventDefault();
    const wallet = document.getElementById('wallet').value;
    getTransactions(wallet);
});

async function getTransactions(wallet) {
    const transactions = await web3.eth.getPastLogs({
        fromBlock: 'earliest',
        address: wallet
    });

    fs.readFile('database.txt', 'utf8', function(err, data) {
        if (err) throw err;
        const parsedTransactions = data.split('\n').map(line => {
            const [type, shitcoinAddress, userAddress, ethAmount, shitcoinAmount] = line.split(',');
            return { type, shitcoinAddress, userAddress, ethAmount: parseFloat(ethAmount), shitcoinAmount: parseFloat(shitcoinAmount) };
        });

        // Filter transactions for the given wallet address
        const walletTransactions = parsedTransactions.filter(transaction => transaction.userAddress === wallet);

        // Calculate the total ETH bought and sold
        const totalBought = walletTransactions.filter(transaction => transaction.type === 'Achat')
                                              .reduce((total, transaction) => total + transaction.ethAmount, 0);
        const totalSold = walletTransactions.filter(transaction => transaction.type === 'Vente')
                                            .reduce((total, transaction) => total + transaction.ethAmount, 0);

        // Calculate the difference
        const difference = totalSold - totalBought;

        // Create a results string and color
        let resultsString = `Total ETH Bought: ${totalBought}<br>
                             Total ETH Sold: ${totalSold}<br>
                             Difference: ${difference}`;

        let color = 'black';
        if (difference > 0) {
            color = 'green';
        } else if (difference < 0) {
            color = 'red';
        }

        // Then display the results
        document.getElementById('results').innerHTML = resultsString;
        document.getElementById('results').style.color = color;
    });
}
