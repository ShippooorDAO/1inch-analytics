import { css, Theme } from '@emotion/react';
import { Skeleton } from '@mui/material';
import Blockies from 'react-blockies';

import { getTaggedAccount } from '@/shared/Model/TaggedAccounts';

import { RoundedIconWrapperProps } from './RoundedIconWrapper';
import { RoundedImageIcon } from './RoundedImageIcon';

export interface AddressIconProps
  extends Omit<RoundedIconWrapperProps, 'src' | 'loading' | 'subIconSrc'> {
  address?: string;
}

export function AddressIcon({ address, size, ...props }: AddressIconProps) {
  size = size ?? 'medium';
  const sizeMap = {
    small: {
      size: 10,
      scale: 3,
    },
    medium: {
      size: 11,
      scale: 4,
    },
    large: {
      size: 15,
      scale: 4,
    },
    xl: {
      size: 20,
      scale: 5,
    },
  };

  const borderRadiusMap = {
    small: 10,
    medium: 10,
    large: 10,
    xl: 20,
  };

  const borderWidthMap = {
    small: 2,
    medium: 2,
    large: 2,
    xl: 4,
  };

  const accountImageSizeMap = {
    small: 'small',
    medium: 'small',
    large: 'medium',
    xl: 'large',
  };

  const blockiesProps = sizeMap[size];
  const borderRadius = borderRadiusMap[size];
  const borderWidth = borderWidthMap[size];
  const accountImageSize = accountImageSizeMap[size];

  const taggedAccount = address ? getTaggedAccount(address) : undefined;

  if (!address) {
    return (
      <Skeleton
        height={blockiesProps.scale * blockiesProps.size}
        width={blockiesProps.scale * blockiesProps.size}
        variant="rectangular"
        css={css`
          border-radius: ${borderRadius}px;
        `}
      />
    );
  }

  if ((size === 'medium' || size === 'small') && taggedAccount?.image) {
    return (
      <RoundedImageIcon src={taggedAccount.image} size={size} loading={false} />
    );
  }

  return (
    <div
      css={css`
        display: flex;
        position: relative;
      `}
    >
      <Blockies
        css={(theme: Theme) => css`
          border-radius: ${borderRadius}px;
          background-color: ${theme.palette.divider};
          ${theme.shadows[3]};
          padding: ${borderWidth}px;
        `}
        seed={address}
        size={blockiesProps.size}
        scale={blockiesProps.scale}
      />
      {taggedAccount?.image && size !== 'small' && (
        <div
          css={css`
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
          `}
        >
          <RoundedImageIcon
            src={taggedAccount.image}
            // @ts-ignore
            size={accountImageSize}
            loading={false}
          />
        </div>
      )}
    </div>
  );
}
