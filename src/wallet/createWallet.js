const { createBTCWallet } = require('./coins/btc');
const { createETHWallet } = require('./coins/eth');
const { createAtomCosmosWallet } = require('./coins/atom-cosmos');
const { createSOLWallet } = require('./coins/sol');

function createWalletByName(name, mnemonic) {
    switch (name) {
        case 'BTC':
            return createBTCWallet(mnemonic);
        case 'ETH':
            return createETHWallet(mnemonic);
        case 'ATOM-Cosmos':
            return createAtomCosmosWallet(mnemonic);
        case 'SOL':
            return createSOLWallet(mnemonic);
        default:
            throw Error('Wrong type of wallet!');
    }
}

module.exports = { createWalletByName };
