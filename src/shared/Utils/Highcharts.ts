import Highcharts from 'highcharts';

export function getHighcharts() {
  if (typeof Highcharts !== 'object') {
    return null;
  }
  return Highcharts;
}
export const getColorPalette = ({
  baseColor = '#155e5e',
  size,
}: {
  baseColor?: Highcharts.ColorType;
  size: number;
}) => {
  const highcharts = getHighcharts();
  if (!highcharts) {
    return [];
  }
  const colorPalette: Array<string> = [];

  for (let i = 0; i < size; i += 1) {
    colorPalette.push(
      Highcharts.color(baseColor)
        .brighten(i / (size + 1))
        .get('rgb')
        .toString()
    );
  }

  return colorPalette;
};

export const Theme: Highcharts.Options = {
  chart: {
    backgroundColor: {
      stops: [
        [0, 'rgb(255, 255, 255)'],
        [1, 'rgb(240, 240, 255)'],
      ],
    },
  },
};

export const Options: Highcharts.Options = {
  credits: {
    enabled: false,
  },
};
