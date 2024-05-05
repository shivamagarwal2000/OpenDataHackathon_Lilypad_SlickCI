# Lilypad Security Contract

This project contains smart contracts and tests for the Lilypad Security Contract deployed on various networks including Filecoin Calibration Net, Filecoin Mainnet, Mantle Testnet, Sepolia Testnet, Polygon Mumbai, Polygon Mainnet, Optimism, and Arbitrum One.

## Contracts

The following contracts are included in the project:

1. **LilypadCallerInterface.sol**
   - Interface for the Lilypad Caller.

2. **LilypadEventsUpgradeable.sol**
   - Upgradeable contract for Lilypad Events.

3. **LilypadSecurityContract.sol**
   - Main security contract for Lilypad.

4. **Lock.sol**
   - Contract for locking functionality.

## Test Cases

The project includes the following test cases:

1. **LilypadSecurityContract.test.js**
   - Comprehensive test suite for the Lilypad Security Contract.

2. **Lock.js**
   - Test suite for the Lock contract.

3. **basic_LilypadSecurityContract.test.js**
   - Basic test suite for the Lilypad Security Contract.

## Network Architecture

Each deployed contract address is associated with its respective chain. The interaction contracts in the Interaction Layer will interact with the corresponding deployed contracts on each network.

[Diagram showing the Interaction Layer and Deployed Contracts on various networks]

## Getting Started


To get started with the project, you can run the following tasks:

```shell
npx hardhat help
npx hardhat test
REPORT_GAS=true npx hardhat test
npx hardhat node
npx hardhat run scripts/deploy.js

