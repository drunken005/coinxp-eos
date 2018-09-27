# coinxp-eos
EOS configuration is simplified and specified smart contract registration and invocation is supported for javascript

### usage
#### Install
```bash
npm install coinxp-eos --save
```
#### Test
```bash
npm test
```
#### API

##### Configuration
```bash
 const CoinXpEos = require('coinxp-eos');
 const config = {
        account: 'bpb',
        keyProvider: "5KAid1JShX7Q8H5BpQ2XeLDzvxEegq4qf7bNBh7DFsiEyveMPg2",
        httpEndpoint: "http://127.0.0.1:8888",
        printMethods: true  //true print contract and contract actions
    };
 coinxpEos = new CoinXpEos(config);
 coinxpEos.register('deposit.tx', ["confirm"]);
 coinxpEos.register('address', ["add", "approve", "reject"]);
```
##### GetInfo
```bash
 //support promise
 let result = await coinxpEos.info(); 
```
##### GetTable
```bash
 //support promise
 await coinxpEos.getTable('BTC', 'withdraw', 'withdrawals', 0, -1, 1000)
 or
 coinxpEos.getTable('BTC', 'withdraw', 'withdrawals', 0, -1, 1000).then((result)=>{
 }).catch((error) => {
 });
```
##### Use register method
```bash
 //Call register contract method,The parameters and eos contract parameters are the same
 //The method name is the combination of the contract name plus action, hump
 coinxpEos.addressAdd('ETH', '0xxxxx', "0xxxx").then((res) => {
        console.log(" Created new address: ", res.args[1]);
 }).catch((error) => {
        console.error("  ---- add address error:", error);
 });
```
##### Use contract instance
```bash
//The Contract instance name is equal to the Contract life plus the "Contract" keyword at registration
coinxpEos.addressContract.then((contract) => {
    contract.approve(coinxpEos.account, "ETH", "0xxxx", coinxpEos.options).then(result => {
        console.log("Approved address: 0xxxx");
    }).catch(err => {
        console.log(err);
    })
}).catch((error) => {
    console.log(error)
});
```