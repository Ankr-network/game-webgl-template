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
