import { gql, useQuery } from '@apollo/client';
import { useMemo } from 'react';

import {
  GetStakingWalletsQuery,
  GetStakingWalletsQueryVariables,
  InputMaybe,
  SortDirection,
} from '@/gql/graphql';
import { StakingWallet } from '@/shared/Model/StakingWallet';

const STAKING_WALLETS_QUERY = gql`
  query getStakingWallets(
    $filter: Filter
    $pageNumber: Int
    $pageSize: Int
    $sortBy: String
    $sortDirection: SortDirection
    $version: StakingVersion
  ) {
    stakingWallets(
      filter: $filter
      pageNumber: $pageNumber
      pageSize: $pageSize
      sortBy: $sortBy
      sortDirection: $sortDirection
      version: $version
    ) {
      totalEntries
      totalPages
      pageSize
      pageNumber
      stakingWallets {
        id
        address
        delegated
        stakingBalance
        version
      }
    }
  }
`;

interface UseStakingWalletsProps {
  // version: string; // Not supported at the moment
  // filters: Filters // Not supported at the moment
  sortBy?: string;
  sortDirection: InputMaybe<SortDirection>;
  pageNumber?: number;
  pageSize?: number;
}

function convertVersionResponseToModel(version?: string | null) {
  switch (version) {
    case 'one':
      return 'stINCH v1';
    case 'two':
      return 'stINCH v2';
    default:
      return '';
  }
}

function convertResponseToModel(
  response: GetStakingWalletsQuery
): StakingWallet[] {
  return (
    response.stakingWallets?.stakingWallets
      ?.filter((s) => !!s && !!s.id && !!s.address && !!s.stakingBalance)
      .map((s) => s!)
      .map((stakingWallet) => {
        return {
          id: stakingWallet.id!,
          address: stakingWallet.address!,
          delegated: !!stakingWallet.delegated,
          stakingBalance: stakingWallet.stakingBalance!,
          version: convertVersionResponseToModel(stakingWallet.version),
        };
      }) ?? []
  );
}

export function useStakingWallets({
  sortBy,
  sortDirection,
  pageNumber,
  pageSize,
}: UseStakingWalletsProps) {
  const { data, loading, error, refetch } = useQuery<
    GetStakingWalletsQuery,
    GetStakingWalletsQueryVariables
  >(STAKING_WALLETS_QUERY, {
    variables: {
      sortBy,
      sortDirection,
      pageNumber,
      pageSize,
    },
  });

  const stakingWallets = useMemo(() => {
    if (!data) {
      return null;
    }

    return convertResponseToModel(data);
  }, [data]);

  return {
    stakingWallets: stakingWallets as StakingWallet[],
    pagination: {
      pageSize: data?.stakingWallets?.pageSize,
      pageNumber: data?.stakingWallets?.pageNumber,
      totalEntries: data?.stakingWallets?.totalEntries,
      totalPages: data?.stakingWallets?.totalPages,
    },
    loading,
    error,
    refetchStakingWallets: refetch,
  };
}
