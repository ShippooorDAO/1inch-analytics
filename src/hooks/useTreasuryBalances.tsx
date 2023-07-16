import { gql, useQuery } from '@apollo/client';

import { GetTreasuryBalancesQuery } from '@/gql/graphql';
import { AssetService } from '@/shared/Currency/AssetService';

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
      ?.filter((t) => !!t && !!t.asset?.id && !!t.amount && !!t.amountUsd)
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
  const { data, loading, error } = useQuery(QUERY);

  const treasuryBalances =
    assetService && data
      ? convertResponseToModel(data, assetService)
      : undefined;

  return {
    treasuryBalances,
    loading,
    error,
  };
}
