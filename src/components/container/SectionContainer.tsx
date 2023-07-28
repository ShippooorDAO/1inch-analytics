import { css, Interpolation, Theme } from '@emotion/react';
import {
  Skeleton,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';
import React, { ClassAttributes, HTMLAttributes, useState } from 'react';

export type SectionContainerProps = {
  title?: string;
  children: React.ReactNode;
  anchorRef?: React.RefObject<HTMLDivElement>;
} & ClassAttributes<HTMLDivElement> &
  HTMLAttributes<HTMLDivElement> & {
    css?: Interpolation<Theme>;
  };

export function SectionContainer({
  title,
  children,
  anchorRef,
  css: cssProp,
}: SectionContainerProps) {
  return (
    <div
      css={[
        (theme) => css`
          display: flex;
          width: 100%;
          position: relative;
          display: flex;
          flex-flow: column;
          gap: 20px;
        `,
        cssProp,
      ]}
    >
      <div
        ref={anchorRef}
        css={css`
          position: absolute;
          top: -128px;
        `}
      />

      {title && (
        <Typography variant="h2" fontWeight={300}>
          {title}
        </Typography>
      )}
      <div>{children}</div>
    </div>
  );
}

interface MultiTabSectionContainerProps {
  title: React.ReactNode;
  tabs: {
    key: string;
    label: string;
    content: React.ReactNode;
  }[];
  loading?: boolean;
}

export function MultiTabSection({
  title,
  tabs,
  loading,
}: MultiTabSectionContainerProps) {
  const [selectedTab, setSelectedTab] = useState(tabs[0].key);

  return (
    <div
      css={css`
        display: flex;
        flex-flow: column;
        justify-content: center;
        align-items: center;
        gap: 10px;
        width: 100%;
      `}
    >
      <div
        css={css`
          display: flex;
          flex-flow: row;
          justify-content: space-between;
          align-items: center;
          width: 100%;
        `}
      >
        {title && title}
        <ToggleButtonGroup
          color="primary"
          exclusive
          disabled={loading}
          aria-label="Select tab"
          value={selectedTab}
          onChange={(e, value) => {
            if (value !== null) {
              setSelectedTab(value);
            }
          }}
        >
          {tabs.map((tab) => (
            <ToggleButton key={tab.key} value={tab.key}>
              {loading ? <Skeleton variant="text" width="80px" /> : tab.label}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
        <div
          css={css`
            visibility: hidden;
          `}
        >
          {title}
        </div>
      </div>
      <div
        css={css`
          width: 100%;
        `}
      >
        {tabs.find((tab) => tab.key === selectedTab)?.content}
      </div>
    </div>
  );
}
