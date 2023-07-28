import { gql, useQuery } from '@apollo/client';
import { useMemo } from 'react';

import {
  GetTreasuryBalancesQuery,
  GetTreasuryBalancesQueryVariables,
} from '@/gql/graphql';
import { AssetService } from '@/shared/Currency/AssetService';
import { TreasuryBalances } from '@/shared/Model/TreasuryBalances';

import { mockTreasuryBalancesResponse } from './mocks/TreasuryBalances';
import { useAssetService } from './useAssetService';

const QUERY = gql`
  query getTreasuryBalances {
    treasuryBalances(pageSize: 100, sortBy: "amountUsd", sortDirection: DESC) {
      pageNumber
      pageSize
      totalEntries
      totalPages
      treasuryBalances {
        id
        amount
        amountUsd
        asset {
          id
        }
        chain {
          id
        }
      }
    }
  }
`;

function convertResponseToModel(
  response: GetTreasuryBalancesQuery,
  assetService: AssetService
): TreasuryBalances {
  const totalValueUsd =
    response.treasuryBalances?.treasuryBalances
      ?.map((t) => t?.amountUsd ?? 0)
      .reduce((a, b) => a + b, 0) ?? 1;

  const positions =
    response.treasuryBalances?.treasuryBalances
      ?.filter(
        (t) =>
          !!t &&
          !!t.asset?.id &&
          t.amount !== undefined &&
          t.amount !== null &&
          t.amountUsd !== undefined &&
          t.amountUsd !== null
      )
      .map((t) => t!)
      .map((t) => ({
        id: t.id!,
        asset: assetService.store.getById(t.asset!.id!),
        amount: assetService.createAssetAmount(t.amount!, t.asset!.id!),
        amountUsd: assetService.createUsdAmount(t.amountUsd!),
        share: t.amountUsd! / totalValueUsd,
      })) ?? [];

  return {
    positions,
    totalValueUsd: assetService.createUsdAmount(totalValueUsd),
  };
}

export function useTreasuryBalances() {
  const assetService = useAssetService();
  const {
    data: response,
    loading,
    error,
  } = useQuery<GetTreasuryBalancesQuery, GetTreasuryBalancesQueryVariables>(
    QUERY
  );

  const data =
    assetService && response
      ? convertResponseToModel(response, assetService)
      : undefined;

  const mockData = useMemo(() => {
    if (!assetService) {
      return null;
    }
    return convertResponseToModel(mockTreasuryBalancesResponse, assetService);
  }, [assetService]);

  return {
    data,
    loading,
    error,
    mockData,
  };
}
