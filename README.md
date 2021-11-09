# Crypto Union
This is a final project for Consensys Blockchain Developmer Bootcamp 2021. 
## Table of Contents
- [About the Project](https://github.com/lnikolenko/blockchain-developer-bootcamp-final-project/blob/main/README.md#about-the-project)
- Directory Structure
- Design Patterns and Avoiding Common Attacks
- Installation
- Deployment
## About the Project
### Problem Statement
Today it is very hard or impossible to send money transfers between certain countries (e.g. from Russia to US). Before the transfer goes through (*if it goes through*) you are required to fill out countless forms with high processing times. Using Western Union international money transfers is inconvenient as well, since you are subject to high commission fees and you can only send limited amounts of money. This project will attempt to solve this issue by enabling regular users to send money internationally with low commission (as opposed to [Ripple](https://ripple.com/), which uses a B2B model only).
### Workflow
Let's go through the workflow using a concrete example. Alice who is located in Russia wants to send 0.5ETH to Bob, who is located in the US.
Setup:
1. We have an account with crypto exchange supported in Russia with 0xabc Ethereum address
2. We have an account with crypto exchange supported in US with 0xdef Ethereum address
3. An owner of the smart contract can do CRUD operations country -> address mappings.

Actual workflow:
1. Alice goes in the web UI and submits a request through MetaMask to transfer 0.05 ETH to the US. 
2. The smart contract sends the 0.05 ETH to an address that belongs to a crypto exchange in the US, i.e. 0xdef account.
3. A contract owner will confirm the transfer after they manually cash out the ~0.05 ETH (it will not bee 0.05 precisely as we need to account for contract and gas fees) on the US exchange to Bob's bank account.

Alice will be able to monitor the status of her transfer though the web UI as well. 

Note, that there is also and Admin panel which you can only access from the contract owner account. This panel tels you:
- Confirm a transfer
- View and update a wallet address for a given country
- Pause/unpause the contract
- Withdraw accumulated contract fees to the owner's account
