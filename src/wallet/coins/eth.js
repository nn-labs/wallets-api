const bip39 = require('bip39');
const { hdkey } = require('ethereumjs-wallet');
const { createMnemonic } = require('../mnemonic');
const { ETHPath } = require('./paths');

function createETHWallet(mnemonic) {
    const mnc =
        mnemonic && mnemonic !== '' ? mnemonic : createMnemonic(12, 'english');
    const seed = bip39.mnemonicToSeedSync(mnc);

    const ETHHdWallet = hdkey.fromMasterSeed(seed);
    const ETHWallet = ETHHdWallet.derivePath(ETHPath).getWallet();
    const ETHAddress = `0x${ETHWallet.getAddress().toString('hex')}`;
    const ETHPrivateKey = `0x${ETHWallet.getPrivateKey().toString('hex')}`;

    return {
        mnemonic: mnc,
        coinName: 'ETH',
        address: ETHAddress,
        private: ETHPrivateKey,
    };
}

module.exports = { createETHWallet };
