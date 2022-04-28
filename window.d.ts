import {IMessagesQueue} from "./src/MessagesQueue";
import {TransactionHandler} from "./src/TransactionHandler";

declare global {
  interface Window {
    ethereum: any;
    MQ: IMessagesQueue;
    transactionHandler: TransactionHandler
  }
}
