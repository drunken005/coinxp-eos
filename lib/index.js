const Eos = require('eosjs');
const Address = require('./address');
const DepositTx = require('./deposit.tx');
const Withdraw = require('./withdraw');

class CoinXPEos {

    constructor() {
        let config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
        if (!config.account) {
            throw new Error('missing key, check your account');
        }
        this.account = config.account;

        config = Object.assign({}, {
            httpEndpoint: 'http://127.0.0.1:8888',
            debug: false,
            verbose: false,
            broadcast: true,
            expireInSeconds: 60,
            sign: true
        }, config);
        this.eos = Eos(config);
        this.account = config.account;
        this.options = {
            authorization: config.account + '@active',
            broadcast: true,
            sign: true
        };

        // PROMISES for deposit.tx,withdraw,address contracts
        this.depositTxContract = this.eos.contract('deposit.tx');
        this.withdrawContract = this.eos.contract('withdraw');
        this.addressContract = this.eos.contract('address');

        this.address = new Address(config.account, this.addressContract, this.options);
        this.deposit = new DepositTx(config.account, this.depositTxContract, this.options);
        this.withdraw = new Withdraw(config.account, this.withdrawContract, this.options);
    }

    getTable(scope, code, table, lower_bound, upper_bound, limit) {
        const self = this;
        return new Promise(function (resolve, reject){
            self.eos.getTableRows({scope, code, table, json: true, lower_bound, upper_bound, limit}).then(result => {
                return resolve(result.rows);
            }).catch(err => {
                console.error(err);
                return reject(err);
            });
        });

    }
}

module.exports = CoinXPEos;