import { gql, useQuery } from '@apollo/client';

import {
  GetTreasuryCashflowBreakdownQuery,
  GetTreasuryCashflowBreakdownQueryVariables,
} from '@/gql/graphql';
import { TreasuryCashflowBreakdown } from '@/shared/Model/TreasuryCashflowBreakdown';

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

const cashflowLabels = {
  spreadSurplus: '1inch: Spread Surplus',
  oneInchTreasury: '1inch: Treasury',
  stakingFees: '1inch: Staking v2 fees',
  aave: 'Aave: USDC V3',
  coldWallet: '1inch: Cold wallet',
  spending: '1inch: Spending',
  grants: '1inch: Grant',
};

function getCashflowForLabel(
  key: keyof typeof cashflowLabels,
  response: GetTreasuryCashflowBreakdownQuery
) {
  const label = cashflowLabels[key];
  const inflow =
    response.treasuryTransactionSums?.from?.find((x) => x?.label === label)
      ?.sumUsd ?? 0;
  const outflow =
    response.treasuryTransactionSums?.to?.find((x) => x?.label === label)
      ?.sumUsd ?? 0 * -1;
  const net = inflow - outflow;

  return {
    inflow,
    outflow,
    net,
  };
}

function convertResponseToModel(
  response: GetTreasuryCashflowBreakdownQuery
): TreasuryCashflowBreakdown {
  const stakingFees = getCashflowForLabel('stakingFees', response).inflow;
  const depositOnAave = getCashflowForLabel('aave', response).net;
  const spreadSurplus =
    getCashflowForLabel('spreadSurplus', response).inflow - depositOnAave; // Temporary fix
  const transfersIn = 0;
  const otherTransfersIn = 0;
  const grants = getCashflowForLabel('grants', response).net;
  const otherSpending = getCashflowForLabel('spending', response).net;
  const transferOutToColdWallet = getCashflowForLabel(
    'coldWallet',
    response
  ).net;

  const revenues = stakingFees + spreadSurplus;
  const deposits = revenues;
  const otherDeposits = depositOnAave;

  const expenses = grants + otherSpending;
  const otherWithdrawals = transferOutToColdWallet + depositOnAave;
  const withdrawals = expenses + otherWithdrawals;

  const netCashflow = deposits - withdrawals;

  return {
    deposits,
    otherDeposits,
    revenues,
    stakingFees,
    spreadSurplus,
    transfersIn,
    otherTransfersIn,
    withdrawals,
    expenses,
    grants,
    otherSpending,
    otherWithdrawals,
    transferOutToColdWallet,
    depositOnAave,
    netCashflow,
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
