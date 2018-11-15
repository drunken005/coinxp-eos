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
        authorization: [config.account, 'active'].join('@'),
        broadcast: true,
        sign: true
    };
}

/**
 * Register the contracts and actions that need to be invoked
 * @param contract  Eos smart contract name, type string
 * @param actions  Eos smart contract actions, type arrays
 */
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

    //Callable smart contract instances
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
                    _con[action](...args, self.options).then(result => {
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

/**
 * Call table for smart contracts on the eos chain
 * @param scope
 * @param code
 * @param table
 * @param lower_bound
 * @param upper_bound
 * @param limit
 * @returns {Promise<any>}
 */
CoinXpEos.prototype.getTable = function (args) {
    const self = this;
    return new Promise(function (resolve, reject) {
        self.eos.getTableRows(args).then(result => {
            return resolve(result.rows);
        }).catch(err => {
            return reject(err);
        });
    });
};

/**
 * Get eos chain info
 * @returns {Promise<any>}
 */
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


