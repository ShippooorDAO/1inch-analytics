import Highcharts from 'highcharts';

export interface HighchartsContextProviderState {
  colors: string[];
  specialColors: { error: string[] };
  areaChartColors: Highcharts.GradientColorObject[];
  areaChartSpecialColors: { error: Highcharts.GradientColorObject[] };
  columnChartColors: Highcharts.GradientColorObject[];
  columnChartSpecialColors: { error: Highcharts.GradientColorObject[] };
  options: Highcharts.Options;
  optionsWithOppositeYAxis: Highcharts.Options;
}
