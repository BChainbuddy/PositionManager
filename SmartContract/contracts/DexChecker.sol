//SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

/**
 * @title IUniswapV2Router
 * @dev Interface for Uniswap V2 Router, used for token swaps.
 */
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

/**
 * @title IUniswapV3Router
 * @dev Interface for Uniswap V3 Router, used for token swaps with more parameters.
 */
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

    function factory() external view returns (address);
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
 * @title IUniswapV3Factory
 * @dev Interface for Uniswap V3 Factory, used to get pools.
 */
interface IUniswapV3Factory {
    function getPool(
        address tokenA,
        address tokenB,
        uint24 fee
    ) external view returns (address pool);
}

/**
 * @title DexChecker
 * @dev Provides utility functions to check and interact with Uniswap V2 and V3 DEXes.
 */
contract DexChecker {
    event LogBytes(bytes data);

    enum UniswapABI {
        V3,
        V2
    }

    // Function selectors for Uniswap V2 and V3 swap functions
    bytes4 private constant UNISWAPV3_SWAP_SELECTOR =
        bytes4(
            keccak256(
                "exactInputSingle((address,address,uint24,address,uint256,uint256,uint256,uint160))"
            )
        );

    bytes4 private constant UNISWAPV2_SWAP_SELECTOR =
        bytes4(
            keccak256(
                "swapExactTokensForTokens(uint256,uint256,address[],address,uint256)"
            )
        );

    /**
     * @dev Checks if a given DEX address is a valid Uniswap V2 or V3 fork.
     * @param dex The address of the DEX to check.
     * @return The type of Uniswap fork (V2 or V3).
     */
    function isValidUniswapFork(address dex) public view returns (UniswapABI) {
        uint256 size;
        assembly {
            size := extcodesize(dex)
        }
        if (size == 0) {
            revert("Address is not a contract!");
        }

        bytes memory code = new bytes(size);
        assembly {
            extcodecopy(dex, add(code, 0x20), 0, size)
        }

        bool hasV3Selector = findSelector(code, UNISWAPV3_SWAP_SELECTOR);
        bool hasV2Selector = findSelector(code, UNISWAPV2_SWAP_SELECTOR);

        if (hasV3Selector) {
            return UniswapABI.V3;
        }
        if (hasV2Selector) {
            return UniswapABI.V2;
        }

        revert("The dex address is not UniswapV3 fork nor UniswapV2 fork");
    }

    /**
     * @dev Searches for a specific selector in the given bytecode.
     * @param code The bytecode to search.
     * @param selector The selector to search for.
     * @return A boolean indicating if the selector was found.
     */
    function findSelector(
        bytes memory code,
        bytes4 selector
    ) internal pure returns (bool) {
        for (uint256 i = 0; i <= code.length - 4; i++) {
            bytes4 foundSelector;
            assembly {
                foundSelector := mload(add(add(code, 0x20), i))
            }
            if (foundSelector == selector) {
                return true;
            }
        }
        return false;
    }

    /**
     * @dev Checks if a pool exists for a given DEX router and token pair.
     * @param dexRouter The address of the DEX router.
     * @param dexType The type of Uniswap fork (V2 or V3).
     * @param tokenIn The address of the input token.
     * @param tokenOut The address of the output token.
     * @return A boolean indicating if the pool exists, and the fee tier for V3 pools.
     */
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

    /**
     * @dev Checks if a pool exists for Uniswap V2.
     * @param _router The address of the Uniswap V2 router.
     * @param tokenIn The address of the input token.
     * @param tokenOut The address of the output token.
     * @return A boolean indicating if the pool exists, and a zero fee for V2 pools.
     */
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

    /**
     * @dev Checks if a pool exists for Uniswap V3.
     * @param _router The address of the Uniswap V3 router.
     * @param tokenIn The address of the input token.
     * @param tokenOut The address of the output token.
     * @return A boolean indicating if the pool exists, and the fee tier for V3 pools.
     */
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
