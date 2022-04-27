import Web3 from "web3";
import {IMessagesQueue} from "./MessagesQueue";
import {Status} from "./Statuses";
import {TransactionData} from "./interfaces";
import detectEthereumProvider from '@metamask/detect-provider';


interface ITransactionHandler {
  signMessage: (id: string, payload: string) => void;
  sendTransaction: (id: string, payload: string) => void;
}

export class TransactionHandler implements ITransactionHandler {
  private web3: Web3;
  private mq: IMessagesQueue;

  constructor(messageQueue: IMessagesQueue) {
    detectEthereumProvider()
      .then((provider: any) => {
        this.web3 = new Web3(provider);
      })
      .catch(() => {
        throw new Error("There is no any providers");
      });
    this.mq = messageQueue;
  }

  public async signMessage(id: string, payload: string) {
    const message = payload;
    try {
      const from = (await this.web3.eth.getAccounts())[0];
      const signature = await this.web3.eth.personal.sign(message, from, "");
      this.mq.addMessage(id, Status.Success, signature);
    } catch (error) {
      this.mq.addMessage(id, Status.Error, error.message);
    }
  };


  public async sendTransaction(id: string, payload: string) {
    const {from, to, value, gas, gasPrice, data, chainId, nonce} = JSON.parse(payload) as TransactionData;

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
        this.mq.addMessage(id, Status.Success, transactionHash);
      })
      .on("error", (error) => {
        this.mq.addMessage(id, Status.Error, error.message);
      });
  }

  public async getAccounts(id: string) {
    try {
      const addresses = await (await this.web3.eth.getAccounts())[0];
      this.mq.addMessage(id, Status.Success, JSON.stringify(addresses));
    } catch (error) {
      this.mq.addMessage(id, Status.Error, error.message);
    }
  }

}
