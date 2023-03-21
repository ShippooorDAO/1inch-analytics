import { css } from '@emotion/react';
import { Typography } from '@mui/material';
import moment from 'moment';

export interface TimestampCellProps {
  timestamp: number;
}

export function TimestampCell({ timestamp }: TimestampCellProps) {
  const date = new Date(timestamp * 1000);

  return (
    <div
      css={css`
        display: flex;
        flex-flow: column;
        justify-content: flex-start;
        align-items: flex-start;
        cursor: pointer;
      `}
    >
      <Typography variant="body2" fontWeight={800}>
        {moment(date).format('lll')}
      </Typography>
      <div
        css={css`
          display: flex;
          justify-content: flex-start;
          align-items: center;
        `}
      >
        <Typography variant="subtitle1" color="textSecondary">
          {moment(date).fromNow()}
        </Typography>
      </div>
    </div>
  );
}
