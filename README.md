# Crypto Union
This is a final project for Consensys Blockchain Developmer Bootcamp 2021. It is deployed on Ropsten at [0x6C9Ba1996215D403724973D27B06d4FF87605381](https://ropsten.etherscan.io/address/0x6C9Ba1996215D403724973D27B06d4FF87605381). 
## Table of Contents
- [About the Project](https://github.com/lnikolenko/blockchain-developer-bootcamp-final-project/blob/main/README.md#about-the-project)
- [Directory Structure](https://github.com/lnikolenko/blockchain-developer-bootcamp-final-project/blob/main/README.md#directory-structure)
- Design Patterns and Avoiding Common Attacks
- [Installation](https://github.com/lnikolenko/blockchain-developer-bootcamp-final-project/blob/main/README.md#installation)
- [Deployment](https://github.com/lnikolenko/blockchain-developer-bootcamp-final-project/blob/main/README.md#deployment)
- Documentation
## About the Project
### Problem Statement
Today it is very hard or impossible to send money transfers between certain countries (e.g. from Russia to US). Before the transfer goes through (*if it goes through*) you are required to fill out countless forms with high processing times. Using Western Union international money transfers is inconvenient as well, since you are subject to high commission fees and you can only send limited amounts of money. This project will attempt to solve this issue by enabling regular users to send money internationally with low commission (as opposed to [Ripple](https://ripple.com/), which uses a B2B model only).
### Workflow
Let's go through the workflow using a concrete example. Alice who is located in Russia wants to send 0.5 ETH to Bob, who is located in the US.
Setup:
1. We have an account with crypto exchange supported in Russia with 0xabc Ethereum address
2. We have an account with crypto exchange supported in US with 0xdef Ethereum address
3. An owner of the smart contract can do CRUD operations country -> address mappings.

Actual workflow:
1. Alice goes in the web UI and submits a request through MetaMask to transfer 0.5 ETH to the US. 
2. The smart contract sends the 0.05 ETH to an address that belongs to a crypto exchange in the US, i.e. 0xdef account.
3. A contract owner will confirm the transfer after they manually cash out the ~0.5 ETH (it will not bee 0.5 ETH precisely as we need to account for contract and gas fees) on the US exchange to Bob's bank account.

Alice will be able to monitor the status of her transfer though the web UI as well. 

Note, that there is also and Admin panel which you can only access from the contract owner account. This panel lets you:
- Confirm a transfer
- View and update a wallet address for a given country
- Pause/unpause the contract
- Withdraw accumulated contract fees to the owner's account
## Directory Structure
The project was bootstrapped from [Truffle React](https://www.trufflesuite.com/boxes/react) box. The `client/` folder contains the React frontend app, everything outside of this folder contains the smart contract code. Note, that the smart contract code has its own `package.json` and `node_modules/` for the smart contract's dependencies (which different from the ones inside of `client/`). There is also a `docs/` folder with the generated documentation (see more in the Documentation section). `test/` folder contain's smart contract's tests. 

The most notable components of `client/src/` folder are`client/src/screens/` - the UI for the website, `client/src/hooks/` - hooks that manage the global state of the app, `client/src/contracts` - the ABI for the smart contract and dependencies and `client/src/components` - small UI pieces that are re-used across different views.
## Installation
### Pre-requisites
1. Install [Node.js](https://nodejs.org/en/download/)
2. Install [Truffle](https://www.trufflesuite.com/docs/truffle/getting-started/installation)
3. Optional: install [Ganache](https://www.trufflesuite.com/ganache) - you can use any blockchain emulator, but I will be using Ganache in the installation instructions
4. Install [MetaMask](https://metamask.io/)
### Smart Contract
1. Start up a local blockchain. If you are using Ganache, create a new workspace with `blockchain-developer-bootcamp-final-project/truffle-config.js` project. See [this page](https://www.trufflesuite.com/docs/ganache/workspaces/creating-workspaces#creating-a-workspace-from-scratch) for step-by-step screenshots. 
2. Connect MetaMask to your local blockhain, see directions [here](https://asifwaquar.com/connect-metamask-to-localhost/). RPC URL is http://127.0.0.1:7545, chain ID is 5777. Import the generated local accounts as needed. 
3. Clone this repo and `cd` into the cloned `blockchain-developer-bootcamp-final-project/`
4. `npm i` - installs the contract dependencies
5. `truffle migrate --reset` - will deploy `CryptoUnion.sol` onto the local blockchain make it available for use. 
6. `truffle test` - run unit tests for the smart contract. 
### Frontend
1. Clone this repo and `cd` into the cloned `blockchain-developer-bootcamp-final-project/client`
2. `npm i` - installs the dependencies for the fronted
3. `npm run start`
4. Go to `http://localhost:3000` in your browser. Admin panel is located at `http://localhost:3000/admin`
## Deployment
### Smart Contract
The instructions are walking through the deployment of the contract to Ropsten via [Infura](https://infura.io/). 
1. Create an `.env` file inside `blockchain-developer-bootcamp-final-project`. 
2. Copy the contents of `.env.sample` to `.env` 
3. Pick an address that is going to deploy the contract (and make sure that address has funds) and fill out its mnemonic in the `MNEMONIC` variable in the .env file. 
4. Create an Infura account - follow [these](https://blog.infura.io/getting-started-with-infura-28e41844cc89/) directions up to and including Step 2. Then under endpoints you will see a URL of the format `https://<network>.infura.io/v3/YOUR-PROJECT-ID`. Select ROSTEN in the "Endpoints" dropdown if you are following along this example. Copy tha URL in the `INFURA_URL`variable. 
5. In `blockchain-developer-bootcamp-final-project/truffle-config.js` uncomment lines 2 - 7 and 19-25. In this patricular case we will be deploying the contract to Ropsten, but it is fairly straightforward to deploy the contract to other Testnets or Mainnet. 
6. Run `truffle migrate --network ropsten` 

**DO NOT SHARE YOUR INFURA URL OR MNEMONIC OR COMMIT THEM TO VERSION CONTROL!**
