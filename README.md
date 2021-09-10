# Crypto Union
## Problem Statement
Today it is very hard or impossible to send money transafers between certain countries (e.g. from Russia to US). Before the transfer goes through (*if it goes through*) you are required to fill out countless forms with high processing times. Using Western Union international money transfers is incovinient as well, since you are subject to high comission fees and you can only send limited amounts. This project will attempt to solve this issue by enabling regular users to send money internationally with low comission (as opposed to [Ripple](https://ripple.com/), which uses a B2B model). 
## Workflow
Let's go through the workflow using a concrete example. Alice who is located in Russia wants to send $500 to Bob, who is located in the US.
Setup:
1. We have an account with crypto exchange supported in Russia with 0xabc Ethereum address
2. We have an account with crypto exchange supported in US with 0xdef Ethereum address

Actual workflow:
1. Alice goes in the web UI and submits a request to transfer $500 to Bob. 
2. The $500 get converted into 500 USDT via some exchange in Russia and gets stored on 0xabc account. 
3. We send the $500 to an address that belongs to a crypto exchange in the US, a.k.a 0xdef account. 
4. We cash out the $500 on the US exchange to Bob's bank account. 

Note, that all transactions will be recorded on the blockchain so Alice and Bob can be sure that their money did not get lost along the way. 
For the bootcamp specififcally, I am planning to have some basic web UI and the ability for a user to specify the amount of money to transfer, actually sending the money from address A to address B and recording all the movements on the blockchain. If time permits, I will try to programmatically puchase crypto on Coinbase before sending it to an address. 
