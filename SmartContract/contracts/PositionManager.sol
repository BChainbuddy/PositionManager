//SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

import "@openzeppelin/contracts/interfaces/IERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "./Swap.sol";

contract PositionManager is Swap, ReentrancyGuard {
    // Events
    event sellPositionMade(address indexed wallet, uint256 positionId);
    event buyPositionMade(address indexed wallet, uint256 positionId);
    event withdrawnPosition(address indexed wallet, uint256 positionId);
    event positionExecuted(uint256 positionId);

    // Storage variables
    uint256 s_positionId;
    address s_wethAddress;
    uint256 s_buyPositionId;
    address s_tradeExecutor;
    address s_owner;
    uint256 s_dailyPositionFee;

    struct Position {
        address wallet;
        address dex;
        address tokenIn;
        address tokenOut;
        uint256 quantity; // input token quantity
        uint256 timestamp;
        uint256 executionValue;
        bool executed;
        uniswapABI forkABI;
        uint256 endTimestamp;
    }

    mapping(uint256 => Position) internal positionAttributes;
    mapping(address => uint256) public userGas;
    mapping(address => bool) public whitelistedDexes;

    constructor(address tradeExecutor, address wethAddress) {
        s_tradeExecutor = tradeExecutor;
        s_wethAddress = wethAddress;
        s_owner = msg.sender;
    }

    // First user needs to approve quantity, only available for WETH, duration in days
    function createPosition(
        address tokenIn,
        address tokenOut,
        uint256 quantity,
        uint256 swapPrice,
        address dex,
        uint256 duration
    ) external payable nonReentrant {
        require(
            msg.value >= s_dailyPositionFee * duration,
            "Need to send more gas"
        );
        require(swapPrice > 0, "Price cannot be 0");
        require(
            IERC20(s_wethAddress).balanceOf(msg.sender) >= quantity,
            "Token balance too low"
        );
        require(whitelistedDexes[dex] == true, "Dex not whitelisted");
        uniswapABI forkABI = isValidUniswapFork(dex);
        IERC20(s_wethAddress).transferFrom(msg.sender, address(this), quantity);
        positionAttributes[s_positionId] = Position(
            msg.sender,
            dex,
            tokenIn,
            tokenOut,
            quantity,
            block.timestamp,
            swapPrice,
            false,
            forkABI,
            block.timestamp + (1 days) * duration
        );
        s_positionId++;
        (bool success, ) = s_owner.call{value: s_dailyPositionFee * duration}(
            ""
        );
        require(success);
    }

    function withdrawPosition(uint256 positionId) external nonReentrant {
        Position storage position = positionAttributes[positionId];
        require(
            position.wallet == msg.sender,
            "Address not an associated with this position"
        );
        require(position.quantity > 0, "Position doesnt exists");
        require(
            position.executed == false,
            "Position has already been executed"
        );
        positionAttributes[positionId].executed = true;
        IERC20(position.tokenIn).transfer(msg.sender, position.quantity);
    }

    function prolongPosition(
        uint256 positionId,
        uint256 duration
    ) external payable nonReentrant {
        Position storage position = positionAttributes[positionId];
        require(
            msg.value >= s_dailyPositionFee * duration,
            "Need to send more gas"
        );
        require(
            position.wallet == msg.sender,
            "Address not an owner of this position"
        );
        positionAttributes[positionId].endTimestamp = block.timestamp + 30 days;
        (bool success, ) = s_owner.call{value: s_dailyPositionFee * duration}(
            ""
        );
        require(success);
    }

    function executeSwap(address wallet, uint256 positionId) external {
        require(
            msg.sender == s_tradeExecutor,
            "Only trade executor addresss can execute a trade"
        );
        // Require enough gas, decrement gas in mapping
    }

    function provideGas() public payable {
        userGas[msg.sender] += msg.value;
    }

    function withdrawGas(uint256 gasAmount) public {
        (bool sent, ) = payable(msg.sender).call{value: gasAmount}("");
        require(sent, "Failed to send Ether");
    }

    // Only owner of the position or trade executor can see the position
    function seePositionAttributes(
        uint256 positionId
    ) public view returns (Position memory) {
        require(
            msg.sender == positionAttributes[positionId].wallet ||
                msg.sender == s_tradeExecutor
        );
        return positionAttributes[positionId];
    }

    function whitelistDex(address dex) public {
        require(msg.sender == s_owner, "Address not an owner");
        whitelistedDexes[dex] = true;
    }

    function changeFee(uint256 newFee) public {
        s_dailyPositionFee = newFee;
    }
}
