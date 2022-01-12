const { createBTCWallet } = require('./coins/btc');
const { createETHWallet } = require('./coins/eth');
const { createAtomCosmosWallet } = require('./coins/atom-cosmos');

function createWalletByName(name) {
    switch (name) {
        case 'BTC':
            return createBTCWallet();
        case 'ETH':
            return createETHWallet();
        case 'ATOM-Cosmos':
            return createAtomCosmosWallet();
        default:
            throw Error('Wrong type of wallet!');
    }
}

module.exports = { createWalletByName };
