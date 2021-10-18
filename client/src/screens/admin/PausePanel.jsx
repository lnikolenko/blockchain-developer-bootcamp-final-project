import React, { useState, useEffect } from "react";
import { useWeb3 } from "../../hooks/web3";
import { Form, Button, Card, message, Tag } from "antd";
import { contractState } from "../../constants";

function PausePanel({ pause, resume, paused }) {
  const { web3, connectToMetaMask } = useWeb3();
  let [refreshedAccounts, setRefreshedAccounts] = useState({
    refreshed: false,
    cb: null,
  });
  let [loading, setLoading] = useState(false);

  const handleClick = async (cb) => {
    setLoading(true);
    setRefreshedAccounts({
      refreshed: false,
      cb: null,
    });
    try {
      await connectToMetaMask();
      setRefreshedAccounts({
        refreshed: true,
        cb: cb,
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
    refreshedAccounts.cb(web3.contract, web3.accounts, setLoading);
  }, [refreshedAccounts, web3]);

  return (
    <div>
      <Card title="Pause/Unpause Contract">
        <Form layout="inline">
          <Form.Item>
            {false && paused.text === contractState.UNKNOWN.text && (
              <Button disabled={loading} type="primary" onClick={() => {}}>
                Check if the contract is paused
              </Button>
            )}
            {paused.text === contractState.RUNNING.text && (
              <Button
                disabled={loading}
                danger
                type="primary"
                onClick={() => {
                  handleClick(pause);
                }}
              >
                Pause contract
              </Button>
            )}
            {paused.text === contractState.PAUSED.text && (
              <Button
                disabled={loading}
                danger
                type="primary"
                onClick={() => {
                  handleClick(resume);
                }}
              >
                Resume contract
              </Button>
            )}
          </Form.Item>
          <Form.Item>
            <Tag color={paused.color}>{paused.text}</Tag>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}

export default PausePanel;
