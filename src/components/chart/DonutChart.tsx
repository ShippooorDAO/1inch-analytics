import { useTheme } from '@emotion/react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { rgba } from 'polished';

import { LoadingWrapper } from '@/components/SkeletonWrapper';
import { createTooltipFormatter } from '@/shared/Highcharts/HighchartsContextProvider';
import { format } from '@/shared/Utils/Format';

import { useChartOptions } from './useChartOptions';

interface UseDonutChartOptionsProps {
  formatter?: (y?: number | null) => string;
}

function useDonutChartOptions({ formatter }: UseDonutChartOptionsProps) {
  const innerFormatter = formatter ?? ((y) => format(y, { symbol: 'USD' }));

  const theme = useTheme();
  const { chartOptions } = useChartOptions();

  const pieColors = (() => {
    const colors = [];
    const base = theme.palette.wardenPurple[300];
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
      backgroundColor: theme.palette.wardenTeal[700],
      borderColor: theme.palette.divider,
      borderRadius: 8,
      borderWidth: 1,
      shadow: true,
      style: {
        fontFamily: theme.typography.fontFamily,
        color: theme.palette.text.primary,
      },
      useHTML: true,
      formatter() {
        const totalY = this.series.data.reduce((acc, curr) => acc + curr.y!, 0);
        return createTooltipFormatter(
          {
            x: this.point.name,
            series: [
              {
                name: this.series.name,
                y: innerFormatter(this.y),
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
        colors: pieColors,
        borderColor: theme.palette.text.secondary,
        borderWidth: 1,
        dataLabels: {
          crop: false,
          enabled: true,
          formatter() {
            return `${this.point.name}: ${innerFormatter(this.y)}`;
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

export interface DonutChartProps {
  seriesName: string;
  yAxisTitle?: string;
  data?: Array<{
    name: string;
    y: number;
    imageUrl?: string;
    color?: string;
  }>;
  formatter?: (y?: number | null) => string;
}

export function DonutChart({ data, seriesName, formatter }: DonutChartProps) {
  const { chartOptions } = useDonutChartOptions({ formatter });

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
      },
    ],
  };

  return (
    <LoadingWrapper width="100%" variant="rounded" loading={!data}>
      <HighchartsReact highcharts={Highcharts} options={options} />
    </LoadingWrapper>
  );
}
