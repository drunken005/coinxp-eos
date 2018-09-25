class Address {
    constructor(account, contract, options) {
        this.account = account;
        this.options = options;
        this.contract = contract;
    }

    add(token, address, transactionHash) {
        const self = this;
        if (!transactionHash) {
            transactionHash = "";
        }
        self.contract.then(addressContract => {
            addressContract.add(self.account, token, address, transactionHash, self.options).then(result => {
                console.log(" Created new address: " + address);
            }).catch(err => {
                console.log(err);
            })
        }).catch(err => {
            console.error(err);
        })
    }

    // approve address
    approve(token, address) {
        const self = this;
        self.contract.then(addressContract => {
            addressContract.approve(self.account, token, address, self.options).then(result => {
                console.log("Approved address: " + address);
            }).catch(err => {
                console.log(err);
            })
        }).catch(err => {
            console.error(err);
        })
    }

    // reject address
    reject(token, address) {
        const self = this;
        self.contract.then(addressContract => {
            addressContract.reject(self.account, token, address, self.options).then(result => {
                console.log("Approved address: " + address);
            }).catch(err => {
                console.log(err);
            })
        }).catch(err => {
            console.error(err);
        })
    }
}

module.exports = Address;