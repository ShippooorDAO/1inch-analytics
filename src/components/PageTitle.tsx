import { Typography } from '@mui/material';

export interface PageTitleProps {
  children: React.ReactNode;
}

export function PageTitle({ children }: PageTitleProps) {
  return (
    <Typography variant="h3" fontWeight={300} color="textSecondary">
      {children}
    </Typography>
  );
}
