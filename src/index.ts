import {MessagesQueue} from "./MessagesQueue";
import {ProviderFabric} from "./ProviderFabric";

const messageQueue = new MessagesQueue();
const providerFabric = new ProviderFabric(messageQueue);

window.MQ = messageQueue;
window.ProviderFabric = providerFabric;
