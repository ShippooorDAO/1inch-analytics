import * as muiColors from '@mui/material/colors';
// @ts-ignore
import merge from 'deepmerge';
import { lighten, rgba } from 'polished';

import { THEMES } from '../constants';

const primary = {
  50: '#e4f3ff',
  100: '#bde0ff',
  200: '#93cdff',
  300: '#68b9ff',
  400: '#48a9ff',
  500: '#2f9aff',
  600: '#2f8bf5',
  700: '#2d79e1',
  800: '#2b67cf',
  900: '#2648af ',
};

const complementary = {
  50: '#fef3e2',
  100: '#fcdfb7',
  200: '#facb89',
  300: '#f8b65d',
  400: '#f7a73f',
  500: '#f5992f',
  600: '#f08d2c',
  700: '#ea7f29',
  800: '#e27026',
  900: '#d75a23',
};

const analogousPrimary = {
  50: '#d8fbfc',
  100: '#9bf5f7',
  200: '#2feef5',
  300: '#00e5f1',
  400: '#00dcec',
  500: '#00d4ea',
  600: '#00c3d6',
  700: '#00adbb',
  800: '#0098a1',
  900: '#007472',
};

const analogousSecondary = {
  50: '#eee7fe',
  100: '#d2c4fd',
  200: '#b29dfd',
  300: '#8f74fe',
  400: '#7054fe',
  500: '#4933fc',
  600: '#362ff5',
  700: '#0027ec',
  800: '#0022e7',
  900: '#0014e1',
};

const triadicPrimary = {
  50: '#f2e5fd',
  100: '#dcbefb',
  200: '#c591f9',
  300: '#ad5ff7',
  400: '#992ff5',
  500: '#8300f1',
  600: '#7700eb',
  700: '#6600e3',
  800: '#5500df',
  900: '#3800d1',
};

const triadicSecondary = {
  50: '#fce4ef',
  100: '#f9bad8',
  200: '#f78dbd',
  300: '#f65ca2',
  400: '#f52f8b',
  500: '#f60074',
  600: '#e40071',
  700: '#cd006b',
  800: '#b70067',
  900: '#90005e',
};

export const chartColors = [
  rgba(primary[300], 1),
  rgba(analogousSecondary[300], 1),
  rgba(analogousPrimary[300], 1),
  rgba('#7a5195', 1),
  rgba('#bc5090', 1),
  rgba('#ef5675', 1),
  rgba('#ff764a', 1),
  rgba('#ffa600', 1),
  lighten(0.2, '#7a5195'),
  lighten(0.2, '#bc5090'),
  lighten(0.2, '#ef5675'),
  lighten(0.2, '#ff764a'),
  lighten(0.2, '#ffa600'),
  lighten(0.4, '#7a5195'),
  lighten(0.4, '#bc5090'),
  lighten(0.4, '#ef5675'),
  lighten(0.4, '#ff764a'),
  lighten(0.4, '#ffa600'),
  lighten(0.6, '#7a5195'),
  lighten(0.6, '#bc5090'),
  lighten(0.6, '#ef5675'),
  lighten(0.6, '#ff764a'),
  lighten(0.6, '#ffa600'),
];

const backgrounds = {
  bgMain: '#141924',
  bg2ry: '#10141C',
  bg3ry: '#1E2633',
  bgBody: '#06070A',
};

const borders = {
  borderMain: '#2F3B4D',
  border2ry: '#232C3D',
};

const defaultVariant = {
  name: THEMES.DEFAULT,
  palette: {
    mui: muiColors,
    mode: 'light',
    primary: {
      main: primary[700],
      contrastText: '#FFF',
    },
    secondary: {
      main: primary[500],
      contrastText: '#FFF',
    },
    background: {
      default: '#F7F9FC',
      paper: '#FFF',
    },
    material: {
      primary,
      complementary,
      analogousPrimary,
      analogousSecondary,
      triadicPrimary,
      triadicSecondary,
    },
    chart: chartColors,
  },
  customBackgrounds: {
    primary: backgrounds.bgMain,
    secondary: backgrounds.bg2ry,
    light: backgrounds.bg3ry,
    dark: backgrounds.bgBody,
  },
  borders: {
    primary: borders.borderMain,
    secondary: borders.border2ry,
  },
  header: {
    color: muiColors.grey[500],
    background: '#FFF',
    search: {
      color: muiColors.grey[800],
    },
    indicator: {
      background: primary[600],
    },
  },
  footer: {
    color: muiColors.grey[500],
    background: '#FFF',
  },
  navbar: {
    color: muiColors.grey[200],
    background: backgrounds.bg2ry,
  },
  sidebar: {
    color: muiColors.grey[200],
    background: backgrounds.bgMain,
    header: {
      color: muiColors.grey[200],
      background: backgrounds.bgMain,
      brand: {
        color: backgrounds.bgMain,
      },
    },
    badge: {
      color: '#FFF',
      background: primary[500],
    },
  },
};

const darkVariant = merge(defaultVariant, {
  name: THEMES.DARK,
  navbar: {
    color: muiColors.grey[200],
    background: backgrounds.bg2ry,
  },
  sidebar: {
    color: muiColors.grey[200],
    background: backgrounds.bgMain,
  },
  customBackgrounds: {
    primary: backgrounds.bgMain,
    secondary: backgrounds.bg2ry,
    light: backgrounds.bg3ry,
    dark: backgrounds.bgBody,
  },
  borders: {
    primary: borders.borderMain,
    secondary: borders.border2ry,
  },
  palette: {
    mode: 'dark',
    divider: borders.borderMain,
    primary: {
      main: primary[600],
      contrastText: '#FFF',
    },
    background: {
      default: '#06070A',
      paper: backgrounds.bgMain,
    },
    text: {
      primary: '#FBFBFB',
      secondary: '#6C86AD',
    },
    success: {
      main: '#21C187',
    },
    error: {
      main: '#F04832',
    },
    warning: {
      main: '#FFC700',
    },
  },
  header: {
    color: muiColors.grey[300],
    background: analogousPrimary[900],
    search: {
      color: muiColors.grey[200],
    },
  },
  footer: {
    color: muiColors.grey[300],
    background: analogousPrimary[900],
  },
});

const variants: Array<VariantType> = [defaultVariant, darkVariant];

export default variants;

export type VariantType = {
  name: string;
  palette: {
    primary: MainContrastTextType;
    secondary: MainContrastTextType;
    chart: Array<string>;
  };
  customBackgrounds: {
    primary: string;
    secondary: string;
    light: string;
    dark: string;
  };
  borders: {
    secondary: string;
  };
  header: ColorBgType & {
    search: {
      color: string;
    };
    indicator: {
      background: string;
    };
  };
  footer: ColorBgType;
  navbar: ColorBgType;
  sidebar: ColorBgType & {
    header: ColorBgType & {
      brand: {
        color: string;
      };
    };
    badge: ColorBgType;
  };
};

type MainContrastTextType = {
  main: string;
  contrastText: string;
};
type ColorBgType = {
  color: string;
  background: string;
};
