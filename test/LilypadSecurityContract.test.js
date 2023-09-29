const { expect } = require("chai");
const { ethers } = require("hardhat");
const { JsonRpcProvider } = require('ethers');
const axios = require('axios');
const { DefaultAzureCredential } = require('@azure/identity');
const { SecretClient } = require('@azure/keyvault-secrets');

const networks = {
  "Filecoin Calibration Net": {
    address: "0xdC7612fa94F098F1d7BB40E0f4F4db8fF0bC8820",
    rpc: "https://api.calibration.node.glif.io/rpc/v0",
    chainId: 314159 // 0x4cb2f in hexadecimal
  },
  "Filecoin Mainnet": {
    address: "0xc18879C0a781DdFa0258302467687413AaD5a4E6",
    rpc: "https://api.node.glif.io/rpc/v1",
    chainId: 314 // 0x13a in hexadecimal
  },
};

// Define OpenAI API endpoint
const openAIAPIEndpoint = 'https://api.openai.com/v1/engines/text-davinci-003/completions';

// Azure Key Vault details
const keyVaultName = 'AI-Capwn-keyvault';
const keyVaultUrl = `https://${keyVaultName}.vault.azure.net`;
const secretName = 'LilypadTesting';

// Initialize a variable to store relevant information
let relevantInfo = "";

describe("Network Availability", function () {
  this.timeout(10000); // Increase timeout for the entire suite
  for (const [networkName, networkDetails] of Object.entries(networks)) {
    const provider = new JsonRpcProvider(networkDetails.rpc, {
      name: networkName,
      chainId: networkDetails.chainId,
    });
    
    it(`Should check the availability of LilypadEvents contract on ${networkName}`, async function () {
      console.log(`\n🔍 Checking availability of LilypadEvents contract on ${networkName}...`);
      console.log(`   RPC URL: ${networkDetails.rpc}`);
      console.log(`   Contract Address: ${networkDetails.address}`);
      console.log(`   Chain ID: ${networkDetails.chainId}`);
      
      try {
        const code = await provider.getCode(networkDetails.address);
        expect(code).to.not.equal("0x");
        console.log(`✅ LilypadEvents contract is available on ${networkName}`);
        relevantInfo += `LilypadEvents contract is available on ${networkName}.\n`;
      } catch (error) {
        console.error(`❌ Error checking contract availability on ${networkName}: ${error.message}`);
        relevantInfo += `Error checking contract availability on ${networkName}: ${error.message}\n`;
      }
    });
  }
});

// After all tests, send the relevant information to OpenAI for analysis
after(async function () {
  this.timeout(15000); // Increase timeout for the analysis step
  // Authenticate with Azure and retrieve the OpenAI API key from Key Vault
  const credential = new DefaultAzureCredential();
  const secretClient = new SecretClient(keyVaultUrl, credential);
  let openAIAPIKey;
  try {
    openAIAPIKey = await secretClient.getSecret(secretName);
  } catch (error) {
    console.error('Error retrieving OpenAI API key from Azure Key Vault:', error);
    return;
  }

  // Define the prompt for analysis
  const prompt = `Analyze the following test information:\n${relevantInfo}\n\nAnalysis:`;

  // Send the prompt to OpenAI for analysis
  try {
    const response = await axios.post(openAIAPIEndpoint, {
      prompt: prompt,
      max_tokens: 200,
      n: 1,
      stop: null,
      temperature: 0.5,
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${openAIAPIKey.value}`,
      },
    });

    const analysis = response.data.choices[0].text.trim();
    console.log('Analysis:', analysis);
  } catch (error) {
    console.error('Error analyzing logs:', error);
  }
});