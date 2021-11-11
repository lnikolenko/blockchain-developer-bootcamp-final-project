import React from "react";
import { Modal, Descriptions, Tag } from "antd";

function confirmationModal(
  transactionHash,
  transferId,
  to,
  from,
  amount,
  status,
  contractFee,
  isInfo
) {
  const transferStatusMap = {
    0: { name: "Sent", color: "gold" },
    1: { name: "Confirmed", color: "green" },
  };
  const params = {
    width: "500",
    title: "Thank you for submitting a transfer!",
    content: (
      <Descriptions
        title="Please keep the information below for you records"
        bordered
      >
        {transactionHash && (
          <Descriptions.Item label="Transaction hash">
            {transactionHash}
          </Descriptions.Item>
        )}
        <Descriptions.Item label="Transfer id">{transferId}</Descriptions.Item>
        <Descriptions.Item label="To">{to}</Descriptions.Item>
        <Descriptions.Item label="From">{from}</Descriptions.Item>
        <Descriptions.Item label="Amount">{amount} ETH</Descriptions.Item>
        <Descriptions.Item label="Status">
          <Tag color={transferStatusMap[status].color}>
            {transferStatusMap[status].name}{" "}
          </Tag>
        </Descriptions.Item>
        <Descriptions.Item label="Contract Fee">
          {contractFee} ETH
        </Descriptions.Item>
      </Descriptions>
    ),
    onOk() {},
  };
  if (isInfo) {
    Modal.info({ ...params, title: "Here is your trasfer summary" });
  } else {
    Modal.success(params);
  }
}

export default confirmationModal;
