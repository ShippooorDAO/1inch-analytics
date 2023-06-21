import { gql, useQuery } from '@apollo/client';
import { useMemo } from 'react';

import { ChainId } from '@/shared/Model/Chain';
import { FusionTrader } from '@/shared/Model/FusionTrader';
import { Filters } from '@/shared/Model/GraphQL/Filters';
import { ChainStore } from '@/shared/Model/Stores/ChainStore';
import { useOneInchAnalyticsAPIContext } from '@/shared/OneInchAnalyticsAPI/OneInchAnalyticsAPIProvider';

const QUERY = gql`
  query getFusionTopTraders(
    $sortBy: String
    $sortDirection: SortDirection
    $pageNumber: Int
    $pageSize: Int
  ) {
    fusionTopTraders(
      sortBy: $sortBy
      sortDirection: $sortDirection
      pageNumber: $pageNumber
      pageSize: $pageSize
    ) {
      fusionTopTraders {
        id
        address
        chain {
          id
        }
        transactionCount
        volumeUsd
      }
      pageNumber
      pageSize
      totalEntries
      totalPages
    }
  }
`;

interface FusionTopTradersResponse {
  fusionTopTraders: {
    fusionTopTraders: {
      id: string;
      address: string;
      chain: {
        id: string;
      };
      transactionCount: number;
      volumeUsd: number;
    }[];
    pageNumber: number;
    pageSize: number;
    totalEntries: number;
    totalPages: number;
  };
}

interface FusionTopTradersQueryVariables {
  chainIds?: string[];
  filter?: Filters;
  sortBy?: string;
  sortDirection?: string;
  pageNumber?: number;
  pageSize?: number;
}

interface UseFusionTopTradersProps {
  // chainIds: string[]; // Not supported at the moment
  // filters: Filters // Not supported at the moment
  sortBy?: 'transactionCount' | 'volumeUsd';
  sortDirection?: 'ASC' | 'DESC';
  pageNumber?: number;
  pageSize?: number;
}

function convertResponseToModel(
  response: FusionTopTradersResponse,
  chainStore: ChainStore
): FusionTrader[] {
  return response.fusionTopTraders.fusionTopTraders.map((trader) => {
    return {
      ...trader,
      chain: chainStore.getByChainId(ChainId.ETHEREUM)!,
    };
  });
}

export function useFusionTopTraders({
  sortBy,
  sortDirection,
  pageNumber,
  pageSize,
}: UseFusionTopTradersProps) {
  const { chainStore } = useOneInchAnalyticsAPIContext();
  const { data, loading, error } = useQuery<
    FusionTopTradersResponse,
    FusionTopTradersQueryVariables
  >(QUERY, {
    variables: {
      sortBy,
      sortDirection,
      pageNumber,
      pageSize,
    },
  });

  const fusionTopTraders = useMemo(() => {
    if (!chainStore || !data) {
      return null;
    }
    return convertResponseToModel(data, chainStore);
  }, [chainStore, data]);

  return {
    fusionTopTraders,
    loading,
    error,
  };
}
