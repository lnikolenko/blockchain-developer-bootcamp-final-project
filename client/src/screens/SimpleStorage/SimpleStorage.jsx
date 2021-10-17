import React, { useState, useEffect } from "react";
import { useWeb3 } from "../../providers/web3/getWeb3";
import { Button, message } from "antd";
import MetaMaskModal from "../../components/MetaMaskModal";
import CountryPanel from "./CountryPanel";
import TransferPanel from "./TransferPanel";

function SimpleStorage() {
  const { web3, connectToMetaMask, checkMetaMaskInstallation } = useWeb3();
  let [refreshedAccounts, setRefreshedAccounts] = useState({
    refreshed: false,
    cb: null,
  });
  let [loading, setLoading] = useState(false);
  let [signedIn, setSignedIn] = useState(false);
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
        cb: adminSignIn,
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
  }, [web3, refreshedAccounts]);

  const adminSignIn = async (contract, accounts) => {
    try {
      const response = await contract.methods
        .adminSignIn()
        .call({ from: accounts[0] });
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
        message.error("Something went wrong, try refreshing the page");
        console.log(e);
      }
    }
  };

  return (
    <div>
      <MetaMaskModal
        visible={checkMetaMaskInstallation && !checkMetaMaskInstallation()}
      />
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
          <div>
            <CountryPanel />
            <br />
            <TransferPanel />
          </div>
        )}
      </div>
    </div>
  );
}

export default SimpleStorage;