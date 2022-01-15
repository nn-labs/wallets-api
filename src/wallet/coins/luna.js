const bip39 = require('bip39');
const { BIP32Factory } = require('bip32');
const ecc = require('tiny-secp256k1');
const { bech32 } = require('bech32');
const { TerraLunaPath } = require('./paths');
const { createMnemonic } = require('../mnemonic');

function createTerraLunaWallet(mnemonic) {
    const mnc =
        mnemonic && mnemonic !== '' ? mnemonic : createMnemonic(12, 'english');
    const seed = bip39.mnemonicToSeedSync(mnc);

    const bip32 = BIP32Factory(ecc);

    const TerraLunaPrefix = 'terra';
    const TerraLunaNode = bip32.fromSeed(seed);
    const TerraLunaChild = TerraLunaNode.derivePath(TerraLunaPath);

    const TerraLunaWords = bech32.toWords(TerraLunaChild.identifier);
    const TerraLunaAddress = bech32.encode(TerraLunaPrefix, TerraLunaWords);

    const TerraLunaPrivateKey = TerraLunaChild.privateKey.toString('hex');

    return {
        mnemonic: mnc,
        coinName: 'ATOM-Cosmos',
        address: TerraLunaAddress,
        private: TerraLunaPrivateKey,
    };
}

module.exports = { createTerraLunaWallet };
