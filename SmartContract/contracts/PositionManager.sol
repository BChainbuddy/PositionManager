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
    uint256 s_positionFee;

    enum positionSide {
        BUY,
        SELL
    }

    struct Position {
        address wallet;
        address dex;
        address token; // in sellPosition the token is the selling token, in buyPosition is is the buying token(input token WETH)
        uint256 quantity; // input token quantity
        uint256 timestamp;
        uint256 executionValue;
        bool executed;
        uniswapABI forkABI;
        positionSide side;
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

    // First user needs to approve quantity
    function setSellPosition(
        address token,
        uint256 quantity,
        uint256 sellPrice,
        address dex
    ) external payable nonReentrant {
        require(msg.value >= s_positionFee, "Need to send more gas");
        require(
            IERC20(token).balanceOf(msg.sender) >= quantity,
            "Token balance too low"
        );
        require(sellPrice > 0, "Price cannot be 0");
        require(whitelistedDexes[dex] == true, "Dex not whitelisted");
        uniswapABI forkABI = isValidUniswapFork(dex);
        IERC20(token).transferFrom(msg.sender, address(this), quantity);
        positionAttributes[s_positionId] = Position(
            msg.sender,
            dex,
            token,
            quantity,
            block.timestamp,
            sellPrice,
            false,
            forkABI,
            positionSide.SELL,
            block.timestamp + 30 days
        );
        s_positionId++;
        (bool success, ) = s_owner.call{value: s_positionFee}("");
        require(success);
    }

    // First user needs to approve quantity, only available for WETH
    function setBuyPosition(
        address token,
        uint256 quantity,
        uint256 buyPrice,
        address dex
    ) external payable nonReentrant {
        require(msg.value >= s_positionFee, "Need to send more gas");
        require(buyPrice > 0, "Price cannot be 0");
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
            token,
            quantity,
            block.timestamp,
            buyPrice,
            false,
            forkABI,
            positionSide.SELL,
            block.timestamp + 30 days
        );
        s_positionId++;
        (bool success, ) = s_owner.call{value: s_positionFee}("");
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
        if (position.side == positionSide.BUY) {
            IERC20(s_wethAddress).transfer(msg.sender, position.quantity);
        } else {
            IERC20(position.token).transfer(msg.sender, position.quantity);
        }
    }

    function executeSell(address wallet, uint256 positionId) external {
        require(
            msg.sender == s_tradeExecutor,
            "Only trade executor addresss can execute a trade"
        );
        require(
            positionAttributes[s_positionId].side == positionSide.BUY,
            "The position needs to be a sell position"
        );
        // Require enough gas, decrement Gas(send it to owner wallet)
    }

    function executeBuy(address wallet, uint256 positionId) external {
        require(
            msg.sender == s_tradeExecutor,
            "Only trade executor addresss can execute a trade"
        );
        require(
            positionAttributes[positionId].side == positionSide.BUY,
            "The position needs to be a buy position"
        );
        // Require enough gas, decrement Gas(send it to owner wallet)
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
        s_positionFee = newFee;
    }
}
