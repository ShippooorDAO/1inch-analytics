import { ChainId, getChainImageUrl } from '@/shared/Model/Chain';

export enum EtherscanLinkType {
  ADDRESS = 'address',
  TRANSACTION = 'tx',
  TOKEN = 'token',
}

function getEtherscanBaseUrl(chainId: ChainId) {
  switch (chainId) {
    case ChainId.BSC:
      return `https://bscscan.com`;
    case ChainId.POLYGON:
      return `https://polygonscan.com`;
    case ChainId.AVALANCHE:
      return `https://snowtrace.io`;
    case ChainId.FANTOM:
      return `https://ftmscan.com`;
    case ChainId.ARBITRUM:
      return `https://arbiscan.io`;
    case ChainId.OPTIMISM:
      return `https://optimistic.etherscan.io`;
    case ChainId.ETHEREUM:
    default:
      return `https://etherscan.io`;
  }
}

export function getEtherscanLink(
  addressOrBlockOrTxHash: string,
  chainId: ChainId = ChainId.ETHEREUM,
  type: EtherscanLinkType = EtherscanLinkType.ADDRESS
) {
  const baseUrl = getEtherscanBaseUrl(chainId);
  return `${baseUrl}/${type}/${addressOrBlockOrTxHash}`;
}

export function getEtherscanAddressLink(
  address: string,
  chainId: ChainId = ChainId.ETHEREUM
) {
  return getEtherscanLink(address, chainId, EtherscanLinkType.ADDRESS);
}

export function getEtherscanTokenLink(
  address: string,
  chainId: ChainId = ChainId.ETHEREUM
) {
  return getEtherscanLink(address, chainId, EtherscanLinkType.TOKEN);
}

export function getEtherscanTransactionLink(
  txHash: string,
  chainId: ChainId = ChainId.ETHEREUM
) {
  return getEtherscanLink(txHash, chainId, EtherscanLinkType.TRANSACTION);
}

export function getEtherscanIcon(chainId: ChainId = ChainId.ETHEREUM) {
  switch (chainId) {
    case ChainId.BSC:
    case ChainId.POLYGON:
    case ChainId.AVALANCHE:
    case ChainId.FANTOM:
    case ChainId.ARBITRUM:
    case ChainId.OPTIMISM:
      return getChainImageUrl(chainId);
    case ChainId.ETHEREUM:
    default:
      return '/vendors/etherscan.svg';
  }
}

export function getBlockExplorerName(chainId: ChainId = ChainId.ETHEREUM) {
  switch (chainId) {
    case ChainId.BSC:
      return 'BscScan';
    case ChainId.POLYGON:
      return 'Polygonscan';
    case ChainId.AVALANCHE:
      return 'Snowtrace';
    case ChainId.FANTOM:
      return 'FtmScan';
    case ChainId.ARBITRUM:
      return 'Arbiscan';
    case ChainId.OPTIMISM:
      return 'OptimisticScan';
    case ChainId.ETHEREUM:
    default:
      return 'Etherscan';
  }
}
