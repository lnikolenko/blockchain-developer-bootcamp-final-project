import React from "react";
import SendCard from "./SendCard";
import TransferCard from "./TransferCard";

function Home() {
  return (
    <div style={{ padding: "5%" }}>
      <SendCard />
      <br />
      <TransferCard />
    </div>
  );
}

export default Home;
