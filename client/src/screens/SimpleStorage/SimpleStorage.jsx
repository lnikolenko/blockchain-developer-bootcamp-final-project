import React, { useState, useEffect } from "react";
import { useWeb3 } from "../../providers/web3/getWeb3";
import { Button, message } from "antd";
import MetaMaskModal from "../../components/MetaMaskModal";
import CountryPanel from "./CountryPanel";

function SimpleStorage() {
  const web3 = useWeb3();
  let [refreshedAccounts, setRefreshedAccounts] = useState(false);
  let [loading, setLoading] = useState(false);
  let [signedIn, setSignedIn] = useState(false);
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
    adminSignIn();
  }, [refreshedAccounts]);

  const adminSignIn = async () => {
    try {
      const response = await web3.contract.methods
        .adminSignIn()
        .call({ from: web3.accounts[0] });
      console.log(response);
      setLoading(false);
      if (response) {
        setSignedIn(true);
      } else {
        message.error("Only an owner of the account can access this page!");
      }
    } catch (e) {
      setLoading(false);
      if (e.code === 4001) {
        //user explicitly denied access
        message.error("Please confirm the transaction in Metamask!");
      } else {
        message.error("Something went wrong, try regreshing the page");
        console.log(e);
      }
    }
  };

  return (
    <div>
      <MetaMaskModal visible={!web3.checkMetaMaskInstallation()} />
      <div style={{ padding: "5%" }}>
        {!signedIn ? (
          <Button
            type="primary"
            size="large"
            disabled={loading}
            onClick={handleClick}
          >
            Sign In
          </Button>
        ) : (
          <CountryPanel />
        )}
      </div>
    </div>
  );
}

export default SimpleStorage;
