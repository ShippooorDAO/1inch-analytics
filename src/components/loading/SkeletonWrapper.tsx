import { css } from '@emotion/react';
import { LinearProgress, Skeleton, SkeletonProps } from '@mui/material';
import React from 'react';

export interface LoadingWrapperProps extends SkeletonProps {
  loading: boolean;
  children: React.ReactNode;
}

export function LoadingWrapper({
  children,
  loading,
  ...otherProps
}: LoadingWrapperProps) {
  if (loading) {
    return (
      <div>
        <LinearProgress
          css={css`
            margin-top: 10px;
          `}
        />
        <Skeleton {...otherProps}>{children}</Skeleton>
      </div>
    );
  }

  return <React.Fragment>{children}</React.Fragment>;
}
