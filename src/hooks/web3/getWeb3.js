import React, { useContext, createContext, useState } from "react";
import CryptoUnionContract from "../../contracts/CryptoUnion.json";
import Web3 from "web3";

const web3Context = createContext();

export function useWeb3() {
  return useContext(web3Context);
}

export function ProvideWeb3({ children }) {
  const web3Hook = useProvideWeb3();
  return (
    <web3Context.Provider value={web3Hook}>{children}</web3Context.Provider>
  );
}

export const getWeb3 = async () =>
  new Promise(async (resolve, reject) => {
    if (document.readyState !== "complete") {
      reject("The window has not loaded yet!");
    }
    // Wait for loading completion to avoid race conditions with web3 injection timing.
    // Modern dapp browsers...
    if (window.ethereum) {
      const web3 = new Web3(window.ethereum);
      try {
        // Request account access if needed
        await window.ethereum.enable();
        // Accounts now exposed
        resolve(web3);
      } catch (error) {
        reject(error);
      }
    } else {
      reject("Please update your browser or install MetaMask");
    }
  });

function useProvideWeb3() {
  let [web3, setWeb3] = useState(null);
  let [accounts, setAccounts] = useState(null);
  let [networkId, setNetworkId] = useState(null);
  let [deployedNetwork, setDeployedNetwork] = useState(null);
  let [contract, setContract] = useState(null);
  let [paused, setPaused] = useState(null);

  const connectToMetaMask = async () => {
    try {
      const w3 = await getWeb3();
      setWeb3(w3);

      const a = await w3.eth.getAccounts();
      setAccounts(await w3.eth.getAccounts());

      // Get the contract instance.
      const netId = await w3.eth.net.getId();
      setNetworkId(netId);

      const deployedNet = CryptoUnionContract.networks[netId];
      setDeployedNetwork(deployedNet);
      const c = new w3.eth.Contract(
        CryptoUnionContract.abi,
        deployedNet && deployedNet.address
      );
      setContract(c);
      const p = await c.methods.paused().call({ from: a[0] });
      setPaused(p);

      window.ethereum.on("accountsChanged", function (accounts) {
        console.log("account changed");
        setAccounts(accounts);
      });

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
    } catch (error) {
      // Catch any errors for any of the above operations.
      //alert(
      //  `Failed to load web3, accounts, or contract. Check console for details.`
      //);
      console.error(error);

      if (error.code === 4001) {
        throw error;
      }
    }
  };

  const checkMetaMaskInstallation = () => {
    if (typeof window.ethereum === "undefined") {
      return false;
    }
    return true;
  };

  return {
    checkMetaMaskInstallation,
    connectToMetaMask,
    accounts,
    networkId,
    deployedNetwork,
    contract,
    paused,
    web3,
  };
}
