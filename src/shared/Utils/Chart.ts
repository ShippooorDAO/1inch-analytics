import { groupBy, sumBy } from 'lodash';
import moment from 'moment';

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
  const startOfToday = moment().startOf('day').toDate();
  const startOfYear = moment(startOfToday).startOf('year').toDate();

  switch (timeWindow) {
    case TimeWindow.ONE_DAY:
      return startOfToday;
    case TimeWindow.SEVEN_DAYS:
      return moment().startOf('week').toDate();
    case TimeWindow.ONE_MONTH:
      return moment(startOfToday).subtract(1, 'months').toDate();
    case TimeWindow.THREE_MONTHS:
      return moment(startOfToday).subtract(3, 'months').toDate();
    case TimeWindow.ONE_YEAR:
      return moment(startOfToday).subtract(1, 'years').toDate();
    case TimeWindow.YEAR_TO_DATE:
      return startOfYear;
    case TimeWindow.MAX:
      return new Date(0);
    default:
      return startOfYear;
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
