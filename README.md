CRM Requirements :

Generate a token with scope ZohoCRM.modules.ALL and replace the same in your code along with the Client ID and Client Secret.

Step 1 :-

Install Metamask Wallet extension in your Chrome browser and create an account.
Once created, kindly note the address and the pass phrase provided by Metamask.
The address generated and also the pass phrase will need to be used later. The passphrase will be used in place of the mnemonic entry.

Now you need to add more gas(ETH) to the Metamask Wallet by making use of Rinkeby Faucets :

https://faucets.chain.link/rinkeby
https://rinkebyfaucet.com/

You need to have at least 3 ETH to proceed with the activity.

Step 2 :-

Open an account in infura.io and create a project. Choose the Endpoint network as Ropsten and note the end-point generated.


Step 3 :- 
In your local machine, do the following steps : -

$ mkdir blockchain-backend
$ cd blockchain-backend
$ yarn global add truffle
$ truffle init


Create a file named DocRegistry.sol with the following content inside the contracts folder of the truffle project :- ( A sample of DocRegistry.sol is also available on Github Repository)


pragma solidity ^0.5.6;

contract DocRegistry {

  struct Doc {
      address sender;
      uint date;
      bytes32 hash;
  }

  /**
   *  @dev Storage space used to record all documents
   */
  mapping(bytes32 => Doc) registry;

  /**
   *  @dev Store a document identified by its 32 bytes hash by recording the hash, the sender and date in the registry
   *  @dev Emit an event HashStored in case of success
   *  @param _hash Document hash
   */
  function storeHash(bytes32 _hash) external returns (bool) {
    registry[_hash].sender = msg.sender;
    registry[_hash].date = block.timestamp;
    registry[_hash].hash = _hash;

    emit HashStored(msg.sender, _hash);

    return true;
  }

  /**
   *  @dev Definition of the event triggered when a document is successfully stored in the registry
   */
  event HashStored(address indexed _sender, bytes32 _hash);
}


Step 4 :-

Create a migration script into migrations folder named 2_deploy_contracts.js with the following content :-

const DocRegistry = artifacts.require("DocRegistry");

module.exports = function(deployer) {
  deployer.deploy(DocRegistry);
};


Step 5 :-
Edit the content of the file truffle-config.js

const HDWalletProvider = require('@truffle/hdwallet-provider'); //The mnemonic that you had copied in Step 1 is to be used here. 
var mnemonic = "charger bitter knere juice camera smoke arrive accuse minimum juice artist exclude";
module.exports = {
    networks: {
        ropsten: {
            provider: new HDWalletProvider(mnemonic, "https://ropsten.infura.io/v3/eada8e83aef6b4e4d978ce215418d04d4"), //Endpoint that you had copied in Step2
            network_id: "*",
            gasPrice: 20000000000,
            gas: 3716887
        }
    }
}

Once completed, run the following commands :

$ truffle migrate

This command deploys the SmartContract into the Rinkeby network. 
and the following command :

$ npm install truffle-contract truffle-hdwallet-provider --save

Step 6 :- 

Clone the code from Github and copy the contracts folder from truffle project and paste it into the Catalyst Functions folder.

Step 7:- 
Deploy the project. Copy the deployed url. You will need this in the next step.
Now you are ready to add the hashData of the ClosedWon deals into the Rinkeby test network and you will get back the blockchain address to which the hashData was deployed to

Step 8 :- 

Configure a custom field in the CRM Deals module with name as blockchainAddress.

Step 9 :-

Configure a workflow in the CRM such that when the Deal attains state of Closed-Won, it triggers this Catalyst function with the url which you have copied in Step 7. Kindly replace the mnemonic, ropsten URL and wallet hash ID in your code.

Once the above steps are completed, your application is good to go. You can begin testing the same.

FAQs:

Q: My return blockchain address is not populating
A : This can happen as at times the Rinkeby network is crowded so the response may have timed out. Try doing this at a different time. This is an issue with the Blockchain networks and not Zoho. The blockchain networks are at times notoriously busy.

