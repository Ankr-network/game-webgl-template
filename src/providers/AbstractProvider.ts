import Web3 from "web3";
import {IMessagesQueue} from "../MessagesQueue";
import {DataSignaturePropsDTO, IEthereumChain, TransactionData} from "../interfaces";
import {ExternalMethod} from "../ExternalMethodDecorator";

export class AbstractProvider {
  protected web3: Web3;
  protected provider: any;
  protected mq: IMessagesQueue;

  constructor(messageQueue: IMessagesQueue) {
    this.mq = messageQueue;
  }

  public async connect() {

  }

  @ExternalMethod()
  public async signMessage(payload: DataSignaturePropsDTO) {
    const {address, message, password = ""} = payload;
    return await this.web3.eth.personal.sign(message, address, password);
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
  public async getContractData(payload: TransactionData) {
    delete payload.chainId;
    return await this.provider.request({method: "eth_call", params: [payload, "latest"]});
  }

  @ExternalMethod()
  public async estimateGas(payload: TransactionData) {
    delete payload.chainId;
    return await this.web3.eth.estimateGas(payload);
  }

  @ExternalMethod()
  public async getAccounts() {
    return this.getAccountsInternal();
  }

  public async getAccountsInternal() {
    const request = this.provider.selectedAddress ? 'eth_accounts' : 'eth_requestAccounts';
    return await this.provider.request({method: request});
  }

  @ExternalMethod()
  public async getTransaction(transactionHash: string) {
    return await this.web3.eth.getTransaction(transactionHash);
  }

  @ExternalMethod()
  public async getTransactionReceipt(transactionHash: string) {
    return new Promise(async (resolve, reject) => {
      let receipt = null;
      while (receipt == null) {
        try {
          receipt = await this.getReceipt(transactionHash);
        } catch (e) {
          reject(e)
        }
      }
      resolve(receipt);
    });
  }

  @ExternalMethod()
  public async switchChain(payload: IEthereumChain) {
  }

  @ExternalMethod()
  public async getEvents(payload: any) {
    return await this.provider.request({method: "eth_getLogs", params: [payload]});
  }

  private getReceipt(transactionHash: string) {
    return this.provider.request({method: "eth_getTransactionReceipt", params: [transactionHash]});
  }
}
