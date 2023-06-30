import typography from './typography';

const components = {
  MuiButtonBase: {
    defaultProps: {
      disableRipple: true,
    },
  },
  MuiButton: {
    styleOverrides: {
      root: {
        borderRadius: '10px',
      },
    },
  },
  MuiTextField: {
    styleOverrides: {
      root: {
        width: '150px',
        [`& label`]: {
          top: '-4px',
        },
        [`& input`]: {
          ...typography.body1,
          padding: '11px 14px',
          textAlign: 'center',
        },
      },
    },
  },
  MuiOutlinedInput: {
    styleOverrides: {
      root: {
        borderRadius: '10px',
      },
    },
  },
  MuiLink: {
    defaultProps: {
      underline: 'hover',
    },
  },
  MuiCardHeader: {
    defaultProps: {
      titleTypographyProps: {
        variant: 'h6',
      },
    },
    styleOverrides: {
      action: {
        marginTop: '-4px',
        marginRight: '-4px',
      },
    },
  },
  MuiCard: {
    styleOverrides: {
      root: {
        borderRadius: '16px',
        boxShadow: 'rgba(0, 0, 0, 0.5) 0px 9px 42px 0px',
        backgroundOpacity: 100,
      },
    },
  },
  MuiPaper: {
    styleOverrides: {
      root: {
        borderRadius: '10px',
        backgroundImage: 'none',
      },
    },
  },
  MuiPickersDay: {
    styleOverrides: {
      day: {
        fontWeight: '300',
      },
    },
  },
  MuiPickersYear: {
    styleOverrides: {
      root: {
        height: '64px',
      },
    },
  },
  MuiPickersCalendar: {
    styleOverrides: {
      transitionContainer: {
        marginTop: '6px',
      },
    },
  },
  MuiPickersCalendarHeader: {
    styleOverrides: {
      iconButton: {
        backgroundColor: 'transparent',
        '& > *': {
          backgroundColor: 'transparent',
        },
      },
      switchHeader: {
        marginTop: '2px',
        marginBottom: '4px',
      },
    },
  },
  MuiPickersClock: {
    styleOverrides: {
      container: {
        margin: `32px 0 4px`,
      },
    },
  },
  MuiPickersClockNumber: {
    styleOverrides: {
      clockNumber: {
        left: `calc(50% - 16px)`,
        width: '32px',
        height: '32px',
      },
    },
  },
  MuiPickerDTHeader: {
    styleOverrides: {
      dateHeader: {
        '& h4': {
          fontSize: '2.125rem',
          fontWeight: 400,
        },
      },
      timeHeader: {
        '& h3': {
          fontSize: '3rem',
          fontWeight: 400,
        },
      },
    },
  },
  MuiPickersTimePicker: {
    styleOverrides: {
      hourMinuteLabel: {
        '& h2': {
          fontSize: '3.75rem',
          fontWeight: 300,
        },
      },
    },
  },
  MuiPickersToolbar: {
    styleOverrides: {
      toolbar: {
        '& h4': {
          fontSize: '2.125rem',
          fontWeight: 400,
        },
      },
    },
  },
  MuiToggleButton: {
    styleOverrides: {
      root: {
        borderRadius: '10px',
      },
    },
  },
  MuiChip: {
    styleOverrides: {
      root: {
        borderRadius: '10px',
      },
    },
  },
};

export default components;
