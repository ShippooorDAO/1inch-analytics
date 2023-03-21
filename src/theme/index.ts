import '@mui/lab/themeAugmentation';

import { createTheme as createMuiTheme } from '@mui/material/styles';

import breakpoints from './breakpoints';
import components from './components';
import shadows from './shadows';
import typography from './typography';
import variants from './variants';

const createTheme = (name: string) => {
  const themeConfig =
    variants.find((variant) => variant.name === name) || variants[1];

  return createMuiTheme(
    {
      spacing: 4,
      breakpoints,
      // @ts-ignore
      components,
      typography,
      shadows,
      palette: themeConfig.palette,
    },
    {
      name: themeConfig.name,
      header: themeConfig.header,
      footer: themeConfig.footer,
      sidebar: themeConfig.sidebar,
    }
  );
};

export default createTheme;
