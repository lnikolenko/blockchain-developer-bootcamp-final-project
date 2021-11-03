## `CryptoUnion`

You can use this contract to transfer money to another address associated with a given country


Only ETH transfers are supported for now

### `validCountryCode(string countrycode)`





### `paidEnough()`





### `checkStatus(enum CryptoUnion.Status status)`





### `noPendingTransfers(string countryCode)`





### `transferExists(uint256 _transferId)`






### `adminSignIn() → bool` (public)

Checks if the transaction was sent by the contract owner


Used for admin sign-in in the web UI


### `setAddress(string countryCode, address wallet)` (public)

Set the country code -> address pair


Also allows you to delete supported country codes by setting the wallet to address to 0


### `getAddress(string countryCode) → address` (public)

Get an address corresponding to a give country code


Inputs longer than three English letters will be rejected


### `getMinValue() → uint256` (public)

Get the contract fee




### `getTransferCount() → uint256` (public)

Get transfer count




### `sendEthToCountry(string countryCode)` (public)

Send ETH to a given country, contract fee will be withheld


If we are unable to perform the send the whole transaction is reverted


### `getTransfer(uint256 _transferId) → uint256, address, string, enum CryptoUnion.Status, uint256, uint256` (public)

Get information about a given trasfer




### `confirmTransfer(uint256 _transferId)` (public)

Confirm a given transfer, should be done after Admin has transferred the money to the recepient off-chain




### `withdraw()` (public)

Withdraw contract's balance to the owner's address


The function will revert if the send wasn't successful

### `pause()` (public)

pause the contract -- the contract will start functioning in read-only mode.


Implementing the circuit breaker pattern

### `unpause()` (public)

resume the contract for both reads and writes


Implementing the circuit breaker pattern


### `LogCountryAddressUpdated(string countryCode, address oldWallet, address newWallet)`





### `LogTransferSent(uint256 transferId, address from, string to, uint256 amount, enum CryptoUnion.Status status, uint256 contractFee)`





### `LogTransferFailed(uint256 transferId, address from, string to, uint256 amount)`






### `Transfer`


uint256 transferId


address payable from


string to


enum CryptoUnion.Status status


uint256 amount



### `Status`








