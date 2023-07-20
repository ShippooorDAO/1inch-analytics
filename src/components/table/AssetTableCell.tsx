import { css } from '@emotion/react';
import { Typography } from '@mui/material';
import Link from 'next/link';
import { useMemo } from 'react';

import { UsdAmount } from '@/shared/Currency/UsdAmount';
import { Asset } from '@/shared/Model/Asset';
import { useOneInchAnalyticsAPIContext } from '@/shared/OneInchAnalyticsAPI/OneInchAnalyticsAPIProvider';

import { AssetIcon } from '../icons/AssetIcon';

function OptionalLink({
  href,
  children,
}: {
  href?: string;
  children: React.ReactNode;
}) {
  if (!href) {
    return <>{children}</>;
  }

  return (
    <Link href={href} passHref>
      <a
        css={css`
          text-decoration: none;
        `}
      >
        {children}
      </a>
    </Link>
  );
}

export interface AssetTableCellProps {
  asset: Asset;
  assetPriceUsd?: UsdAmount;
  rate?: number;
}
export function AssetTableCell({ asset, assetPriceUsd }: AssetTableCellProps) {
  const { assetService } = useOneInchAnalyticsAPIContext();

  const link = useMemo(() => {
    if (!assetService) {
      return undefined;
    }

    return `https://etherscan.io/token/${asset.address}`;
  }, [assetService, asset]);

  const priceUsd = useMemo(() => {
    if (assetPriceUsd) {
      return assetPriceUsd;
    }

    return asset.priceUsd;
  }, [assetPriceUsd, asset]);

  return (
    <OptionalLink href={link}>
      <a
        css={css`
          text-decoration: none;
        `}
      >
        <div
          css={(theme) => [
            css`
              display: flex;
              flex-flow: row;
              align-items: center;
              gap: 10px;
              border-radius: 10px;
              padding: 5px;
            `,
            link &&
              css`
                &:hover {
                  background-color: ${theme.palette.action.hover};
                  ${theme.shadows[3]};
                }
              `,
          ]}
        >
          <AssetIcon asset={asset} />
          <div
            css={css`
              display: flex;
              flex-flow: column;
              align-items: flex-start;
              justify-content: space-between;
            `}
          >
            <Typography variant="body2">{asset.displayName}</Typography>
            {priceUsd && (
              <Typography variant="body2" color="textSecondary">
                {priceUsd?.toDisplayString()}
              </Typography>
            )}
          </div>
        </div>
      </a>
    </OptionalLink>
  );
}
