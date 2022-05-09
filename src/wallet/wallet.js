const bip39 = require('bip39');
const { BIP32Factory } = require('bip32');
const ecc = require('tiny-secp256k1');
const bitcoin = require('bitcoinjs-lib');
const { hdkey } = require('ethereumjs-wallet');
const { bech32 } = require('bech32');
const nacl = require('tweetnacl');
const bs58 = require('bs58');
const { createMnemonic } = require('./mnemonic');
const { derivePath } = require('ed25519-hd-key')
const {
    BTCPath,
    ETHPath,
    ATOMCosmosPath,
    TerraLunaPath,
    NearPath,
    SOLPath,
    AVAXPath,
} = require('./paths');
const { toBuffer } = require('../helpers/toBuffer');

class Wallet {
    constructor(mnemonic) {
        this.mnemonic =
            mnemonic && mnemonic !== ''
                ? mnemonic
                : createMnemonic(12, 'english');

        this.seed = bip39.mnemonicToSeedSync(this.mnemonic);
        this.bip32 = BIP32Factory(ecc);
        this.network = bitcoin.networks.bitcoin;
    }

    getBtcWallet() {
        const BTCNode = this.bip32.fromSeed(this.seed, this.network);
        const BTCChild = BTCNode.derivePath(BTCPath);
        // const node = account.derive(0).derive(0);

        // p2wpkh
        const BTCAddress = bitcoin.payments.p2pkh({
            pubkey: BTCChild.publicKey,
            network: this.network,
        }).address;

        const BTCPrivateKey = BTCChild.toWIF();

        return {
            mnemonic: this.mnemonic,
            coinName: 'BTC',
            address: BTCAddress,
            private: BTCPrivateKey,
        };
    }

    getEthWallet() {
        const ETHNode = hdkey.fromMasterSeed(this.seed);
        const ETHChild = ETHNode.derivePath(ETHPath).getWallet();

        const ETHAddress = `0x${ETHChild.getAddress().toString('hex')}`;
        const ETHPrivateKey = `0x${ETHChild.getPrivateKey().toString('hex')}`;

        return {
            mnemonic: this.mnemonic,
            coinName: 'ETH',
            address: ETHAddress,
            private: ETHPrivateKey,
        };
    }

    getAtomCosmosWallet() {
        const ATOMPrefix = 'cosmos';

        const ATOMNode = this.bip32.fromSeed(this.seed);
        const ATOMChild = ATOMNode.derivePath(ATOMCosmosPath);

        const ATOMWords = bech32.toWords(ATOMChild.identifier);
        const ATOMAddress = bech32.encode(ATOMPrefix, ATOMWords);

        const ATOMPrivateKey = ATOMChild.privateKey.toString('base64');

        return {
            mnemonic: this.mnemonic,
            coinName: 'ATOM-Cosmos',
            address: ATOMAddress,
            private: ATOMPrivateKey,
        };
    }

    getTerraLunaWallet() {
        const TerraLunaPrefix = 'terra';

        const TerraLunaNode = this.bip32.fromSeed(this.seed);
        const TerraLunaChild = TerraLunaNode.derivePath(TerraLunaPath);

        const TerraLunaWords = bech32.toWords(TerraLunaChild.identifier);
        const TerraLunaAddress = bech32.encode(TerraLunaPrefix, TerraLunaWords);

        const TerraLunaPrivateKey = TerraLunaChild.privateKey.toString('hex');

        return {
            mnemonic: this.mnemonic,
            coinName: 'Terra-LUNA',
            address: TerraLunaAddress,
            private: TerraLunaPrivateKey,
        };
    }

    getSolWallet() {
        const SOLDeriveSeed = this.bip32
            .fromSeed(this.seed)
            .derivePath(SOLPath).privateKey;

        const SOLSecretKey =
            nacl.sign.keyPair.fromSeed(SOLDeriveSeed).secretKey;

        const SOLKeyPair = nacl.sign.keyPair.fromSecretKey(
            toBuffer(SOLSecretKey),
        );

        const SOLAddress = bs58.encode(toBuffer(SOLKeyPair.publicKey));
        const SOLPrivateKey = bs58.encode(toBuffer(SOLKeyPair.secretKey));

        return {
            mnemonic: this.mnemonic,
            coinName: 'SOL',
            address: SOLAddress,
            private: SOLPrivateKey,
        };
    }

    getAvaxWallet() {
        const AVAXNode = hdkey.fromMasterSeed(this.seed);
        const AVAXChild = AVAXNode.derivePath(AVAXPath).getWallet();

        const AVAXAddress = `0x${AVAXChild.getAddress().toString('hex')}`;
        const AVAXPrivateKey = `0x${AVAXChild.getPrivateKey().toString('hex')}`;

        return {
            mnemonic: this.mnemonic,
            coinName: 'AVAX-C',
            address: AVAXAddress,
            private: AVAXPrivateKey,
        };
    }

    getNearWallet() {
        const { key } = derivePath(NearPath, this.seed.toString('hex'))
        const NearKeyPair = nacl.sign.keyPair.fromSeed(key)
        const NearPublicKey = 'ed25519:' + bs58.encode(toBuffer(NearKeyPair.publicKey))
        const NearSecretKey = 'ed25519:' + bs58.encode(toBuffer(NearKeyPair.secretKey))

        return {
            mnemonic: this.mnemonic,
            coinName: 'NEAR',
            public: NearPublicKey,
            private: NearSecretKey,
            address: Buffer.from(bs58.decode(publicKey.replace('ed25519:', ''))).toString('hex')
        };
    }
    

    createWallet(name) {
        switch (name) {
            case 'BTC':
                return this.getBtcWallet();
            case 'ETH':
                return this.getEthWallet();
            case 'ATOM-Cosmos':
                return this.getAtomCosmosWallet();
            case 'SOL':
                return this.getSolWallet();
            case 'AVAX':
                return this.getAvaxWallet();
            case 'LUNA':
                return this.getTerraLunaWallet();
            case 'NEAR':
                return this.getNearWallet();
            default:
                throw Error('Wrong type of wallet!');
        }
    }
}

module.exports = Wallet;
