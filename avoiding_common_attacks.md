My smart contract implments the following security measures:

1.  `tx.origin` authentication ([SWC-115](https://swcregistry.io/docs/SWC-115))-- throughout my contract I am relying on `msg.sender` field. E.g. I am checking `msg.sender` during `adminSignIn` function and I using `msg.sender` to keep track of the sender of the transfer in the contract's state variable.
2.  Re-entrancy ([SWC-107](https://swcregistry.io/docs/SWC-107)) - I am defending against re-entrancy by using `nonReentrant` modifier on the functions that transfer and withdraw funds.
