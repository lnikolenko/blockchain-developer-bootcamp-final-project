import React, { useState, useEffect } from "react";
import { useWeb3 } from "../../providers/web3/getWeb3";
import {
  Form,
  Input,
  Button,
  Card,
  Typography,
  message,
  InputNumber,
} from "antd";

function CountryPanel() {
  let [countryCode, setCountryCode] = useState("");
  let [amount, setAmount] = useState("");
  const web3 = useWeb3();
  let [refreshedAccounts, setRefreshedAccounts] = useState(false);
  let [loading, setLoading] = useState(false);
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
    sendEthToCountry();
  }, [refreshedAccounts]);

  const sendEthToCountry = async () => {
    try {
      const amountWei = amount * 1e18;
      await web3.contract.methods
        .sendEthToCountry(countryCode)
        .send({ from: web3.accounts[0], value: amountWei });
      setLoading(false);
      message.success("Success!");
    } catch (e) {
      setLoading(false);
      if (e.code == 4001) {
        //user explicitly denied access
        message.error("Please confirm the transaction in Metamask!");
      } else {
        message.error(`Got ${e.message}`);
        console.log(e);
      }
    }
  };

  return (
    <div style={{ padding: "5%" }}>
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
      </Card>
    </div>
  );
}

export default CountryPanel;
