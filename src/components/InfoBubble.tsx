import { css } from '@emotion/react';
import InfoIcon from '@mui/icons-material/Info';
import { Tooltip, Typography, useTheme } from '@mui/material';
import React from 'react';

interface InfoBubbleProps {
  title: string;
  children: React.ReactNode;
}

export function InfoBubble({ title, children }: InfoBubbleProps) {
  const theme = useTheme();

  const content = (
    <React.Fragment>
      <div
        css={css`
          padding: 20px;
          background-color: ${theme.palette.background.default};
          border: 1px solid rgba(255, 255, 225, 0.3);
          border-radius: 5px;
        `}
      >
        <Typography variant="h4">{title}</Typography>
        <hr
          css={css`
            border: 1px solid rgba(255, 255, 225, 0.1);
          `}
        />
        {children}
      </div>
    </React.Fragment>
  );

  return (
    <Tooltip
      title={content}
      componentsProps={{
        tooltip: {
          sx: {
            margin: 0,
            padding: 0,
            backgroundColor: 'transparent',
          },
        },
      }}
    >
      <InfoIcon
        css={css`
          width: 25px;
          height: 25px;
          fill: #fff;
          cursor: pointer;
        `}
      />
    </Tooltip>
  );
}
