import { Asset } from '@/shared/Model/Asset';

import { UsdAmount } from '../Currency/UsdAmount';
import { Chain, ChainId } from '../Model/Chain';
import { GlobalSystemQueryResponse } from './OneInchAnalyticsAPI.type';

function getAssetDisplayName(symbol: string, chain: Chain): string {
  if (!chain.chainId || chain.chainId === ChainId.ETHEREUM) {
    return symbol;
  }

  return `${symbol} (${chain.displayName})`;
}

function getChainImageUrl(chainId: number): string {
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
      return '/vendors/chains/bsc.svg';
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

export function processGlobalSystemResponse(
  response: GlobalSystemQueryResponse
): {
  assets: Asset[];
  chains: Chain[];
} {
  const chains = response.chains.map((chain) => {
    return {
      ...chain,
      chainId: chain.chainIdentifier,
      displayName: chain.name,
      imageUrl: getChainImageUrl(chain.chainIdentifier),
      nativeToken: {
        id: chain.nativeToken, // TODO: Make sure to link with correct property.
      } as Asset,
    };
  });

  const assets: Asset[] = response.assets
    .filter((entry) => !!entry.symbol)
    .map((entry) => {
      const chain = chains.find((chain) => chain.id === entry.chain.id)!;
      return {
        ...entry,
        chain,
        imageUrl: entry.logoUrl,
        displayName: getAssetDisplayName(entry.name, chain),
        precision: BigInt(10 ** entry.decimals),
        priceUsd: new UsdAmount(entry.priceUsd),
      };
    });

  for (const chain of chains) {
    const nativeToken = assets.find(
      (asset) => asset.id === chain.nativeToken.id
    )!;
    chain.nativeToken = nativeToken;
  }

  return { assets, chains };
}
