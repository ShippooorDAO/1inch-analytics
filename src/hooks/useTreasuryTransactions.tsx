import { gql, useQuery } from '@apollo/client';
import { useMemo } from 'react';

import {
  Filter,
  GetTreasuryTransactionsQuery,
  GetTreasuryTransactionsQueryVariables,
  InputMaybe,
  Operator,
  SortDirection,
} from '@/gql/graphql';
import { AssetService } from '@/shared/Currency/AssetService';
import { ChainStore } from '@/shared/Model/Stores/ChainStore';
import {
  TreasuryTransaction,
  TreasuryTransactionType,
} from '@/shared/Model/TreasuryTransaction';

import { mockTreasuryTransactionsResponse } from './mocks/TreasuryTransactions';
import { useAssetService } from './useAssetService';
import { useChainStore } from './useChainStore';

const SPREAD_SURPLUS_LABEL = '1inch: Spread Surplus';
const STAKING_FEES_LABEL = '1inch: Staking v2 fees';
const SPENDING_LABEL = '1inch: Spending';
const GRANT_LABEL = '1inch: Grant';
const COLD_WALLET_LABEL = '1inch: Cold wallet';
const AAVE_LABEL = 'Aave: USDC V3';
const ONE_INCH_TREASURY_LABEL = '1inch: Treasury';

const QUERY = gql`
  query getTreasuryTransactions(
    $filter: Filter
    $pageNumber: Int
    $pageSize: Int
    $sortBy: String
    $sortDirection: SortDirection
    $assetIds: [String]
    $chainIds: [String]
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
      chainIds: $chainIds
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
        chain {
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
  fromLabel,
  toLabel,
}: {
  fromLabel?: string | null;
  toLabel?: string | null;
}) {
  if (fromLabel === SPREAD_SURPLUS_LABEL) {
    return TreasuryTransactionType.SPREAD_SURPLUS;
  }

  if (fromLabel === STAKING_FEES_LABEL) {
    return TreasuryTransactionType.STAKING_FEES;
  }

  if (toLabel === SPENDING_LABEL) {
    return TreasuryTransactionType.SPENDING;
  }

  if (toLabel === GRANT_LABEL) {
    return TreasuryTransactionType.GRANT_PAYMENT;
  }

  if (toLabel === COLD_WALLET_LABEL) {
    return TreasuryTransactionType.COLD_WALLET;
  }

  if (toLabel === AAVE_LABEL) {
    return TreasuryTransactionType.AAVE;
  }

  if (fromLabel === ONE_INCH_TREASURY_LABEL) {
    return TreasuryTransactionType.WITHDRAW;
  }

  if (toLabel === ONE_INCH_TREASURY_LABEL) {
    return TreasuryTransactionType.DEPOSIT;
  }

  return TreasuryTransactionType.OTHER;
}

function convertResponseToModel(
  response: GetTreasuryTransactionsQuery,
  assetService: AssetService,
  chainStore: ChainStore
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
          !!t.transactionHash &&
          !!t.chain?.id
      )
      .map((t) => t!)
      .map((tx) => ({
        amount: assetService.createAssetAmount(tx.amount!, tx.asset!.id!)!,
        amountUsd: assetService.createUsdAmount(tx.amountUsd!)!,
        asset: assetService.store.getById(tx.asset!.id!)!,
        fromLabel: tx.fromLabel,
        from: tx.from!,
        id: tx.id!,
        timestamp: tx.timestamp!,
        to: tx.to!,
        chain: chainStore.getById(tx.chain!.id!)!,
        toLabel: tx.toLabel,
        transactionHash: tx.transactionHash!,
        type: getTransactionType({
          fromLabel: tx.fromLabel,
          toLabel: tx.toLabel,
        }),
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
  transactionTypes?: TreasuryTransactionType[];
  startDate?: Date;
  endDate?: Date;
}

function buildQueryFilter({
  from,
  to,
  startDate,
  endDate,
}: {
  from?: string;
  to?: string;
  startDate?: Date;
  endDate?: Date;
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

function getTransactionTypeQueryFilter(
  transactionTypes?: TreasuryTransactionType[]
): { fromLabels: string[]; toLabels: string[] } {
  const fromLabels: string[] = [];
  const toLabels: string[] = [];

  if (transactionTypes?.includes(TreasuryTransactionType.SPREAD_SURPLUS)) {
    fromLabels.push(SPREAD_SURPLUS_LABEL);
  }

  if (transactionTypes?.includes(TreasuryTransactionType.STAKING_FEES)) {
    fromLabels.push(STAKING_FEES_LABEL);
  }

  if (transactionTypes?.includes(TreasuryTransactionType.SPENDING)) {
    toLabels.push(SPENDING_LABEL);
  }

  if (transactionTypes?.includes(TreasuryTransactionType.GRANT_PAYMENT)) {
    toLabels.push(GRANT_LABEL);
  }

  if (transactionTypes?.includes(TreasuryTransactionType.COLD_WALLET)) {
    toLabels.push(COLD_WALLET_LABEL);
  }

  if (transactionTypes?.includes(TreasuryTransactionType.AAVE)) {
    toLabels.push(AAVE_LABEL);
  }

  if (transactionTypes?.includes(TreasuryTransactionType.DEPOSIT)) {
    toLabels.push(ONE_INCH_TREASURY_LABEL);
  }

  if (transactionTypes?.includes(TreasuryTransactionType.WITHDRAW)) {
    fromLabels.push(ONE_INCH_TREASURY_LABEL);
  }

  return { fromLabels, toLabels };
}

export function useTreasuryTransactions({
  sortBy,
  sortDirection,
  pageSize,
  pageNumber,
  assetIds,
  chainIds,
  transactionTypes,
  from,
  to,
  startDate,
  endDate,
}: UseTreasuryTransactionsProps) {
  const assetService = useAssetService();
  const chainStore = useChainStore();

  const transactionTypeQueryFilter =
    getTransactionTypeQueryFilter(transactionTypes);
  const { data, error, loading } = useQuery<
    GetTreasuryTransactionsQuery,
    GetTreasuryTransactionsQueryVariables
  >(QUERY, {
    variables: {
      assetIds,
      chainIds,
      fromLabels: transactionTypeQueryFilter.fromLabels,
      toLabels: transactionTypeQueryFilter.toLabels,
      filter: buildQueryFilter({ from, to, startDate, endDate }),
      sortBy,
      sortDirection,
      pageSize,
      pageNumber,
    },
  });

  const mock = useMemo(() => {
    if (!assetService || !chainStore) {
      return null;
    }
    return convertResponseToModel(
      mockTreasuryTransactionsResponse,
      assetService,
      chainStore
    );
  }, [assetService, chainStore]);

  const transactions = useMemo(() => {
    if (!assetService || !chainStore || !data) {
      return null;
    }
    return convertResponseToModel(data, assetService, chainStore);
  }, [assetService, chainStore, data]);

  return {
    error,
    loading,
    transactions,
    mock,
  };
}
