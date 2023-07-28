import { css } from '@emotion/react';
import { Typography } from '@mui/material';

interface SelectOptionLabelProps {
  name: string;
  description?: string;
  icon?: React.ReactNode;
}

export function SelectOptionLabel({
  name,
  icon,
  description,
}: SelectOptionLabelProps) {
  return (
    <div
      css={css`
        display: flex;
        flex-flow: row;
        align-items: center;
        gap: 10px;
      `}
    >
      {icon}
      <Typography variant="body2">{name}</Typography>
      {description && (
        <Typography variant="body2" color="textSecondary">
          {description}
        </Typography>
      )}
    </div>
  );
}
