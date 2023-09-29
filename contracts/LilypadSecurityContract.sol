// SPDX-License-Identifier: MIT
pragma solidity >=0.8.4;

import "./LilypadCallerInterface.sol";
import "./LilypadEventsUpgradeable.sol";

contract MyContract is LilypadCallerInterface {
    address payable public bridgeAddress;
    LilypadEventsUpgradeable bridge;
    uint256 public lilypadFee;
    mapping(uint => string) public prompts;

    constructor(address payable _bridgeContractAddress) {
        bridgeAddress = _bridgeContractAddress;
        bridge = LilypadEventsUpgradeable(_bridgeContractAddress);
        uint fee = bridge.getLilypadFee();
        lilypadFee = fee;
    }

    function concatenateStrings(string memory a, string memory b, string memory c) internal pure returns (string memory) {
        return string(abi.encodePacked(a, b, c));
    }

    function StableDiffusion(string calldata _prompt) external payable {
        require(msg.value >= lilypadFee, "Not enough to run Lilypad job");
        string memory spec = concatenateStrings("{...}", _prompt, "{...}");
        uint id = bridge.runLilypadJob{value: lilypadFee}(address(this), spec, uint8(LilypadResultType.CID));
        require(id > 0, "job didn't return a value");
        prompts[id] = _prompt;
    }

    function lilypadFulfilled(address _from, uint _jobId, LilypadResultType _resultType, string calldata _result) external override {
        // Implement logic when the LilypadEvents contract returns results successfully
    }

    function lilypadCancelled(address _from, uint _jobId, string calldata _errorMsg) external override {
        // Implement logic if there's an error returned by the LilypadEvents contract
    }
}
