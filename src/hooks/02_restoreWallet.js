const { mnemonicToEntropy } = require("ethereum-cryptography/bip39");
const { wordlist } = require("ethereum-cryptography/bip39/wordlists/english");
const { HDKey } = require("ethereum-cryptography/hdkey");
const { getPublicKey } = require("ethereum-cryptography/secp256k1");
const { keccak256 } = require("ethereum-cryptography/keccak");
const { bytesToHex } = require("ethereum-cryptography/utils");
const { writeFileSync, readFileSync } = require("fs");

export async function restoreWallet(_mnemonic) {
    const entropy = mnemonicToEntropy(_mnemonic, wordlist);
    const hdRootKey = HDKey.fromMasterSeed(entropy);
    const privateKey = hdRootKey.deriveChild(0).privateKey;
    const publicKey = getPublicKey(privateKey);
    const address = keccak256(publicKey).slice(-20);
    const addressHex = `0x${bytesToHex(address)}`;
    console.log(`Account One Wallet Address: ${addressHex}`);

    // Check if the address already exists in the database
    try {
        const accountRawData = readFileSync("account-2.json", "utf8");
        const accountData = JSON.parse(accountRawData);
        if (accountData.address === addressHex) {
            console.log("Address already exists in the database. No new account created.");
            return;
        }
    } catch (error) {
        // If the file doesn't exist or is empty, we can proceed to store the new account
    }

    _store(privateKey, publicKey, address);
    return {address: addressHex};
}

function _store(_privateKey, _publicKey, _address) {
    const accountOne = {
        privateKey: _privateKey,
        publicKey: _publicKey,
        address: _address
    }

    const accountOneData = JSON.stringify(accountOne);
    writeFileSync("account-2.json", accountOneData);
}

// main(process.argv[2])
// .then(() => process.exit(0))
// .catch((error) => {
//     console.error(error);
//     process.exit(1);
// })