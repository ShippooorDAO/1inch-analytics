import { useTheme } from '@emotion/react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { rgba } from 'polished';

import { LoadingWrapper } from '@/components/SkeletonWrapper';
import { createTooltipFormatter } from '@/contexts/Highcharts/HighchartsContextProvider';
import { format } from '@/shared/Utils/Format';

import { useChartOptions } from './useChartOptions';

interface UseDonutOptionsProps {
  tooltipFormatter?: (y?: number | null) => string;
  labelFormatter?: (y?: number | null) => string;
}

function useDonutOptions({
  tooltipFormatter,
  labelFormatter,
}: UseDonutOptionsProps) {
  const innerTooltipFormatter =
    tooltipFormatter ?? ((y) => format(y, { symbol: 'USD' }));
  const innerLabelFormatter =
    labelFormatter ?? ((y) => format(y, { symbol: 'USD', abbreviate: true }));

  const theme = useTheme();
  const { chartOptions } = useChartOptions();

  const pieColors = (() => {
    const colors = [];
    const base = theme.palette.material.analogousSecondary[300];
    let i;
    if (typeof Highcharts === 'object') {
      for (i = 0; i < 10; i += 1) {
        // Start out with a darkened base color (negative brighten), and end
        // up with a much brighter color
        colors.push(
          Highcharts.color(base)
            .brighten((i - 3) / 7)
            .get()
        );
      }
    }
    return colors;
  })();

  const options: Highcharts.Options = {
    ...chartOptions,
    chart: {
      type: 'pie',
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
      pie: {
        colors: pieColors,
        borderColor: theme.palette.text.secondary,
        borderWidth: 1,
        innerSize: '60%',
        showInLegend: true,
        dataLabels: {
          crop: false,
          enabled: true,
          formatter() {
            return `${this.point.name}: ${innerLabelFormatter(this.y)}`;
          },
          style: {
            fontFamily: theme.typography.fontFamily,
            fontSize: theme.typography.body1.fontSize,
            color: theme.palette.text.primary,
          },
        },
      },
    },
  };

  return { chartOptions: options };
}

export interface DonutProps {
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

export function DonutChart({
  data,
  seriesName,
  tooltipFormatter,
  labelFormatter,
}: DonutProps) {
  const { chartOptions } = useDonutOptions({
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
        type: 'pie',
        name: seriesName,
        data: sortedData,
      },
    ],
  };

  return (
    <LoadingWrapper width="100%" variant="rounded" loading={!data}>
      <HighchartsReact
        allowChartUpdate={true}
        highcharts={Highcharts}
        options={options}
      />
    </LoadingWrapper>
  );
}
