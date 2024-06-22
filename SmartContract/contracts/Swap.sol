//SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

interface IUniswapV2 {
    function swapExactTokensForTokens(
        uint256 amountIn,
        uint256 amountOutMin,
        address[] calldata path,
        address to,
        uint256 deadline
    ) external returns (uint256[] memory amounts);
}

interface IUniswapV3 {
    function swap(
        address recipient,
        bool zeroForOne,
        int256 amountSpecified,
        uint160 sqrtPriceLimitX96,
        bytes calldata data
    ) external returns (int256 amount0, int256 amount1);
}

contract Swap {
    enum uniswapABI {
        V3,
        V2
    }

    bytes4 private constant UNISWAPV3_SWAP_SELECTOR =
        bytes4(keccak256("swap(address,bool,int256,uint160,bytes)"));

    bytes4 private constant UNISWAPV2_SWAP_SELECTOR =
        bytes4(
            keccak256(
                "swapExactTokensForTokens(uint256,uint256,address[],address,uint256)"
            )
        );

    function isValidUniswapFork(address dex) public view returns (uniswapABI) {
        uint256 size;
        assembly {
            size := extcodesize(dex)
        }
        if (size == 0) {
            revert("Address is not a contract!");
        }

        (bool successV3, ) = dex.staticcall(
            abi.encodeWithSelector(UNISWAPV3_SWAP_SELECTOR)
        );
        if (successV3) {
            return uniswapABI.V3;
        }
        (bool successV2, ) = dex.staticcall(
            abi.encodeWithSelector(UNISWAPV2_SWAP_SELECTOR)
        );
        if (successV2) {
            return uniswapABI.V2;
        }
        revert("The dex address is not UniswapV3 fork nor UniswapV2 fork");
    }

    function buyToken() external {}

    function sellToken() external {}
}
