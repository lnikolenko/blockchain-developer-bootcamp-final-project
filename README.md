# Crypto Union
## Problem Statement
Today it is very hard or impossible to send money transfers between certain countries (e.g. from Russia to US). Before the transfer goes through (*if it goes through*) you are required to fill out countless forms with high processing times. Using Western Union international money transfers is inconvenient as well, since you are subject to high commission fees and you can only send limited amounts of money. This project will attempt to solve this issue by enabling regular users to send money internationally with low commission (as opposed to [Ripple](https://ripple.com/), which uses a B2B model).
## Workflow
Let's go through the workflow using a concrete example. Alice who is located in Russia wants to send $500 to Bob, who is located in the US.
Setup:
1. We have an account with crypto exchange supported in Russia with 0xabc Ethereum address
2. We have an account with crypto exchange supported in US with 0xdef Ethereum address
3. An owner of the smart contract can do CRUD operations country -> address mappings.

Actual workflow:
1. Alice goes in the web UI and submits a request to transfer $500 to Bob. She needs to specify Bob's country and contact information (e.g. email, phone number, payment credentials)
2. Alice signs a transaction through her MetaMask account to transfer $500 to 0xabc (address belongs to Crypto Union dapp).
3. The $500 get converted into 500 USDT.
4. The smart contract sends the 500 USDT to an address that belongs to a crypto exchange in the US, a.k.a 0xdef account.
5. We cash out the ~$500 (it will not bee $500 precisely as we need to account for gas fees) on the US exchange to Bob's bank account (we will leave this as a manual process for now).
6. A person transferring the funds out of the exchange account will update the status of the transfer in the smart contract and send Alice some confirmation of transfer to Bob.  

Note, that all transactions and status updates will be recorded on the blockchain so Alice and Bob can be sure that their money did not get lost along the way.
For the bootcamp specifically, I am planning to have some basic web UI and the ability for a user to specify the amount of money to transfer, actually sending the money from address A to address B and recording all the movements on the blockchain. If time permits, I will try to programmatically purchase crypto on Coinbase before sending it to an address.
