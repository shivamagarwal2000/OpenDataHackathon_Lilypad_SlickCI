const { expect } = require("chai");
const { ethers } = require("hardhat");
const { JsonRpcProvider } = require('ethers');

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

describe("Network Availability", function () {
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
      } catch (error) {
        console.error(`❌ Error checking contract availability on ${networkName}: ${error.message}`);
      }
    });
  }
});
