import { gql, useQuery } from '@apollo/client';
import { useMemo } from 'react';

import {
  Filter,
  GetFusionTradesQuery,
  GetFusionTradesQueryVariables,
  InputMaybe,
  Operator,
  SortDirection,
} from '@/gql/graphql';
import { FusionTrade } from '@/shared/Model/FusionTrade';
import { AssetStore } from '@/shared/Model/Stores/AssetStore';
import { ChainStore } from '@/shared/Model/Stores/ChainStore';

import { mockFusionTradesResponse } from './mocks/FusionTrades';
import { useAssetStore } from './useAssetStore';
import { useChainStore } from './useChainStore';

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

function convertResponseToModel(
  response: GetFusionTradesQuery,
  assetStore: AssetStore,
  chainStore: ChainStore
): FusionTrade[] {
  return (
    response.fusionTopTrades?.fusionTopTrades
      ?.filter(
        (t) =>
          !!t &&
          !!t.id &&
          !!t.chain &&
          !!t.chain.id &&
          !!t.destinationAsset?.id &&
          !!t.sourceAsset?.id &&
          !!t.executorAddress &&
          !!t.receiverAddress &&
          !!t.destinationUsdAmount &&
          !!t.sourceUsdAmount &&
          !!t.timestamp &&
          !!t.transactionHash
      )
      .map((t) => t!)
      .map((trade) => {
        return {
          id: trade.id!,
          chain: chainStore.getById(trade.chain!.id!)!,
          destinationAsset: assetStore.getById(trade.destinationAsset!.id!)!,
          sourceAsset: assetStore.getById(trade.sourceAsset!.id!)!,
          executorAddress: trade.executorAddress!,
          receiverAddress: trade.receiverAddress!,
          destinationUsdAmount: trade.destinationUsdAmount!,
          sourceUsdAmount: trade.sourceUsdAmount!,
          slippage: trade.destinationUsdAmount! / trade.sourceUsdAmount! - 1,
          timestamp: trade.timestamp!,
          transactionHash: trade.transactionHash!,
        };
      }) ?? []
  );
}

function buildQueryFilter({
  startDate,
  endDate,
}: {
  startDate?: Date;
  endDate?: Date;
}): Filter {
  const filter: Filter = {};

  if (startDate) {
    filter.integerFilters = (filter.integerFilters ?? []).concat([
      {
        field: 'timestamp',
        operator: Operator.GtEq,
        value: Math.floor(startDate.getTime() / 1000),
      },
    ]);
  }

  if (endDate) {
    filter.integerFilters = (filter.integerFilters ?? []).concat([
      {
        field: 'timestamp',
        operator: Operator.SmEq,
        value: Math.floor(endDate.getTime() / 1000),
      },
    ]);
  }

  return filter;
}

export interface UseFusionTradesProps {
  sortBy?: 'timestamp' | 'sourceUsdAmount' | 'destinationUsdAmount';
  sortDirection?: InputMaybe<SortDirection> | undefined;
  pageSize?: number;
  pageNumber?: number;
  assetIds?: string[];
  chainIds?: string[];
  startDate?: Date;
  endDate?: Date;
}
export function useFusionTrades({
  sortBy,
  sortDirection,
  pageSize,
  pageNumber,
  assetIds,
  chainIds,
  startDate,
  endDate,
}: UseFusionTradesProps) {
  const assetStore = useAssetStore();
  const chainStore = useChainStore();
  const { data, error, loading } = useQuery<
    GetFusionTradesQuery,
    GetFusionTradesQueryVariables
  >(QUERY, {
    variables: {
      assetIds,
      chainIds,
      sortBy,
      sortDirection,
      pageSize,
      filter: buildQueryFilter({ startDate, endDate }),
      pageNumber,
    },
  });

  const mock = useMemo(() => {
    if (!assetStore || !chainStore) {
      return null;
    }
    return convertResponseToModel(
      mockFusionTradesResponse,
      assetStore,
      chainStore
    );
  }, [assetStore, chainStore]);

  const fusionTrades = useMemo(() => {
    if (!assetStore || !chainStore || !data) {
      return null;
    }
    return convertResponseToModel(data, assetStore, chainStore);
  }, [data, assetStore, chainStore]);

  return {
    fusionTrades,
    mock,
    error,
    loading: loading || !data,
  };
}
