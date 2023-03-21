import { css, Interpolation, Theme } from '@emotion/react';
import { Typography } from '@mui/material';
import { ClassAttributes, HTMLAttributes } from 'react';

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
