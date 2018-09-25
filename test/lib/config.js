const binaryen = require('binaryen');
const config = {
    account: 'bpa',
    keyProvider: "5KAid1JShX7Q8H5BpQ2XeLDzvxEegq4qf7bNBh7DFsiEyveMPg2",
    httpEndpoint: "http://192.168.0.171:8888",
    expireInSeconds: 60,
    broadcast: true,
    debug: true,
    sign: true,
    binaryen: binaryen
};
module.exports = config;