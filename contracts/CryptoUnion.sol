// SPDX-License-Identifier: MIT
pragma solidity >=0.4.21 <0.7.0;

contract CryptoUnion {
    // <owner>
    address public owner = msg.sender;

    //transfer id
    uint256 public transferCount = 0;

    //the initator needs to send > minValue for the transaction to go through
    uint256 public minValue = 2e17;

    //contry code (3 chars max) -> address mapping
    mapping(string => address) public addresses;

    //wallet address -> count of pending transfers mapping
    mapping(address => uint256) public pendingTransfers;

    // transfer id -> Transfer mapping
    mapping(uint256 => Transfer) public transfers;

    // enum State
    // Initiated - user initiated the trasfer
    // Sent - the money was sent to the desination country
    // Failed - the money was not sent to the destination country, because of some error
    // Confirmed - the initiator of the trasfer was sent a confirmation that the intended recepient
    // has received the money
    // Refunded - the initiator of the trasfer was refunded their payment minus the gas fees
    // State transitions:
    //     Initalized
    //     /        \
    //   Sent     Refunded
    //    |
    // Confirmed
    enum Status {
        Initiated,
        Sent,
        Confirmed,
        Refunded
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

    /*
     * Modifiers
     */
    modifier isOwner() {
        require(msg.sender == owner, "Owner required!");
        _;
    }

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
    modifier checkStatus(Status expectedStatus, Status actualStatus) {
        revert("Not implemented!");
        _;
    }

    // we cannot uodate an address if there are pending transfers tied to that address
    modifier noPendingTransfers(bytes4 countryCode) {
        revert("Not implemented!");
        _;
    }

    function adminSignIn() public view returns (bool) {
        if (msg.sender == owner) {
            return true;
        }
        return false;
    }

    function setAddress(string memory countryCode, address wallet)
        public
        isOwner
        validCountryCode(countryCode)
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

    function setMinValue(uint256 _minValue) public isOwner {
        revert("Not implemented!");
    }

    function getMinValue() public view returns (uint256) {
        revert("Not implemented!");
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
            return;
        }
        uint256 amount = msg.value - minValue;
        transfers[transferCount] = Transfer(
            transferCount,
            msg.sender,
            countryCode,
            Status.Initiated,
            amount
        );
        // 2. Try to send money to addresses[countryCode]
        (bool sent, ) = addresses[countryCode].call.value(amount)("");
        require(sent, "Failed to send Ether");
        // 3. If success, change the status to Sent
        transfers[transferCount].status = Status.Sent;
        transferCount += 1;
        // 4. If fail, refund the money to the sender (minus the contract fees) and change the status to Refunded
        //revert("Not implemented!");
    }

    function refundEth(address sender) public returns (bool) {
        revert("Not implemented!");
    }

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

    function getTransfer(uint256 _transferId)
        public
        view
        returns (
            uint256,
            address,
            bytes4,
            uint256
        )
    {
        revert("Not implemented!");
    }

    function confirmTransfer(uint256 _transferId)
        public
        isOwner
        checkStatus(Status.Sent, transfers[_transferId].status)
    {
        revert("Not implemented!");
    }
}
