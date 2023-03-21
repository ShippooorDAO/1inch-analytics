import { css } from '@emotion/react';
import { AppBar, Button } from '@mui/material';
import { lighten } from 'polished';
import React from 'react';

export interface SectionNavigationButtonProps {
  label: React.ReactNode;
  anchorRef: React.RefObject<HTMLDivElement>;
}

export function SectionNavigationButton({
  label,
  anchorRef,
}: SectionNavigationButtonProps) {
  return (
    <Button
      variant="text"
      onClick={() => {
        anchorRef.current?.scrollIntoView({
          behavior: 'smooth',
        });
      }}
    >
      {label}
    </Button>
  );
}

export interface NavigationBarProps {
  children: React.ReactNode;
}

export function NavigationBar({ children }: NavigationBarProps) {
  return (
    <AppBar
      position="sticky"
      css={(theme) => css`
        border-radius: 0;
        top: 64px;
        ${theme.shadows[0]};
        display: flex;
        flex-flow: column;
        background-color: transparent;
      `}
    >
      <div
        css={(theme) => css`
          display: flex;
          flex-flow: row;
          background-color: ${lighten(0.02, theme.palette.background.default)};
          justify-content: center;
          align-items: center;
          width: 100%;
          gap: 20px;
          padding: 5px 40px;
          white-space: nowrap;
        `}
      >
        {children}
      </div>
    </AppBar>
  );
}
