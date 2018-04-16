/**
 *  contract Example {
 *
 *      string _value;
 *
 *      // Constructor
 *      function Example(string value) {
 *          _value = value;
 *      }
 *  }
 */

const cote = require('cote');

const ethers = require('ethers');

// Connect to the network
var providers = require('ethers').providers;

// Connect to Ropsten (the test network)

// You may specify any of:
// - boolean; true = ropsten, false = homestead
// - object; { name: 'ropsten', chainId: 3 } (see ethers.networks);
// - string; e.g. 'homestead', 'ropsten', 'rinkeby', 'kovan'
var network = providers.networks.ropsten;

// Connect to INFUA
var infuraProvider = new providers.InfuraProvider(network);

// Connect to Etherscan
var etherscanProvider = new providers.EtherscanProvider(network);

// Creating a provider to automatically fallback onto Etherscan
// if INFURA is down
var fallbackProvider = new providers.FallbackProvider([
    infuraProvider,
    etherscanProvider
]);

// This is equivalent to using the getDefaultProvider
// var provider = ethers.providers.getDefaultProvider();
// var provider = providers.getDefaultProvider(network)


// Connect to a local Parity instance
var provider = new providers.JsonRpcProvider('http://localhost:8545', network);

// Connect to an injected Web3's provider (e.g. MetaMask)
// var web3Provider = new providers.Web3Provider(web3.currentProvider, network);


// A Requester that shall ask for the Rest Api calls
const requester = new cote.Requester({ name: ' bitrix rest calls webhooks requester ' });

const userRequester = new cote.Requester({name: 'User Requester'});

var call = 0;

// A get current user request
const webhook = { type: 'webhook', auth: 'authorization token', acc: 'access token' };

// A get current user request
const api = { type: 'api', auth: 'authorization token', acc: 'access token' };

// Get notified when a contract event is logged
var eventTopic = '0xf538d33cf0aeab2f474d1ec307854fed7e411946cb8e4239785e4f7d2c424047';
provider.on([ eventTopic ], function(log) {
    console.log('Event Log');
    console.log(log);
    var Call = log;

    console.log('Event call:', call++);

    requester.send(webhook, (res) => {
        console.log(res);
    });

    requester.send(api, (res) => {
        console.log(res);
    })

    userRequester
    .send({type: 'api2', path: '/auth'})
    .then(res => console.log(code))
    .then(headers => console.log(res))
    .then(process.exit);
});

