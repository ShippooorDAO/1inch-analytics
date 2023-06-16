import { css } from '@emotion/react';
import { TrendingDown, TrendingUp } from '@mui/icons-material';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { Card, Typography } from '@mui/material';
import React from 'react';

import { formatDelta } from '@/shared/Utils/Format';

import { AutoSkeleton } from './AutoSkeleton';

export interface SlimMetricsCardProps {
  loading?: boolean;
  title: React.ReactNode;
  value?: React.ReactNode;
  subValue?: React.ReactNode;
}

export function SlimMetricsCard({
  title,
  value,
  subValue,
  loading,
}: SlimMetricsCardProps) {
  const loading_ = !value || !!loading;

  return (
    <Card
      css={css`
        height: 100%;
        display: flex;
        flex-flow: row;
        gap: 10px;
        align-items: center;
        justify-content: flex-end;
        padding-right: 10px;
      `}
    >
      <AutoSkeleton loading={loading_}>
        <div
          css={(theme) =>
            css`
              border-radius-left: 10px;
              background-color: ${theme.palette.action.hover};
              padding: 10px;
              white-space: nowrap;
            `
          }
        >
          <Typography variant="body2">{title}</Typography>
        </div>
      </AutoSkeleton>
      <AutoSkeleton loading={loading_}>
        <div
          css={css`
            display: flex;
            flex-flow: row;
            gap: 10px;
            align-items: center;
            white-space: nowrap;
          `}
        >
          <Typography variant="body2">{value}</Typography>
        </div>
      </AutoSkeleton>
      {subValue !== undefined && (
        <div
          css={(theme) => css`
            border-left: 2px solid ${theme.palette.action.hover};
            padding-left: 10px;
          `}
        >
          {subValue !== undefined && typeof subValue === 'string' && (
            <Typography variant="body2" color="textSecondary">
              {subValue}
            </Typography>
          )}
          {subValue !== undefined && typeof subValue !== 'string' && subValue}
        </div>
      )}
    </Card>
  );
}

export function MetricsCardWithLink({
  title,
  value,
  subValue,
  footer,
  loading,
  linkUrl,
  backgroundImageUrl,
  backgroundImageAlt,
  variant: variant_,
}: {
  loading?: boolean;
  title: React.ReactNode;
  backgroundImageUrl?: string;
  backgroundImageAlt?: string;
  value?: React.ReactNode;
  subValue?: React.ReactNode;
  footer?: React.ReactNode;
  linkUrl: string;
  variant?: 'default' | 'slim';
}) {
  const loading_ = !value || !!loading;
  const value_ = !loading ? value : 12345;
  const variant = variant_ || 'default';

  return (
    <a
      href={linkUrl}
      css={css`
        text-decoration: none;
        margin: 0;
        padding: 0;
      `}
    >
      <Card
        css={(theme) => css`
          border-radius: 24px;
          padding: 20px;
          display: flex;
          flex-flow: column;
          gap: 5px;
          justify-content: flex-start;
          position: relative;
          background-color: transparent;
          border: 1px solid ${theme.palette.divider};
          :hover {
            background-color: ${theme.palette.background.paper};
          }
        `}
      >
        {backgroundImageUrl && (
          <img
            src={backgroundImageUrl}
            alt={backgroundImageAlt}
            css={css`
              position: absolute;
              top: 50%;
              right: 20px;
              transform: translateY(-50%);
              height: 100px;
              width: 100px;
              opacity: 15%;
            `}
          />
        )}
        <div
          css={css`
            display: flex;
            flex-flow: row;
            justify-content: space-between;
          `}
        >
          <AutoSkeleton loading={loading_}>
            <Typography variant="body2">{title}</Typography>
          </AutoSkeleton>
          <div
            css={(theme) => css`
              display: flex;
              flex-flow: row;
              gap: 5px;
              align-items: center;
            `}
          >
            <OpenInNewIcon fontSize="small" />
          </div>
        </div>
        <AutoSkeleton loading={loading_}>
          <div
            css={css`
              display: flex;
              flex-flow: row;
              gap: 10px;
              align-items: center;
              white-space: nowrap;
            `}
          >
            <Typography variant="h1" fontWeight={300}>
              {value}
            </Typography>
            {subValue !== undefined && typeof subValue === 'string' && (
              <Typography variant="body2" color="textSecondary">
                {subValue}
              </Typography>
            )}
            {subValue !== undefined && typeof subValue !== 'string' && subValue}
          </div>
        </AutoSkeleton>
        {footer && typeof footer !== 'string' && (
          <AutoSkeleton loading={loading_}>{footer}</AutoSkeleton>
        )}
        {footer && typeof footer === 'string' && (
          <AutoSkeleton loading={loading_}>
            <Typography variant="body2" color="textSecondary" fontWeight={300}>
              {footer}
            </Typography>
          </AutoSkeleton>
        )}
      </Card>
    </a>
  );
}

export function MetricsCard({
  title,
  value,
  subValue,
  footer,
  loading,
  variant: variant_,
}: {
  loading?: boolean;
  title: React.ReactNode;
  value?: React.ReactNode;
  subValue?: React.ReactNode;
  footer?: React.ReactNode;
  variant?: 'default' | 'slim';
}) {
  const loading_ = !value || !!loading;
  const value_ = !loading ? value : 12345;
  const variant = variant_ || 'default';

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
            align-items: center;
            white-space: nowrap;
          `}
        >
          <Typography variant="h1" fontWeight={300}>
            {value}
          </Typography>
          {subValue !== undefined && typeof subValue === 'string' && (
            <Typography variant="body2" color="textSecondary">
              {subValue}
            </Typography>
          )}
          {subValue !== undefined && typeof subValue !== 'string' && subValue}
        </div>
      </AutoSkeleton>
      {footer && typeof footer !== 'string' && (
        <AutoSkeleton loading={loading_}>{footer}</AutoSkeleton>
      )}
      {footer && typeof footer === 'string' && (
        <AutoSkeleton loading={loading_}>
          <Typography variant="body2" color="textSecondary" fontWeight={300}>
            {footer}
          </Typography>
        </AutoSkeleton>
      )}
    </Card>
  );
}

interface TrendLabelProps {
  label?: string;
  variant?: 'up' | 'down';
  iconAlign?: 'right' | 'left';
}

export function TrendLabel({
  label,
  variant,
  iconAlign: iconAlign_,
}: TrendLabelProps) {
  const iconAlign = iconAlign_ || 'left';
  const icon =
    variant === 'up' ? (
      <TrendingUp fontSize="small" />
    ) : (
      <TrendingDown fontSize="small" />
    );
  return (
    <div
      css={(theme) => css`
        display: flex;
        flex-flow: row;
        gap: 5px;
        align-items: center;
        color: ${variant === 'up'
          ? theme.palette.success.main
          : theme.palette.error.main};
      `}
    >
      {iconAlign === 'left' && icon}
      <Typography variant="body2">{label}</Typography>
      {iconAlign === 'right' && icon}
    </div>
  );
}

interface TrendLabelPercentProps {
  value?: number;
  iconAlign?: 'right' | 'left';
}

export function TrendLabelPercent({
  value,
  iconAlign,
}: TrendLabelPercentProps) {
  return (
    <TrendLabel
      label={formatDelta(value, '%')}
      variant={value && value > 0 ? 'up' : 'down'}
      iconAlign={iconAlign}
    />
  );
}
