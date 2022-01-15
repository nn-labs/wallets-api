const Wallet = require('./wallet');

function createWalletByName(name, mnemonic) {
    const wallet = new Wallet(mnemonic);

    switch (name) {
        case 'BTC':
            return wallet.getBtcWallet();
        case 'ETH':
            return wallet.getEthWallet();
        case 'ATOM-Cosmos':
            return wallet.getAtomCosmosWallet();
        case 'SOL':
            return wallet.getSolWallet();
        case 'AVAX':
            return wallet.getAvaxWallet();
        case 'LUNA':
            return wallet.getTerraLunaWallet();
        default:
            throw Error('Wrong type of wallet!');
    }
}

module.exports = { createWalletByName };
