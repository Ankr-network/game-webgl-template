import Web3 from "web3";
import {IConnectionProps, IEthereumChain} from "../interfaces";
import detectEthereumProvider from '@metamask/detect-provider';
import {ExternalMethod} from "../ExternalMethodDecorator";
import {AbstractProvider} from "./AbstractProvider";

const CHAIN_HAS_NOT_BEEN_ADDED_CODE = 4902;

export class MetamaskProvider extends AbstractProvider {

  public async connect() {
    try {
      const provider = await detectEthereumProvider() as any;
      this.provider = provider;
      this.web3 = new Web3(provider);
      await this.getAccountsInternal();
    } catch (error) {
      throw new Error("There is no any providers. Please install the Metamask plugin to your browser.");
    }
  }

  @ExternalMethod()
  public async switchChain(payload: IEthereumChain) {
    return new Promise<void>(async (resolve, reject) => {
      try {
        await this.provider.request({
          method: 'wallet_switchEthereumChain',
          params: [{chainId: payload.chainId}],
        });
        resolve();
      } catch (switchError) {
        if ((switchError as any).code === CHAIN_HAS_NOT_BEEN_ADDED_CODE) {
          try {
            await this.provider.request({
              method: 'wallet_addEthereumChain',
              params: [payload],
            });
            resolve();
          } catch (addError) {
            reject((addError as Error).message);
          }
        } else {
          reject((switchError as Error).message);
        }
      }
    });
  }
}
