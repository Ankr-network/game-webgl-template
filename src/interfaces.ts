export interface TransactionData
{
  from: string;
  to: string;
  data: string;
  gas: string;
  gasPrice: string;
  value: string;
  nonce: number;
  chainId: number;
}

export interface DataSignaturePropsDTO {
  address: string;
  message: string;
  password?: string;
}

export interface IConnectionProps {
  wallet: string;
  chain: IEthereumChain;
}

export interface IEthereumChain {
  chainId: string; // A 0x-prefixed hexadecimal string
  chainName: string;
  nativeCurrency: {
    name: string;
    symbol: string; // 2-6 characters long
    decimals: 18;
  };
  rpcUrls: string[];
  blockExplorerUrls?: string[];
  iconUrls?: string[]; // Currently ignored.
}
