import React, { useState, useEffect } from "react";
import { useWeb3 } from "../../providers/web3/getWeb3";
import { Form, Button, Card, message, InputNumber, Alert } from "antd";
import confirmationModal from "./ConfirmationModal";

function TransferCard() {
  let [transferId, setTransferId] = useState("");
  const { connectToMetaMask, contract, accounts } = useWeb3();
  let [refreshedAccounts, setRefreshedAccounts] = useState(false);
  let [loading, setLoading] = useState(false);
  const handleClick = async () => {
    setLoading(true);
    setRefreshedAccounts(false);
    try {
      await connectToMetaMask();
      setRefreshedAccounts(true);
    } catch (e) {
      setLoading(false);
      setRefreshedAccounts(false);
      message.error("Please allow access!");
    }
  };

  useEffect(() => {
    if (!refreshedAccounts) {
      return;
    }
    sendEthToCountry();
  }, [refreshedAccounts]);

  const sendEthToCountry = async () => {
    try {
      const result = await contract.methods.getTransfer(transferId).call();
      console.log(result);
      confirmationModal(
        null,
        result[0],
        result[2],
        result[1],
        result[4] / 1e18,
        result[3],
        result[5] / 1e18,
        true
      );
      setLoading(false);
    } catch (e) {
      setLoading(false);
      if (e.code == 4001) {
        //user explicitly denied access
        message.error("Please confirm the transaction in Metamask!");
      } else if (e.message.includes("Transfer does not exist")) {
        message.error("Invalid transfer Id");
      } else {
        message.error(`Got ${e.message}`);
        console.log(e);
      }
    }
  };

  return (
    <Card title="View Transfer">
      <Form>
        <Form.Item label="Transfer Id">
          <InputNumber
            style={{
              width: "50%",
            }}
            placeholder="Enter Transfer Id"
            value={transferId}
            min="0"
            step="1"
            onChange={(e) => setTransferId(e)}
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
          message="Please do not refresh this page until you see a modal with your transfer information"
          type="warning"
        />
      )}
    </Card>
  );
}

export default TransferCard;
