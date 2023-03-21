import * as muiColors from '@mui/material/colors';
// @ts-ignore
import merge from 'deepmerge';

import { THEMES } from '../constants';

const customBlue = {
  50: '#e9f0fb',
  100: '#c8daf4',
  200: '#a3c1ed',
  300: '#7ea8e5',
  400: '#6395e0',
  500: '#4782da',
  600: '#407ad6',
  700: '#376fd0',
  800: '#2f65cb',
  900: '#2052c2 ',
};

const wardenTeal = {
  50: '#e3e7ea',
  100: '#bac3cb',
  200: '#8c9ba9',
  300: '#5d7386',
  400: '#3b556c',
  500: '#183752',
  600: '#15314b',
  700: '#112a41',
  800: '#0e2338',
  900: '#081628',
  950: '#050e1a',
};

const wardenBackgroundDark = {};

const wardenPurple = {
  50: '#e6ecfb',
  100: '#c1cff5',
  200: '#98b0ef',
  300: '#6f90e9',
  400: '#5078e4',
  500: '#3160df',
  600: '#2c58db',
  700: '#254ed7',
  800: '#1f44d2',
  900: '#1333ca',
};

const wardenWhite = '#fffffb';

const defaultVariant = {
  name: THEMES.DEFAULT,
  palette: {
    mui: muiColors,
    mode: 'light',
    primary: {
      main: customBlue[700],
      contrastText: '#FFF',
    },
    secondary: {
      main: customBlue[500],
      contrastText: '#FFF',
    },
    background: {
      default: '#F7F9FC',
      paper: '#FFF',
    },
    wardenPurple,
    wardenTeal,
  },
  header: {
    color: muiColors.grey[500],
    background: '#FFF',
    search: {
      color: muiColors.grey[800],
    },
    indicator: {
      background: customBlue[600],
    },
  },
  footer: {
    color: muiColors.grey[500],
    background: '#FFF',
  },
  sidebar: {
    color: muiColors.grey[200],
    background: wardenTeal[500],
    header: {
      color: muiColors.grey[200],
      background: wardenTeal[500],
      brand: {
        color: wardenTeal[500],
      },
    },
    footer: {
      color: muiColors.grey[200],
      background: '#1E2A38',
      online: {
        background: muiColors.green[500],
      },
    },
    badge: {
      color: '#FFF',
      background: customBlue[500],
    },
  },
};

const darkVariant = merge(defaultVariant, {
  name: THEMES.DARK,
  sidebar: {
    color: muiColors.grey[200],
    background: wardenTeal[900],
  },
  palette: {
    mode: 'dark',
    primary: {
      main: customBlue[600],
      contrastText: '#FFF',
    },
    background: {
      default: '#06070A',
      paper: '#131823',
    },
    text: {
      primary: '#FBFBFB',
      secondary: '#6C86AD',
    },
  },
  header: {
    color: muiColors.grey[300],
    background: wardenTeal[950],
    search: {
      color: muiColors.grey[200],
    },
  },
  footer: {
    color: muiColors.grey[300],
    background: wardenTeal[950],
  },
});

const variants: Array<VariantType> = [defaultVariant, darkVariant];

export default variants;

export type VariantType = {
  name: string;
  palette: {
    primary: MainContrastTextType;
    secondary: MainContrastTextType;
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
  sidebar: ColorBgType & {
    header: ColorBgType & {
      brand: {
        color: string;
      };
    };
    footer: ColorBgType & {
      online: {
        background: string;
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
