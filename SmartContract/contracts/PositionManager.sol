// SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./DexChecker.sol";
import "./FeeManager.sol";
import "./GasManager.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

contract PositionManager is
    ReentrancyGuard,
    DexChecker,
    FeeManager,
    GasManager
{
    // Events
    event PositionCreated(address indexed wallet, uint256 positionId);
    event PositionWithdrawn(address indexed wallet, uint256 positionId);
    event PositionExecuted(uint256 positionId);
    event PositionProlonged(uint256 positionId, uint256 duration);

    using SafeERC20 for IERC20;

    // Storage variables
    uint256 public s_positionId;
    address private s_tradeExecutor;

    struct Position {
        address wallet;
        address dexRouter;
        address tokenIn;
        address tokenOut;
        uint256 quantity; // input token quantity
        uint256 executionValue;
        uint32 endTimestamp;
        uint24 fee;
        bool executed;
        UniswapABI forkABI;
    }

    mapping(uint256 => Position) private positionAttributes;

    modifier onlyPositionOwner(uint256 positionId) {
        require(
            positionAttributes[positionId].wallet == msg.sender,
            "Not position owner"
        );
        _;
    }

    constructor(
        address tradeExecutor,
        uint256 dailyPositionFee
    ) FeeManager(dailyPositionFee, tradeExecutor) {
        s_tradeExecutor = tradeExecutor;
    }

    function createPosition(
        address tokenIn,
        address tokenOut,
        uint256 quantity,
        uint256 swapPrice,
        address dexRouter,
        uint32 duration
    ) external payable nonReentrant {
        require(
            msg.value >= getDailyPositionFee() * duration,
            "Insufficient fee"
        );
        require(swapPrice > 0, "Swap price cannot be zero");
        require(
            IERC20(tokenIn).balanceOf(msg.sender) >= quantity,
            "Insufficient token balance"
        );
        require(isWhitelistedDex(dexRouter), "Dex router not whitelisted");
        UniswapABI forkABI = isValidUniswapFork(dexRouter);
        (bool exists, uint24 fee) = doesPoolExist(
            dexRouter,
            forkABI,
            tokenIn,
            tokenOut
        );
        require(exists, "The pool doesn't exist");

        IERC20(tokenIn).safeTransferFrom(msg.sender, address(this), quantity);

        positionAttributes[s_positionId] = Position(
            msg.sender,
            dexRouter,
            tokenIn,
            tokenOut,
            quantity,
            swapPrice,
            uint32(block.timestamp) + (1 days) * duration,
            forkABI == UniswapABI.V3 ? fee : 0,
            false,
            forkABI
        );

        emit PositionCreated(msg.sender, s_positionId);
        s_positionId++;

        distributeFee(msg.value);
    }

    function withdrawPosition(
        uint256 positionId
    ) external onlyPositionOwner(positionId) nonReentrant {
        Position storage position = positionAttributes[positionId];
        require(!position.executed, "Position already executed");

        position.executed = true;
        IERC20(position.tokenIn).safeTransfer(msg.sender, position.quantity);

        emit PositionWithdrawn(msg.sender, positionId);
    }

    function prolongPosition(
        uint256 positionId,
        uint32 duration
    ) external payable onlyPositionOwner(positionId) nonReentrant {
        Position storage position = positionAttributes[positionId];
        require(
            msg.value >= getDailyPositionFee() * duration,
            "Insufficient fee"
        );

        position.endTimestamp += (1 days) * duration;

        distributeFee(msg.value);

        emit PositionProlonged(positionId, duration);
    }

    function executeSwap(uint256 positionId) external nonReentrant {
        require(
            msg.sender == s_tradeExecutor,
            "Only trade executor can execute swap"
        );

        Position storage position = positionAttributes[positionId];
        require(!position.executed, "Position already executed");

        uint256 tokensReceived;
        if (position.forkABI == UniswapABI.V2) {
            IUniswapV2Router router = IUniswapV2Router(position.dexRouter);
            IERC20(position.tokenIn).approve(
                address(router),
                position.quantity
            );

            address[] memory path = new address[](2);
            path[0] = position.tokenIn;
            path[1] = position.tokenOut;

            uint256[] memory amounts = router.swapExactTokensForTokens(
                position.quantity,
                position.executionValue,
                path,
                position.wallet,
                block.timestamp
            );

            tokensReceived = amounts[amounts.length - 1];
        } else if (position.forkABI == UniswapABI.V3) {
            IUniswapV3Router router = IUniswapV3Router(position.dexRouter);
            IERC20(position.tokenIn).approve(
                address(router),
                position.quantity
            );

            router.exactInputSingle(
                position.tokenIn,
                position.tokenOut,
                position.fee,
                position.wallet,
                block.timestamp + 10 minutes,
                position.quantity,
                position.executionValue * position.quantity,
                0
            );
        }

        position.executed = true;

        emit PositionExecuted(positionId);
    }

    function seePositionAttributes(
        uint256 positionId
    ) external view returns (Position memory) {
        require(
            msg.sender == positionAttributes[positionId].wallet ||
                msg.sender == s_tradeExecutor,
            "Not authorized to view this position"
        );
        return positionAttributes[positionId];
    }

    function setNewTradeExecutor(address newTradeExecutor) external onlyOwner {
        s_tradeExecutor = newTradeExecutor;
    }
}
