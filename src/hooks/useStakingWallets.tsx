import { gql, useQuery } from '@apollo/client';
import { useMemo } from 'react';

import { Filters } from '@/shared/Model/GraphQL/Filters';
import { StakingWallet } from '@/shared/Model/StakingWallet';

const STAKING_WALLETS_QUERY = gql`
  query getFusionResolvers(
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

interface StakingWalletsResponse {
  stakingWallets: {
    stakingWallets: {
      id: string;
      address: string;
      delegated: boolean;
      stakingBalance: number;
      version: string;
    }[];
    pageNumber: number;
    pageSize: number;
    totalEntries: number;
    totalPages: number;
  };
}

export interface StakingWalletsQueryVariables {
  version?: string;
  filter?: Filters;
  sortBy?: string;
  sortDirection?: string;
  pageNumber?: number;
  pageSize?: number;
}

interface UseStakingWalletsProps {
  // version: string; // Not supported at the moment
  // filters: Filters // Not supported at the moment
  sortBy?: string;
  sortDirection?: string;
  pageNumber?: number;
  pageSize?: number;
}

function convertVersionResponseToModel(version: string) {
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
  response: StakingWalletsResponse
): StakingWallet[] {
  return response.stakingWallets.stakingWallets.map((stakingWallet) => {
    return {
      id: stakingWallet.id,
      address: stakingWallet.address,
      delegated: stakingWallet.delegated,
      stakingBalance: stakingWallet.stakingBalance,
      version: convertVersionResponseToModel(stakingWallet.version),
    };
  });
}

export function useStakingWallets({
  sortBy,
  sortDirection,
  pageNumber,
  pageSize,
}: UseStakingWalletsProps) {
  const { data, loading, error, refetch } = useQuery<
    StakingWalletsResponse,
    StakingWalletsQueryVariables
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
      pageSize: data?.stakingWallets.pageSize,
      pageNumber: data?.stakingWallets?.pageNumber,
      totalEntries: data?.stakingWallets?.totalEntries,
      totalPages: data?.stakingWallets?.totalPages,
    },
    loading,
    error,
    refetchStakingWallets: refetch,
  };
}
