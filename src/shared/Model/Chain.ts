import { Asset } from './Asset';

export interface Chain {
  id: string;
  chainId: number;
  name: string;
  displayName: string;
  color: string;
  imageUrl: string;
  nativeToken: Asset;
  gasSymbol: string;
}

export enum ChainId {
  ETHEREUM = 1,
  OPTIMISM = 10,
  AURORA = 1313161554,
  ARBITRUM = 42161,
  POLYGON = 137,
  BSC = 56,
  FANTOM = 250,
  GNOSIS = 100,
  KLAYTN = 8217,
  AVALANCHE = 43114,
}

export function getChainColor(chainId: number): string {
  switch (chainId) {
    case ChainId.ETHEREUM:
      return '#95a0d7';
    case ChainId.OPTIMISM:
      return '#ff0420';
    case ChainId.AURORA:
      return '#29e7e7';
    case ChainId.ARBITRUM:
      return 'rgb(73,147,234)';
    case ChainId.POLYGON:
      return 'rgb(114,56,214)';
    case ChainId.BSC:
      return '#F0B90B';
    case ChainId.FANTOM:
      return '#005EFF';
    case ChainId.GNOSIS:
      return '#133629';
    case ChainId.KLAYTN:
      return '#FF2F00';
    case ChainId.AVALANCHE:
      return '#e84142';
    default:
      return '';
  }
}

export function getChainImageUrl(chainId: number): string {
  switch (chainId) {
    case ChainId.ETHEREUM:
      return '/vendors/chains/ethereum.svg';
    case ChainId.OPTIMISM:
      return '/vendors/chains/optimism.svg';
    case ChainId.AURORA:
      return '/vendors/chains/aurora.svg';
    case ChainId.ARBITRUM:
      return '/vendors/chains/arbitrum.svg';
    case ChainId.POLYGON:
      return '/vendors/chains/polygon.svg';
    case ChainId.BSC:
      return '/vendors/chains/binance.svg';
    case ChainId.FANTOM:
      return '/vendors/chains/fantom.svg';
    case ChainId.GNOSIS:
      return '/vendors/chains/gnosis.svg';
    case ChainId.KLAYTN:
      return '/vendors/chains/klaytn.svg';
    case ChainId.AVALANCHE:
      return '/vendors/chains/avalanche.svg';
    default:
      return '';
  }
}

export function getChainName(chainId: number): string {
  switch (chainId) {
    case ChainId.ETHEREUM:
      return 'Ethereum';
    case ChainId.OPTIMISM:
      return 'Optimism';
    case ChainId.AURORA:
      return 'Aurora';
    case ChainId.ARBITRUM:
      return 'Arbitrum';
    case ChainId.POLYGON:
      return 'Polygon';
    case ChainId.BSC:
      return 'Binance Smart Chain';
    case ChainId.FANTOM:
      return 'Fantom';
    case ChainId.GNOSIS:
      return 'Gnosis';
    case ChainId.KLAYTN:
      return 'Klaytn';
    case ChainId.AVALANCHE:
      return 'Avalanche';
    default:
      return '';
  }
}
