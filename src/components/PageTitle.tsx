import { css } from '@emotion/react';
import { Typography } from '@mui/material';

export interface PageTitleProps {
  children: React.ReactNode;
  icon?: React.ReactNode;
}

export function PageTitle({ children, icon }: PageTitleProps) {
  return (
    <div
      css={css`
        display: flex;
        flex-flow: row;
        align-items: center;
        gap: 10px;
      `}
    >
      {icon}
      <Typography variant="h3" color="textPrimary" whiteSpace="nowrap">
        {children}
      </Typography>
    </div>
  );
}
