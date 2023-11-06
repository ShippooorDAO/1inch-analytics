import { groupBy, sumBy } from 'lodash';

import {
  Timeseries,
  TimeseriesGranularity,
  TimeseriesOptions,
  TimeWindow,
} from '../Model/Timeseries';

/**
 * Get the exact date corresponding to a given TimeWindow enum value.
 */
export function getTimeWindowStartDate(timeWindow: TimeWindow): Date {
  const startOfToday = new Date();
  startOfToday.setUTCHours(0, 0, 0, 0);

  const startOfWeek = new Date(startOfToday.getTime() - 86400 * 6 * 1000);

  const startOfMonth = new Date(startOfToday.getTime());
  startOfMonth.setUTCMonth(startOfMonth.getUTCMonth() - 1);

  if (startOfMonth.getUTCFullYear() > startOfToday.getUTCFullYear()) {
    startOfMonth.setUTCFullYear(startOfMonth.getUTCFullYear() - 1);
  }

  const startOf3MonthsAgo = new Date(startOfToday.getTime());
  startOf3MonthsAgo.setUTCMonth(startOfMonth.getUTCMonth() - 3);

  if (startOf3MonthsAgo.getUTCFullYear() > startOfToday.getUTCFullYear()) {
    startOf3MonthsAgo.setUTCFullYear(startOf3MonthsAgo.getUTCFullYear() - 1);
  }

  const startOf6MonthsAgo = new Date(startOfToday.getTime());
  startOf6MonthsAgo.setUTCMonth(startOfMonth.getUTCMonth() - 6);

  if (startOf6MonthsAgo.getUTCFullYear() > startOfToday.getUTCFullYear()) {
    startOf6MonthsAgo.setUTCFullYear(startOf6MonthsAgo.getUTCFullYear() - 1);
  }

  const startOfYearAgo = new Date(startOfToday.getTime());
  startOfYearAgo.setUTCFullYear(startOfYearAgo.getUTCFullYear() - 1);

  const startOfYearToDate = new Date(startOfToday.getTime());
  startOfYearToDate.setUTCFullYear(startOfYearToDate.getUTCFullYear(), 0, 1);

  const startOfAllTime = new Date(1000);

  switch (timeWindow) {
    case TimeWindow.ONE_DAY:
      return startOfToday;
    case TimeWindow.SEVEN_DAYS:
      return startOfWeek;
    case TimeWindow.ONE_MONTH:
      return startOfMonth;
    case TimeWindow.THREE_MONTHS:
      return startOf3MonthsAgo;
    case TimeWindow.SIX_MONTHS:
      return startOf6MonthsAgo;
    case TimeWindow.ONE_YEAR:
      return startOfYearAgo;
    case TimeWindow.YEAR_TO_DATE:
      return startOfYearToDate;
    case TimeWindow.MAX:
      return startOfAllTime;
    default:
      return startOfYearToDate;
  }
}

export function getGranularity(timeWindow: TimeWindow): TimeseriesGranularity {
  const hourlyTimewindows = [
    TimeWindow.ONE_DAY,
    TimeWindow.SEVEN_DAYS,
    TimeWindow.ONE_MONTH,
  ];

  if (hourlyTimewindows.includes(timeWindow)) {
    return TimeseriesGranularity.ONE_HOUR;
  }

  return TimeseriesGranularity.ONE_DAY;
}

export function getTimeseriesOptions(
  timeWindow: TimeWindow
): TimeseriesOptions {
  const startDate = getTimeWindowStartDate(timeWindow);
  const startTimestamp = Math.floor(startDate.getTime() / 1000);
  const granularity = getGranularity(timeWindow);
  return {
    startTimestamp,
    endTimestamp: Math.floor(Date.now() / 1000),
    granularity,
  };
}

export function sumTimeseriesList(
  timeseriesList: Timeseries[]
): Timeseries | undefined {
  if (timeseriesList.length < 1) {
    return undefined;
  }

  const data = Object.values(
    groupBy(timeseriesList.map((timeseries) => timeseries.data).flat(), 'x')
  )
    .map((dataPoints) => ({
      x: dataPoints[0].x,
      y: sumBy(dataPoints, 'y'),
    }))
    .sort((a, b) => a.x - b.x);

  const { name } = timeseriesList[0];

  return {
    name,
    data,
  };
}

export function scopeTimeseriesToTimeWindow(
  timeseries: Timeseries,
  timeWindow: TimeWindow
) {
  if (timeWindow === TimeWindow.MAX) {
    return timeseries;
  }

  const startDate = getTimeWindowStartDate(timeWindow);
  const startTimestamp = Math.floor(startDate.getTime() / 1000);

  const data = timeseries.data.filter((dataPoint) => {
    return dataPoint.x >= startTimestamp;
  });

  return {
    ...timeseries,
    data,
  };
}
