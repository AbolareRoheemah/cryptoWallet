const { generateMnemonic, mnemonicToEntropy } 
= require("ethereum-cryptography/bip39");
const { wordlist } = require("ethereum-cryptography/bip39/wordlists/english");

function _generateMnemonic() {
  const strength = 128; // 256 bits, 24 words; default is 128 bits, 12 words
  const mnemonic = generateMnemonic(wordlist, strength);
  const entropy = mnemonicToEntropy(mnemonic, wordlist);
  return { mnemonic, entropy };
}
const { HDKey } = require("ethereum-cryptography/hdkey");

function _getHdRootKey(_mnemonic) {
  return HDKey.fromMasterSeed(_mnemonic);
}
function _generatePrivateKey(_hdRootKey, _accountIndex) {
    return _hdRootKey.deriveChild(_accountIndex).privateKey;
}
const { getPublicKey } = require("ethereum-cryptography/secp256k1");

function _getPublicKey(_privateKey) {
  return getPublicKey(_privateKey);
}
const { keccak256 } = require("ethereum-cryptography/keccak");

function _getEthAddress(_publicKey) {
  return keccak256(_publicKey).slice(-20);
}

const { bytesToHex } = require("ethereum-cryptography/utils");

function _store(_privateKey, _publicKey, _address) {
  const accountOne = {
      privateKey: _privateKey,
      publicKey: _publicKey,
      address: _address
  }

  const accountOneData = JSON.stringify(accountOne);
  writeFileSync("account-2.json", accountOneData);
}

export async function createNewAccount() {
  const { mnemonic, entropy } = _generateMnemonic();
  console.log(`WARNING! Never disclose your Seed Phrase:\n ${mnemonic}`);

  const hdRootKey = _getHdRootKey(entropy);
  const accountOneIndex = 0;
  const accountOnePrivateKey = _generatePrivateKey(hdRootKey, accountOneIndex);
  const accountOnePublicKey = _getPublicKey(accountOnePrivateKey);
  const accountOneAddress = _getEthAddress(accountOnePublicKey);
  // _store(accountOnePrivateKey, accountOnePublicKey, accountOneAddress);

  return {
    address: `0x${bytesToHex(accountOneAddress)}`,
    mnemonic: mnemonic
  };
}

// createNewAccount()
//   .then(() => process.exit(0))
//   .catch((error) => {
//     console.error(error);
//     process.exit(1);
//   });