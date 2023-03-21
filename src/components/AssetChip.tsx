import { css } from '@emotion/react';
import { Chip } from '@mui/material';

import { Asset } from '@/shared/Model/Asset';

import { AssetIcon } from './icons/AssetIcon';

export interface AssetChipProps {
  asset: Asset;
  onDelete?: (asset: Asset) => void;
}

export function AssetChip({ asset, onDelete }: AssetChipProps) {
  return (
    <Chip
      css={css`
        border-radius: 10px;
        height: 40px;
        padding-left: 0;
        & .MuiChip-label {
          padding-left: 2px;
        }
      `}
      label={
        <div
          css={css`
            display: flex;
            flex-flow: row;
            align-items: center;
            gap: 10px;
          `}
        >
          <div
            css={css`
              display: flex;
              justify-content: center;
              flex-flow: row;
              height: 35px;
              width: 35px;
              padding: 2px;
              background-color: #fff;
              align-items: center;
              position: relative;
              border-radius: 50%;
              border: 2px solid rgba(0, 0, 0, 0.4);
            `}
          >
            <AssetIcon asset={asset} size="small" />
          </div>
          {asset.displayName}
        </div>
      }
      variant="outlined"
      onDelete={onDelete ? () => onDelete(asset) : undefined}
    />
  );
}
