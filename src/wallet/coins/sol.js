const bip39 = require('bip39');
const nacl = require('tweetnacl');
const bs58 = require('bs58');
const { BIP32Factory } = require('bip32');
const ecc = require('tiny-secp256k1');
const { createMnemonic } = require('../mnemonic');
const { SOLPath } = require('./paths');
const { toBuffer } = require('../../helpers/toBuffer');

function createSOLWallet() {
    const mnemonic = createMnemonic(12, 'english');
    const seed = bip39.mnemonicToSeedSync(mnemonic);

    const bip32 = BIP32Factory(ecc);

    const SOLDeriveSeed = bip32.fromSeed(seed).derivePath(SOLPath).privateKey;
    const SOLSecretKey = nacl.sign.keyPair.fromSeed(SOLDeriveSeed).secretKey;
    const SOLKeyPair = nacl.sign.keyPair.fromSecretKey(toBuffer(SOLSecretKey));
    const SOLAddress = bs58.encode(toBuffer(SOLKeyPair.publicKey));
    const SOLPrivateKey = bs58.encode(toBuffer(SOLKeyPair.secretKey));
    return {
        mnemonic,
        coinName: 'SOL',
        address: SOLAddress,
        private: SOLPrivateKey,
    };
}

module.exports = { createSOLWallet };
