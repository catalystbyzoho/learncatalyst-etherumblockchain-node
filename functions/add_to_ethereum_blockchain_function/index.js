const axios = require('axios');
const catalyst = require('zcatalyst-sdk-node');
const web3 = require('web3');
const HDWalletProvider = require("truffle-hdwallet-provider");
const truffleContract = require("truffle-contract");
const DocRegistryJSON = require('./build/contracts/DocRegistry.json');
const CREDENTIALS = {
    CRMConnector_Blockchain: {
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        auth_url: 'https://accounts.zoho.com/oauth/v2/auth',
        refresh_url: 'https://accounts.zoho.com/oauth/v2/token',
        refresh_token: REFRESH_TOKEN
    }
};

module.exports = async (context, basicIO) => {

    const catalystApp = catalyst.initialize(context);
    const dealid = basicIO.getArgument('dealid');
    const incomingDealName = basicIO.getArgument('dealname');
    const hashed_data = await web3.utils.asciiToHex(incomingDealName); //Creating a Hash of the received data from CRM
    const address = await addRecordsToBlockchain(hashed_data); // Store the hash in the blockchain and get address back as response
    const status = await updateDataToCRM(catalystApp, {
        "data": [{
            "blockchainAddress": address,
            "id": dealid
        }]
    }); //Update the blockchainAddress field with the retrieved address
    if (status === 'success') {
        basicIO.write('Record successfully updated in CRM');
    } else {
        basicIO.write('Record updation Failure to CRM');
    }
    context.close();
};

/**
 * @param {* catalystApp } For generating the access token 
 * @param {* data } For updating to CRM 
 * @returns success or failure
 */
async function updateDataToCRM(catalystApp, data) {

    const accessToken = await catalystApp.connection(CREDENTIALS).getConnector('CRMConnector_Blockchain').getAccessToken();
    const response = await axios({
        method: 'PUT',
        url: 'https://www.zohoapis.com/crm/v2/Deals',
        headers: {
            'Authorization': `Zoho-oauthtoken ${accessToken}`,
            'Content-Type': 'application/json'
        },
        data: data
    });
    if (response.status == 200) {
        return 'success';
    } else {
        return 'failure';
    }
}

/**
 * @param {* The access token } accessToken 
 * @returns nothing
 */

const addRecordsToBlockchain = async (hashedData) => {
    try {
        const mnemonic = YOUR_MNEMONIC;
        const provider = new HDWalletProvider(mnemonic, YOUR_ROPSTEN_ENDPOINT); // Connect to the Blockchain and unlock the wallet to send transaction
        const DocRegistry = truffleContract(DocRegistryJSON);
        DocRegistry.setProvider(provider);
        const docRegistryInstance = await DocRegistry.deployed();
        const result = await docRegistryInstance.storeHash(hashedData, { from: YOUR_WALLET_HASH_ID });
        return result.logs[0].address;
    } catch (e) {
        console.log("Failure " + e);
        return 'unable to add';
    }
}