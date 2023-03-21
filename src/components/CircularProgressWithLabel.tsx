import { css } from '@emotion/react';
import {
  CircularProgress,
  CircularProgressProps,
  Typography,
} from '@mui/material';

export function CircularProgressWithLabel(
  props: CircularProgressProps & { value: number }
) {
  const { value } = props;
  let color: 'primary' | 'warning' | 'error' = 'primary';
  if (value < 75) {
    color = 'warning';
  } else if (value < 50) {
    color = 'error';
  }

  return (
    <div
      css={css`
        position: relative;
        display: inline-flex;
      `}
    >
      <CircularProgress
        variant="determinate"
        size="84px"
        color={color}
        css={(theme) =>
          css`
            border-radius: 999px;
            padding: 10px;
            background-color: ${theme.palette.background.paper};
            ${theme.shadows[5]};
          `
        }
        {...props}
      />
      <div
        css={css({
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          position: 'absolute',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        })}
      >
        <Typography variant="caption" component="div">{`${Math.round(
          props.value
        )}%`}</Typography>
      </div>
    </div>
  );
}
