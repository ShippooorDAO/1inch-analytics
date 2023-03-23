import { css, Theme, useTheme } from '@emotion/react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { useEffect, useMemo, useRef, useState } from 'react';

import { TimeWindowToggleButtonGroup } from '@/components/chart/TimeWindowToggleButtonGroup';
import { LoadingWrapper } from '@/components/SkeletonWrapper';
import {
  chartDateTooltipFormatter,
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
  theme: Theme
) {
  const tooltipRows = timeseriesList
    .filter((t) => timeseriesIsSelected(t, selectedTimeseries))
    .map((timeseries) => getTooltipRowForTimeseries(xValue, timeseries));

  tooltipRows.sort((a, b) => {
    return (b.y || 0) - (a.y || 0);
  });

  const x = chartDateTooltipFormatter.format(new Date(Number(xValue) * 1000));
  return createTooltipFormatter(
    { x, series: tooltipRows.map(({ row }) => row) },
    theme
  );
}

function getTooltipRowForTimeseries(x: number, timeseries: Timeseries) {
  const data = (() => {
    const index = timeseries.data.findIndex((data) => {
      return data.x > x;
    });
    if (index === -1 || index === 0) {
      return null;
    }
    return timeseries.data[index - 1];
  })();

  const point = {
    color: timeseries.color,
    name: timeseries.name,
    y: format(data?.y, { symbol: 'USD' }),
  };

  return {
    y: data?.y,
    row: point,
  };
}

export interface HistogramChartProps {
  timeseriesList?: Timeseries[];
  timeWindow: TimeWindow;
  timeInterval: TimeInterval;
  onTimeWindowChange: (timeWindow: TimeWindow) => void;
  onTimeIntervalChange: (timeInterval: TimeInterval) => void;
}

export function HistogramChart({
  timeseriesList,
  timeWindow,
  timeInterval,
  onTimeWindowChange,
  onTimeIntervalChange,
}: HistogramChartProps) {
  const theme = useTheme();
  const { chartOptions } = useChartOptions();

  const [selectedTimeseries, setSelectedTimeseries] = useState<Timeseries[]>(
    []
  );

  const initialized = useRef<boolean>(false);

  const loading = !timeseriesList;

  useEffect(() => {
    if (loading || initialized.current) {
      return;
    }

    setSelectedTimeseries(timeseriesList);
  }, [loading, timeseriesList]);

  const series: Highcharts.SeriesOptionsType[] = useMemo(() => {
    const series = new Array<Highcharts.SeriesOptionsType>();

    if (loading) {
      return series;
    }

    series.push(
      // @ts-ignore
      ...timeseriesList.map((t) => ({
        type: 'column',
        color: t.color,
        name: t.name,
        data: t.data,
        visible: !!timeseriesList?.find((t_) => t.name === t_.name),
        stack: 1,
        stacking: 'normal',
        states: {
          inactive: {
            enabled: false,
          },
        },
      }))
    );

    return series;
  }, [loading, selectedTimeseries, timeseriesList]);

  const handleTimeIntervalChange = (e: any, value: any) => {
    if (e) {
      onTimeIntervalChange(value);
    }
  };

  const handleTimeWindowChange = (e: any, value: any) => {
    if (value) {
      onTimeWindowChange(value);
    }
  };

  const options: Highcharts.Options = {
    ...chartOptions,
    tooltip: {
      ...chartOptions.tooltip,
      formatter() {
        if (this.x === undefined || typeof this.x !== 'number' || loading) {
          return;
        }

        return getTooltipFormatter(
          this.x,
          selectedTimeseries,
          timeseriesList,
          theme
        );
      },
      shared: false,
    },
    series,
  };

  return (
    <LoadingWrapper width="100%" variant="rounded" loading={loading}>
      <div
        css={css`
          display: flex;
          flex-flow: column;
          gap: 10px;
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
          <TimeseriesMultiSelect
            options={timeseriesList ?? []}
            values={selectedTimeseries}
            onChange={setSelectedTimeseries}
          />
          <div
            css={css`
              display: flex;
              gap: 20px;
            `}
          >
            <TimeIntervalToggleButtonGroup
              value={timeInterval}
              onChange={handleTimeIntervalChange}
            />
            <TimeWindowToggleButtonGroup
              value={timeWindow}
              onChange={handleTimeWindowChange}
            />
          </div>
        </div>
        <HighchartsReact highcharts={Highcharts} options={options} />
      </div>
    </LoadingWrapper>
  );
}
