import { Asset } from './Asset';

export interface Chain {
  id: string;
  chainId: number;
  name: string;
  displayName: string;
  imageUrl: string;
  nativeToken: Asset;
}

export enum ChainId {
  ETHEREUM = 1,
  OPTIMISM = 10,
  AURORA = 10,
  ARBITRUM = 42161,
  POLYGON = 137,
  BSC = 56,
  FANTOM = 250,
  GNOSIS = 100,
  KLAYTN = 8217,
  XDAI = 100,
  AVALANCHE = 43114,
}
