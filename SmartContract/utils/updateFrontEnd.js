const fs = require("fs");
const hre = require("hardhat");

const abiFile =
  "/Users/jakapotokar/Desktop/PositionManager/FrontEnd/my-app/src/data/abi.json";
const addressFile =
  "/Users/jakapotokar/Desktop/PositionManager/FrontEnd/my-app/src/data/contractAddresses.json";

async function checkIfFileExists(customPath) {
  if (!fs.existsSync(customPath)) {
    throw new Error(`File not found at path ${customPath}`);
  }

  let state = 0;
  if (fs.readFileSync(customPath, "utf-8")) {
    state = JSON.parse(fs.readFileSync(customPath, "utf-8"));
  }

  return state;
}

async function getDeployedAddressFromIgnition() {
  const ignitionState = await checkIfFileExists(
    `/Users/jakapotokar/Desktop/PositionManager/SmartContract/ignition/deployments/chain-${hre.network.config.chainId}/deployed_addresses.json`
  );

  const contract = ignitionState["Deploy#PositionManager"];

  if (!contract) {
    throw new Error("PositionManager contract not found in Ignition state");
  }

  console.log("Contract deployed at:", contract);
  return contract;
}

async function updateAddresses() {
  const { abi } = await hre.artifacts.readArtifact("PositionManager");
  const address = await getDeployedAddressFromIgnition();
  const chainId = hre.network.config.chainId;

  // Update abi
  const abiState = await checkIfFileExists(abiFile);
  if (!abiState) {
    fs.writeFile(abiFile, "", function () {
      console.log("cleared Data");
    });
  }
  fs.writeFile(abiFile, JSON.stringify(abi), function () {
    console.log("updated Abi");
  });

  // Update address
  const addressState = await checkIfFileExists(addressFile);

  // Network exists
  let updated = false;
  const index = addressState.findIndex((obj) => obj.hasOwnProperty(chainId));
  if (index !== -1) {
    addressState[index][chainId] = address;
    updated = true;
  }

  // New network
  if (!updated) {
    addressState.push({ [chainId]: address });
  }
  fs.writeFile(addressFile, JSON.stringify(addressState), function () {
    console.log("updated Addresses");
  });
}

updateAddresses();
