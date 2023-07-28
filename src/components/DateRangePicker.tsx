import { css } from '@emotion/react';
import { CalendarMonthOutlined } from '@mui/icons-material';
import { Badge, InputAdornment, TextField, useTheme } from '@mui/material';
import { DateRangePicker as MuiDateRangePicker } from '@mui/x-date-pickers-pro';
import { DateRange as MuiDateRange } from '@mui/x-date-pickers-pro/DateRangePicker';
import moment from 'moment';
import { darken } from 'polished';

function CloseButtonBadge() {
  const theme = useTheme();
  return (
    <span
      css={css`
        display: flex;
        flex-flow: row;
        justify-content: center;
        align-items: center;
        background-color: ${darken(0.05, theme.palette.background.paper)};
        border-radius: 999px;
        color: ${theme.palette.text.secondary};
        border: 1px solid ${theme.palette.text.secondary};
        text-align: center;
        width: 20px;
        height: 20px;
      `}
    >
      ×
    </span>
  );
}

interface DateRange {
  start?: Date;
  end?: Date;
}

interface DateRangePickerProps {
  onChange: (dateRange: DateRange) => void;
  value: DateRange;
}

export function DateRangePicker({ value, onChange }: DateRangePickerProps) {
  const handleChange = (newValue: MuiDateRange<moment.Moment>) => {
    const [startDate, endDate] = newValue;
    const start = startDate?.toDate();
    const end = endDate?.toDate();

    onChange({ start, end });
  };

  const start = value.start ? moment(value.start) : null;
  const end = value?.end ? moment(value.end) : null;

  return (
    <MuiDateRangePicker
      onChange={handleChange}
      value={[start, end]}
      maxDate={moment()}
      renderInput={(startParams, endParams) => (
        <div
          css={css`
            display: flex;
            flex-flow: row;
            gap: 10px;
          `}
        >
          <Badge
            color="default"
            overlap="circular"
            css={css`
              cursor: pointer;
            `}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            invisible={!start}
            badgeContent={<CloseButtonBadge />}
            onClick={() => handleChange([null, end])}
          >
            <TextField
              {...startParams}
              css={(theme) =>
                css`
                  & .MuiOutlinedInput-notchedOutline {
                    border-color: ${theme.palette.divider};
                  }
                `
              }
              InputLabelProps={{
                ...startParams.InputLabelProps,
                sx: {
                  marginTop: '5px',
                },
              }}
              InputProps={{
                ...startParams.InputProps,
                sx: {
                  '& .MuiInputBase-input': {
                    paddingLeft: 0,
                    height: '18px',
                  },
                },
                startAdornment: (
                  <InputAdornment position="start">
                    <CalendarMonthOutlined />
                  </InputAdornment>
                ),
              }}
            />
          </Badge>
          <Badge
            overlap="circular"
            css={css`
              cursor: pointer;
            `}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            invisible={!end}
            badgeContent={<CloseButtonBadge />}
            onClick={() => handleChange([start, null])}
          >
            <TextField
              {...endParams}
              css={(theme) =>
                css`
                  & .MuiOutlinedInput-notchedOutline {
                    border-color: ${theme.palette.divider};
                  }
                `
              }
              InputLabelProps={{
                ...startParams.InputLabelProps,
                sx: {
                  marginTop: '5px',
                },
              }}
              InputProps={{
                ...endParams.InputProps,
                sx: {
                  '& .MuiInputBase-input': {
                    paddingLeft: 0,
                    height: '18px',
                  },
                },
                startAdornment: (
                  <InputAdornment position="start">
                    <CalendarMonthOutlined />
                  </InputAdornment>
                ),
              }}
            />
          </Badge>
        </div>
      )}
    />
  );
}
