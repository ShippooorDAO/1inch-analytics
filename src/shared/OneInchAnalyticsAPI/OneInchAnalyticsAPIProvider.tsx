import { useLazyQuery } from '@apollo/client';
import {
  createContext,
  FC,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';

import { AssetService } from '../Currency/AssetService';
import { FeatureFlags } from '../FeatureFlags/FeatureFlags.type';
import { useFeatureFlags } from '../FeatureFlags/FeatureFlagsContextProvider';
import { AssetStore } from '../Model/Stores/AssetStore';
import { ChainStore } from '../Model/Stores/ChainStore';
import {
  GlobalSystemQueryResponse,
  OneInchAnalyticsAPIProviderState,
} from './OneInchAnalyticsAPI.type';
import { processGlobalSystemResponse } from './OneInchAnalyticsAPIProcess';
import { GET_GLOBAL_SYSTEM } from './OneInchAnalyticsAPIQueries';

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

    queryGlobalSystem();
  }, [featureFlagsContext.runtimeFeatureFlagsLoaded]);

  useEffect(() => {
    if (!featureFlagsContext.runtimeFeatureFlagsLoaded) {
      return;
    }

    const storedResponse = getStoredGlobalSystemResponse(featureFlagsContext);
    if (!storedResponse) {
      return;
    }

    const { assets, chains } = processGlobalSystemResponse(storedResponse);

    const assetStore = new AssetStore(assets);
    setAssetService(new AssetService(assetStore));
    setChainStore(new ChainStore(chains));
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
