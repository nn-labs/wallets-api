const path = require('path');

const PROTO_PATH = path.resolve(__dirname, 'proto/wallet.proto');

const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    arrays: true,
});

const { WalletService } = grpc.loadPackageDefinition(packageDefinition);
const client = new WalletService(
    'localhost:50051',
    grpc.credentials.createInsecure(),
);

client.createWallet({ walletName: 'ETH' }, (err, data) => {
    if (err) {
        console.log(err);
        return;
    }

    console.log(data);
});

client.createMnemonic(null, (err, data) => {
    if (err) {
        console.log(err);
        return;
    }

    console.log(data);
});
