const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');

const { createMnemonic } = require('./wallet/mnemonic');
const Wallet = require('./wallet/wallet');

const PROTO_PATH = path.resolve(__dirname, 'proto/wallet.proto');

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    arrays: true,
});

const walletsProto = grpc.loadPackageDefinition(packageDefinition);

const server = new grpc.Server();

server.addService(walletsProto.WalletService.service, {
    createWallet: (call, callback) => {
        try {
            const w = new Wallet(call.request.mnemonic);
            const wallet = w.createWallet(call.request.walletName);
            callback(null, { wallet });
        } catch (error) {
            callback({
                code: grpc.status.NOT_FOUND,
                details: error.message,
            });
        }
    },
    createMnemonic: (call, callback) => {
        try {
            const mnemonic = createMnemonic(
                call.request.mnemonicLength,
                call.request.language,
            );
            callback(null, { mnemonic });
        } catch (error) {
            callback({
                code: grpc.status.NOT_FOUND,
                details: error.message,
            });
        }
    },
});

server.bindAsync(
    '127.0.0.1:50051',
    grpc.ServerCredentials.createInsecure(),
    (error, port) => {
        console.log(`Server running at http://127.0.0.1:${port}`);
        server.start();
    },
);
