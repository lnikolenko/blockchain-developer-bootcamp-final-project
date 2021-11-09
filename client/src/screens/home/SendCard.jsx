import React, { useState, useEffect } from "react";
import { useWeb3 } from "../../hooks/web3";
import { Form, Input, Button, Card, message, InputNumber, Alert } from "antd";
import confirmationModal from "./ConfirmationModal";
import PausedModal from "../../components/PausedModal";

function SendCard() {
  let [countryCode, setCountryCode] = useState("");
  let [amount, setAmount] = useState("");
  const { contract, accounts, paused, connectToMetaMask } = useWeb3();
  let [refreshedAccounts, setRefreshedAccounts] = useState({
    refreshed: false,
    cb: null,
  });
  let [loading, setLoading] = useState(false);
  const handleClick = async () => {
    setLoading(true);
    try {
      if (!contract) {
        await connectToMetaMask();
      }
      setRefreshedAccounts({
        refreshed: true,
        cb: sendEthToCountry,
      });
    } catch (e) {
      setLoading(false);
      setRefreshedAccounts({
        refreshed: false,
        cb: null,
      });
      message.error("Please allow access!");
    }
  };

  useEffect(() => {
    if (paused) {
      setLoading(false);
      return;
    }
    if (!refreshedAccounts.refreshed || !contract || !accounts) {
      return;
    }

    refreshedAccounts.cb(contract, accounts);
  }, [refreshedAccounts, paused, contract, accounts]);

  const sendEthToCountry = async (contract, accounts) => {
    setRefreshedAccounts({
      refreshed: false,
      cb: null,
    });
    try {
      const amountWei = amount * 1e18;
      const result = await contract.methods
        .sendEthToCountry(countryCode)
        .send({ from: accounts[0], value: amountWei });
      console.log(result);
      confirmationModal(
        result.transactionHash,
        result.events.LogTransferSent.returnValues.transferId,
        result.events.LogTransferSent.returnValues.to,
        result.events.LogTransferSent.returnValues.from,
        result.events.LogTransferSent.returnValues.amount / 1e18,
        result.events.LogTransferSent.returnValues.status,
        result.events.LogTransferSent.returnValues.contractFee / 1e18,
        false
      );
      setLoading(false);
    } catch (e) {
      setLoading(false);
      if (e.code === 4001) {
        //user explicitly denied access
        message.error("Please confirm the transaction in Metamask!");
      } else {
        message.error(`Got ${e.message}`);
        console.log(e);
      }
    }
  };

  return (
    <div>
      <PausedModal visible={paused} />
      <Card title="Send Money!">
        <Form>
          <Form.Item label="Country Code">
            <Input
              style={{
                width: "50%",
              }}
              maxLength={3}
              placeholder="Enter country code"
              value={countryCode}
              onChange={(e) => setCountryCode(e.target.value.toUpperCase())}
            />
          </Form.Item>
          <Form.Item label="Amount in ETH">
            <InputNumber
              style={{
                width: "50%",
              }}
              value={amount}
              placeholder="Enter the amount"
              min="0"
              step="0.00000000000001"
              stringMode
              onChange={(e) => setAmount(e)}
            />
          </Form.Item>
          <Form.Item>
            <Button disabled={loading} type="primary" onClick={handleClick}>
              Submit
            </Button>
          </Form.Item>
        </Form>
        {loading && (
          <Alert
            message="Please do not refresh this page until you see a confirmation modal with your transaction information"
            type="warning"
          />
        )}
      </Card>
    </div>
  );
}

export default SendCard;
