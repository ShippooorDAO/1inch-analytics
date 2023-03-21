import { css } from '@emotion/react';
import { Typography } from '@mui/material';

import { Asset } from '@/shared/Model/Asset';

import { AssetIcon } from './icons/AssetIcon';

interface AssetOptionLabelProps {
  asset: Asset;
}

export function AssetOptionLabel({ asset }: AssetOptionLabelProps) {
  return (
    <div
      css={css`
        display: flex;
        flex-flow: row;
        align-items: center;
        gap: 10px;
      `}
    >
      <AssetIcon asset={asset} size="small" />
      <Typography variant="body2">{asset.displayName}</Typography>
      <Typography variant="body2" color="textSecondary">
        {asset.priceUsd.toDisplayString()}
      </Typography>
    </div>
  );
}
