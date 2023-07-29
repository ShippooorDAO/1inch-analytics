import { gql, useQuery } from '@apollo/client';

import {
  GetTreasuryCashflowBreakdownQuery,
  GetTreasuryCashflowBreakdownQueryVariables,
} from '@/gql/graphql';
import {
  AAVE_LABEL,
  COLD_WALLET_LABEL,
  GRANT_LABEL,
  OPERATIONS_FUND_LABEL,
  OPERATIONS_LABEL,
  SPENDING_LABEL,
  SPREAD_SURPLUS_LABEL,
  STAKING_FEES_LABEL,
  TRANSFER_OUT_LABEL,
} from '@/shared/Constants';
import { CashFlow } from '@/shared/Model/TreasuryCashflowBreakdown';

import { mockTreasuryCashflowBreakdownResponse } from './mocks/TreasuryCashflowBreakdown';

const QUERY = gql`
  query getTreasuryCashflowBreakdown {
    treasuryTransactionSums {
      from {
        label
        sumUsd
      }
      to {
        label
        sumUsd
      }
    }
  }
`;

function getCashflowForLabel(
  label: string,
  response: GetTreasuryCashflowBreakdownQuery
): CashFlow {
  const inflow =
    response.treasuryTransactionSums?.from?.find((x) => x?.label === label)
      ?.sumUsd ?? 0;
  const outflow =
    response.treasuryTransactionSums?.to?.find((x) => x?.label === label)
      ?.sumUsd ?? 0;
  const net = inflow - outflow;

  return {
    inflow,
    outflow,
    net,
  };
}

function convertResponseToModel(response: GetTreasuryCashflowBreakdownQuery) {
  const stakingFees = getCashflowForLabel(STAKING_FEES_LABEL, response);
  const spreadSurplus = getCashflowForLabel(SPREAD_SURPLUS_LABEL, response);

  const aave = getCashflowForLabel(AAVE_LABEL, response);
  const grants = getCashflowForLabel(GRANT_LABEL, response);
  const otherSpending = getCashflowForLabel(SPENDING_LABEL, response);
  const transferOutToColdWallet = getCashflowForLabel(
    COLD_WALLET_LABEL,
    response
  );
  const otherTransfersOut = getCashflowForLabel(TRANSFER_OUT_LABEL, response);
  const operations = getCashflowForLabel(OPERATIONS_LABEL, response);
  const operationsFund = getCashflowForLabel(OPERATIONS_FUND_LABEL, response);
  const transfersOut = getCashflowForLabel(TRANSFER_OUT_LABEL, response);

  const inflow = stakingFees.inflow + spreadSurplus.inflow;
  const outflow =
    operations.outflow + otherTransfersOut.outflow + operationsFund.outflow;
  const net = inflow - outflow;

  return {
    inflow,
    outflow,
    net,
    stakingFees,
    spreadSurplus,
    operations,
    operationsFund,
    otherTransfersOut,
    transferOutToColdWallet,
    transfersOut,
    otherSpending,
    grants,
    aave,
  };
}

export function useTreasuryCashflowBreakdown() {
  const {
    data: response,
    error,
    loading,
  } = useQuery<
    GetTreasuryCashflowBreakdownQuery,
    GetTreasuryCashflowBreakdownQueryVariables
  >(QUERY);

  const data = response ? convertResponseToModel(response) : null;
  const mockData = convertResponseToModel(
    mockTreasuryCashflowBreakdownResponse
  );

  return {
    data,
    mockData,
    loading,
  };
}
