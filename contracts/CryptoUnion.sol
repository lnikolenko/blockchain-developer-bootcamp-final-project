// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

/// @title Crypto Union Contract
/// @author Nikki Nikolenko
/// @notice You can use this contract to transfer money to another address associated with a given country
/// @dev Only ETH transfers are supported for now
contract CryptoUnion is Ownable, Pausable {
    //transfer id
    uint256 public transferCount = 0;

    //the initator needs to send > minValue for the transaction to go through
    uint256 public minValue = 3e15;

    //contry code (3 chars max) -> address mapping
    mapping(string => address) public addresses;

    //wallet address -> count of pending transfers mapping
    mapping(address => uint256) public pendingTransfers;

    // transfer id -> Transfer mapping
    mapping(uint256 => Transfer) public transfers;

    /// @notice Status enum which can either be "Sent" or "Confirmed"
    enum Status {
        Sent,
        Confirmed
    }

    /// @notice Transfer struct that captures all the necessary information about a transafer
    struct Transfer {
        uint256 transferId;
        address payable from;
        string to; //country code of the recepient
        Status status;
        uint256 amount;
    }

    /*
     * Events
     */
    /// @notice Emitted after successful address update for country code -> address pair
    /// @param countryCode Three-letter country code, e.g. BHS
    /// @param oldWallet An old address associated with the country code
    /// @param newWallet A new address associated with the country code
    event LogCountryAddressUpdated(
        string countryCode,
        address oldWallet,
        address newWallet
    );

    /// @notice Emitted after we have successfully sent the money to an address associated with a given country
    /// @param transferId id of the transfer, can be used to view the transfer later
    /// @param from Sender's address
    /// @param to Three-letter country code, e.g. BHS
    /// @param amount Amount transferred (msg.value - contract fee)
    /// @param status Status of the transfer
    /// @param contractFee contract fee
    event LogTransferSent(
        uint256 transferId,
        address from,
        string to,
        uint256 amount,
        Status status,
        uint256 contractFee
    );

    /// @notice Emitted if the send money call failed
    /// @param transferId id of the transfer, can be used to view the transfer later
    /// @param from Sender's address
    /// @param to Three-letter country code, e.g. BHS
    /// @param amount Amount transferred (msg.value - contract fee)
    event LogTransferFailed(
        uint256 transferId,
        address from,
        string to,
        uint256 amount
    );
    /*
     * Modifiers
     */

    /// @notice Validate the given country code
    /// @dev Inputs longer than three English letters will be rejected
    /// @param countryCode Three-letter country code, e.g. BHS
    modifier validCountryCode(string memory countryCode) {
        bytes memory tempEmptyStringTest = bytes(countryCode);
        require(tempEmptyStringTest.length == 3, "Invalid country code!");
        _;
    }

    /// @notice Validate that the sender has send more ETH than the contract fee
    modifier paidEnough() {
        require(msg.value >= minValue, "Insufficient ammount!");
        _;
    }

    /// @notice Validate that the transfer status is not Confirmed
    /// @param status The transfer status
    modifier checkStatus(Status status) {
        require(status == Status.Sent, "Transfer is already confirmed!");
        _;
    }

    /// @notice Validate that there are no pending transfers for a given country code
    /// @param countryCode Three-letter country code, e.g. BHS
    modifier noPendingTransfers(string memory countryCode) {
        require(
            pendingTransfers[addresses[countryCode]] == 0,
            "There are still unconfirmed transfers at this address!"
        );
        _;
    }

    /// @notice Validate that the transfer with a given transfer id exists
    /// @param _transferId Transfer id
    modifier transferExists(uint256 _transferId) {
        address from = transfers[_transferId].from;
        require(from != address(0), "Transfer does not exist!");
        _;
    }

    /// @notice Checks if the transaction was sent by the contract owner
    /// @dev Used for admin sign-in in the web UI
    /// @return true if the sender address belongs to contract owner, false otherwise.
    function adminSignIn() public view returns (bool) {
        return msg.sender == owner();
    }

    /// @notice Set the country code -> address pair
    /// @dev Also allows you to delete supported country codes by setting the wallet to address to 0
    /// @param countryCode Three-letter country code, e.g. BHS
    /// @param wallet Wallet address corresponding to the country code
    function setAddress(string memory countryCode, address wallet)
        public
        onlyOwner
        whenNotPaused
        validCountryCode(countryCode)
        noPendingTransfers(countryCode)
    {
        address oldWallet = addresses[countryCode];
        addresses[countryCode] = wallet;
        emit LogCountryAddressUpdated(countryCode, oldWallet, wallet);
    }

    /// @notice Get an address corresponding to a give country code
    /// @dev Inputs longer than three English letters will be rejected
    /// @param countryCode Three-letter country code, e.g. BHS
    /// @return address corresponding the country code
    function getAddress(string memory countryCode)
        public
        view
        validCountryCode(countryCode)
        returns (address)
    {
        return addresses[countryCode];
    }

    /// @notice Get the contract fee
    /// @return contract fee
    function getMinValue() public view returns (uint256) {
        return minValue;
    }

    /// @notice Get transfer count
    /// @return transfer count
    function getTransferCount() public view returns (uint256) {
        return transferCount;
    }

    /// @notice Send ETH to a given country, contract fee will be withheld
    /// @dev If we are unable to perform the send the whole transaction is reverted
    /// @param countryCode Three-letter country code, e.g. BHS
    function sendEthToCountry(string memory countryCode)
        public
        payable
        paidEnough
        validCountryCode(countryCode)
        whenNotPaused
    {
        // Here are the approximate steps:
        // 1. Create a transfer - need to figure out how much the contract should charge for the service
        if (addresses[countryCode] == address(0)) {
            revert("Invalid address");
        }
        uint256 amount = msg.value - minValue;
        transfers[transferCount] = Transfer(
            transferCount,
            payable(msg.sender),
            countryCode,
            Status.Sent,
            amount
        );
        pendingTransfers[addresses[countryCode]] += 1;
        transferCount += 1;
        // 2. Try to send money to addresses[countryCode]
        (bool sent, ) = addresses[countryCode].call{value: amount}("");
        if (!sent) {
            emit LogTransferFailed(
                transferCount - 1,
                msg.sender,
                countryCode,
                amount
            );
        }
        // defending afainst https://swcregistry.io/docs/SWC-104
        require(sent, "Failed to send Ether");
        // 3. If success, change the status to Sent
        emit LogTransferSent(
            transferCount - 1,
            msg.sender,
            countryCode,
            amount,
            Status.Sent,
            minValue
        );
    }

    /// @notice Get information about a given trasfer
    /// @param _transferId transfer id
    /// @return transfer information: transfer id, from - address of the sender, to - receiving country code, status - status of the transfer, amount transferred (in ETH), contract fee
    function getTransfer(uint256 _transferId)
        public
        view
        transferExists(_transferId)
        returns (
            uint256,
            address,
            string memory,
            Status,
            uint256,
            uint256
        )
    {
        return (
            transfers[_transferId].transferId,
            transfers[_transferId].from,
            transfers[_transferId].to,
            transfers[_transferId].status,
            transfers[_transferId].amount,
            minValue
        );
    }

    /// @notice Confirm a given transfer, should be done after Admin has transferred the money to the recepient off-chain
    /// @param _transferId transfer id
    function confirmTransfer(uint256 _transferId)
        public
        onlyOwner
        whenNotPaused
        transferExists(_transferId)
        checkStatus(transfers[_transferId].status)
    {
        transfers[_transferId].status = Status.Confirmed;
        pendingTransfers[addresses[transfers[_transferId].to]] -= 1;
    }

    /// @notice Withdraw contract's balance to the owner's address
    /// @dev The function will revert if the send wasn't successful
    function withdraw() public onlyOwner {
        (bool sent, ) = msg.sender.call{value: address(this).balance}("");
        require(sent, "Failed to send Ether");
    }

    /// @notice pause the contract -- the contract will start functioning in read-only mode.
    /// @dev Implementing the circuit breaker pattern
    function pause() public onlyOwner {
        Pausable._pause();
    }

    /// @notice resume the contract for both reads and writes
    /// @dev Implementing the circuit breaker pattern
    function unpause() public onlyOwner {
        Pausable._unpause();
    }
}
