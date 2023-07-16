import { gql, useQuery } from '@apollo/client';

import {
  GetTreasuryTransactionsQuery,
  GetTreasuryTransactionsQueryVariables,
  SortDirection,
} from '@/gql/graphql';
import { AssetService } from '@/shared/Currency/AssetService';
import { TreasuryTransaction } from '@/shared/Model/TreasuryTransaction';

import { useAssetService } from './useAssetService';

const QUERY = gql`
  query getTreasuryTransactions(
    $filter: Filter
    $pageNumber: Int
    $pageSize: Int
    $sortBy: String
    $sortDirection: SortDirection
  ) {
    treasuryTransactions(
      filter: $filter
      pageNumber: $pageNumber
      pageSize: $pageSize
      sortBy: $sortBy
      sortDirection: $sortDirection
    ) {
      pageNumber
      pageSize
      totalEntries
      totalPages
      treasuryTransactions {
        amount
        amountUsd
        asset {
          id
        }
        from
        id
        timestamp
        to
        transactionHash
      }
    }
  }
`;

function convertResponseToModel(
  response: GetTreasuryTransactionsQuery,
  assetService: AssetService
): TreasuryTransaction[] {
  return (
    response.treasuryTransactions?.treasuryTransactions
      ?.filter(
        (t) =>
          !!t &&
          !!t.asset?.id &&
          !!t.amount &&
          !!t.amountUsd &&
          !!t.from &&
          !!t.to &&
          !!t.id &&
          !!t.timestamp &&
          !!t.transactionHash
      )
      .map((t) => t!)
      .map((tx) => ({
        amount: assetService.createAssetAmount(tx.amount!, tx.asset!.id!)!,
        amountUsd: assetService.createUsdAmount(tx.amountUsd!)!,
        asset: assetService.store.getById(tx.asset!.id!)!,
        from: tx.from!,
        id: tx.id!,
        timestamp: tx.timestamp!,
        to: tx.to!,
        transactionHash: tx.transactionHash!,
      })) ??
    [] ??
    []
  );
}

export function useTreasuryTransactions() {
  const assetService = useAssetService();
  const { data, error, loading } = useQuery<
    GetTreasuryTransactionsQuery,
    GetTreasuryTransactionsQueryVariables
  >(QUERY, {
    variables: {
      filter: {},
      pageSize: 1000,
      sortBy: 'timestamp',
      sortDirection: SortDirection.Desc,
    },
  });

  const transactions =
    assetService && data ? convertResponseToModel(data, assetService) : null;

  return {
    error,
    loading,
    transactions,
  };
}
