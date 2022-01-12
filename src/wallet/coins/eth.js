const bip39 = require('bip39');
const { hdkey } = require('ethereumjs-wallet');
const { createMnemonic } = require('../mnemonic');
const { ETHPath } = require('./paths');

function createETHWallet() {
    const mnemonic = createMnemonic();
    const seed = bip39.mnemonicToSeedSync(mnemonic);

    const ETHHdWallet = hdkey.fromMasterSeed(seed);
    const ETHWallet = ETHHdWallet.derivePath(ETHPath).getWallet();
    const ETHAddress = `0x${ETHWallet.getAddress().toString('hex')}`;
    const ETHPrivateKey = `0x${ETHWallet.getPrivateKey().toString('hex')}`;

    return {
        mnemonic,
        coinName: 'ETH',
        address: ETHAddress,
        private: ETHPrivateKey,
    };
}

module.exports = { createETHWallet };
