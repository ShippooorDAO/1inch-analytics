import { css } from '@emotion/react';
import { NoSsr, Typography } from '@mui/material';
import moment from 'moment';
import { lighten } from 'polished';
import TimeAgo from 'react-timeago';

function getLastSyncTimestamp() {
  return moment.utc().startOf('day').unix();
}

export function LastSyncWidget() {
  const lastSyncTimestamp = getLastSyncTimestamp();

  return (
    <div
      css={css`
        display: flex;
        flex-flow: row;
        align-items: center;
        gap: 10px;
      `}
    >
      <div
        css={css`
          display: flex;
          flex-flow: column;
          justify-content: center;
          align-items: flex-end;
        `}
      >
        <div
          css={css`
            display: flex;
            flex-flow: row;
            justify-content: flex-end;
            align-items: center;
            gap: 10px;
          `}
        >
          <span
            css={(theme) =>
              css`
                height: 10px;
                width: 10px;
                border-radius: 50%;
                border: 1px solid ${lighten(0.5, theme.palette.text.primary)};
                background-color: ${theme.palette.mui.green[500]};
              `
            }
          >
            &nbsp;
          </span>
          <Typography
            variant="body1"
            color="textSecondary"
            gutterBottom={false}
            fontWeight={300}
          >
            Last sync
          </Typography>
        </div>

        <div
          css={css`
            display: flex;
            flex-flow: row;
            justify-content: flex-end;
            align-items: center;
            gap: 10px;
          `}
        >
          <Typography variant="body2" gutterBottom={false}>
            <NoSsr>
              <TimeAgo date={lastSyncTimestamp * 1000} />
            </NoSsr>
          </Typography>
        </div>
      </div>
    </div>
  );
}
