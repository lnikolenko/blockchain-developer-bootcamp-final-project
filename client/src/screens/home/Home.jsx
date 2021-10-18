import React from "react";
import MetaMaskModal from "../../components/MetaMaskModal";
import SendCard from "./SendCard";
import TransferCard from "./TransferCard";
import { useWeb3 } from "../../hooks/web3";

function Home() {
  const { checkMetaMaskInstallation, web3 } = useWeb3();
  return (
    <div>
      <MetaMaskModal
        visible={checkMetaMaskInstallation && !checkMetaMaskInstallation()}
      />
      <div style={{ padding: "5%" }}>
        <SendCard />
        <br />
        <TransferCard />
      </div>
    </div>
  );
}

export default Home;
