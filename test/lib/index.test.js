const assert = require('assert');
const CoinxpEos = require('../../lib');
const config = require('./config');

describe('index.js', () => {
    let coinxpEos;
    before(() => {
        console.log(config);
        coinxpEos = new CoinxpEos(config);
    });

    it('#method "getTable()" find withdraw table should return arrays', async () => {
        let withdrawals = await coinxpEos.getTable('BTC', 'withdraw', 'withdrawals', 0, -1, 1000);
        assert.equal(typeof(withdrawals), 'object');
        console.log('withdraw rows length:', withdrawals.length);
    });

    it('#method "address.add()"', () => {
        coinxpEos.address.add('BTC', "testAddress1", "testHash1");
    })

});


