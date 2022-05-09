import { createContext, useContext, useEffect, useState } from "react";
import Web3 from "web3";

import abi from "../contracts/abi.json";
import { useAuthContext } from "./AuthProvider";
import { config } from "../config";

export const ContractContext = createContext({
  contract: null,
  web: null,
  wrongNetwork: false,
  getBnbBalance: () => null,
  fromWei: () => null,
  toWei: () => null,
});

export const ContractProvider = ({ children }) => {
  const [contract, setContract] = useState();
  const [web3, setWeb3] = useState();
  const { chainId, setSnackbar } = useAuthContext();
  const [wrongNetwork, setWrongNetwork] = useState(false);

  useEffect(() => {
    if (!chainId) {
      return;
    }
    if (parseInt(chainId) !== config.chainId) {
      setSnackbar({
        type: "error",
        message: "Wrong network",
      });
      setWrongNetwork(true);
      return;
    }
    setWrongNetwork(false);
    const web3Instance = new Web3();
    web3Instance.setProvider(Web3.givenProvider);

    setWeb3(web3Instance);
    const contract = new web3Instance.eth.Contract(abi, config.contractAddress);
    setContract(contract);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chainId]);

  const getBnbBalance = (address) => web3.eth.getBalance(address);
  const fromWei = (wei, unit = "ether") =>
    parseFloat(Web3.utils.fromWei(wei, unit)).toFixed(3);
  const toWei = (amount, unit = "ether") => Web3.utils.toWei(amount, unit);

  return (
    <ContractContext.Provider
      value={{ web3, contract, wrongNetwork, getBnbBalance, fromWei, toWei }}
    >
      {children}
    </ContractContext.Provider>
  );
};

export const useContractContext = () => useContext(ContractContext);
