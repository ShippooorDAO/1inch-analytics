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
import { Timeseries, TimeWindow } from '@/shared/Model/Timeseries';
import { format } from '@/shared/Utils/Format';

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
  formatter: (y?: number) => string = (y) => format(y, { symbol: 'USD' })
) {
  const tooltipRows = timeseriesList
    .filter((t) => timeseriesIsSelected(t, selectedTimeseries))
    .map((timeseries) =>
      getTooltipRowForTimeseries(
        xValue,
        timeseries,
        selectedTimeseries,
        formatter
      )
    );

  const totalY = selectedTimeseries.reduce((acc, t) => {
    const data = t.data.find((d) => d.x === xValue);
    return acc + (data?.y || 0);
  }, 0);

  tooltipRows.push({
    y: totalY,
    row: {
      color: 'white',
      name: 'Total (all selected chains)',
      y: formatter(totalY),
    },
  });
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
  formatter: (y?: number) => string
) {
  const totalY = selectedTimeseries.reduce((acc, t) => {
    const data = t.data.find((d) => d.x === x);
    return acc + (data?.y || 0);
  }, 0);

  const data = (() => {
    const index = timeseries.data.findIndex((data) => {
      return data.x >= x;
    });
    if (index === -1) {
      return null;
    }
    return timeseries.data[index];
  })();

  const share = data?.y ? data.y / totalY : 0;

  const point = {
    color: timeseries.color,
    name: timeseries.name,
    y: `${formatter(data?.y)} (${format(share, {
      symbol: '%',
    })})`,
  };

  return {
    y: data?.y,
    row: point,
  };
}

export interface LineChartProps {
  timeseriesList?: Timeseries[];
  timeWindow: TimeWindow;
  timeWindowOptions?: { value: TimeWindow; label: string }[];
  onTimeWindowChange: (timeWindow: TimeWindow) => void;
  formatter?: (y?: number) => string;
}

export function LineChart({
  timeseriesList,
  timeWindow,
  timeWindowOptions,
  onTimeWindowChange,
  formatter,
}: LineChartProps) {
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
      ...selectedTimeseries.map((t) => ({
        type: 'line',
        color: t.color,
        name: t.name,
        data: t.data,
        yAxis: t.yAxis,
        visible: !!timeseriesList?.find((t_) => t.name === t_.name),
        states: {
          inactive: {
            enabled: false,
          },
        },
      }))
    );

    return series;
  }, [loading, selectedTimeseries, timeseriesList]);

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
          theme,
          formatter
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
              margin-top: 10px;
            `}
          >
            {timeWindowOptions && (
              <TimeWindowToggleButtonGroup
                value={timeWindow}
                options={timeWindowOptions}
                onChange={handleTimeWindowChange}
              />
            )}
          </div>
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
