//SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

interface IUniswapV2Router {
    function swapExactTokensForTokens(
        uint256 amountIn,
        uint256 amountOutMin,
        address[] calldata path,
        address to,
        uint256 deadline
    ) external returns (uint256[] memory amounts);

    function factory() external view returns (address);
}

interface IUniswapV3Router {
    function exactInputSingle(
        address tokenIn,
        address tokenOut,
        uint24 fee,
        address recipient,
        uint256 deadline,
        uint256 amountIn,
        uint256 amountOutMinimum,
        uint160 sqrtPriceLimitX96
    ) external returns (uint256 amountOut);

    function factory() external view returns (address);
}

interface IUniswapV2Factory {
    function getPair(
        address tokenA,
        address tokenB
    ) external view returns (address pair);
}

interface IUniswapV3Factory {
    function getPool(
        address tokenA,
        address tokenB,
        uint24 fee
    ) external view returns (address pool);
}

contract DexChecker {
    enum UniswapABI {
        V3,
        V2
    }

    bytes4 private constant UNISWAPV3_SWAP_SELECTOR =
        bytes4(
            keccak256(
                "exactInputSingle(address,address,uint24,address,uint256,uint256,uint256,uint160)"
            )
        );

    bytes4 private constant UNISWAPV2_SWAP_SELECTOR =
        bytes4(
            keccak256(
                "swapExactTokensForTokens(uint256,uint256,address[],address,uint256)"
            )
        );

    function isValidUniswapFork(address dex) public view returns (UniswapABI) {
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
            return UniswapABI.V3;
        }
        (bool successV2, ) = dex.staticcall(
            abi.encodeWithSelector(UNISWAPV2_SWAP_SELECTOR)
        );
        if (successV2) {
            return UniswapABI.V2;
        }
        revert("The dex address is not UniswapV3 fork nor UniswapV2 fork");
    }

    function doesPoolExist(
        address dexRouter,
        UniswapABI dexType,
        address tokenIn,
        address tokenOut
    ) public view returns (bool, uint24) {
        if (dexType == UniswapABI.V2) {
            return doesPoolExistV2(dexRouter, tokenIn, tokenOut);
        } else if (dexType == UniswapABI.V3) {
            return doesPoolExistV3(dexRouter, tokenIn, tokenOut);
        }
        return (false, 0);
    }

    function doesPoolExistV2(
        address _router,
        address tokenIn,
        address tokenOut
    ) internal view returns (bool, uint24) {
        IUniswapV2Router router = IUniswapV2Router(_router);
        address factoryAddress = router.factory();
        IUniswapV2Factory factory = IUniswapV2Factory(factoryAddress);
        address poolAddress = factory.getPair(tokenIn, tokenOut);
        if (poolAddress != address(0)) {
            return (true, 0);
        } else {
            return (false, 0);
        }
    }

    function doesPoolExistV3(
        address _router,
        address tokenIn,
        address tokenOut
    ) internal view returns (bool, uint24) {
        IUniswapV3Router router = IUniswapV3Router(_router);
        address factoryAddress = router.factory();
        IUniswapV3Factory factory = IUniswapV3Factory(factoryAddress);
        uint24[3] memory feeTiers = [uint24(500), uint24(3000), uint24(10000)];

        for (uint256 i = 0; i < feeTiers.length; i++) {
            address pool = factory.getPool(tokenIn, tokenOut, feeTiers[i]);
            if (pool != address(0)) {
                return (true, feeTiers[i]);
            }
        }
        return (false, 0);
    }
}