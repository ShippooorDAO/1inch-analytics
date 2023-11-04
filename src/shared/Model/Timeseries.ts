export interface DataPoint {
  x: number;
  y: number;
}

export interface Timeseries {
  name: string;
  data: DataPoint[];
  imageUrl?: string;
  color?: string;
  dashStyle?: Highcharts.DashStyleValue;
  yAxis?: string | number;
  visible?: boolean;
  type?: 'bar' | 'area' | 'line' | 'areaspline' | 'spline';
  stack?: number;
}

export enum TimeWindow {
  ONE_DAY = 1,
  SEVEN_DAYS = 2,
  ONE_MONTH = 3,
  THREE_MONTHS = 4,
  SIX_MONTHS = 5,
  ONE_YEAR = 6,
  YEAR_TO_DATE = 7,
  MAX = 8,
}

export function getTimeWindowLabel(timeWindow: TimeWindow) {
  switch (timeWindow) {
    case TimeWindow.ONE_DAY:
      return '1D';
    case TimeWindow.SEVEN_DAYS:
      return '7D';
    case TimeWindow.ONE_MONTH:
      return '1M';
    case TimeWindow.THREE_MONTHS:
      return '3M';
    case TimeWindow.SIX_MONTHS:
      return '6M';
    case TimeWindow.ONE_YEAR:
      return '1Y';
    case TimeWindow.YEAR_TO_DATE:
      return 'YTD';
    case TimeWindow.MAX:
    default:
      return 'All time';
  }
}

export function getTimeIntervalLabel(timeInterval: TimeInterval) {
  switch (timeInterval) {
    case TimeInterval.DAILY:
      return 'Daily';
    case TimeInterval.WEEKLY:
      return 'Weekly';
    case TimeInterval.MONTHLY:
      return 'Monthly';
    case TimeInterval.QUARTERLY:
      return 'Quarterly';
    case TimeInterval.YEARLY:
      return 'Yearly';
    default:
      return '';
  }
}

export enum TimeInterval {
  DAILY = 1,
  WEEKLY = 2,
  MONTHLY = 3,
  QUARTERLY = 4,
  YEARLY = 5,
}

export interface TimeseriesOptions {
  startTimestamp?: number;
  endTimestamp?: number;
  granularity?: TimeseriesGranularity;
  format?: TimeseriesCurrency;
}

export enum TimeseriesGranularity {
  ONE_HOUR = 'ONE_HOUR',
  ONE_DAY = 'ONE_DAY',
}

export enum TimeseriesCurrency {
  PERCENT = 'PERCENT',
  USD = 'VALUE',
  DECIMAL = 'DECIMAL',
}
