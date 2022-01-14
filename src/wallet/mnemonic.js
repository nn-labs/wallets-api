const bip39 = require('bip39');

function createMnemonic(length, language) {
    const mnemonicLength = {
        12: 128,
        24: 256,
    };
    const languages = [
        'english',
        'spanish',
        'japanese',
        'italian',
        'french',
        'korean',
        'czech',
        'portuguese',
    ];

    if (!(length in mnemonicLength)) {
        throw new Error('wrong length of mnemonic');
    }

    if (!languages.includes(language)) {
        throw new Error('invalid language');
    }

    return bip39.generateMnemonic(
        mnemonicLength[length],
        null,
        bip39.wordlists[language],
    );
}

module.exports = { createMnemonic };
