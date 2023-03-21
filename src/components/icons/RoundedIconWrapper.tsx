import { css, Interpolation, Theme } from '@emotion/react';
import { Skeleton } from '@mui/material';
import { lighten } from 'polished';

export interface RoundedIconWrapperProps {
  loading?: boolean;
  size?: 'small' | 'medium' | 'large' | 'xl';
  children?: React.ReactNode;
  subIcon?: React.ReactNode;
  css?: Interpolation<Theme>;
}

export function RoundedIconWrapper({
  children,
  subIcon,
  loading,
  size,
  css: cssProp,
}: RoundedIconWrapperProps) {
  size = size ?? 'medium';
  const sizeMap = {
    small: 30,
    medium: 46,
    large: 60,
    xl: 80,
  };
  const sizePx = sizeMap[size];

  if (loading) {
    return <Skeleton variant="circular" height={sizePx} width={sizePx} />;
  }

  return (
    <div
      css={(theme) => [
        css`
          border-radius: 50%;
          background-color: ${lighten(0.1, theme.palette.background.paper)};
          display: flex;
          justify-content: center;
          flex-flow: row;
          align-items: center;
          position: relative;
        `,
        cssProp,
      ]}
    >
      {children}
      {subIcon && (
        <div
          css={css`
            position: absolute;
            right: -5px;
            bottom: -9px;
            height: ${sizePx / 2}px;
            width: ${sizePx / 2}px;
          `}
        >
          {subIcon}
        </div>
      )}
    </div>
  );
}
