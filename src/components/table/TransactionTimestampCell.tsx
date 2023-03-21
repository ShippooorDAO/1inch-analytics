import { css } from '@emotion/react';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { Typography } from '@mui/material';
import moment from 'moment';

export interface TimestampCellProps {
  timestamp: number;
  transactionHash: string;
}

export function TransactionTimestampCell({
  timestamp,
  transactionHash,
}: TimestampCellProps) {
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
      onClick={() => {
        window.open(`https://etherscan.io/tx/${transactionHash}`);
      }}
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
        <OpenInNewIcon
          css={css`
            height: 15px;
            fill: rgba(255, 255, 255, 0.5);
          `}
        />
      </div>
    </div>
  );
}
