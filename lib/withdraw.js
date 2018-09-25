class Withdraw {
    constructor(account, contract, options) {
        this.account = account;
        this.options = options;
        this.contract = contract;
    }

    _contract(){
        const self = this;
        return new Promise(function (resolve, reject) {
             function callback(err, result) {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            }
        });
    }


    setExecutor(headBlockNum, tokenSymbol, id,) {
        const self = this;
        this.contract.then(withdraw => {
            withdraw.setexecutor(self.account, headBlockNum, tokenSymbol, id, self.options).then(result => {
                console.log(` ------ withdraw::setexcutor(${self.account}, ${headBlockNum}) for withdrawal ${id}`);
            }).catch(err => {
                console.error(`${tokenSymbol} withdraw setexecutor error: ${err.message}`);
            })
        }).catch(err => {
            console.error(err);
        })
    }

    setPending(tokenSymbol, id) {
        const self = this;
        this.contract.then(withdraw => {
            withdraw.setpending(self.account, tokenSymbol, id, self.options).then(result => {
                console.log(" ------ Processing " + tokenSymbol + " withdrawal " + id + " by " + self.account);
            }).catch(err => {
                console.error(`${tokenSymbol} withdraw setpending error: ${err.message}`);
            })
        }).catch(err => {
            console.error(err);
        })
    }

    errorHandle(id, amount, to, transactionHash, errorCode) {
        const self = this;
        this.contract.then(withdraw => {
            withdraw.errorhandle(self.account, id, amount, to, transactionHash, errorCode, self.options).then(result => {
                console.log(" ------ Withdraw error handle transaction: " + id + "\n");
            }).catch(err => {
                console.log(err);
            })
        }).catch(err => {
            console.error(err);
        })
    }


    confirm(from, to, amount, transactionHash) {
        const self = this;
        this.contract.then(withdraw => {
            withdraw.confirm(self.account, from, to, amount, transactionHash, self.options).then(result => {
                console.log(" ------ Withdraw confirmed transaction: " + transactionHash + "\n");
            }).catch(err => {
                console.log(err);
            })
        }).catch(err => {
            console.error(err);
        })
    }

}

module.exports = Withdraw;
