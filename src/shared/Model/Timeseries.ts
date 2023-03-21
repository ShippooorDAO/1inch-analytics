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
}

export enum TimeWindow {
  ONE_DAY = 1,
  SEVEN_DAYS = 2,
  ONE_MONTH = 3,
  THREE_MONTHS = 4,
  ONE_YEAR = 5,
  YEAR_TO_DAY = 6,
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
