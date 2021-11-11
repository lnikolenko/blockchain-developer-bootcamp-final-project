import React from "react";
import { Modal } from "antd";

function MetaMaskModal({ visible }) {
  return (
    <Modal
      visible={visible}
      closable={false}
      title="Cannot Detect MetaMask"
      footer={null}
    >
      Please install Metamask and then refresh this page.
    </Modal>
  );
}

export default MetaMaskModal;
