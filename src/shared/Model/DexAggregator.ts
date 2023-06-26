import { sum } from 'lodash';

import { ChainId } from './Chain';
import { Timeseries } from './Timeseries';

export interface DexAggregatorOverviewMetricsDataset {
  transactionsCountAllTime: number;
  walletsCountAllTime: number;
  volumeAllTime: number;

  transactionsCountLastDay: number;
  walletsCountLastDay: number;
  volumeLastDay: number;

  transactionsCountLastWeek: number;
  walletsCountLastWeek: number;
  volumeLastWeek: number;

  transactionsCountLastMonth: number;
  walletsCountLastMonth: number;
  volumeLastMonth: number;

  transactionsCountLastDayTrend: number;
  walletsCountLastDayTrend: number;
  volumeLastDayTrend: number;

  transactionsCountLastWeekTrend: number;
  walletsCountLastWeekTrend: number;
  volumeLastWeekTrend: number;

  transactionsCountLastMonthTrend: number;
  walletsCountLastMonthTrend: number;
  volumeLastMonthTrend: number;

  transactionsCountAllTimeTimeseries: Timeseries;
  walletsCountAllTimeTimeseries: Timeseries;
  volumeAllTimeTimeseries: Timeseries;

  transactionsCountDailyTimeseries: Timeseries;
  walletsCountDailyTimeseries: Timeseries;
  volumeDailyTimeseries: Timeseries;

  transactionsCountWeeklyTimeseries: Timeseries;
  walletsCountWeeklyTimeseries: Timeseries;
  volumeWeeklyTimeseries: Timeseries;

  transactionsCountMonthlyTimeseries: Timeseries;
  walletsCountMonthlyTimeseries: Timeseries;
  volumeMonthlyTimeseries: Timeseries;
}

export interface DexAggregatorOverviewMetrics {
  byChain: Map<ChainId, DexAggregatorOverviewMetricsDataset>;
  allChains: DexAggregatorOverviewMetricsDataset;
  allSelectedChains: DexAggregatorOverviewMetricsDataset;
}

export function getCumulatedTimeseries(timeseries: Timeseries) {
  let cumulated = 0;
  return {
    ...timeseries,
    data: timeseries.data.map((d) => {
      cumulated += d.y;
      return { ...d, y: cumulated };
    }),
  };
}

export function getAllTimeTotal(timeseries: Timeseries) {
  return timeseries.data.reduce((sum, d) => sum + d.y, 0);
}

export function getAllTimeShare(
  timeseries: Timeseries,
  allTimeseries: Timeseries[]
) {
  const allTimeTimeseriesTotal = getAllTimeTotal(timeseries);
  const allTimeTotal = sum(allTimeseries.map((t) => getAllTimeTotal(t)));
  return allTimeTimeseriesTotal / allTimeTotal;
}

export function getLastPeriodShare(
  timeseries: Timeseries,
  allTimeseries: Timeseries[]
) {
  const lastPeriodValue = getLastPeriodValue(timeseries);
  const lastPeriodValueTotal = sum(
    allTimeseries.map((t) => getLastPeriodValue(t))
  );
  return lastPeriodValue / lastPeriodValueTotal;
}

export function getLastPeriodValue(timeseries: Timeseries) {
  if (timeseries.data.length < 1) {
    return 0;
  }

  return timeseries.data[timeseries.data.length - 1].y;
}

export function getTimeseriesTrend(timeseries: Timeseries) {
  if (timeseries.data.length < 2) {
    return 0;
  }

  return (
    timeseries.data[timeseries.data.length - 1].y /
      timeseries.data[timeseries.data.length - 2].y -
    1
  );
}

export function sumTimeseries(timeseriesList: Timeseries[]): Timeseries {
  const result: Timeseries = {
    name: 'All Chains',
    color: '#000000',
    data: [],
  };

  const timestamps = new Set<number>();
  for (const timeseries of timeseriesList) {
    for (const { x } of timeseries.data) {
      timestamps.add(x);
    }
  }

  for (const timestamp of timestamps) {
    let sum = 0;
    for (const timeseries of timeseriesList) {
      const value = timeseries.data.find((d) => d.x === timestamp)?.y;
      if (value) {
        sum += value;
      }
    }
    result.data.push({ x: timestamp, y: sum });
  }

  return result;
}
