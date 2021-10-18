import React from "react";
import { Modal } from "antd";

function MetaMaskModal({ visible }) {
  return (
    <Modal
      visible={visible}
      closable={false}
      title="The contract is paused"
      footer={null}
    >
      Please visit us at a later time
    </Modal>
  );
}

export default MetaMaskModal;
