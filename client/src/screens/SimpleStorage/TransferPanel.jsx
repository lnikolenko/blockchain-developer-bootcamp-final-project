import React, { useState, useEffect } from "react";
import { useWeb3 } from "../../providers/web3/getWeb3";
import { Form, InputNumber, Button, Card, message } from "antd";

function TransferPanel() {
  const web3 = useWeb3();
  let [refreshedAccounts, setRefreshedAccounts] = useState(null);
  let [loading, setLoading] = useState(false);
  let [transferId, setTransferId] = useState("");

  const handleClick = async () => {
    setLoading(true);
    setRefreshedAccounts(false);
    try {
      await web3.connectToMetaMask();
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
    confirmTransfer();
  }, [refreshedAccounts]);

  const confirmTransfer = async () => {
    try {
      await web3.contract.methods
        .confirmTransfer(transferId)
        .send({ from: web3.accounts[0] });
      setLoading(false);
      message.success("Success!");
    } catch (e) {
      setLoading(false);
      if (e.code == 4001) {
        //user explicitly denied access
        message.error("Please confirm the transaction in Metamask!");
      } else {
        message.error(`Got ${e.message.data}`);
        console.log(e);
      }
    }
  };

  return (
    <div>
      <Card title="Confirm Transfer">
        <Form layout="inline">
          <Form.Item label="Transfer id">
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
      </Card>
    </div>
  );
}

export default TransferPanel;
