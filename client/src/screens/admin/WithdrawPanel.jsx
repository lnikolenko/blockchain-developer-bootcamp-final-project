import React, { useState, useEffect } from "react";
import { useWeb3 } from "../../hooks/web3";
import { Button, Card, message } from "antd";

function WithdrawPanel() {
  const { web3, connectToMetaMask } = useWeb3();
  let [refreshedAccounts, setRefreshedAccounts] = useState({
    refreshed: false,
    cb: null,
  });
  let [loading, setLoading] = useState(false);
  let [balance, setBalance] = useState(false);

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
        cb: withraw,
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

  useEffect(() => {
    const getBalance = async (web3) => {
      try {
        const balance = await web3.web3.eth.getBalance(
          web3.contract.options.address
        );
        setBalance(balance / 1e18);
      } catch (e) {
        console.error(e);
        message.error("Could not get contracts balance!");
      }
    };

    if (!web3) {
      return;
    }
    getBalance(web3);
  });

  const withraw = async (contract, accounts) => {
    try {
      await contract.methods.withdraw().send({ from: accounts[0] });
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
      <Card title="Withdraw Contract Balance">
        {web3 && <p>Current balance is {balance} ETH</p>}
        <Button disabled={loading} type="primary" onClick={handleClick}>
          Withdraw ETH
        </Button>
      </Card>
    </div>
  );
}

export default WithdrawPanel;
