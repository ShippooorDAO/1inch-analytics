import { gql, useQuery } from '@apollo/client';
import { useMemo } from 'react';

import { FusionTrade } from '@/shared/Model/FusionTrade';
import { Filters } from '@/shared/Model/GraphQL/Filters';
import { AssetStore } from '@/shared/Model/Stores/AssetStore';
import { ChainStore } from '@/shared/Model/Stores/ChainStore';
import { useOneInchAnalyticsAPIContext } from '@/shared/OneInchAnalyticsAPI/OneInchAnalyticsAPIProvider';

const QUERY = gql`
  query getFusionTrades(
    $assetIds: [String]
    $chainIds: [String]
    $filter: Filter
    $pageNumber: Int
    $pageSize: Int
    $sortBy: String
    $sortDirection: SortDirection
  ) {
    fusionTopTrades(
      assetIds: $assetIds
      chainIds: $chainIds
      filter: $filter
      pageNumber: $pageNumber
      pageSize: $pageSize
      sortBy: $sortBy
      sortDirection: $sortDirection
    ) {
      pageNumber
      pageSize
      totalPages
      totalEntries
      fusionTopTrades {
        id
        chain {
          id
        }
        destinationAsset {
          id
        }
        sourceAsset {
          id
        }
        executorAddress
        receiverAddress
        destinationUsdAmount
        sourceUsdAmount
        timestamp
        transactionHash
      }
    }
  }
`;

interface QueryResponse {
  fusionTopTrades: {
    pageNumber: number;
    pageSize: number;
    totalPages: number;
    totalEntries: number;
    fusionTopTrades: {
      id: string;
      chain: {
        id: string;
      };
      destinationAsset: {
        id: string;
      };
      sourceAsset: {
        id: string;
      };
      executorAddress: string;
      receiverAddress: string;
      destinationUsdAmount: number;
      sourceUsdAmount: number;
      timestamp: number;
      transactionHash: string;
    }[];
  };
}

interface QueryVariables {
  assetIds?: string[];
  chainIds?: string[];
  filter?: Filters;
  pageNumber?: number;
  pageSize?: number;
  sortBy?: string;
  sortDirection?: string;
}

function convertResponseToModel(
  response: QueryResponse,
  assetStore: AssetStore,
  chainStore: ChainStore
): FusionTrade[] {
  return response.fusionTopTrades.fusionTopTrades.map((trade) => {
    return {
      id: trade.id,
      chain: chainStore.getById(trade.chain.id)!,
      destinationAsset: assetStore.getById(trade.destinationAsset.id)!,
      sourceAsset: assetStore.getById(trade.sourceAsset.id)!,
      executorAddress: trade.executorAddress,
      receiverAddress: trade.receiverAddress,
      destinationUsdAmount: trade.destinationUsdAmount,
      sourceUsdAmount: trade.sourceUsdAmount,
      slippage: trade.destinationUsdAmount / trade.sourceUsdAmount - 1,
      timestamp: trade.timestamp,
      transactionHash: trade.transactionHash,
    };
  });
}

export interface UseFusionTradesProps {
  sortBy?: 'timestamp' | 'sourceUsdAmount' | 'destinationUsdAmount';
  sortDirection?: 'asc' | 'desc';
  pageSize?: number;
  pageNumber?: number;
  assetIds?: string[];
  chainIds?: string[];
}
export function useFusionTrades({
  sortBy,
  sortDirection,
  pageSize,
  pageNumber,
  assetIds,
  chainIds,
}: UseFusionTradesProps) {
  const { assetService, chainStore } = useOneInchAnalyticsAPIContext();
  const { data, error, loading } = useQuery<QueryResponse, QueryVariables>(
    QUERY,
    {
      variables: {
        assetIds,
        chainIds,
        sortBy,
        sortDirection,
        pageSize,
        pageNumber,
      },
    }
  );

  const fusionTrades = useMemo(() => {
    if (!assetService || !chainStore || !data) {
      return null;
    }
    return convertResponseToModel(data, assetService.store, chainStore);
  }, [data, assetService, chainStore]);

  return {
    fusionTrades,
    error,
    loading,
  };
}
