import { formatUnits } from 'ethers/lib/utils';
import { useMemo } from 'react';
import useSWR from 'swr';

import { FusionResolver } from '@/shared/Model/FusionResolver';
import { getAddressShorthand } from '@/shared/Utils/Format';
import { chartColors } from '@/theme/variants';

type FusionResolversResponse = {
  [key: string]: {
    ensName?: string;
    isVerified: boolean;
    image?: string;
    about?: string[];
  };
};

type FusionResolversBalancesResponse = Array<{
  verified: boolean;
  resolver: string;
  balance: string;
  share: string;
}>;

function parseResolversResponse(
  fusionResolversResponse: FusionResolversResponse,
  fusionResolversBalancesResponse: FusionResolversBalancesResponse
): FusionResolver[] {
  return Object.entries(fusionResolversResponse).map(
    ([address, resolver], i) => {
      const fusionResolverBalances = fusionResolversBalancesResponse.find(
        (balance) => balance.resolver === address
      );
      return {
        id: address,
        address,
        name: resolver.ensName ?? getAddressShorthand(address),
        color: chartColors[i],
        isVerified: resolver.isVerified,
        imageUrl: resolver.image ?? 'resolver-placeholder.webp',
        description: resolver.about?.join('\n'),
        share: Number(fusionResolverBalances?.share ?? '0'),
        balance: formatUnits(fusionResolverBalances?.balance ?? '0', 18),
      };
    }
  );
}

function fetcher(url: string) {
  return fetch(url).then((res) => res.json());
}

export function useFusionResolvers() {
  const resolversQueryContext = useSWR<FusionResolversResponse>(
    'https://configs.1inch.io/frontend/resolvers/resolvers.json',
    fetcher
  );
  const balancesQueryContext = useSWR<FusionResolversBalancesResponse>(
    'https://fusion.1inch.io/dao/v1.0/1/resolvers/balances',
    fetcher
  );

  const resolvers = useMemo(() => {
    if (!resolversQueryContext.data || !balancesQueryContext.data) {
      return undefined;
    }

    return parseResolversResponse(
      resolversQueryContext.data,
      balancesQueryContext.data
    );
  }, [resolversQueryContext.data, balancesQueryContext.data]);

  return { data: resolvers, loading: resolversQueryContext.isLoading };
}
