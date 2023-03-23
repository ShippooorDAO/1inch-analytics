import { useHighchartsContext } from '@/shared/Highcharts/HighchartsContextProvider';
import { format } from '@/shared/Utils/Format';

export function useChartOptions() {
  const { optionsWithOppositeYAxis, columnChartColors } =
    useHighchartsContext();

  const yAxisOptions = {
    ...optionsWithOppositeYAxis.yAxis,
    labels: {
      // @ts-ignore
      ...optionsWithOppositeYAxis.yAxis!.labels,
      formatter() {
        return format(this.value, { symbol: 'USD', abbreviate: true });
      },
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
        color: columnChartColors[0],
        groupPadding: 0,
        shadow: false,
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
