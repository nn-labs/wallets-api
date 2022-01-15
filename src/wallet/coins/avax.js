const bip39 = require('bip39');
const { hdkey } = require('ethereumjs-wallet');
const { createMnemonic } = require('../mnemonic');
const { AVAXPath } = require('./paths');

function createAVAXWallet(mnemonic) {
    const mnc =
        mnemonic && mnemonic !== '' ? mnemonic : createMnemonic(12, 'english');
    const seed = bip39.mnemonicToSeedSync(mnc);

    const AVAXHdWallet = hdkey.fromMasterSeed(seed);
    const AVAXWallet = AVAXHdWallet.derivePath(AVAXPath).getWallet();
    const AVAXAddress = `0x${AVAXWallet.getAddress().toString('hex')}`;
    const AVAXPrivateKey = `0x${AVAXWallet.getPrivateKey().toString('hex')}`;

    return {
        mnemonic: mnc,
        coinName: 'AVAX-C',
        address: AVAXAddress,
        private: AVAXPrivateKey,
    };
}
module.exports = { createAVAXWallet };
