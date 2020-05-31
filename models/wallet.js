const secureRandom = require('secure-random');
const EC = require('elliptic').ec;
const ecdsa = new EC('secp256k1');
class Wallet {
    constructor (){
        this.wallet = {
            publicKey : null,
            privateKey : null
        }
    }
    genenatorNewWallet(){
        this.wallet.privateKey = secureRandom.randomBuffer(32).toString('hex');
        let  keys = ecdsa.keyFromPrivate(this.wallet.privateKey);  
        this.wallet.publicKey = keys.getPublic('hex'); 
        return this.wallet;
    }
    isValidPublicKey (publicKey){
        return ecdsa.keyFromPrivate(this.wallet.privateKey).getPublic('hex') == publicKey;  
    }
}
module.exports = Wallet;