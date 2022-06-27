import {IMessagesQueue} from "./src/MessagesQueue";
import {ProviderFabric} from "./src/ProviderFabric";
import {AbstractProvider} from "./src/providers/AbstractProvider";

declare global {
  interface Window {
    ethereum: any;
    clover: any;
    MQ: IMessagesQueue;
    WalletProvider: AbstractProvider;
    ProviderFabric: ProviderFabric;
  }
}
