import { gql, useQuery } from '@apollo/client';
import { useMemo } from 'react';

import {
  GetTreasuryBalancesQuery,
  GetTreasuryBalancesQueryVariables,
} from '@/gql/graphql';
import { AssetService } from '@/shared/Currency/AssetService';

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
      }
    }
  }
`;

function convertResponseToModel(
  response: GetTreasuryBalancesQuery,
  assetService: AssetService
) {
  return (
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
      })) ?? []
  );
}

export function useTreasuryBalances() {
  const assetService = useAssetService();
  const { data, loading, error } = useQuery<
    GetTreasuryBalancesQuery,
    GetTreasuryBalancesQueryVariables
  >(QUERY);

  const treasuryBalances =
    assetService && data
      ? convertResponseToModel(data, assetService)
      : undefined;

  const mock = useMemo(() => {
    if (!assetService) {
      return null;
    }
    return convertResponseToModel(mockTreasuryBalancesResponse, assetService);
  }, [assetService]);

  return {
    treasuryBalances,
    loading,
    error,
    mock,
  };
}
