class DepositTx {
    constructor(account, contract, options) {
        this.account = account;
        this.options = options;
        this.contract = contract;
    }

    confirm(from, to, amount, transactionHash) {
        const self = this;
        this.contract.then(tx => {
            tx.confirm(self.account, from, to, amount, transactionHash, self.options).then(result => {
                console.log("Confirmed transaction: " + transactionHash + "\n");
            }).catch(err => {
                console.error(err);
            })
        }).catch(err => {
            console.error(err);
        })
    }
}

module.exports = DepositTx;