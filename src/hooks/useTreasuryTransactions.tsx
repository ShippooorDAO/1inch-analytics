import { gql, useQuery } from '@apollo/client';
import { useMemo } from 'react';

import {
  Filter,
  GetTreasuryTransactionsQuery,
  GetTreasuryTransactionsQueryVariables,
  InputMaybe,
  SortDirection,
} from '@/gql/graphql';
import {
  AGGREGATION_ROUTER_ADDRESSES,
  GOV_LEFTOVER_EXCHANGER_ADDRESS,
  GOV_STAKING_ADDRESS,
  NULL_ADDRESS,
  TREASURY_ADDRESS,
} from '@/shared/Constants';
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
    $fromLabels: [String]
    $toLabels: [String]
  ) {
    treasuryTransactions(
      filter: $filter
      pageNumber: $pageNumber
      pageSize: $pageSize
      sortBy: $sortBy
      sortDirection: $sortDirection
      assetIds: $assetIds
      fromLabels: $fromLabels
      toLabels: $toLabels
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
        fromLabel
        id
        timestamp
        to
        toLabel
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
        fromLabel: tx.fromLabel,
        from: tx.from!,
        id: tx.id!,
        timestamp: tx.timestamp!,
        to: tx.to!,
        toLabel: tx.toLabel,
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
  fromLabels?: string[];
  toLabels?: string[];
  from?: string;
  to?: string;
  includeSpreadSurplus?: boolean;
  includeStakingFees?: boolean;
  includeSpending?: boolean;
  includeGrantPayments?: boolean;
  includeColdWalletTransfers?: boolean;
  includeAave?: boolean;
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

function getTransactionTypeQueryFilter({
  includeSpreadSurplus,
  includeStakingFees,
  includeGrantPayments,
  includeSpending,
  includeColdWalletTransfers,
  includeAave,
}: {
  includeSpreadSurplus?: boolean;
  includeStakingFees?: boolean;
  includeSpending?: boolean;
  includeGrantPayments?: boolean;
  includeColdWalletTransfers?: boolean;
  includeAave?: boolean;
}): { fromLabels: string[]; toLabels: string[] } {
  const fromLabels: string[] = [];
  const toLabels: string[] = [];

  if (includeSpreadSurplus) {
    fromLabels.push('1inch: Spread Surplus');
  }

  if (includeStakingFees) {
    fromLabels.push('1inch: Staking v2 fees');
  }

  if (includeSpending) {
    toLabels.push('1inch: Spending');
  }

  if (includeGrantPayments) {
    toLabels.push('1inch: Grant');
  }

  if (includeColdWalletTransfers) {
    toLabels.push('1inch: Cold wallet');
  }

  if (includeAave) {
    toLabels.push('Aave: USDC V3');
  }

  return { fromLabels, toLabels };
}

export function useTreasuryTransactions({
  sortBy,
  sortDirection,
  pageSize,
  pageNumber,
  assetIds,
  includeSpreadSurplus,
  includeStakingFees,
  includeGrantPayments,
  includeSpending,
  includeColdWalletTransfers,
  includeAave,
  from,
  to,
}: UseTreasuryTransactionsProps) {
  const assetService = useAssetService();
  const transactionTypeQueryFilter = getTransactionTypeQueryFilter({
    includeSpreadSurplus,
    includeStakingFees,
    includeGrantPayments,
    includeSpending,
    includeColdWalletTransfers,
    includeAave,
  });
  const { data, error, loading } = useQuery<
    GetTreasuryTransactionsQuery,
    GetTreasuryTransactionsQueryVariables
  >(QUERY, {
    variables: {
      assetIds,
      fromLabels: transactionTypeQueryFilter.fromLabels,
      toLabels: transactionTypeQueryFilter.toLabels,
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
