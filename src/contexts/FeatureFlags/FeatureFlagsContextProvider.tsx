import { useRouter } from 'next/router';
import {
  createContext,
  FC,
  ReactNode,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';

import { FeatureFlags, FeatureFlagsContextState } from './FeatureFlags.type';
import {
  loadStoredFeatureFlags,
  storeFeatureFlags,
} from './FeatureFlagsStorage';
import { staticFeatureFlags } from './StaticFeatureFlags';

const missingProviderError =
  'You forgot to wrap your code in a provider <FeatureFlagsContextProvider>';

const FeatureFlagsContext = createContext<FeatureFlagsContextState>({
  get enableAllExperimentalFeatures(): never {
    throw new Error(missingProviderError);
  },
  get sudo(): never {
    throw new Error(missingProviderError);
  },
  get hasForcedFeatureFlags(): never {
    throw new Error(missingProviderError);
  },
  get clear(): never {
    throw new Error(missingProviderError);
  },
  get runtimeFeatureFlagsLoaded(): never {
    throw new Error(missingProviderError);
  },
  get enableTransactionsPage(): never {
    throw new Error(missingProviderError);
  },
});

interface FeatureFlagsProviderProps {
  children?: ReactNode;
}

function featureFlagsAreEqual(a: FeatureFlags, b: FeatureFlags): boolean {
  const aDict = a as Record<string, boolean | undefined>;
  const bDict = b as Record<string, boolean | undefined>;

  return [
    'enableAllExperimentalFeatures',
    'enableTransactionsPage',
    'sudo',
  ].every((key) => !!aDict[key] === !!bDict[key]);
}

function removeUndefinedFeatureFlags(obj: FeatureFlags): FeatureFlags {
  return Object.entries(obj).reduce((acc, [key, value]) => {
    if (value !== undefined) {
      acc[key as keyof FeatureFlags] = value;
    }
    return acc;
  }, {} as FeatureFlags);
}

function getBooleanQueryParam(
  queryParam: string | string[] | undefined
): boolean | undefined {
  if (queryParam === undefined || queryParam === '') {
    return undefined;
  }

  if (Array.isArray(queryParam)) {
    return queryParam[0] === 'true' || queryParam[0] === '1';
  }

  return queryParam === 'true' || queryParam === '1';
}

export const useFeatureFlags = () =>
  useContext<FeatureFlagsContextState>(FeatureFlagsContext);

export const FeatureFlagsContextProvider: FC<FeatureFlagsProviderProps> = ({
  children,
}: FeatureFlagsProviderProps) => {
  const router = useRouter();

  const [runtimeFeatureFlagsLoaded, setRuntimeFeatureFlagsLoaded] =
    useState<boolean>(false);

  const featureFlagsRef = useRef<FeatureFlags>({
    ...staticFeatureFlags,
  });
  const [featureFlags, setFeatureFlags] = useState<FeatureFlags>({
    ...staticFeatureFlags,
  });

  useEffect(() => {
    let storedForcedFeatureFlags = removeUndefinedFeatureFlags(
      loadStoredFeatureFlags()
    );

    let enableAllExperimentalFeatures =
      getBooleanQueryParam(router.query.enableAllExperimentalFeatures) ??
      getBooleanQueryParam(router.query.e);

    if (enableAllExperimentalFeatures === undefined) {
      enableAllExperimentalFeatures =
        storedForcedFeatureFlags.enableAllExperimentalFeatures;
    }

    let allExperimentalFeaturesEnabledFlags = removeUndefinedFeatureFlags({
      enableAllExperimentalFeatures,
      enableTransactionsPage: enableAllExperimentalFeatures,
      sudo: enableAllExperimentalFeatures,
    });

    const forcedFeatureFlagsFromQueryParams = removeUndefinedFeatureFlags({
      enableAllExperimentalFeatures:
        getBooleanQueryParam(router.query.enableAllExperimentalFeatures) ??
        getBooleanQueryParam(router.query.e),
      sudo: getBooleanQueryParam(router.query.sudo),
      enableTransactionsPage: getBooleanQueryParam(
        router.query.enableTransactionsPage
      ),
    });

    if (enableAllExperimentalFeatures === false) {
      storedForcedFeatureFlags = removeUndefinedFeatureFlags(
        storeFeatureFlags({})!
      );
    } else {
      storedForcedFeatureFlags = removeUndefinedFeatureFlags(
        storeFeatureFlags({
          ...storedForcedFeatureFlags,
          ...forcedFeatureFlagsFromQueryParams,
        })!
      );
    }

    const newFeatureFlags = {
      ...staticFeatureFlags,
      ...allExperimentalFeaturesEnabledFlags,
      ...storedForcedFeatureFlags,
      ...forcedFeatureFlagsFromQueryParams,
    };

    if (!featureFlagsAreEqual(newFeatureFlags, featureFlagsRef.current)) {
      setFeatureFlags(newFeatureFlags);
      featureFlagsRef.current = newFeatureFlags;
    }

    setRuntimeFeatureFlagsLoaded(true);
  }, [router.query]);

  const clear = () => {
    storeFeatureFlags({});
    setFeatureFlags({
      ...staticFeatureFlags,
    });

    delete router.query.e;
    delete router.query.enableAllExperimentalFeatures;
    delete router.query.sudo;
    delete router.query.enableTransactionsPage;
    router.push(router);
  };

  return (
    <FeatureFlagsContext.Provider
      value={{
        ...featureFlags,
        hasForcedFeatureFlags: !featureFlagsAreEqual(
          staticFeatureFlags,
          featureFlags
        ),
        clear,
        runtimeFeatureFlagsLoaded,
      }}
    >
      {children}
    </FeatureFlagsContext.Provider>
  );
};
