import {SupportedWallets} from "../SupportedWallets";
import {isConnected as isConnectedMetamask} from "./MetamaskConnector";
import {isConnected as isConnectedTorus} from "./TorusConnector";

export default {
  [SupportedWallets.Metamask]: isConnectedMetamask,
  [SupportedWallets.Torus]: isConnectedTorus,
}
