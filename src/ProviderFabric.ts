import {IMessagesQueue} from "./MessagesQueue";
import {IConnectionProps} from "./interfaces";
import {SupportedWallets} from "./SupportedWallets";
import {MetamaskProvider} from "./providers/MetamaskProvider";
import {TorusProvider} from "./providers/TorusProvider";
import {ExternalMethod} from "./ExternalMethodDecorator";
import {AbstractProvider} from "./providers/AbstractProvider";
import connectors from "./connectors";

export class ProviderFabric {
  private mq: IMessagesQueue;

  constructor(messageQueue: IMessagesQueue) {
    this.mq = messageQueue;
  }

  @ExternalMethod()
  public async createProvider(payload: IConnectionProps) {
    let provider = null as AbstractProvider;
    switch (payload.wallet) {
      case SupportedWallets.Metamask:
        provider = new MetamaskProvider(this.mq);
        break;
      case SupportedWallets.Torus:
        provider = new TorusProvider(this.mq, payload.chain);
        break;
      default:
        throw Error(`Wallet ${payload.wallet} doesn't support`);
    }

    if(provider) {
      await provider.connect();
      this.injectProvider(provider);
    }
  }

  @ExternalMethod()
  public async getWalletsStatus() {
    return Object.keys(connectors).reduce(async (previousPromise, key) => {
      const connector = connectors[key];
      const isConnected = await connector.call(this);
      return {... await previousPromise , [key]: isConnected};
    }, Promise.resolve({}));
  }

  private injectProvider(provider: AbstractProvider) {
    window.WalletProvider = provider;
  }
}
