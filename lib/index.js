const Eos = require('eosjs');
const _ = require('lodash');
let binaryen = require('binaryen');

function CoinXpEos() {
    let config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    if (!config.account) {
        throw new Error('missing key, check your account');
    }
    this.account = config.account;
    this.printMethods = config.printMethods;
    config = Object.assign({}, {
        httpEndpoint: 'http://127.0.0.1:8888',
        debug: false,
        broadcast: true,
        expireInSeconds: 60,
        sign: true,
        verbose: false,
        binaryen: binaryen
    }, config);
    this.eos = Eos(config);
    this.options = {
        authorization: config.account + '@active',
        broadcast: true,
        sign: true
    };
}

CoinXpEos.prototype.register = function (contract, actions) {
    if (!contract) {
        throw new Error('missing contract, check your contract');
    }
    if (!actions || !_.isArray(actions)) {
        throw new Error('actions must is array');
    }
    let cs = contract.split('.');
    let m = '';
    if (cs.length > 0) {
        cs.forEach(function (c, index) {
            if (index === 0) {
                m += c;
            } else {
                m += _.upperFirst(c);
            }
        })
    } else {
        m = cs[0];
    }
    let _contract = this.eos.contract(contract);
    let contractInstance = m + 'Contract';
    this[contractInstance] = _contract;
    let self = this;
    let methods = [];
    actions.forEach(function (action) {
        let method = m + _.upperFirst(action);
        methods.push(method);
        CoinXpEos.prototype[method] = function () {
            let args = Array.prototype.slice.apply(arguments);
            return new Promise(function (resolve, reject) {
                _contract.then(_con => {
                    _con[action](self.account, ...args, self.options).then(result => {
                        resolve(Object.assign({account: self.account, options: self.options, args}, result));
                    }).catch(err => {
                        reject(err);
                    })
                }).catch(err => {
                    reject(err);
                })
            });
        }
    });
    this.printMethods && console.log({contract, contractInstance, methods});
};


CoinXpEos.prototype.getTable = function (scope, code, table, lower_bound, upper_bound, limit) {
    const self = this;
    return new Promise(function (resolve, reject) {
        self.eos.getTableRows({scope, code, table, json: true, lower_bound, upper_bound, limit}).then(result => {
            return resolve(result.rows);
        }).catch(err => {
            return reject(err);
        });
    });
};

CoinXpEos.prototype.info = function () {
    const self = this;
    return new Promise(function (resolve, reject) {
        self.eos.getInfo({}).then((res) => {
            resolve(res);
        }).catch((error) => {
            reject(error);
        })
    })
};

module.exports = CoinXpEos;


