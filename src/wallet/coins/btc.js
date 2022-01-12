const bip39 = require('bip39');
const bitcoin = require('bitcoinjs-lib');
const ecc = require('tiny-secp256k1');

const { BIP32Factory } = require('bip32');
const { createMnemonic } = require('../mnemonic');
const { BTCPath } = require('./paths');

function createBTCWallet() {
    const mnemonic = createMnemonic();
    const seed = bip39.mnemonicToSeedSync(mnemonic);

    // Define the network
    const network = bitcoin.networks.bitcoin; // use networks.testnet for testnet

    const bip32 = BIP32Factory(ecc);

    const root = bip32.fromSeed(seed, network);

    const account = root.derivePath(BTCPath);
    const node = account.derive(0).derive(0);

    // p2pkh
    const btcAddress = bitcoin.payments.p2wpkh({
        pubkey: node.publicKey,
        network: network,
    }).address;

    return {
        mnemonic,
        coinName: 'BTC',
        address: btcAddress,
        private: node.toWIF(),
    };
}

module.exports = { createBTCWallet };
