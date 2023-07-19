import { gql, useQuery } from '@apollo/client';
import { useMemo } from 'react';

import {
  Filter,
  GetTreasuryTransactionsQuery,
  GetTreasuryTransactionsQueryVariables,
  InputMaybe,
  SortDirection,
} from '@/gql/graphql';
import { AssetService } from '@/shared/Currency/AssetService';
import {
  TreasuryTransaction,
  TreasuryTransactionSubType,
  TreasuryTransactionType,
} from '@/shared/Model/TreasuryTransaction';

import { mockTreasuryTransactionsResponse } from './mocks/TreasuryTransactions';
import { useAssetService } from './useAssetService';

const QUERY = gql`
  query getTreasuryTransactions(
    $filter: Filter
    $pageNumber: Int
    $pageSize: Int
    $sortBy: String
    $sortDirection: SortDirection
    $assetIds: [String]
  ) {
    treasuryTransactions(
      filter: $filter
      pageNumber: $pageNumber
      pageSize: $pageSize
      sortBy: $sortBy
      sortDirection: $sortDirection
      assetIds: $assetIds
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

function getTransactionType({
  from,
  to,
}: {
  from?: string | null;
  to?: string | null;
}) {
  const TREASURY_ADDRESS = '0x7951c7ef839e26f63da87a42c9a87986507f1c07';
  const NULL_ADDRESS = '0x0000000000000000000000000000000000000000';

  if (from === TREASURY_ADDRESS && to === NULL_ADDRESS) {
    return TreasuryTransactionType.BURN;
  }

  if (to === TREASURY_ADDRESS && from === NULL_ADDRESS) {
    return TreasuryTransactionType.MINT;
  }

  if (to === TREASURY_ADDRESS) {
    return TreasuryTransactionType.DEPOSIT;
  }

  if (from === TREASURY_ADDRESS) {
    return TreasuryTransactionType.WITHDRAW;
  }

  return TreasuryTransactionType.UNKNOWN;
}

function getTransactionSubType({
  type,
  from,
  to,
}: {
  type: TreasuryTransactionType;
  from?: string | null;
  to?: string | null;
}): TreasuryTransactionSubType {
  const AGGREGATION_ROUTER_ADDRESSES = [
    '0x1111111254fb6c44bac0bed2854e76f90643097d',
  ];
  const GOV_STAKING_ADDRESS = '0x9a0c8ff858d273f57072d714bca7411d717501d7';
  const GOV_LEFTOVER_EXCHANGER_ADDRESS =
    '0xdd9f24efc84d93deef3c8745c837ab63e80abd27';

  if (
    type === TreasuryTransactionType.DEPOSIT &&
    from === GOV_STAKING_ADDRESS
  ) {
    return TreasuryTransactionSubType.STAKING_REVENUE;
  }

  if (type === TreasuryTransactionType.WITHDRAW) {
    return TreasuryTransactionSubType.GRANT_PAYMENT;
  }

  if (
    type === TreasuryTransactionType.DEPOSIT &&
    from === GOV_LEFTOVER_EXCHANGER_ADDRESS
  ) {
    return TreasuryTransactionSubType.OTHER;
  }

  if (
    type === TreasuryTransactionType.DEPOSIT &&
    from &&
    AGGREGATION_ROUTER_ADDRESSES.includes(from)
  ) {
    return TreasuryTransactionSubType.AGGREGATION_ROUTER_REVENUE;
  }

  return TreasuryTransactionSubType.OTHER;
}

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
        type: getTransactionType(tx),
        subType: getTransactionSubType({
          type: getTransactionType(tx),
          from: tx.from,
          to: tx.to,
        }),
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

interface UseTreasuryTransactionsProps {
  sortBy?: 'timestamp' | 'amountUsd';
  sortDirection?: InputMaybe<SortDirection> | undefined;
  pageSize?: number;
  pageNumber?: number;
  assetIds?: string[];
  chainIds?: string[];
  from?: string;
  to?: string;
}

function buildQueryFilter({
  from,
  to,
}: {
  from?: string;
  to?: string;
}): Filter {
  const filter: Filter = {};

  if (from) {
    filter.stringFilters = (filter.stringFilters ?? []).concat([
      { field: 'from', contains: from },
    ]);
  }

  if (to) {
    filter.stringFilters = (filter.stringFilters ?? []).concat([
      { field: 'to', contains: to },
    ]);
  }

  return filter;
}

export function useTreasuryTransactions({
  sortBy,
  sortDirection,
  pageSize,
  pageNumber,
  assetIds,
  chainIds,
  from,
  to,
}: UseTreasuryTransactionsProps) {
  const assetService = useAssetService();
  const { data, error, loading } = useQuery<
    GetTreasuryTransactionsQuery,
    GetTreasuryTransactionsQueryVariables
  >(QUERY, {
    variables: {
      assetIds,
      // chainIds, // TODO: Remove this.
      filter: buildQueryFilter({ from, to }),
      sortBy,
      sortDirection,
      pageSize,
      pageNumber,
    },
  });

  const mock = useMemo(() => {
    if (!assetService) {
      return null;
    }
    return convertResponseToModel(
      mockTreasuryTransactionsResponse,
      assetService
    );
  }, [assetService]);

  const transactions = useMemo(() => {
    if (!assetService || !data) {
      return null;
    }
    return convertResponseToModel(data, assetService);
  }, [assetService, data]);

  return {
    error,
    loading,
    transactions,
    mock,
  };
}
