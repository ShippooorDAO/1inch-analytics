import { gql, useLazyQuery } from '@apollo/client';
import {
  createContext,
  FC,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';

import { AssetService } from '../Currency/AssetService';
import { UsdAmount } from '../Currency/UsdAmount';
import { FeatureFlags } from '../FeatureFlags/FeatureFlags.type';
import { useFeatureFlags } from '../FeatureFlags/FeatureFlagsContextProvider';
import { Asset } from '../Model/Asset';
import {
  Chain,
  ChainId,
  getChainColor,
  getChainImageUrl,
  getChainName,
} from '../Model/Chain';
import { AssetStore } from '../Model/Stores/AssetStore';
import { ChainStore } from '../Model/Stores/ChainStore';
import { TreasuryTransactionLabelStore } from '../Model/Stores/TreasuryTransactionLabelStore';
import { createMockGlobalSystemResponse } from './mocks/GlobalSystemQueryResponse';

export interface OneInchAnalyticsAPIProviderState {
  systemStatus?: {
    id: string;
    message: string;
  };
  assetService?: AssetService;
  chainStore?: ChainStore;
}

export interface GlobalSystemQueryResponse {
  systemStatus: {
    id?: string;
    message?: string;
  } | null;
  chains: {
    id: string;
    name: string;
    chainIdentifier: number;
    nativeToken: string;
  }[];
  assets: {
    id: string;
    address: string;
    symbol: string;
    chain: {
      id: string;
    };
    name: string;
    decimals: number;
    logoUrl: string;
    priceUsd: number | null;
    price: number | null;
  }[];
  treasuryTransactionsLabels: {
    fromLabels: string[];
    toLabels: string[];
  };
}

function getAssetDisplayName(symbol: string, chain: Chain): string {
  if (!chain.chainId || chain.chainId === ChainId.ETHEREUM) {
    return symbol;
  }

  return `${symbol} (${chain.displayName})`;
}

export function processGlobalSystemResponse(
  response: GlobalSystemQueryResponse
): {
  assets: Asset[];
  chains: Chain[];
  treasuryTransactionsLabels: {
    fromLabels: string[];
    toLabels: string[];
  };
} {
  const chains = response.chains.map((chain) => {
    return {
      ...chain,
      chainId: chain.chainIdentifier,
      displayName: getChainName(chain.chainIdentifier),
      imageUrl: getChainImageUrl(chain.chainIdentifier),
      color: getChainColor(chain.chainIdentifier),
      gasSymbol: chain.nativeToken,
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
        priceUsd: new UsdAmount(entry.priceUsd ?? 0),
      };
    });

  for (const chain of chains) {
    const nativeToken = assets.find(
      (asset) => asset.id === chain.nativeToken.id
    )!;
    chain.nativeToken = nativeToken;
  }

  return {
    assets,
    chains,
    treasuryTransactionsLabels: response.treasuryTransactionsLabels,
  };
}

export const GET_GLOBAL_SYSTEM = gql`
  {
    systemStatus {
      id
      message
    }
    chains {
      id
      name
      chainIdentifier
      nativeToken
    }
    assets {
      id
      address
      symbol
      chain {
        id
      }
      name
      decimals
      logoUrl
      priceUsd
      price
    }
    treasuryTransactionsLabels {
      fromLabels
      toLabels
    }
  }
`;

const missingProviderError =
  'You forgot to wrap your code in a provider <OneInchAnalyticsAPIProvider>';

const OneInchAnalyticsAPIContext =
  createContext<OneInchAnalyticsAPIProviderState>({
    get chainStore(): never {
      throw new Error(missingProviderError);
    },
    get assetService(): never {
      throw new Error(missingProviderError);
    },
    get systemStatus(): never {
      throw new Error(missingProviderError);
    },
  });

interface OneInchAnalyticsAPIProviderProps {
  children?: ReactNode;
}

function getGlobalSystemQuery(featureFlags: FeatureFlags) {
  return GET_GLOBAL_SYSTEM;
}

function storeGlobalSystemResponse(
  response: GlobalSystemQueryResponse,
  featureFlags: FeatureFlags
) {
  const gqlQuery = getGlobalSystemQuery(featureFlags);
  if (!gqlQuery.loc) {
    return;
  }

  const query = gqlQuery.loc?.source.body;
  if (!query) {
    return;
  }

  localStorage.setItem(
    'globalSystemResponse',
    JSON.stringify({
      query,
      response,
    })
  );
}

function getStoredGlobalSystemResponse(
  featureFlags: FeatureFlags
): GlobalSystemQueryResponse | undefined {
  const gqlQuery = getGlobalSystemQuery(featureFlags);
  const storedResponse = localStorage.getItem('globalSystemResponse');
  if (!storedResponse) {
    return;
  }

  const { query, response } = JSON.parse(storedResponse);
  if (!query || !response || gqlQuery.loc?.source.body !== query) {
    return;
  }

  return response;
}

export const useOneInchAnalyticsAPIContext = () =>
  useContext<OneInchAnalyticsAPIProviderState>(OneInchAnalyticsAPIContext);

export const OneInchAnalyticsAPIProvider: FC<
  OneInchAnalyticsAPIProviderProps
> = ({ children }: OneInchAnalyticsAPIProviderProps) => {
  const featureFlagsContext = useFeatureFlags();
  const [assetService, setAssetService] = useState<AssetService | undefined>();
  const [chainStore, setChainStore] = useState<ChainStore | undefined>();
  const [treasuryTransactionLabelsStore, setTreasuryTransactionLabelsStore] =
    useState<TreasuryTransactionLabelStore>();
  const [systemStatus, setSystemStatus] = useState<{
    id: string;
    message: string;
  }>();

  const [queryGlobalSystem, { data: globalSystemResponse }] =
    useLazyQuery<GlobalSystemQueryResponse>(GET_GLOBAL_SYSTEM, {
      fetchPolicy: 'network-only', // Used for first execution
      nextFetchPolicy: 'cache-first', // Used for subsequent executions
    });

  useEffect(() => {
    if (!featureFlagsContext.runtimeFeatureFlagsLoaded) {
      return;
    }

    if (featureFlagsContext.enableMockData) {
      const { assets, chains, treasuryTransactionsLabels } =
        processGlobalSystemResponse(createMockGlobalSystemResponse());

      const assetStore = new AssetStore(assets);
      setAssetService(new AssetService(assetStore));
      setChainStore(new ChainStore(chains));
      setTreasuryTransactionLabelsStore(
        new TreasuryTransactionLabelStore(treasuryTransactionsLabels)
      );
    } else {
      queryGlobalSystem();
    }
  }, [
    featureFlagsContext.runtimeFeatureFlagsLoaded,
    featureFlagsContext.enableMockData,
  ]);

  useEffect(() => {
    if (!featureFlagsContext.runtimeFeatureFlagsLoaded) {
      return;
    }

    const storedResponse = getStoredGlobalSystemResponse(featureFlagsContext);
    if (!storedResponse) {
      return;
    }

    const { assets, chains, treasuryTransactionsLabels } =
      processGlobalSystemResponse(storedResponse);

    const assetStore = new AssetStore(assets);
    setAssetService(new AssetService(assetStore));
    setChainStore(new ChainStore(chains));
    setTreasuryTransactionLabelsStore(
      new TreasuryTransactionLabelStore(treasuryTransactionsLabels)
    );
  }, [featureFlagsContext]);

  useEffect(() => {
    const response = globalSystemResponse;

    if (response === undefined) {
      return;
    }

    if (response.systemStatus?.message && response.systemStatus?.id) {
      setSystemStatus({
        message: response.systemStatus.message!,
        id: response.systemStatus.id!,
      });
    }

    storeGlobalSystemResponse(response, featureFlagsContext);

    const { assets, chains } = processGlobalSystemResponse(response);

    const assetStore = new AssetStore(assets);
    setAssetService(new AssetService(assetStore));
    setChainStore(new ChainStore(chains));
  }, [globalSystemResponse, featureFlagsContext]);

  return (
    <OneInchAnalyticsAPIContext.Provider
      value={{
        assetService,
        chainStore,
        systemStatus,
      }}
    >
      {children}
    </OneInchAnalyticsAPIContext.Provider>
  );
};
