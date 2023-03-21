import { css } from '@emotion/react';
import { Typography } from '@mui/material';

interface AssetPriceOptionLabelProps {
  name: string;
  icon?: React.ReactNode;
}

export function AssetPriceOptionLabel({
  name,
  icon,
}: AssetPriceOptionLabelProps) {
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
    </div>
  );
}
