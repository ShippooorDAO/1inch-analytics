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

function convertTreasuryFlowsToTimeseries(
  treasuryFlows: Array<TreasuryFlow | null | undefined>
) {
  const nonNullTreasuryFlows = treasuryFlows
    ?.filter(
      (f) =>
        !!f &&
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
      netVolumeUsd:
        (flow.inboundVolumeUsd ?? 0) - (flow.outboundVolumeUsd ?? 0),
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
    name: 'Outbound Volume (USD)',
    data:
      nonNullTreasuryFlows?.map((flow) => ({
        x: flow.timestamp,
        y: -1 * flow.outboundVolumeUsd,
      })) ?? [],
  };
  const netVolumeUsdTimeseries: Timeseries = {
    name: 'Net Volume (USD)',
    type: 'bar',
    data:
      nonNullTreasuryFlows?.map((flow) => ({
        x: flow.timestamp,
        y: flow.netVolumeUsd,
      })) ?? [],
  };
  const balanceUsdTimeseries: Timeseries = {
    name: 'Balance (USD)',
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

  const cumulativeRevenueUsdTimeseries: Timeseries = {
    name: 'Cumulative Inbound Volume (USD)',
    data:
      nonNullTreasuryFlows?.reduce((acc, flow) => {
        const latestValue = acc[acc.length - 1]?.y ?? 0;
        acc.push({
          x: flow.timestamp,
          y: flow.inboundVolumeUsd + latestValue,
        });
        return acc;
      }, [] as DataPoint[]) ?? [],
  };

  const cumulativeExpenseUsdTimeseries: Timeseries = {
    name: 'Cumulative Outbound Volume (USD)',
    data:
      nonNullTreasuryFlows?.reduce((acc, flow) => {
        const latestValue = acc[acc.length - 1]?.y ?? 0;
        acc.push({
          x: flow.timestamp,
          y: -1 * flow.outboundVolumeUsd + latestValue,
        });
        return acc;
      }, [] as DataPoint[]) ?? [],
  };

  return {
    inboundVolumeUsdTimeseries,
    outboundVolumeUsdTimeseries,
    netVolumeUsdTimeseries,
    balanceUsdTimeseries,
    cumulativeRevenueUsdTimeseries,
    cumulativeExpenseUsdTimeseries,
  };
}

function convertDailyTreasuryFlowsToQuarterlyTreasuryFlows(
  dailyTreasuryFlows: Array<TreasuryFlow | null | undefined>
): Array<TreasuryFlow | null | undefined> {
  const treasuryFlowMap = dailyTreasuryFlows.reduce((acc, flow) => {
    if (!flow || !flow.timestamp) {
      return acc;
    }
    const date = new Date(flow.timestamp * 1000);
    const year = date?.getFullYear();
    const quarter = Math.floor(date.getMonth()! / 3);
    const key = `${year}-Q${quarter}`;
    if (!acc[key]) {
      acc[key] = {
        inboundVolumeUsd: 0,
        outboundVolumeUsd: 0,
        timestamp: Math.floor(new Date(year!, quarter * 3, 1).getTime() / 1000),
      };
    }
    acc[key].inboundVolumeUsd =
      (acc[key].inboundVolumeUsd ?? 0) + (flow.inboundVolumeUsd ?? 0);
    acc[key].outboundVolumeUsd =
      (acc[key].outboundVolumeUsd ?? 0) + (flow.outboundVolumeUsd ?? 0);
    return acc;
  }, {} as { [key: string]: TreasuryFlow });

  return Object.values(treasuryFlowMap).sort(
    (a, b) => a.timestamp! - b.timestamp!
  );
}

function convertDailyTreasuryFlowsToYearlyTreasuryFlows(
  dailyTreasuryFlows: Array<TreasuryFlow | null | undefined>
): Array<TreasuryFlow | null | undefined> {
  const treasuryFlowMap = dailyTreasuryFlows.reduce((acc, flow) => {
    if (!flow || !flow.timestamp) {
      return acc;
    }
    const date = new Date(flow.timestamp * 1000);
    const year = date?.getFullYear();
    const key = `${year}`;
    if (!acc[key]) {
      acc[key] = {
        inboundVolumeUsd: 0,
        outboundVolumeUsd: 0,
        timestamp: Math.floor(new Date(year!, 0, 1).getTime() / 1000),
      };
    }
    acc[key].inboundVolumeUsd =
      (acc[key].inboundVolumeUsd ?? 0) + (flow.inboundVolumeUsd ?? 0);
    acc[key].outboundVolumeUsd =
      (acc[key].outboundVolumeUsd ?? 0) + (flow.outboundVolumeUsd ?? 0);
    return acc;
  }, {} as { [key: string]: TreasuryFlow });
  return Object.values(treasuryFlowMap).sort(
    (a, b) => a.timestamp! - b.timestamp!
  );
}

function convertResponseToModel(response: GetTreasuryFlowsQuery) {
  const quarterlyTreasuryFlows =
    convertDailyTreasuryFlowsToQuarterlyTreasuryFlows(
      response.dailyTreasuryFlows ?? []
    );
  const yearlyTreasuryFlows = convertDailyTreasuryFlowsToYearlyTreasuryFlows(
    response.dailyTreasuryFlows ?? []
  );
  return {
    daily: convertTreasuryFlowsToTimeseries(response.dailyTreasuryFlows ?? []),
    weekly: convertTreasuryFlowsToTimeseries(
      response.weeklyTreasuryFlows ?? []
    ),
    monthly: convertTreasuryFlowsToTimeseries(
      response.monthlyTreasuryFlows ?? []
    ),
    quarterly: convertTreasuryFlowsToTimeseries(quarterlyTreasuryFlows),
    yearly: convertTreasuryFlowsToTimeseries(yearlyTreasuryFlows),
  };
}

interface TreasuryFlowsTimeseries {
  inboundVolumeUsdTimeseries: Timeseries;
  outboundVolumeUsdTimeseries: Timeseries;
  netVolumeUsdTimeseries: Timeseries;
  balanceUsdTimeseries: Timeseries;
  cumulativeRevenueUsdTimeseries: Timeseries;
  cumulativeExpenseUsdTimeseries: Timeseries;
}

export interface TreasuryFlows {
  daily: TreasuryFlowsTimeseries;
  weekly: TreasuryFlowsTimeseries;
  monthly: TreasuryFlowsTimeseries;
  quarterly: TreasuryFlowsTimeseries;
  yearly: TreasuryFlowsTimeseries;
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
