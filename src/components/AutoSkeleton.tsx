import { Skeleton, SkeletonProps } from '@mui/material';

export interface AutoSkeletonProps extends SkeletonProps {
  loading?: boolean;
}

export function AutoSkeleton({
  children,
  loading,
  ...props
}: AutoSkeletonProps) {
  if (loading) {
    return <Skeleton {...props}>{children}</Skeleton>;
  }

  return <>{children}</>;
}
