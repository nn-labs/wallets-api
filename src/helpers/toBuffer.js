const toBuffer = (arr) => {
    if (Buffer.isBuffer(arr)) {
        return arr;
    }
    if (arr instanceof Uint8Array) {
        return Buffer.from(arr.buffer, arr.byteOffset, arr.byteLength);
    }
    return Buffer.from(arr);
};

module.exports = { toBuffer };
