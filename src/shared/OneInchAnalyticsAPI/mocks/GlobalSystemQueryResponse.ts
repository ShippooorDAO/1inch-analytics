import { ChainId } from '@/shared/Model/Chain';

import { GlobalSystemQueryResponse } from '../OneInchAnalyticsAPIProvider';

export function createMockGlobalSystemResponse(): GlobalSystemQueryResponse {
  return {
    systemStatus: null,
    chains: [
      {
        id: 'ethereum',
        name: 'Ethereum',
        chainIdentifier: ChainId.ETHEREUM,
        nativeToken: 'ETH',
      },
      {
        id: 'polygon',
        name: 'Polygon',
        chainIdentifier: ChainId.POLYGON,
        nativeToken: 'MATIC',
      },
      {
        id: 'bsc',
        name: 'Binance Smart Chain',
        chainIdentifier: ChainId.BSC,
        nativeToken: 'BNB',
      },
      {
        id: 'fantom',
        name: 'Fantom',
        chainIdentifier: ChainId.FANTOM,
        nativeToken: 'FTM',
      },
      {
        id: 'arbitrum',
        name: 'Arbitrum',
        chainIdentifier: ChainId.ARBITRUM,
        nativeToken: 'ARB',
      },
      {
        id: 'optimism',
        name: 'Optimism',
        chainIdentifier: ChainId.OPTIMISM,
        nativeToken: 'ETH',
      },
      {
        id: 'avalanche',
        name: 'Avalanche',
        chainIdentifier: ChainId.AVALANCHE,
        nativeToken: 'AVAX',
      },
      {
        id: 'gnosis',
        name: 'Gnosis',
        chainIdentifier: ChainId.GNOSIS,
        nativeToken: 'XDAI',
      },
      {
        id: 'klaytn',
        name: 'Klaytn',
        chainIdentifier: ChainId.KLAYTN,
        nativeToken: 'KLAY',
      },
      {
        id: 'aurora',
        name: 'Aurora',
        chainIdentifier: ChainId.AURORA,
        nativeToken: 'AUR',
      },
    ],
    assets: [],
  };
}
