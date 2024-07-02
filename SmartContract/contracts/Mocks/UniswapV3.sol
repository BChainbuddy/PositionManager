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

contract MockUniswapV3Router is IUniswapV3Router {
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
}
