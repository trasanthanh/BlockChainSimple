var Block = require('./block');
var Transaction = require('./transaction');
class Blockchain{
    constructor() {
        this.chain = [this.createFirstBlock()];
        this.difficulty = 1;
        this.pendingTransactions = [];
        this.miningReward = 1;
    }
    createFirstBlock() {
        let totalCoin = 99999999;

        return new Block(Date.parse('2020-05-20'),[new Transaction(null, 'root',totalCoin )], "0");
    }

    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }
    
    miningPendingTransactions(miningRewardAddress) {
        const block = new Block(Date.now(), this.pendingTransactions, this.getLatestBlock().hash);
        block.mineBlock(this.difficulty);
        this.chain.push(block);
        io.sockets.emit('block', JSON.stringify(block));
        io.sockets.emit('transaction', JSON.stringify(this.pendingTransactions));
        this.pendingTransactions = [
            new Transaction(null, miningRewardAddress, this.miningReward)
        ];
    }
    createTransaction(transaction) {
        this.pendingTransactions.push(transaction);
    }

    isChainValid() {
        for (let i = 1; i < this.chain.length; i++){
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];

            if (currentBlock.hash !== currentBlock.calculateHash()) {
                return false;
            }

            if (currentBlock.previousHash !== previousBlock.hash) {
                return false;
            }
        }
        return true;
    }
    getBalanceOfAddress(address){
        let balance = 0;
        for(const block of this.chain){
            for(const trans of block.transactions){
                if (trans.fromAddress === address){
                    balance -= parseInt(trans.amount);
                }
                if(trans.toAddress === address){
                    balance += parseInt(trans.amount);
                }
            }
        }
        return balance;
    }
    getTransactionOfAddress(address){
        let transactions = [];
        for(const block of this.chain){
            for(const trans of block.transactions){
                if (trans.fromAddress == address || trans.toAddress == address){
                   transactions.push(trans);
                }
            }
        }
        return transactions.length > 0 ? transactions : null;
    }
    joinChain(address){
        if(this.getBalanceOfAddress(address) == 0){
            return this.pendingTransactions = [
                new Transaction(null, address, this.miningReward)
            ];
        }
        return null;
    }
    getListPendingTransactions(){
        return  this.pendingTransactions;
    }
}
module.exports = Blockchain;