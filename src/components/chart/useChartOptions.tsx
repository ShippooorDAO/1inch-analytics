import { useTheme } from '@emotion/react';
import Highcharts from 'highcharts';

import { useHighchartsContext } from '@/contexts/Highcharts/HighchartsContextProvider';
import { format } from '@/shared/Utils/Format';

export function useChartOptions() {
  const theme = useTheme();
  const { optionsWithOppositeYAxis, columnChartColors } =
    useHighchartsContext();

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

  const yAxisOptions = {
    ...optionsWithOppositeYAxis.yAxis,
    labels: {
      // @ts-ignore
      ...optionsWithOppositeYAxis.yAxis!.labels,
      y: 0,
      x: -10,
    },
    lineWidth: 0,
    tickLength: 0,
  };

  const chartOptions: Highcharts.Options = {
    ...optionsWithOppositeYAxis,
    chart: {
      ...optionsWithOppositeYAxis.chart,
      margin: undefined,
    },
    plotOptions: {
      ...optionsWithOppositeYAxis.plotOptions,
      column: {
        ...optionsWithOppositeYAxis.plotOptions?.column,
        pointPadding: 0,
        borderWidth: 0,
        borderRadius: 4,
        color: columnChartColors[0],
        shadow: false,
      },
      bar: {
        ...optionsWithOppositeYAxis.plotOptions?.bar,
        colors: pieColors,
        borderColor: theme.palette.text.secondary,
        borderWidth: 0,
        borderRadius: 4,
      },
    },
    yAxis: [{ ...yAxisOptions }, { ...yAxisOptions }, { ...yAxisOptions }],
    xAxis: {
      ...optionsWithOppositeYAxis.xAxis,
      labels: {
        // @ts-ignore
        ...optionsWithOppositeYAxis.xAxis!.labels,
        x: 0,
      },
      gridLineWidth: 0,
      lineWidth: 0,
      tickLength: 5,
      offset: 0,
    },
  };

  return {
    chartOptions,
  };
}
