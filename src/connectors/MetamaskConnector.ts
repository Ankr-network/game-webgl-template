import detectEthereumProvider from "@metamask/detect-provider";
import Web3 from "web3";

export const isConnected = async () =>  {
  const provider = await detectEthereumProvider() as any;
  const web3 = new Web3(provider);
  const accounts = await web3.eth.getAccounts();
  const isConnected = accounts.length > 0;

  return isConnected;
};
