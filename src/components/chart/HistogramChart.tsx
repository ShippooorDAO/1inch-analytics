import { css, Theme, useTheme } from '@emotion/react';
import Highcharts, { YAxisOptions } from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { cloneDeep } from 'lodash';
import { useEffect, useState } from 'react';

import { TimeWindowToggleButtonGroup } from '@/components/chart/TimeWindowToggleButtonGroup';
import { LoadingWrapper } from '@/components/SkeletonWrapper';
import {
  chartDateTooltipFormatter,
  createGradient,
  createTooltipFormatter,
} from '@/shared/Highcharts/HighchartsContextProvider';
import {
  TimeInterval,
  Timeseries,
  TimeWindow,
} from '@/shared/Model/Timeseries';
import { format } from '@/shared/Utils/Format';

import { TimeIntervalToggleButtonGroup } from './TimeIntervalToggleButtonGroup';
import { TimeseriesMultiSelect } from './TimeseriesMultiSelect';
import { useChartOptions } from './useChartOptions';

function timeseriesIsSelected(
  timeseriesList: Timeseries,
  selectedTimeseries: Timeseries[]
) {
  return selectedTimeseries.some((t) => t.name === timeseriesList.name);
}

function getTooltipFormatter(
  xValue: number,
  timeseriesList: Timeseries[],
  selectedTimeseries: Timeseries[],
  theme: Theme,
  formatter: (y?: number) => string = (y) => format(y, { symbol: 'USD' }),
  excludeTotalFromTooltip = false,
  excludeSharesFromTooltip = false
) {
  const tooltipRows = timeseriesList
    .filter((t) => timeseriesIsSelected(t, selectedTimeseries))
    .map((timeseries) =>
      getTooltipRowForTimeseries(
        xValue,
        timeseries,
        selectedTimeseries,
        formatter,
        excludeSharesFromTooltip
      )
    );

  const totalY = selectedTimeseries.reduce((acc, t) => {
    const data = t.data.find((d) => d.x === xValue);
    return acc + (data?.y || 0);
  }, 0);

  if (!excludeTotalFromTooltip) {
    tooltipRows.push({
      y: totalY,
      row: {
        color: 'white',
        name: 'Total',
        y: formatter(totalY),
      },
    });
  }

  tooltipRows.sort((a, b) => {
    return (b.y || 0) - (a.y || 0);
  });

  const x = chartDateTooltipFormatter.format(new Date(Number(xValue) * 1000));
  return createTooltipFormatter(
    { x, series: tooltipRows.map(({ row }) => row) },
    theme
  );
}

function getTooltipRowForTimeseries(
  x: number,
  timeseries: Timeseries,
  selectedTimeseries: Timeseries[],
  formatter: (y?: number) => string,
  excludeSharesFromTooltip = false
) {
  const totalY = selectedTimeseries.reduce((acc, t) => {
    const data = t.data.find((d) => d.x === x);
    return acc + (data?.y || 0);
  }, 0);

  const data = (() => {
    const index = timeseries.data.findIndex((data) => {
      return data.x === x;
    });
    if (index === -1) {
      return null;
    }
    return timeseries.data[index];
  })();

  const share = data?.y ? data.y / totalY : 0;

  const yLabel = excludeSharesFromTooltip
    ? formatter(data?.y)
    : `${formatter(data?.y)} (${format(share, {
        symbol: '%',
      })})`;
  const point = {
    color: timeseries.color,
    name: timeseries.name,
    y: yLabel,
  };

  return {
    y: data?.y,
    row: point,
  };
}

export interface HistogramChartProps {
  timeseriesList: Timeseries[];
  timeseriesOptions?: Timeseries[];
  timeWindow?: TimeWindow;
  timeWindowOptions?: { value: TimeWindow; label: string }[];
  timeInterval?: TimeInterval;
  timeIntervalOptions?: { value: TimeInterval; label: string }[];
  onTimeWindowChange?: (timeWindow: TimeWindow) => void;
  onTimeIntervalChange?: (timeInterval: TimeInterval) => void;
  onTimeseriesChange?: (timeseriesList: Timeseries[]) => void;
  formatter?: (y?: number) => string;
  loading?: boolean;
  yAxisFormatter?: (y?: number) => string;
  excludeTotalFromTooltip?: boolean;
  excludeSharesFromTooltip?: boolean;
}

export function HistogramChart({
  timeseriesList,
  timeseriesOptions,
  timeWindow,
  timeWindowOptions,
  timeInterval,
  timeIntervalOptions,
  onTimeWindowChange,
  onTimeIntervalChange,
  onTimeseriesChange,
  loading,
  formatter,
  yAxisFormatter = (y) => format(y, { symbol: 'USD', abbreviate: true }),
  excludeTotalFromTooltip,
  excludeSharesFromTooltip,
}: HistogramChartProps) {
  const theme = useTheme();
  const { chartOptions } = useChartOptions();

  const series: Highcharts.SeriesOptionsType[] = (() => {
    const series = new Array<Highcharts.SeriesOptionsType>();

    if (loading) {
      return series;
    }

    series.push(
      // @ts-ignore
      ...timeseriesList.map((t) => ({
        id: t.name,
        type: t.type ?? 'area',
        color: t.color,
        fillColor: t.color
          ? createGradient(t.color, 0.2, 0.7, 'up')
          : undefined,
        name: t.name,
        connectNulls: true,
        dashStyle: t.dashStyle,
        yAxis: t.yAxis,
        data: cloneDeep(t.data),
        visible: !!timeseriesList?.find((t_) => t.name === t_.name),
        stack: t.stack ?? 1,
        stacking: 'normal',
        states: {
          inactive: {
            enabled: false,
          },
        },
      }))
    );

    return series;
  })();

  const handleTimeIntervalChange = (e: any, value: any) => {
    if (value) {
      onTimeIntervalChange?.(value);
    }
  };

  const handleTimeWindowChange = (e: any, value: any) => {
    if (value) {
      onTimeWindowChange?.(value);
    }
  };

  let yAxis;

  if (Array.isArray(chartOptions.yAxis)) {
    yAxis = chartOptions.yAxis.map((y: YAxisOptions) => {
      return {
        ...y,
        labels: {
          ...y.labels,
          // @ts-ignore
          formatter() {
            // @ts-ignore
            return yAxisFormatter(this.value);
          },
        },
      };
    });
  } else {
    yAxis = {
      ...chartOptions.yAxis,
      labels: {
        ...chartOptions.yAxis?.labels,
        // @ts-ignore
        formatter() {
          // @ts-ignore
          return yAxisFormatter(this.value);
        },
      },
    };
  }

  const options: Highcharts.Options = {
    ...chartOptions,
    yAxis,
    tooltip: {
      ...chartOptions.tooltip,
      formatter() {
        if (this.x === undefined || typeof this.x !== 'number' || loading) {
          return;
        }

        return getTooltipFormatter(
          this.x,
          timeseriesList,
          timeseriesList,
          theme,
          formatter,
          excludeTotalFromTooltip,
          excludeSharesFromTooltip
        );
      },
      shared: false,
    },
    series,
  };

  return (
    <LoadingWrapper width="100%" variant="rounded" loading={!!loading}>
      <div
        css={css`
          display: flex;
          flex-flow: column;
          gap: 10px;
          width: 100%;
        `}
      >
        <div
          css={css`
            display: flex;
            flex-flow: row;
            justify-content: space-between;
            align-items: center;
            gap: 20px;
          `}
        >
          {timeseriesList &&
            timeseriesList?.length !== 0 &&
            timeseriesOptions &&
            onTimeseriesChange && (
              <TimeseriesMultiSelect
                options={timeseriesOptions ?? []}
                values={timeseriesList}
                onChange={onTimeseriesChange}
                disabled={timeseriesList.length <= 1}
              />
            )}
          {timeIntervalOptions && onTimeIntervalChange && (
            <TimeIntervalToggleButtonGroup
              value={timeInterval}
              onChange={handleTimeIntervalChange}
              options={timeIntervalOptions}
            />
          )}
          {timeWindowOptions && onTimeWindowChange && (
            <TimeWindowToggleButtonGroup
              value={timeWindow}
              options={timeWindowOptions}
              onChange={handleTimeWindowChange}
            />
          )}
        </div>

        <HighchartsReact
          allowChartUpdate={true}
          highcharts={Highcharts}
          options={options}
        />
      </div>
    </LoadingWrapper>
  );
}

export interface ControlledHistogramChartProps
  extends Omit<
    HistogramChartProps,
    'onTimeWindowChange' | 'onTimeIntervalChange' | 'onTimeseriesChange'
  > {}

export function ControlledHistogramChart({
  ...props
}: ControlledHistogramChartProps) {
  const [timeWindow, setTimeWindow] = useState(props.timeWindow);
  const [timeInterval, setTimeInterval] = useState(props.timeInterval);
  const [timeseriesList, setTimeseriesList] = useState(props.timeseriesList);

  useEffect(() => {
    setTimeseriesList(props.timeseriesList);
  }, [props.timeseriesList]);

  return (
    <HistogramChart
      {...props}
      timeWindow={timeWindow}
      timeInterval={timeInterval}
      timeseriesList={timeseriesList}
      onTimeWindowChange={setTimeWindow}
      onTimeIntervalChange={setTimeInterval}
      onTimeseriesChange={setTimeseriesList}
    />
  );
}
