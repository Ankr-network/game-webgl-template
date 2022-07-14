import Web3 from "web3";
import {IEthereumChain} from "../interfaces";
import {ExternalMethod} from "../ExternalMethodDecorator";
import Torus from "@toruslabs/torus-embed";
import {TorusHosts} from "../TorusHosts";
import {AbstractProvider} from "./AbstractProvider";
import {IMessagesQueue} from "../MessagesQueue";

export class TorusProvider extends AbstractProvider {
  private torusProvider: Torus;
  private initialChain: IEthereumChain;

  constructor(messageQueue: IMessagesQueue, chain: IEthereumChain) {
    super(messageQueue);
    this.initialChain = chain;
    this.torusProvider = new Torus();
  }

  public async connect() {
    await this.initTorusProvider(this.torusProvider, this.initialChain);
    await this.torusProvider.login();
    const provider = this.torusProvider.provider as any;
    this.web3 = new Web3(provider);
    this.provider = provider;
  }

  private async initTorusProvider(torusProvider: Torus, chain: IEthereumChain) {
    const network = this.defineChain(chain);

    await torusProvider.init({
      network,
      showTorusButton: false
    });
  }

  private defineChain(chain: IEthereumChain) {
    const chainId = Web3.utils.hexToNumber(chain.chainId);
    let network;
    if (TorusHosts.hasOwnProperty(chainId)) {
      network = {
        host: TorusHosts[chainId]
      }
    } else {
      network = {
        host: chain.rpcUrls[0],
        chainId: chainId, // optional
        networkName: chain.chainName, // optional
      }
    }
    return network;
  }

  @ExternalMethod()
  public async switchChain(payload: IEthereumChain) {
    this.torusProvider.clearInit();
    this.initTorusProvider(this.torusProvider, payload);
  }

  @ExternalMethod()
  public async disconnect() {
    this.torusProvider.cleanUp();
  }
}
