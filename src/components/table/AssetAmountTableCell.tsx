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
      <Typography variant="body2" fontWeight={300} color="textSecondary">
        {amount.toDisplayString({ abbreviate: true })}
      </Typography>
      <Typography variant="h3" fontWeight={300}>
        {amountUsd.toDisplayString({ abbreviate: true })}
      </Typography>
    </div>
  );
}
