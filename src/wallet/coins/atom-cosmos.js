const bip39 = require('bip39');
const { bech32 } = require('bech32');
const { BIP32Factory } = require('bip32');
const ecc = require('tiny-secp256k1');
const { createMnemonic } = require('../mnemonic');
const { ATOMCosmosPath } = require('./paths');

function createAtomCosmosWallet() {
    const mnemonic = createMnemonic();
    const seed = bip39.mnemonicToSeedSync(mnemonic);

    const bip32 = BIP32Factory(ecc);

    const ATOMPrefix = 'cosmos';
    const ATOMNode = bip32.fromSeed(seed);
    const ATOMChild = ATOMNode.derivePath(ATOMCosmosPath);
    const ATOMWords = bech32.toWords(ATOMChild.identifier);
    const ATOMAddress = bech32.encode(ATOMPrefix, ATOMWords);
    const ATOMPrivateKey = ATOMChild.privateKey.toString('hex');

    return {
        mnemonic,
        coinName: 'ATOM-Cosmos',
        address: ATOMAddress,
        private: ATOMPrivateKey,
    };
}

module.exports = { createAtomCosmosWallet };
