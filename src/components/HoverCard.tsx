import { css, Interpolation, Theme } from '@emotion/react';
import QueryStatsIcon from '@mui/icons-material/QueryStats';
import { CardContent, Typography, useTheme } from '@mui/material';
import { lighten, rgba } from 'polished';
import React from 'react';

export type BaseCardProps = React.ClassAttributes<HTMLDivElement> &
  React.HTMLAttributes<HTMLDivElement> & {
    css?: Interpolation<Theme>;
  };

export function Card({ children, css: cssProp, ...props }: BaseCardProps) {
  const theme = useTheme();

  return (
    <div
      css={[
        cssProp,
        css`
          backdrop-filter: blur(20px);
          border-radius: 10px;
          ${theme.shadows[10]};
          background-color: ${theme.palette.background.paper};
        `,
      ]}
      {...props}
    >
      {children}
    </div>
  );
}

export function HoverCard({ children, css: cssProp, ...props }: BaseCardProps) {
  const theme = useTheme();

  return (
    <Card
      css={[
        cssProp,
        css`
          &:hover {
            cursor: pointer;
            background-color: ${rgba(
              lighten(0.1, theme.palette.background.paper),
              0.5
            )};
          }
        `,
      ]}
      {...props}
    >
      {children}
    </Card>
  );
}

export function LinkHoverCard({
  children,
  css: cssProp,
  ...props
}: BaseCardProps) {
  const theme = useTheme();

  return (
    <Card
      css={[
        cssProp,
        css`
          border: 1px solid ${theme.palette.divider};
          position: relative;
          display: flex;
          padding: 0 15px;
          flex-flow: row;
          align-items: center;
          justify-content: center;
          &:hover {
            background-color: ${theme.palette.action.hover};
          }
        `,
      ]}
      {...props}
    >
      <CardContent>{children}</CardContent>
      <div
        css={css`
          display: flex;
          flex-flow: row;
          justify-content: flex-start;
          align-items: flex-start;
          width: 15px;
          right: 20px;
          color: rgba(255, 255, 255, 0.5);
          top: 15px;
          position: absolute;
        `}
      >
        <QueryStatsIcon fontSize="small" />
      </div>
    </Card>
  );
}

export interface QuickSearchLinkHoverCardProps extends BaseCardProps {
  logo: React.ReactNode;
  label: React.ReactNode;
}

export function QuickSearchLinkHoverCard({
  logo,
  label,
  css: cssProp,
  ...props
}: QuickSearchLinkHoverCardProps) {
  return (
    <LinkHoverCard
      css={[
        css`
          display: flex;
          flex-flow: column;
          align-items: center;
          gap: 10px;
          height: 100%;
          justify-content: space-between;
        `,
        cssProp,
      ]}
      {...props}
    >
      <div
        css={css`
          display: flex;
          flex-flow: column;
          align-items: center;
          gap: 10px;
          height: 100%;
          justify-content: space-between;
        `}
      >
        {logo}
        <Typography variant="body2" textAlign="center">
          {label}
        </Typography>
      </div>
    </LinkHoverCard>
  );
}
