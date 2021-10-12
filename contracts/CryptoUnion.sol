// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "@openzeppelin/contracts/access/Ownable.sol";

contract CryptoUnion is Ownable {
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

    // enum State
    // Sent - the money was sent to the desination country
    // Confirmed - the initiator of the trasfer was sent a confirmation that the intended recepient
    // has received the money (a manual step for now)
    // If the send fails the initiator will be refued their payment minus the gas fees via revert
    // State transitions:
    // Sent -> Confirmed
    enum Status {
        Sent,
        Confirmed
    }

    // struct Transfer
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
    // <LogForSale event: sku arg>
    event LogCountryAddressUpdated(
        string countryCode,
        address oldWallet,
        address newWallet
    );

    event LogTransferSent(
        uint256 transferId,
        address from,
        string to,
        uint256 amount,
        Status status,
        uint256 contractFee
    );
    event LogTransferFailed(
        uint256 transferId,
        address from,
        string to,
        uint256 amount
    );

    /*
     * Modifiers
     */

    modifier validCountryCode(string memory countrycode) {
        bytes memory tempEmptyStringTest = bytes(countrycode);
        require(tempEmptyStringTest.length == 3, "Invalid country code!");
        _;
    }

    // validate that the initaltor of the transfer paid a non-zero amount
    modifier paidEnough() {
        require(msg.value >= minValue, "Insufficient ammount!");
        _;
    }

    // validate transfer status, expectedStatus == actualStatus
    modifier checkStatus(Status status) {
        require(status == Status.Sent, "Transfer is already confirmed!");
        _;
    }

    // we cannot uodate an address if there are pending transfers tied to that address
    modifier noPendingTransfers(string memory countryCode) {
        require(
            pendingTransfers[addresses[countryCode]] == 0,
            "There are still unconfirmed transfers at this address!"
        );
        _;
    }

    modifier transferExists(uint256 _transferId) {
        address from = transfers[_transferId].from;
        require(from != address(0), "Transfer does not exist!");
        _;
    }

    function adminSignIn() public view returns (bool) {
        return msg.sender == owner();
    }

    function setAddress(string memory countryCode, address wallet)
        public
        onlyOwner
        validCountryCode(countryCode)
        noPendingTransfers(countryCode)
    {
        address oldWallet = addresses[countryCode];
        addresses[countryCode] = wallet;
        emit LogCountryAddressUpdated(countryCode, oldWallet, wallet);
    }

    function getAddress(string memory countryCode)
        public
        view
        validCountryCode(countryCode)
        returns (address)
    {
        return addresses[countryCode];
    }

    /*
    function setMinValue(uint256 _minValue) public isOwner {
        revert("Not implemented!");
    }
    */
    function getMinValue() public view returns (uint256) {
        return minValue;
    }

    function getTransferCount() public view returns (uint256) {
        return transferCount;
    }

    function sendEthToCountry(string memory countryCode)
        public
        payable
        paidEnough
        validCountryCode(countryCode)
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

    /*
    function sendToCountry(string memory countryCode)
        public
        payable
        paidEnough
    {
        // Similar steps to sendEthToCountry() but with USDT
        revert("Not implemented!");
    }

    function refund(address sender) public returns (bool) {
        revert("Not implemented!");
    }
    */

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

    function confirmTransfer(uint256 _transferId)
        public
        onlyOwner
        transferExists(_transferId)
        checkStatus(transfers[_transferId].status)
    {
        transfers[_transferId].status = Status.Confirmed;
        pendingTransfers[addresses[transfers[_transferId].to]] -= 1;
    }
}
