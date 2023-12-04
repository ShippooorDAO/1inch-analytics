import { Asset } from "./Asset";

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
  BASE = 8453,
}

export function getChainColor(chainId: number): string {
  switch (chainId) {
    case ChainId.ETHEREUM:
      return "#647FE9";
    case ChainId.OPTIMISM:
      return "#FF0420";
    case ChainId.AURORA:
      return "#86D65B";
    case ChainId.ARBITRUM:
      return "#2D374B";
    case ChainId.POLYGON:
      return "#8446E7";
    case ChainId.BSC:
      return "#F5B50D";
    case ChainId.FANTOM:
      return "#0813EF";
    case ChainId.GNOSIS:
      return "#037A5B";
    case ChainId.KLAYTN:
      return "#E06C01";
    case ChainId.AVALANCHE:
      return "#D64F4A";
    case ChainId.BASE:
      return "#0052FF";
    default:
      return "";
  }
}

export function getChainImageUrl(chainId: number): string {
  switch (chainId) {
    case ChainId.ETHEREUM:
      return "/vendors/chains/ethereum.svg";
    case ChainId.OPTIMISM:
      return "/vendors/chains/optimism.svg";
    case ChainId.AURORA:
      return "/vendors/chains/aurora.svg";
    case ChainId.ARBITRUM:
      return "/vendors/chains/arbitrum.svg";
    case ChainId.POLYGON:
      return "/vendors/chains/polygon.svg";
    case ChainId.BSC:
      return "/vendors/chains/binance.svg";
    case ChainId.FANTOM:
      return "/vendors/chains/fantom.svg";
    case ChainId.GNOSIS:
      return "/vendors/chains/gnosis.svg";
    case ChainId.KLAYTN:
      return "/vendors/chains/klaytn.svg";
    case ChainId.AVALANCHE:
      return "/vendors/chains/avalanche.svg";
    case ChainId.BASE:
      return "/vendors/chains/base.svg";
    default:
      return "";
  }
}

export function getChainName(chainId: number): string {
  switch (chainId) {
    case ChainId.ETHEREUM:
      return "Ethereum";
    case ChainId.OPTIMISM:
      return "Optimism";
    case ChainId.AURORA:
      return "Aurora";
    case ChainId.ARBITRUM:
      return "Arbitrum";
    case ChainId.POLYGON:
      return "Polygon";
    case ChainId.BSC:
      return "Binance Smart Chain";
    case ChainId.FANTOM:
      return "Fantom";
    case ChainId.GNOSIS:
      return "Gnosis";
    case ChainId.KLAYTN:
      return "Klaytn";
    case ChainId.AVALANCHE:
      return "Avalanche";
    case ChainId.BASE:
      return "Base";
    default:
      return "";
  }
}
