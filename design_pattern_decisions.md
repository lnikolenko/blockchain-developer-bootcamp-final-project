My smart contract implements the following design patterns:

1. Inheritance and Interfaces - I am importing and using functions and modifiers from `Ownable`, `Pausable`, `ReentrancyGuard` OpenZeppelin's abstract contracts.
2. Access Control Design Patterns - I have a few functions that are callable only by the contract owner. I using `Ownable` to enforce that.
