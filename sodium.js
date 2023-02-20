// require('dotenv').config()
var sodium = require('sodium-native')

// The secret key (32 bytes)
const key = Buffer.from('01234567890123456789012345878901');

// The nonce (24 bytes)
const nonce = Buffer.from('012345678901234567899123');

function createCiphertext(plaintext) {

    try {
        // Create a buffer to hold the encrypted message
        plaintext = Buffer.from(plaintext)
        const ciphertext = Buffer.alloc(sodium.crypto_secretbox_MACBYTES + plaintext.length);

        // Encrypt the message using the fixed nonce and key
        sodium.crypto_secretbox_easy(ciphertext, plaintext, nonce, key);

        return ciphertext.toString('hex');

    }
    catch (err) {
        return err
    }

}


function decodeCiphertext(ciphertext) {
    try {

        ciphertext = Buffer.from(ciphertext, 'hex')
        const plaintext = Buffer.alloc(ciphertext.length - sodium.crypto_secretbox_MACBYTES);


        // Decrypt the message using the fixed nonce and key
        if (!sodium.crypto_secretbox_open_easy(plaintext, ciphertext, nonce, key)) {
            throw new Error('Failed to decrypt message');
        }

        return plaintext.toString();
    }

    catch (err) {
        return err
    }

}

module.exports = {
    decodeCiphertext,
    createCiphertext
}