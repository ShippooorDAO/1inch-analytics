import { css } from '@emotion/react';
import { Card, Typography } from '@mui/material';
import React from 'react';

import { AutoSkeleton } from './AutoSkeleton';

export function MetricsCard({
  title,
  value,
  subValue,
  footer,
  loading,
}: {
  loading?: boolean;
  title: React.ReactNode;
  value?: React.ReactNode;
  subValue?: React.ReactNode;
  footer?: React.ReactNode;
}) {
  const loading_ = !value || !!loading;
  const value_ = !loading ? value : 12345;

  return (
    <Card
      css={css`
        padding: 20px;
        height: 100%;
        display: flex;
        flex-flow: column;
        gap: 5px;
        justify-content: flex-end;
      `}
    >
      <AutoSkeleton loading={loading_}>
        <Typography variant="body2">{title}</Typography>
      </AutoSkeleton>
      <AutoSkeleton loading={loading_}>
        <div
          css={css`
            display: flex;
            flex-flow: row;
            gap: 10px;
            align-items: baseline;
            white-space: nowrap;
          `}
        >
          <Typography variant="h1" fontWeight={300}>
            {value}
          </Typography>
          {subValue !== undefined && (
            <Typography variant="body2" color="textSecondary">
              {subValue}
            </Typography>
          )}
        </div>
      </AutoSkeleton>
      {footer && typeof footer !== 'string' ? (
        <AutoSkeleton loading={loading_}>{footer}</AutoSkeleton>
      ) : (
        <AutoSkeleton loading={loading_}>
          <Typography variant="body2" color="textSecondary" fontWeight={300}>
            {footer}
          </Typography>
        </AutoSkeleton>
      )}
    </Card>
  );
}
