import React, { useState, useEffect } from "react";
import { useWeb3 } from "../../providers/web3/getWeb3";
import { Form, InputNumber, Button, Card, message } from "antd";

function TransferPanel() {
  const { web3, connectToMetaMask } = useWeb3();
  let [refreshedAccounts, setRefreshedAccounts] = useState({
    refreshed: false,
    cb: null,
  });
  let [loading, setLoading] = useState(false);
  let [transferId, setTransferId] = useState("");

  const handleClick = async () => {
    setLoading(true);
    setRefreshedAccounts({
      refreshed: false,
      cb: null,
    });
    try {
      await connectToMetaMask();
      setRefreshedAccounts({
        refreshed: true,
        cb: confirmTransfer,
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
    if (!refreshedAccounts.refreshed || !web3) {
      return;
    }
    refreshedAccounts.cb(web3.contract, web3.accounts);
  }, [refreshedAccounts, web3]);

  const confirmTransfer = async (contract, accounts) => {
    try {
      await contract.methods
        .confirmTransfer(transferId)
        .send({ from: accounts[0] });
      setLoading(false);
      message.success("Success!");
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
