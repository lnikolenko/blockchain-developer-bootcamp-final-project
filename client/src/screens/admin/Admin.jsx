import React, { useState, useEffect } from "react";
import { useWeb3 } from "../../hooks/web3";
import { Button, message } from "antd";
import MetaMaskModal from "../../components/MetaMaskModal";
import CountryPanel from "./CountryPanel";
import TransferPanel from "./TransferPanel";
import PausePanel from "./PausePanel";
import WithdrawPanel from "./WithdrawPanel";
import { contractState } from "../../constants";

function Admin() {
  const { web3, connectToMetaMask, checkMetaMaskInstallation } = useWeb3();
  let [refreshedAccounts, setRefreshedAccounts] = useState({
    refreshed: false,
    cb: null,
  });
  let [loading, setLoading] = useState(false);
  let [signedIn, setSignedIn] = useState(false);
  let [paused, setPaused] = useState(contractState.UNKNOWN);
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

  useEffect(() => {
    if (!web3 || web3.paused === null) {
      return;
    }
    if (web3.paused) {
      setPaused(contractState.PAUSED);
    } else {
      setPaused(contractState.RUNNING);
    }
  }, [web3]);

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

  const pause = async (contract, accounts, setLoadingcb, setPausedcb) => {
    try {
      await contract.methods.pause().send({ from: accounts[0] });
      setLoadingcb(false);
      setPaused(contractState.PAUSED);
      message.success("Success!");
    } catch (e) {
      setLoadingcb(false);
      if (e.code === 4001) {
        //user explicitly denied access
        message.error("Please confirm the transaction in Metamask!");
      } else {
        message.error(`Got ${e.message}`);
        console.log(e);
      }
    }
  };

  const resume = async (contract, accounts, setLoadingcb, setPausedcb) => {
    try {
      await contract.methods.unpause().send({ from: accounts[0] });
      setLoadingcb(false);
      setPaused(contractState.RUNNING);
      message.success("Success!");
    } catch (e) {
      setLoadingcb(false);
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
            <CountryPanel paused={paused} />
            <br />
            {paused.text == contractState.RUNNING.text && <TransferPanel />}
            <br />
            <PausePanel pause={pause} resume={resume} paused={paused} />
            <br />
            <WithdrawPanel />
          </div>
        )}
      </div>
    </div>
  );
}

export default Admin;
