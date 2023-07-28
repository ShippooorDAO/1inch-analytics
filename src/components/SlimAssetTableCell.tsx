import { css } from '@emotion/react';
import { Typography } from '@mui/material';

import { Asset } from '@/shared/Model/Asset';
import { Chain, ChainId } from '@/shared/Model/Chain';

import { RoundedImageIcon } from './icons/RoundedImageIcon';

interface SlimTokenTableCellProps {
  symbol: string;
  imageUrl: string;
  chain?: Chain;
}

export function SlimTokenTableCell({
  symbol,
  imageUrl,
  chain,
}: SlimTokenTableCellProps) {
  const label = (() => {
    if (!chain || chain.chainId === ChainId.ETHEREUM) {
      return symbol;
    }

    return `${symbol} (${chain.displayName})`;
  })();

  const subIconSrc = (() => {
    if (!chain || chain.chainId === ChainId.ETHEREUM) {
      return undefined;
    }

    return chain.imageUrl;
  })();

  return (
    <div
      css={css`
        display: flex;
        flex-flow: row;
        align-items: center;
        gap: 10px;
      `}
    >
      <RoundedImageIcon src={imageUrl} subIconSrc={subIconSrc} size="small" />
      <div
        css={css`
          display: flex;
          flex-flow: column;
          align-items: flex-start;
          justify-content: space-between;
        `}
      >
        <Typography variant="body2" fontWeight={800}>
          {label}
        </Typography>
      </div>
    </div>
  );
}

export interface SlimAssetTableCellProps {
  asset: Asset;
}
export function SlimAssetTableCell({ asset }: SlimAssetTableCellProps) {
  const assetImageUrl = asset.imageUrl ?? '/unknown_token_dark.png';

  return (
    <SlimTokenTableCell
      symbol={asset.displayName}
      imageUrl={assetImageUrl}
      chain={asset.chain}
    />
  );
}
