//SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

import "@openzeppelin/contracts/interfaces/IERC20.sol";

contract PositionManager {
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
        uint256 executsonValue;
        bool executed;
        positionSide side;
    }

    mapping(uint256 => Position) public positionAttributes;

    constructor(address tradeExecutor, address wethAddress) {
        s_tradeExecutor = tradeExecutor;
        s_wethAddress = wethAddress;
    }

    // First user needs to approve quantity
    function setSellPosition(
        address token,
        uint256 quantity,
        uint256 sellPrice,
        address dex
    ) external {
        require(
            IERC20(token).balanceOf(msg.sender) >= quantity,
            "Token balance too low"
        );
        IERC20(token).transferFrom(msg.sender, address(this), quantity);
        positionAttributes[s_positionId] = Position(
            msg.sender,
            dex,
            token,
            quantity,
            block.timestamp,
            sellPrice,
            false,
            positionSide.SELL
        );
        s_positionId++;
    }

    // First user needs to approve quantity, only available for WETH
    function setBuyPosition(
        address token,
        uint256 quantity,
        uint256 buyPrice,
        address dex
    ) external {
        require(
            IERC20(s_wethAddress).balanceOf(msg.sender) >= quantity,
            "Token balance too low"
        );
        IERC20(s_wethAddress).transferFrom(msg.sender, address(this), quantity);
        positionAttributes[s_positionId] = Position(
            msg.sender,
            dex,
            token,
            quantity,
            block.timestamp,
            buyPrice,
            false,
            positionSide.SELL
        );
        s_positionId++;
    }

    function withdrawPosition(uint256 positionId) external {
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
    }
}
