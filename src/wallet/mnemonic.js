const bip39 = require('bip39');

function createMnemonic() {
    return bip39.generateMnemonic();
}

module.exports = { createMnemonic };
