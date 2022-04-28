import {MessagesQueue} from "./MessagesQueue";
import {TransactionHandler} from "./TransactionHandler";

const messageQueue = new MessagesQueue();
const transactionHandler = new TransactionHandler(messageQueue);

window.MQ = messageQueue;
window.transactionHandler = transactionHandler;
