import { css } from '@emotion/react';
import { Typography } from '@mui/material';

import { AssetAmount } from '@/shared/Currency/AssetAmount';
import { UsdAmount } from '@/shared/Currency/UsdAmount';

export interface AssetAmountTableCellProps {
  amount: AssetAmount;
  amountUsd: UsdAmount;
}

export function AssetAmountTableCell({
  amount,
  amountUsd,
  ...props
}: AssetAmountTableCellProps) {
  return (
    <div
      css={css`
        text-align: right;
        padding-right: 10px;
      `}
    >
      <Typography variant="body2">{amount.toDisplayString()}</Typography>
      <Typography variant="body2" color="textSecondary">
        {amountUsd.toDisplayString()}
      </Typography>
    </div>
  );
}
