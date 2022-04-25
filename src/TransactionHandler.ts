import Web3 from "web3";
import {IMessagesQueue} from "./MessagesQueue";
import {Status} from "./Statuses";

interface ITransactionHandler {
  signMessage: (id: string, payload: string) => void;
  sendTransaction: (id: string, payload: string) => void;
}

export class TransactionHandler implements ITransactionHandler {
  private web3: Web3;
  private mq: IMessagesQueue;

  constructor(messageQueue: IMessagesQueue) {
    this.web3 = window.web3;
    this.mq = messageQueue;
  }

  public signMessage = async (id: string, payload: string) => {
    const message = payload;
    try {
      const from = (await this.web3.eth.getAccounts())[0];
      const signature = await this.web3.eth.personal.sign(message, from, "");
      this.mq.addMessage(id, Status.Success, signature);
    } catch (error) {
      this.mq.addMessage(id, Status.Error, error.message);
    }
  };


  public sendTransaction = async (id: string, payload: string) => {
    const {to, value, gasLimit, gasPrice} = JSON.parse(payload);

    const from = (await this.web3.eth.getAccounts())[0];
    this.web3.eth
      .sendTransaction({
        from,
        to,
        value,
        gas: gasLimit ? gasLimit : undefined,
        gasPrice: gasPrice ? gasPrice : undefined,
      })
      .on("transactionHash", (transactionHash) => {
        this.mq.addMessage(id, Status.Success, transactionHash);
      })
      .on("error", (error) => {
        this.mq.addMessage(id, Status.Error, error.message);
      });
  }

}
