// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

interface IUniswapV3Router {
    struct ExactInputSingleParams {
        address tokenIn;
        address tokenOut;
        uint24 fee;
        address recipient;
        uint256 deadline;
        uint256 amountIn;
        uint256 amountOutMinimum;
        uint160 sqrtPriceLimitX96;
    }

    function exactInputSingle(
        ExactInputSingleParams calldata params
    ) external returns (uint256 amountOut);
}

interface IUniswapV3Factory {
    function getPool(
        address tokenA,
        address tokenB,
        uint24 fee
    ) external view returns (address pool);
}

contract MockUniswapV3Router is IUniswapV3Router, IUniswapV3Factory {
    struct Pool {
        uint256 reserveA;
        uint256 reserveB;
        uint24 fee;
    }

    mapping(bytes32 => address) public poolAddresses;
    mapping(bytes32 => Pool) public pools;
    address public factory;

    event PoolCreated(
        address indexed tokenA,
        address indexed tokenB,
        uint24 fee,
        address pool
    );

    constructor() {
        factory = address(this); // For simplicity, using the same contract as the factory
    }

    function exactInputSingle(
        ExactInputSingleParams calldata params
    ) external override returns (uint256 amountOut) {
        require(block.timestamp <= params.deadline, "Transaction expired");

        IERC20 inputToken = IERC20(params.tokenIn);
        IERC20 outputToken = IERC20(params.tokenOut);

        amountOut = params.amountIn; // Simplified swap logic
        require(
            amountOut >= params.amountOutMinimum,
            "Insufficient output amount"
        );

        inputToken.transferFrom(msg.sender, address(this), params.amountIn);
        outputToken.transfer(params.recipient, amountOut);
    }

    function createPool(
        address tokenA,
        address tokenB,
        uint24 fee
    ) external returns (address pool) {
        bytes32 poolId = getPoolId(tokenA, tokenB, fee);
        require(poolAddresses[poolId] == address(0), "Pool already exists");

        pool = address(uint160(uint256(poolId))); // Simplified pool address generation
        poolAddresses[poolId] = pool;
        pools[poolId] = Pool({reserveA: 0, reserveB: 0, fee: fee});

        emit PoolCreated(tokenA, tokenB, fee, pool);
    }

    function getPool(
        address tokenA,
        address tokenB,
        uint24 fee
    ) external view override returns (address pool) {
        bytes32 poolId = getPoolId(tokenA, tokenB, fee);
        pool = poolAddresses[poolId];
    }

    function getPoolId(
        address tokenA,
        address tokenB,
        uint24 fee
    ) public pure returns (bytes32) {
        return keccak256(abi.encodePacked(tokenA, tokenB, fee));
    }

    function addLiquidity(
        address tokenA,
        address tokenB,
        uint24 fee,
        uint256 amountADesired,
        uint256 amountBDesired
    ) external returns (uint256 amountA, uint256 amountB, uint256 liquidity) {
        bytes32 poolId = getPoolId(tokenA, tokenB, fee);
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
    }

    function getReserves(
        address tokenA,
        address tokenB,
        uint24 fee
    ) external view returns (uint256 reserveA, uint256 reserveB) {
        bytes32 poolId = getPoolId(tokenA, tokenB, fee);
        Pool storage pool = pools[poolId];
        reserveA = pool.reserveA;
        reserveB = pool.reserveB;
    }
}
