const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');

const { createWalletByName } = require('./wallet/createWallet');
const { createMnemonic } = require('./wallet/mnemonic');

const PROTO_PATH = path.resolve(__dirname, 'proto/wallets.proto');

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    arrays: true,
});

const walletsProto = grpc.loadPackageDefinition(packageDefinition);

const server = new grpc.Server();

server.addService(walletsProto.WalletsService.service, {
    createWallet: (call, callback) => {
        try {
            const wallet = createWalletByName(call.request.name);
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
            const mnemonic = createMnemonic();
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
