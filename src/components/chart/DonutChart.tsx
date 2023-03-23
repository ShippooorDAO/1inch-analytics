import { useTheme } from '@emotion/react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

import { LoadingWrapper } from '@/components/SkeletonWrapper';

import { useChartOptions } from './useChartOptions';

function useDonutChartOptions() {
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
    tooltip: {
      enabled: false,
    },
    plotOptions: {
      pie: {
        size: '100%',
        innerSize: '50%',
        colors: pieColors,
        borderColor: theme.palette.text.secondary,
        borderWidth: 1,
        // @ts-ignore
        dataLabels: {
          enabled: true,
          connectorColor: theme.palette.text.secondary,
          connectorWidth: 1,
          format: '{point.name}: {point.percentage:.1f}%',
          style: {
            fontWeight: 400,
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
  data?: Array<{
    name: string;
    y: number;
    imageUrl?: string;
    color?: string;
  }>;
}

export function DonutChart({ data }: DonutChartProps) {
  const { chartOptions } = useDonutChartOptions();

  const options: Highcharts.Options = {
    ...chartOptions,
    series: [
      {
        type: 'pie',
        name: 'Concentration',
        data: [...(data ?? [])],
      },
    ],
  };

  return (
    <LoadingWrapper width="100%" variant="rounded" loading={!data}>
      <HighchartsReact highcharts={Highcharts} options={options} />
    </LoadingWrapper>
  );
}
