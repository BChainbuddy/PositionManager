// SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./DexChecker.sol";
import "./FeeManager.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

/**
 * @title PositionManager
 * @notice This contract manages trading positions on Uniswap V2 and V3 forks, allowing users to create, prolong, and execute positions. It also handles fee management and gas provision.
 */
contract PositionManager is ReentrancyGuard, DexChecker, FeeManager {
    using SafeERC20 for IERC20;

    // Events
    event PositionCreated(address indexed wallet, uint256 positionId);
    event PositionWithdrawn(address indexed wallet, uint256 positionId);
    event PositionExecuted(uint256 positionId);
    event PositionProlonged(uint256 positionId, uint256 duration);

    // Storage variables
    uint256 public s_positionId;
    address private s_tradeExecutor;

    // Struct representing trading position
    struct Position {
        address wallet;
        address dexRouter;
        address tokenIn;
        address tokenOut;
        uint256 quantity;
        uint256 executionValue;
        uint32 endTimestamp;
        uint24 fee;
        bool executed;
        UniswapABI forkABI;
    }

    mapping(uint256 => Position) private positionAttributes;

    // Modifier to check if the caller is the owner of the position
    modifier onlyPositionOwner(uint256 positionId) {
        require(
            positionAttributes[positionId].wallet == msg.sender,
            "Not the position owner"
        );
        _;
    }

    /**
     * @dev Constructor to initialize the contract with the trade executor and daily position fee.
     * @param tradeExecutor Address of the trade executor.
     * @param dailyPositionFee Fee charged per day for maintaining a position.
     */
    constructor(
        address tradeExecutor,
        uint64 dailyPositionFee,
        uint64 executionFee
    ) FeeManager(dailyPositionFee, executionFee, tradeExecutor) {
        s_tradeExecutor = tradeExecutor;
    }

    /**
     * @dev Function to create a new trading position.
     * @param tokenIn Address of the input token.
     * @param tokenOut Address of the output token.
     * @param quantity Quantity of input tokens.
     * @param swapPrice Desired swap price. Multiply it by 10 ** 18, so 1USD is 1000000000000000000.
     * @param dexRouter Address of the DEX router.
     * @param duration Duration of the position in days.
     */
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
        require(
            whitelistedDexes[dexRouter].isWhitelisted,
            "Dex router not whitelisted"
        );
        (bool exists, uint24 fee) = doesPoolExist(
            dexRouter,
            whitelistedDexes[dexRouter].dexType,
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
            whitelistedDexes[dexRouter].dexType == UniswapABI.V3 ? fee : 0,
            false,
            whitelistedDexes[dexRouter].dexType
        );

        emit PositionCreated(msg.sender, s_positionId);
        s_positionId++;

        distributeFee(msg.value);
    }

    /**
     * @dev Function to withdraw an existing position.
     * @param positionId ID of the position to withdraw.
     */
    function withdrawPosition(
        uint256 positionId
    ) external onlyPositionOwner(positionId) nonReentrant {
        Position storage position = positionAttributes[positionId];
        require(!position.executed, "Position already executed");

        position.executed = true;
        IERC20(position.tokenIn).safeTransfer(msg.sender, position.quantity);

        emit PositionWithdrawn(msg.sender, positionId);
    }

    /**
     * @dev Function to prolong the duration of an existing position.
     * @param positionId ID of the position to prolong.
     * @param duration Additional duration in days.
     */
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

    /**
     * @dev Function to execute a swap for a given position.
     * @param positionId ID of the position to execute.
     */
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

            IUniswapV3Router.ExactInputSingleParams
                memory params = IUniswapV3Router.ExactInputSingleParams(
                    position.tokenIn,
                    position.tokenOut,
                    position.fee,
                    position.wallet,
                    block.timestamp + 10 minutes,
                    position.quantity,
                    position.executionValue,
                    0
                );

            uint256 amountOut = router.exactInputSingle(params);
            tokensReceived = amountOut;
        }

        position.executed = true;

        emit PositionExecuted(positionId);
    }

    /**
     * @dev Function to view the attributes of a position.
     * @param positionId ID of the position to view.
     * @return Position struct containing the position's details.
     */
    function seePositionAttributes(
        uint256 positionId
    ) external view returns (Position memory) {
        // require(
        //     msg.sender == positionAttributes[positionId].wallet ||
        //         msg.sender == s_tradeExecutor,
        //     "Not authorized to view this position"
        // ); Relevant for ZkSync
        return positionAttributes[positionId];
    }

    /**
     * @dev Function to set a new trade executor.
     * @param newTradeExecutor Address of the new trade executor.
     */
    function setNewTradeExecutor(address newTradeExecutor) external onlyOwner {
        s_tradeExecutor = newTradeExecutor;
    }
}
