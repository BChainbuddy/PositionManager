// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/**
 * @title IUniswapV2Router
 * @dev Interface for Uniswap V2 Router
 */
interface IUniswapV2Router {
    function swapExactTokensForTokens(
        uint256 amountIn,
        uint256 amountOutMin,
        address[] calldata path,
        address to,
        uint256 deadline
    ) external returns (uint256[] memory amounts);

    function addLiquidity(
        address tokenA,
        address tokenB,
        uint256 amountADesired,
        uint256 amountBDesired,
        uint256 amountAMin,
        uint256 amountBMin,
        address to,
        uint256 deadline
    ) external returns (uint256 amountA, uint256 amountB, uint256 liquidity);
}

/**
 * @title IUniswapV2Factory
 * @dev Interface for Uniswap V2 Factory, used to get pairs.
 */
interface IUniswapV2Factory {
    function getPair(
        address tokenA,
        address tokenB
    ) external view returns (address pair);
}

/**
 * @title MockUniswapV2Router
 * @dev Mock implementation of Uniswap V2 Router for testing purposes
 */
contract MockUniswapV2Router is IUniswapV2Router, IUniswapV2Factory {
    struct Pool {
        uint256 reserveA;
        uint256 reserveB;
    }

    mapping(bytes32 => address) public pairAddresses;
    mapping(bytes32 => Pool) public pools;
    address public factory;

    event PairCreated(
        address indexed tokenA,
        address indexed tokenB,
        address pair
    );

    constructor() {
        factory = address(this); // For simplicity, using the same contract as the factory
    }

    function swapExactTokensForTokens(
        uint256 amountIn,
        uint256 amountOutMin,
        address[] calldata path,
        address to,
        uint256 deadline
    ) external override returns (uint256[] memory amounts) {
        require(path.length >= 2, "Invalid path");
        require(block.timestamp <= deadline, "Transaction expired");

        IERC20 inputToken = IERC20(path[0]);
        IERC20 outputToken = IERC20(path[path.length - 1]);

        uint256 outputAmount = amountIn; // Simplified swap logic
        require(outputAmount >= amountOutMin, "Insufficient output amount");

        inputToken.transferFrom(msg.sender, address(this), amountIn);
        outputToken.transfer(to, outputAmount);

        amounts = new uint256[](path.length);
        amounts[0] = amountIn;
        amounts[path.length - 1] = outputAmount;
    }

    function addLiquidity(
        address tokenA,
        address tokenB,
        uint256 amountADesired,
        uint256 amountBDesired,
        uint256 amountAMin,
        uint256 amountBMin,
        address to,
        uint256 deadline
    )
        external
        override
        returns (uint256 amountA, uint256 amountB, uint256 liquidity)
    {
        require(block.timestamp <= deadline, "Transaction expired");

        bytes32 poolId = getPoolId(tokenA, tokenB);
        Pool storage pool = pools[poolId];

        // Assume the pool accepts any liquidity and doesn't use a specific algorithm
        pool.reserveA += amountADesired;
        pool.reserveB += amountBDesired;

        IERC20(tokenA).transferFrom(msg.sender, address(this), amountADesired);
        IERC20(tokenB).transferFrom(msg.sender, address(this), amountBDesired);

        // Simplified liquidity calculation
        liquidity = amountADesired + amountBDesired;
        amountA = amountADesired;
        amountB = amountBDesired;

        // Create pair address if it doesn't exist
        if (pairAddresses[poolId] == address(0)) {
            address pair = address(uint160(uint256(poolId))); // Simplified pair address generation
            pairAddresses[poolId] = pair;
            emit PairCreated(tokenA, tokenB, pair);
        }
    }

    function getPair(
        address tokenA,
        address tokenB
    ) external view override returns (address pair) {
        bytes32 poolId = getPoolId(tokenA, tokenB);
        pair = pairAddresses[poolId];
    }

    function getPoolId(
        address tokenA,
        address tokenB
    ) public pure returns (bytes32) {
        return keccak256(abi.encodePacked(tokenA, tokenB));
    }

    function getReserves(
        address tokenA,
        address tokenB
    ) external view returns (uint256 reserveA, uint256 reserveB) {
        bytes32 poolId = getPoolId(tokenA, tokenB);
        Pool storage pool = pools[poolId];
        reserveA = pool.reserveA;
        reserveB = pool.reserveB;
    }
}
