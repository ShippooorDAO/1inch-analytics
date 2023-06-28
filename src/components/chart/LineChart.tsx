import { css } from '@emotion/react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { useMemo } from 'react';

import { TimeWindowToggleButtonGroup } from '@/components/chart/TimeWindowToggleButtonGroup';
import { LoadingWrapper } from '@/components/SkeletonWrapper';
import {
  createGradient,
  useHighchartsContext,
} from '@/shared/Highcharts/HighchartsContextProvider';
import { Timeseries, TimeWindow } from '@/shared/Model/Timeseries';

import { TimeseriesMultiSelect } from './TimeseriesMultiSelect';
import { useChartOptions } from './useChartOptions';

export interface LineChartProps {
  loading: boolean;
  timeseriesList?: Timeseries[];
  selectedTimeseriesList?: Timeseries[];
  timeWindow: TimeWindow;
  timeWindowOptions?: { value: TimeWindow; label: string }[];
  onTimeWindowChange: (timeWindow: TimeWindow) => void;
  onSelectedTimeseriesChange: (timeseriesList: Timeseries[]) => void;
}

export function LineChart({
  loading,
  timeseriesList,
  selectedTimeseriesList,
  timeWindow,
  timeWindowOptions,
  onTimeWindowChange,
  onSelectedTimeseriesChange,
}: LineChartProps) {
  const { colors } = useHighchartsContext();
  const { chartOptions } = useChartOptions();

  const series: Highcharts.SeriesOptionsType[] = useMemo(() => {
    const series = new Array<Highcharts.SeriesOptionsType>();

    if (loading) {
      return series;
    }

    series.push(
      // @ts-ignore
      ...(selectedTimeseriesList ?? []).map((t, i) => ({
        type: 'area',
        color: t.color ?? colors[i],
        fillColor:
          t.color ?? colors[i]
            ? createGradient(t.color ?? colors[i], 0.2, 0.7, 'up')
            : undefined,
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
  }, [selectedTimeseriesList, timeseriesList]);

  const handleTimeWindowChange = (e: any, value: any) => {
    if (value) {
      onTimeWindowChange(value);
    }
  };

  const options: Highcharts.Options = {
    ...chartOptions,
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
          {timeseriesList && selectedTimeseriesList && (
            <TimeseriesMultiSelect
              disabled={timeseriesList.length === 1}
              options={timeseriesList ?? []}
              values={selectedTimeseriesList ?? []}
              onChange={onSelectedTimeseriesChange}
            />
          )}
          <div
            css={css`
              display: flex;
              gap: 20px;
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
