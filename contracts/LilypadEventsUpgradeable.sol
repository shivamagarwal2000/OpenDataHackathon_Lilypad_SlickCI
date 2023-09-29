// SPDX-License-Identifier: MIT
pragma solidity >=0.8.4;

import "./LilypadCallerInterface.sol";

contract LilypadEventsUpgradeable {
    event LilypadJobRun(address indexed _from, uint indexed _jobId, string _spec, LilypadResultType _resultType);
    
    uint256 public lilypadFee;
    uint256 public jobIdCounter;
    address public owner;
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Not the contract owner");
        _;
    }
    
    constructor() {
        // Initialize lilypadFee with a default value (e.g., 30000000000000000 for FVM)
        lilypadFee = 30000000000000000;
        // Initialize jobIdCounter
        jobIdCounter = 1;
        // Set the contract deployer as the owner
        owner = msg.sender;
    }
    
    function getLilypadFee() public view returns (uint256) {
        return lilypadFee;
    }
    
    function runLilypadJob(address _from, string memory _spec, uint8 _resultType) public payable returns (uint jobId) {
        require(msg.value >= lilypadFee, "Not enough to run Lilypad job");
        // Generate a unique jobId using a counter
        jobId = jobIdCounter;
        jobIdCounter++;
        emit LilypadJobRun(_from, jobId, _spec, LilypadResultType(_resultType));
        return jobId;
    }
    
    function updateLilypadFee(uint256 newFee) public onlyOwner {
        lilypadFee = newFee;
    }
    
    receive() external payable {}
}
