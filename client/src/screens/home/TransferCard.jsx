import React, { useState, useEffect } from "react";
import { useWeb3 } from "../../hooks/web3";
import { Form, Button, Card, message, InputNumber, Alert } from "antd";
import confirmationModal from "./ConfirmationModal";

function TransferCard() {
  let [transferId, setTransferId] = useState("");
  const { contract, connectToMetaMask } = useWeb3();
  let [refreshedAccounts, setRefreshedAccounts] = useState({
    refreshed: false,
    cb: null,
  });
  let [loading, setLoading] = useState(false);
  const handleClick = async () => {
    if (transferId === "" || transferId === null) {
      message.error("Please input the transfer id!");
      return;
    }
    setLoading(true);
    setRefreshedAccounts({
      refreshed: false,
      cb: null,
    });
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
    if (!refreshedAccounts.refreshed || !contract) {
      return;
    }
    refreshedAccounts.cb(contract);
  }, [refreshedAccounts, contract]);

  const sendEthToCountry = async (contract) => {
    setRefreshedAccounts({
      refreshed: false,
      cb: null,
    });
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
      if (e.code === 4001) {
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
        <Form.Item
          label="Transfer Id"
          name="transferId"
          rules={[{ required: true, message: "Please input the transferId!" }]}
        >
          <InputNumber
            style={{
              width: "50%",
            }}
            placeholder="Enter Transfer Id"
            value={transferId}
            min="0"
            step="1"
            onChange={(e) => {
              setTransferId(e);
            }}
            required
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
