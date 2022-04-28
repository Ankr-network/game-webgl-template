import Web3 from "web3";
import {IMessagesQueue} from "./MessagesQueue";
import {DataSignaturePropsDTO, TransactionData} from "./interfaces";
import detectEthereumProvider from '@metamask/detect-provider';
import {ExternalMethod} from "./ExternalMethodDecorator";


interface ITransactionHandler {
  signMessage: (payload: DataSignaturePropsDTO) => void;
  sendTransaction: (payload: TransactionData) => void;
}

export class TransactionHandler implements ITransactionHandler {
  private web3: Web3;
  private provider: any;
  private mq: IMessagesQueue;

  constructor(messageQueue: IMessagesQueue) {
    detectEthereumProvider()
      .then((provider: any) => {
        this.web3 = new Web3(provider);
        this.provider = provider;
      })
      .catch(() => {
        throw new Error("There is no any providers");
      });
    this.mq = messageQueue;
  }

  @ExternalMethod()
  public async signMessage(payload: DataSignaturePropsDTO) {
    const {address, message, password = ""} = payload;
    try {
      return await this.web3.eth.personal.sign(message, address, password);
    } catch(error) {
        throw error;
    }
  };

  @ExternalMethod()
  public sendTransaction(payload: TransactionData) {
    const {from, to, value, gas, gasPrice, data, chainId, nonce} = payload;
    return new Promise((resolve, reject) => {
      this.web3.eth
        .sendTransaction({
          from,
          to,
          value,
          gas: gas ? gas : undefined,
          gasPrice: gasPrice ? gasPrice : undefined,
          data,
          chainId,
          nonce
        })
        .on("transactionHash", (transactionHash) => {
          resolve(transactionHash);
        })
        .on("error", (error) => {
          reject(error);
        });
    });
  }

  @ExternalMethod()
  public async getAccounts(id: string) {
    const request = this.provider.selectedAddress ? 'eth_accounts' : 'eth_requestAccounts';

    try {
      const addresses = await this.provider.request({method: request});
      return addresses;
    } catch (error) {
      throw error;
    }
  }

}
