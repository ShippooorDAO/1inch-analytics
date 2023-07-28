import { useTheme } from '@emotion/react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { rgba } from 'polished';

import { LoadingWrapper } from '@/components/SkeletonWrapper';
import { createTooltipFormatter } from '@/contexts/Highcharts/HighchartsContextProvider';
import { format } from '@/shared/Utils/Format';

import { useChartOptions } from './useChartOptions';

interface UseBarChartOptionsProps {
  tooltipFormatter?: (y?: number | null) => string;
  labelFormatter?: (y?: number | null) => string;
}

function useBarChartOptions({
  tooltipFormatter,
  labelFormatter,
}: UseBarChartOptionsProps) {
  const innerTooltipFormatter =
    tooltipFormatter ?? ((y) => format(y, { symbol: 'USD' }));
  const innerLabelFormatter =
    labelFormatter ?? ((y) => format(y, { symbol: 'USD', abbreviate: true }));

  const theme = useTheme();
  const { chartOptions } = useChartOptions();

  const options: Highcharts.Options = {
    ...chartOptions,
    chart: {
      type: 'bar',
      ...chartOptions.chart,
    },
    yAxis: {
      ...chartOptions.yAxis,
      labels: {
        // @ts-ignore
        ...chartOptions.yAxis?.labels,
        enabled: false,
      },
      title: {
        // @ts-ignore
        ...chartOptions.yAxis?.title,
        text: 'Volume (USD)',
        style: {
          color: theme.palette.text.secondary,
        },
      },
      gridLineWidth: 1,
      gridLineDashStyle: 'Dash',
      gridLineColor: rgba(theme.palette.text.primary, 0.1),
    },
    xAxis: {
      ...chartOptions.xAxis,
      visible: false,
    },
    tooltip: {
      ...chartOptions.tooltip,
      formatter() {
        const totalY = this.series.data.reduce((acc, curr) => acc + curr.y!, 0);
        return createTooltipFormatter(
          {
            x: this.point.name,
            series: [
              {
                color: this.point.color as string,
                name: this.series.name,
                y: innerTooltipFormatter(this.y),
              },
              {
                name: 'Share',
                y: format(this.y! / totalY, { symbol: '%' }),
              },
            ],
          },
          theme
        );
      },
    },
    plotOptions: {
      bar: {
        ...chartOptions.plotOptions?.bar,
        dataLabels: {
          ...chartOptions.plotOptions?.bar?.dataLabels,
          crop: false,
          enabled: true,
          style: {
            fontFamily: theme.typography.fontFamily,
            fontSize: theme.typography.body1.fontSize,
            color: theme.palette.text.primary,
          },
          formatter() {
            return `${this.point.name}: ${innerLabelFormatter(this.y)}`;
          },
        },
      },
    },
  };

  return { chartOptions: options };
}

export interface BarChartProps {
  seriesName: string;
  yAxisTitle?: string;
  data?: Array<{
    name: string;
    y: number;
    imageUrl?: string;
    color?: string;
  }>;
  tooltipFormatter?: (y?: number | null) => string;
  labelFormatter?: (y?: number | null) => string;
}

export function BarChart({
  data,
  seriesName,
  tooltipFormatter,
  labelFormatter,
}: BarChartProps) {
  const { chartOptions } = useBarChartOptions({
    tooltipFormatter,
    labelFormatter,
  });

  const sortedData = [...(data ?? [])];
  sortedData.sort((a, b) => b.y - a.y);

  const options: Highcharts.Options = {
    ...chartOptions,
    yAxis: {
      ...chartOptions.yAxis,
      title: {
        // @ts-ignore
        ...chartOptions.yAxis?.title,
        text: seriesName,
      },
    },
    series: [
      {
        type: 'bar',
        name: seriesName,
        data: sortedData,
        stacking: 'normal',
        stack: 1,
      },
    ],
  };

  return (
    <LoadingWrapper width="100%" variant="rounded" loading={!data}>
      <HighchartsReact
        highcharts={Highcharts}
        options={options}
        allowChartUpdate={true}
      />
    </LoadingWrapper>
  );
}
