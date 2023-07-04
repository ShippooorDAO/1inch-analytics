import { css } from '@emotion/react';

import { RoundedIconWrapper } from './RoundedIconWrapper';

export interface RoundedImageIconProps {
  src: string;
  subIconSrc?: string;
  loading?: boolean;
  size?: 'small' | 'medium' | 'large' | 'xl';
}

export function RoundedImageIcon({
  src,
  subIconSrc,
  loading,
  size,
}: RoundedImageIconProps) {
  size = size ?? 'medium';
  const sizeMap = {
    small: 34,
    medium: 44,
    large: 64,
    xl: 85,
  };
  const paddingMap = {
    small: 2,
    medium: 2,
    large: 2,
    xl: 3,
  };

  const sizePx = sizeMap[size];
  const paddingPx = paddingMap[size];

  return (
    <RoundedIconWrapper loading={!!loading} size={size}>
      <img
        height={sizePx}
        width={sizePx}
        src={src}
        alt="asset icon"
        css={(theme) => css`
          border-radius: 50%;
          padding: ${paddingPx}px;
          ${theme.shadows[5]};
        `}
      />
      {subIconSrc && (
        <div
          css={css`
            position: absolute;
            right: -5px;
            bottom: -9px;
          `}
        >
          <img
            alt="asset sub-icon"
            src={subIconSrc}
            height={sizePx / 2}
            width={sizePx / 2}
          />
        </div>
      )}
    </RoundedIconWrapper>
  );
}
