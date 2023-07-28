import { css } from '@emotion/react';
import { OpenInNew } from '@mui/icons-material';
import { Typography } from '@mui/material';

import { Asset } from '@/shared/Model/Asset';
import { Chain, ChainId } from '@/shared/Model/Chain';
import { getEtherscanTokenLink } from '@/shared/Utils/Etherscan';

import { RoundedImageIcon } from './icons/RoundedImageIcon';

interface SlimTokenTableCellProps {
  address: string;
  symbol: string;
  imageUrl: string;
  chain?: Chain;
}

export function SlimTokenTableCell({
  address,
  symbol,
  imageUrl,
  chain,
}: SlimTokenTableCellProps) {
  // const label = (() => {
  //   if (!chain || chain.chainId === ChainId.ETHEREUM) {
  //     return symbol;
  //   }

  //   return `${symbol} (${chain.displayName})`;
  // })();

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
          flex-flow: row;
          align-items: center;
          justify-content: space-between;
        `}
      >
        <Typography variant="body2" fontWeight={800}>
          {symbol}
        </Typography>
        <a
          href={getEtherscanTokenLink(address, chain?.chainId)}
          target="_blank"
          rel="noopener noreferrer"
        >
          <OpenInNew
            css={(theme) =>
              css`
                height: 16px;
                margin-top: 3px;
                color: ${theme.palette.text.secondary};
              `
            }
          />
        </a>
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
      address={asset.address}
      symbol={asset.displayName}
      imageUrl={assetImageUrl}
      chain={asset.chain}
    />
  );
}
