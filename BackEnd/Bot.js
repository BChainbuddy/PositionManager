// Connect to contract
const { ethers } = require("ethers");
const { positionListener } = require("./PositionListener");
require("dotenv").config();

const contractAddress = "0xf8B27F9e884BAD05fDBfD18f0FA193776052c368";
const abi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "tradeExecutor",
        type: "address",
      },
      {
        internalType: "uint64",
        name: "dailyPositionFee",
        type: "uint64",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "target",
        type: "address",
      },
    ],
    name: "AddressEmptyCode",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "AddressInsufficientBalance",
    type: "error",
  },
  {
    inputs: [],
    name: "FailedInnerCall",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
    ],
    name: "OwnableInvalidOwner",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "OwnableUnauthorizedAccount",
    type: "error",
  },
  {
    inputs: [],
    name: "ReentrancyGuardReentrantCall",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "token",
        type: "address",
      },
    ],
    name: "SafeERC20FailedOperation",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "dexRouter",
        type: "address",
      },
    ],
    name: "DexRouterWhitelisted",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "wallet",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "positionId",
        type: "uint256",
      },
    ],
    name: "PositionCreated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "positionId",
        type: "uint256",
      },
    ],
    name: "PositionExecuted",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "positionId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "duration",
        type: "uint256",
      },
    ],
    name: "PositionProlonged",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "wallet",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "positionId",
        type: "uint256",
      },
    ],
    name: "PositionWithdrawn",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "uint64",
        name: "newFee",
        type: "uint64",
      },
    ],
    name: "changeFee",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "tokenIn",
        type: "address",
      },
      {
        internalType: "address",
        name: "tokenOut",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "quantity",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "swapPrice",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "dexRouter",
        type: "address",
      },
      {
        internalType: "uint32",
        name: "duration",
        type: "uint32",
      },
    ],
    name: "createPosition",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "dexRouter",
        type: "address",
      },
      {
        internalType: "enum DexChecker.UniswapABI",
        name: "dexType",
        type: "uint8",
      },
      {
        internalType: "address",
        name: "tokenIn",
        type: "address",
      },
      {
        internalType: "address",
        name: "tokenOut",
        type: "address",
      },
    ],
    name: "doesPoolExist",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
      {
        internalType: "uint24",
        name: "",
        type: "uint24",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "positionId",
        type: "uint256",
      },
    ],
    name: "executeSwap",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "getDailyPositionFee",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "dex",
        type: "address",
      },
    ],
    name: "isValidUniswapFork",
    outputs: [
      {
        internalType: "enum DexChecker.UniswapABI",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "dexRouter",
        type: "address",
      },
    ],
    name: "isWhitelistedDex",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "positionId",
        type: "uint256",
      },
      {
        internalType: "uint32",
        name: "duration",
        type: "uint32",
      },
    ],
    name: "prolongPosition",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [],
    name: "provideGas",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "s_positionId",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "positionId",
        type: "uint256",
      },
    ],
    name: "seePositionAttributes",
    outputs: [
      {
        components: [
          {
            internalType: "address",
            name: "wallet",
            type: "address",
          },
          {
            internalType: "address",
            name: "dexRouter",
            type: "address",
          },
          {
            internalType: "address",
            name: "tokenIn",
            type: "address",
          },
          {
            internalType: "address",
            name: "tokenOut",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "quantity",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "executionValue",
            type: "uint256",
          },
          {
            internalType: "uint32",
            name: "endTimestamp",
            type: "uint32",
          },
          {
            internalType: "uint24",
            name: "fee",
            type: "uint24",
          },
          {
            internalType: "bool",
            name: "executed",
            type: "bool",
          },
          {
            internalType: "enum DexChecker.UniswapABI",
            name: "forkABI",
            type: "uint8",
          },
        ],
        internalType: "struct PositionManager.Position",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newTradeExecutor",
        type: "address",
      },
    ],
    name: "setNewTradeExecutor",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "userGas",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "dexRouter",
        type: "address",
      },
    ],
    name: "whitelistDexRouter",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "gasAmount",
        type: "uint256",
      },
    ],
    name: "withdrawGas",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "positionId",
        type: "uint256",
      },
    ],
    name: "withdrawPosition",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

async function startBot() {
  // Retrieve contract
  console.log("Connecting to contract...");
  let provider = new ethers.JsonRpcProvider(process.env.RPC_URL);

  const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

  let contract = new ethers.Contract(contractAddress, abi, signer);
  console.log("Successfully connected to the contract!");

  // Loop through Positions with positionId to find all positions that were yet to be executed
  console.log("Looping through positions...");
  let positionId = await contract.s_positionId();

  if (positionId == 0) {
    console.log("Positions haven't been made yet!");
    return;
  }

  for (let i = 0; i < positionId; i++) {
    const positionAttributes = await contract.seePositionAttributes(
      i.toString()
    );
    if (positionAttributes[8] == false) {
      // Start the listener
      positionListener(
        i,
        positionAttributes[2],
        positionAttributes[3],
        positionAttributes[5],
        positionAttributes[1],
        positionAttributes[9],
        positionAttributes[6],
        positionAttributes[7]
      );
    }

    // [
    //     '0xA9774e31e68c1a0C9507e942692305eb8c3B32AE',
    //     '0x425141165d3DE9FEC831896C016617a52363b687',
    //     '0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14',
    //     '0xbe72E441BF55620febc26715db68d3494213D8Cb',
    //     10000000000000n,
    //     3200n,
    //     1720606020n,
    //     0n,
    //     false,
    //     1n
    // ]
    // address wallet;
    // address dexRouter;
    // address tokenIn;
    // address tokenOut;
    // uint256 quantity;
    // uint256 executionValue;
    // uint32 endTimestamp;
    // uint24 fee;
    // bool executed;
    // UniswapABI forkABI;
    // positionId, token1, token2, targetPrice, dexRouter, ABIType;
    // endTimestamp, executed, fee;
  }
  // For Each create a setInterval that Is checking if the price of a pool is the same as execution value
  // If the endTimestamp is more than Date.now() / 1000, then stop the loop, or if it gets executed
}

startBot();
