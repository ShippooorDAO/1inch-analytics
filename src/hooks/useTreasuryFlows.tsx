import { gql, useQuery } from '@apollo/client';

import {
  GetTreasuryFlowsQuery,
  GetTreasuryFlowsQueryVariables,
  TreasuryFlow,
} from '@/gql/graphql';
import { DataPoint, Timeseries } from '@/shared/Model/Timeseries';

const QUERY = gql`
  fragment TreasuryFlowFields on TreasuryFlow {
    id
    inboundVolumeUsd
    outboundVolumeUsd
    timespan
    timestamp
  }
  query getTreasuryFlows {
    dailyTreasuryFlows: treasuryFlows(timespan: DAY) {
      ...TreasuryFlowFields
    }
    weeklyTreasuryFlows: treasuryFlows(timespan: WEEK) {
      ...TreasuryFlowFields
    }
    monthlyTreasuryFlows: treasuryFlows(timespan: MONTH) {
      ...TreasuryFlowFields
    }
  }
`;

function convertResponseToModel(response: GetTreasuryFlowsQuery) {
  const parseTreasuryFlows = (
    treasuryFlows: Array<TreasuryFlow | null | undefined>
  ) => {
    const nonNullTreasuryFlows = treasuryFlows
      ?.filter(
        (f) =>
          !!f &&
          !!f.id &&
          !!f.timestamp &&
          f.inboundVolumeUsd !== null &&
          f.inboundVolumeUsd !== undefined &&
          f.outboundVolumeUsd !== null &&
          f.outboundVolumeUsd !== undefined
      )
      .map((f) => f!)
      .sort((a, b) => a.timestamp! - b.timestamp!)
      .map((flow) => ({
        timestamp: flow.timestamp!,
        inboundVolumeUsd: flow.inboundVolumeUsd ?? 0,
        outboundVolumeUsd: flow.outboundVolumeUsd ?? 0,
      }));

    const inboundVolumeUsdTimeseries: Timeseries = {
      name: 'Inbound Volume (USD)',
      data:
        nonNullTreasuryFlows?.map((flow) => ({
          x: flow.timestamp,
          y: flow.inboundVolumeUsd,
        })) ?? [],
    };
    const outboundVolumeUsdTimeseries: Timeseries = {
      name: 'Inbound Volume (USD)',
      data:
        nonNullTreasuryFlows?.map((flow) => ({
          x: flow.timestamp,
          y: flow.inboundVolumeUsd,
        })) ?? [],
    };

    const balanceUsdTimeseries: Timeseries = {
      name: 'Balance (USD)',
      data:
        nonNullTreasuryFlows?.reduce((acc, flow) => {
          const latestValue = acc[acc.length - 1]?.y ?? 0;
          acc.push({
            x: flow.timestamp,
            y: flow.inboundVolumeUsd + flow.outboundVolumeUsd + latestValue,
          });
          return acc;
        }, [] as DataPoint[]) ?? [],
    };

    const cumulativeRevenueUsdTimeseries: Timeseries = {
      name: 'Revenue (USD)',
      data:
        nonNullTreasuryFlows?.reduce((acc, flow) => {
          const latestValue = acc[acc.length - 1]?.y ?? 0;
          acc.push({
            x: flow.timestamp,
            y: flow.inboundVolumeUsd - flow.outboundVolumeUsd + latestValue,
          });
          return acc;
        }, [] as DataPoint[]) ?? [],
    };

    const cumulativeExpenseUsdTimeseries: Timeseries = {
      name: 'Expense (USD)',
      data:
        nonNullTreasuryFlows?.reduce((acc, flow) => {
          const latestValue = acc[acc.length - 1]?.y ?? 0;
          acc.push({
            x: flow.timestamp,
            y: flow.outboundVolumeUsd - flow.inboundVolumeUsd + latestValue,
          });
          return acc;
        }, [] as DataPoint[]) ?? [],
    };

    return {
      inboundVolumeUsdTimeseries,
      outboundVolumeUsdTimeseries,
      balanceUsdTimeseries,
      cumulativeRevenueUsdTimeseries,
      cumulativeExpenseUsdTimeseries,
    };
  };

  return {
    daily: parseTreasuryFlows(response.dailyTreasuryFlows ?? []),
    weekly: parseTreasuryFlows(response.weeklyTreasuryFlows ?? []),
    monthly: parseTreasuryFlows(response.monthlyTreasuryFlows ?? []),
  };
}

export function useTreasuryFlows() {
  const { data, loading, error } = useQuery<
    GetTreasuryFlowsQuery,
    GetTreasuryFlowsQueryVariables
  >(QUERY);

  const treasuryFlows = data ? convertResponseToModel(data) : undefined;

  return {
    treasuryFlows,
    loading,
    error,
  };
}
