import Web3 from "web3";
import {IMessagesQueue} from "./src/MessagesQueue";
import {TransactionHandler} from "./src/TransactionHandler";

declare global {
  interface Window {
    web3: Web3;
    messageQueue: IMessagesQueue;
    transactionHandler: TransactionHandler
  }
}
