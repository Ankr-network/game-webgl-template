import Web3 from "web3";
import {IMessagesQueue} from "./MessagesQueue";
import {DataSignaturePropsDTO, IEthereumChain, TransactionData} from "./interfaces";
import detectEthereumProvider from '@metamask/detect-provider';
import {ExternalMethod} from "./ExternalMethodDecorator";

const CHAIN_HAS_NOT_BEEN_ADDED_CODE = 4902;

export class TransactionHandler {
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
        throw new Error("There is no any providers. Please install the Metamask plugin to your browser.");
      });
    this.mq = messageQueue;
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
  public async getAccounts(id: string) {
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
    return new Promise<void>(async (resolve, reject) => {
      try {
        await this.provider.request({
          method: 'wallet_switchEthereumChain',
          params: [{chainId: payload.chainId}],
        });
        resolve();
      } catch (switchError) {
        if ((switchError as any).code === CHAIN_HAS_NOT_BEEN_ADDED_CODE) {
          try {
            await this.provider.request({
              method: 'wallet_addEthereumChain',
              params: [payload],
            });
            resolve();
          } catch (addError) {
            reject((addError as Error).message);
          }
        } else {
          reject((switchError as Error).message);
        }
      }
    });
  }

  @ExternalMethod()
  public async getEvents(payload: any) {
    return await this.provider.request({method: "eth_getLogs", params: [payload]});
  }

  private getReceipt(transactionHash: string) {
    return this.provider.request({method: "eth_getTransactionReceipt", params: [transactionHash]});
  }
}
