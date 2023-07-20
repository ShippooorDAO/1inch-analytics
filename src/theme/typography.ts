import { TypographyOptions } from '@mui/material/styles/createTypography';

const typography: TypographyOptions = {
  fontFamily: ['Roboto', 'serif'].join(','),
  fontSize: 16,
  fontWeightLight: 300,
  fontWeightRegular: 400,
  fontWeightMedium: 500,
  fontWeightBold: 600,
  h1: {
    fontSize: '2rem',
    fontWeight: 600,
    lineHeight: 1.25,
    color: '#6C86AD',
  },
  h2: {
    fontSize: '1.75rem',
    fontWeight: 600,
    lineHeight: 1.25,
    color: '#6C86AD',
  },
  h3: {
    fontSize: '1.2rem',
    fontWeight: 600,
    lineHeight: 1.25,
    color: '#6C86AD',
  },
  h4: {
    fontSize: '1.125rem',
    fontWeight: 500,
    lineHeight: 1.25,
    color: '#6C86AD',
  },
  h5: {
    fontSize: '1.0625rem',
    fontWeight: 500,
    lineHeight: 1.25,
    color: '#6C86AD',
  },
  h6: {
    fontSize: '1rem',
    fontWeight: 500,
    lineHeight: 1.25,
    color: '#6C86AD',
  },
  body1: {
    fontSize: 13,
  },
  button: {
    textTransform: 'none',
  },
};

export default typography;
