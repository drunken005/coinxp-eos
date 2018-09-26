const assert = require('assert');
const CoinXpEos = require('./index');

describe('index.js', () => {
    const config = {
        account: 'bpb',
        keyProvider: "5KAid1JShX7Q8H5BpQ2XeLDzvxEegq4qf7bNBh7DFsiEyveMPg2",
        httpEndpoint: "http://192.168.0.171:8888",
        printMethods: true
    };
    let coinxpEos;
    before(() => {
        coinxpEos = new CoinXpEos(config);
        coinxpEos.register('deposit.tx', ["confirm"]);
        coinxpEos.register('address', ["add", "approve", "reject"]);
    });

    it('#method "getTable()" find withdraw table should return arrays', async () => {
        let withdrawals = await coinxpEos.getTable({scope: 'ETH', code: 'address', table: 'addresses', limit: 1000});
        assert.equal(typeof(withdrawals), 'object');
        console.log('withdraw rows length:', withdrawals.length);
    });

    it('#method "info()" should return eos chain info', async () => {
        let result = await coinxpEos.info();
        assert.equal(typeof (result.chain_id), 'string');
        assert.ok(result.head_block_num > 0);
    });


    it('#method "address.add()" should execute success and return address', () => {
        coinxpEos.addressAdd('ETH', '0x3D8a29f01e91EED5c0B290B74f0616FF8ce327D5', "0x9fa8ccd6cf23c51b8a3be7f93ce296f074b2bd8f502d65cbddd13e92401c04c5").then((res) => {
            console.log(" Created new address: ", res.args[1]);
        }).catch((error) => {
            console.error("  ---- add address error:", error);
        });
    });

    it('#method "addressContract.approve()" test contract instance call method approve.', async () => {
        coinxpEos.addressContract.then((contract) => {
            contract.approve(coinxpEos.account, "ETH", "0x3D8a29f01e91EED5c0B290B74f0616FF8ce327D5", coinxpEos.options).then(result => {
                console.log("Approved address: 0x3D8a29f01e91EED5c0B290B74f0616FF8ce327D5");
            }).catch(err => {
                console.log(err);
            })
        }).catch((error) => {
            console.log(error)
        });
    });

});


