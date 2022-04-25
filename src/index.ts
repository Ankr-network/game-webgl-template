import {MessagesQueue} from "./MessagesQueue";
import {TransactionHandler} from "./TransactionHandler";

const messageQueue = new MessagesQueue();
const transactionHandler = new TransactionHandler(messageQueue);

window.messageQueue = messageQueue;
window.transactionHandler = transactionHandler;
