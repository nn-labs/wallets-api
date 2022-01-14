const bip39 = require('bip39');
const bitcoin = require('bitcoinjs-lib');
const ecc = require('tiny-secp256k1');

const { BIP32Factory } = require('bip32');
const { createMnemonic } = require('../mnemonic');
const { BTCPath } = require('./paths');

function createBTCWallet() {
    const mnemonic = createMnemonic();
    const seed = bip39.mnemonicToSeedSync(mnemonic);

    const network = bitcoin.networks.bitcoin;

    const bip32 = BIP32Factory(ecc);
    const BTCNode = bip32.fromSeed(seed, network);
    const BTCChild = BTCNode.derivePath(BTCPath);
    // const node = account.derive(0).derive(0);

    // p2wpkh
    const BTCAddress = bitcoin.payments.p2pkh({
        pubkey: BTCChild.publicKey,
        network: network,
    }).address;
    const BTCPrivateKey = BTCChild.toWIF();

    return {
        mnemonic,
        coinName: 'BTC',
        address: BTCAddress,
        private: BTCPrivateKey,
    };
}

module.exports = { createBTCWallet };
