import React, { useState, useEffect } from "react";
import { useWeb3 } from "../../providers/web3/getWeb3";
import { Form, Input, Button, Card, Typography, message, Tag } from "antd";

const { Title } = Typography;

function CountryPanel() {
  let [countryCode, setCountryCode] = useState("");
  let [retrivedCountryCode, setRetrivedCountryCode] = useState("");
  let [retrivedAddress, setRetrivedAddress] = useState("");
  let [address, setAddress] = useState("");
  const { web3, connectToMetaMask } = useWeb3();
  let [refreshedAccounts, setRefreshedAccounts] = useState({
    refreshed: false,
    cb: null,
  });
  let [loadingSet, setLoadingSet] = useState(false);
  let [loadingGet, setLoadingGet] = useState(false);

  const handleGetClick = async () => {
    setLoadingGet(true);
    setRefreshedAccounts({
      refreshed: false,
      cb: null,
    });
    try {
      await connectToMetaMask();
      setRefreshedAccounts({
        refreshed: true,
        cb: getAddressContract,
      });
    } catch (e) {
      setLoadingGet(false);
      setRefreshedAccounts({
        refreshed: false,
        cb: null,
      });
      message.error("Please allow access!");
    }
  };

  const handleSetClick = async () => {
    setLoadingSet(true);
    setRefreshedAccounts({
      refreshed: false,
      cb: null,
    });
    try {
      await connectToMetaMask();
      setRefreshedAccounts({
        refreshed: true,
        cb: setAddressContract,
      });
    } catch (e) {
      setLoadingSet(false);
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

  const setAddressContract = async (contract, accounts) => {
    try {
      await contract.methods
        .setAddress(countryCode, address)
        .send({ from: accounts[0] });
      setLoadingSet(false);
      message.success("Success!");
    } catch (e) {
      setLoadingSet(false);
      if (e.code === 4001) {
        //user explicitly denied access
        message.error("Please confirm the transaction in Metamask!");
      } else {
        message.error(`Got ${e}`);
        console.log(e);
      }
    }
  };

  const getAddressContract = async (contract, accounts) => {
    try {
      const response = await contract.methods
        .getAddress(retrivedCountryCode)
        .call({ from: accounts[0] });
      setLoadingGet(false);
      setRetrivedAddress(response);
      message.success("Success!");
    } catch (e) {
      setLoadingGet(false);
      if (e.code === 4001) {
        //user explicitly denied access
        message.error("Please confirm the transaction in Metamask!");
      } else {
        message.error(`Got ${e}`);
        console.log(e);
      }
    }
  };

  return (
    <div>
      <Card title="Country addresses">
        <Title level={5}>Get country address</Title>
        <Form layout="inline">
          <Form.Item label="Country Code">
            <Input
              maxLength={3}
              placeholder="Enter country code"
              value={retrivedCountryCode}
              onChange={(e) =>
                setRetrivedCountryCode(e.target.value.toUpperCase())
              }
            />
          </Form.Item>
          <Form.Item>
            <Button
              disabled={loadingGet}
              type="primary"
              onClick={handleGetClick}
            >
              Submit
            </Button>
          </Form.Item>
          <Form.Item>
            <Tag>{retrivedAddress ? retrivedAddress : "--"}</Tag>
          </Form.Item>
        </Form>
        <br />
        <Title level={5}>Set country address</Title>
        <Form layout="inline">
          <Form.Item label="Country Code">
            <Input
              maxLength={3}
              placeholder="Enter country code"
              value={countryCode}
              onChange={(e) => setCountryCode(e.target.value.toUpperCase())}
            />
          </Form.Item>
          <Form.Item label="Wallet Address">
            <Input
              placeholder="Enter wallet address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </Form.Item>
          <Form.Item>
            <Button
              disabled={loadingSet}
              type="primary"
              onClick={handleSetClick}
            >
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}

export default CountryPanel;
