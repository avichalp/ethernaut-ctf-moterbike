### Ethernaut CTF: Motorbike

Sample code for breaking the vunlerable upgradable contract using selfdestruct. 

First, initialize the Engine contract. The initialize function will set the `msg.sender` as "upgrader" which will let you call `upgradeToAndCall`.

Second, deploy a malicious contract that exposes a function (eg: "kill") that can trigger `selfdestruct`. Then call the `upgradeToAndCall` with the address of the malicious contract and function signature of "kill".

#### Usage

```shell
# run local hardhat node 
1. npx hardhat node

# execute the script
2. node scripts/sample-script.js --network localhost
```