import * as emotionCss from '@emotion/css';
import { Theme, useTheme } from '@emotion/react';
import Highcharts from 'highcharts';
import { lighten, rgba } from 'polished';
import { createContext, FC, ReactNode, useContext } from 'react';

import { format } from '@/shared/Utils/Format';

import { HighchartsContextProviderState } from './Highcharts.type';

export interface TooltipProps {
  x: string;
  series: {
    name: string;
    y: string;
    color?: string;
  }[];
}

export function createTooltipFormatter(
  { x, series }: TooltipProps,
  theme: Theme
) {
  return `
    <div class="${emotionCss.css`
        display: flex;
        flex-flow: column;
        gap: 10px;
        text-align: left;
        padding: 5px;
        font-size: ${theme.typography.body1.fontSize};
      `}">
      <div class="${emotionCss.css`
          display: flex;
          flex-flow: row;
          justify-content: space-between;
          gap: 20px;`}">
        <div class="${emotionCss.css`
          color: ${theme.palette.text.secondary};
        `}">
          ${x}
        </div> 
      </div>${series
        .map(
          ({ name, y, color }) => `<div class="${emotionCss.css`
          display: flex;
          flex-flow: row;
          justify-content: space-between;
          gap: 20px;
      `}">
        <div class=${emotionCss.css`
        `}>
          <div class="${emotionCss.css`display: flex; flex-flow: row; justify-content: flex-start; align-items: center; gap: 5px;`}">
            ${
              color
                ? `<span class="${emotionCss.css`
              height: 12px;
              width: 12px;
              background-color: ${color};
              border-radius: 50%;`}">
            </span>`
                : ''
            }
            ${name}
          </div>
        </div>
        <div class="${emotionCss.css`
          font-weight: 500;
        `}"> 
          ${y}
        </div>
      </div>`
        )
        .join('')}</div>`;
}

export function createGradient(
  color: string,
  minOpacity = 0.2,
  maxOpacity = 0.6,
  direction: 'up' | 'down' = 'up'
): Highcharts.GradientColorObject {
  if (direction === 'down') {
    return {
      linearGradient: { x1: 0, x2: 0, y1: 0, y2: 1 },
      stops: [
        [0, rgba(color, minOpacity)],
        [1, rgba(color, maxOpacity)],
      ],
    };
  }
  return {
    linearGradient: { x1: 0, x2: 0, y1: 0, y2: 1 },
    stops: [
      [0, rgba(color, maxOpacity)],
      [1, rgba(color, minOpacity)],
    ],
  };
}

const missingProviderError =
  'You forgot to wrap your code in a provider <HighchartsContextProvider>';

const HighchartsContext = createContext<HighchartsContextProviderState>({
  get colors(): never {
    throw new Error(missingProviderError);
  },
  get specialColors(): never {
    throw new Error(missingProviderError);
  },
  get areaChartColors(): never {
    throw new Error(missingProviderError);
  },
  get areaChartSpecialColors(): never {
    throw new Error(missingProviderError);
  },
  get columnChartColors(): never {
    throw new Error(missingProviderError);
  },
  get columnChartSpecialColors(): never {
    throw new Error(missingProviderError);
  },
  get options(): never {
    throw new Error(missingProviderError);
  },
  get optionsWithOppositeYAxis(): never {
    throw new Error(missingProviderError);
  },
});

interface HighchartsContextProviderProps {
  address?: string;
  protocolName?: string;
  children?: ReactNode;
}

export const chartDateTooltipFormatter = new Intl.DateTimeFormat(undefined, {
  month: 'short',
  day: 'numeric',
  hour: 'numeric',
  minute: 'numeric',
  year: 'numeric',
});

export const chartDateFormatter = new Intl.DateTimeFormat(undefined, {
  month: 'short',
  day: 'numeric',
  year: '2-digit',
});

export const useHighchartsContext = () =>
  useContext<HighchartsContextProviderState>(HighchartsContext);

export const HighchartsContextProvider: FC<HighchartsContextProviderProps> = ({
  children,
}: HighchartsContextProviderProps) => {
  const theme = useTheme();
  const axisColor = rgba(theme.palette.text.primary, 0.2);

  const colors = theme.palette.chart as string[];
  const specialColors = {
    error: [theme.palette.error.main],
  };

  const areaChartColors: Highcharts.GradientColorObject[] = colors.map(
    (color: string) => createGradient(color, 0.4, 0.6, 'up')
  );

  const areaChartSpecialColors: { error: Highcharts.GradientColorObject[] } = {
    error: specialColors.error.map((color) =>
      createGradient(color, 0.4, 0.6, 'up')
    ),
  };

  const columnChartColors: Highcharts.GradientColorObject[] = colors.map(
    (color: string) => createGradient(color, 1, 1)
  );

  const columnChartSpecialColors: { error: Highcharts.GradientColorObject[] } =
    {
      error: specialColors.error.map((color) =>
        createGradient(color, 0.1, 0.4, 'down')
      ),
    };

  const options: Highcharts.Options = {
    title: {
      text: '',
      style: {
        fontFamily: theme.typography.fontFamily,
        color: theme.palette.text.primary,
      },
    },
    colors,
    plotOptions: {
      series: {
        marker: {
          enabled: false,
        },
        dataLabels: {
          style: {
            fontFamily: theme.typography.fontFamily,
            color: theme.palette.text.primary,
          },
        },
      },
      area: {
        lineColor: theme.palette.material.analogousPrimary[200],
        lineWidth: 2,
        fillColor: areaChartColors[0],
        color: areaChartColors[0],
        negativeColor: areaChartSpecialColors.error[0],
      },
    },
    tooltip: {
      backgroundColor: lighten(0.1, theme.palette.background.paper),
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
        return createTooltipFormatter(
          {
            x: chartDateTooltipFormatter.format(
              new Date(Number(this.x) * 1000)
            ),
            series: [
              {
                name: this.series.name,
                y: format(this.y, { symbol: 'USD' }),
                // color: this.series.color?.toString(),
              },
            ],
          },
          theme
        );
      },
    },
    xAxis: {
      gridLineWidth: 1,
      gridLineDashStyle: 'Dash',
      gridLineColor: rgba(theme.palette.text.primary, 0.1),
      tickColor: rgba(theme.palette.text.primary, 0.1),
      tickWidth: 1,
      tickLength: 30,
      lineWidth: 1,
      lineColor: rgba(theme.palette.text.primary, 0.1),
      labels: {
        enabled: true,
        style: {
          fontFamily: theme.typography.fontFamily,
          color: theme.palette.text.primary,
        },
        x: 22,
        formatter() {
          return chartDateFormatter.format(new Date(Number(this.value) * 1000));
        },
      },
      title: {
        style: {
          fontFamily: theme.typography.fontFamily,
          color: theme.palette.text.primary,
        },
      },
    },
    yAxis: {
      lineWidth: 1,
      tickWidth: 1,
      opposite: true,
      gridLineWidth: 1,
      gridLineDashStyle: 'Dash',
      gridLineColor: rgba(theme.palette.text.primary, 0.1),
      tickColor: rgba(theme.palette.text.primary, 0.1),
      lineColor: rgba(theme.palette.text.primary, 0.1),
      tickLength: 65,
      tickPosition: 'outside',
      labels: {
        overflow: 'allow',
        formatter() {
          return format(this.value, { abbreviate: true });
        },
        style: {
          fontFamily: theme.typography.fontFamily,
          color: theme.palette.text.primary,
          whiteSpace: 'nowrap',
          textOverflow: 'none',
        },
        y: -5,
        x: 5,
        align: 'left',
      },
      title: {
        text: null,
      },
    },
    chart: {
      backgroundColor: 'transparent',
      style: {
        fontFamily: theme.typography.fontFamily,
        color: theme.palette.text.primary,
      },
      margin: [30, 55, 30, 0],
    },
    legend: {
      enabled: false,
    },
    credits: {
      enabled: false,
    },
  };

  const optionsWithOppositeYAxis: Highcharts.Options = {
    ...options,
    yAxis: {
      ...options.yAxis,
      opposite: false,
      labels: {
        // @ts-ignore
        ...options.yAxis.labels,
        align: 'right',
        x: -5,
      },
    },
    chart: {
      ...options.chart,
      // @ts-ignore
      margin: [30, 0, 30, 55],
    },
  };

  return (
    <HighchartsContext.Provider
      value={{
        options,
        optionsWithOppositeYAxis,
        colors,
        specialColors,
        areaChartColors,
        areaChartSpecialColors,
        columnChartColors,
        columnChartSpecialColors,
      }}
    >
      {children}
    </HighchartsContext.Provider>
  );
};
