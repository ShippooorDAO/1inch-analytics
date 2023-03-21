import { css, Interpolation, Theme } from '@emotion/react';
import { Typography, useTheme } from '@mui/material';

import { getTransactionTypeStaticDataById } from '@/shared/Model/Transaction';

import { TransactionTypeIcon } from '../icons/TransactionTypeIcon';

export interface TransactionTypeCellProps {
  type: string;
  css?: Interpolation<Theme>;
  className?: string;
  size?: 'small' | 'medium' | 'large';
}

export function TransactionTypeCell({
  type,
  css: cssProp,
  size,
}: TransactionTypeCellProps) {
  const theme = useTheme();

  const transactionType = getTransactionTypeStaticDataById(type);

  if (!transactionType) {
    return null;
  }

  size = size ?? 'medium';

  const { name } = transactionType;

  return (
    <div
      css={[
        css`
          display: flex;
          flex-flow: row;
          align-items: center;
          gap: 10px;
        `,
        cssProp,
      ]}
    >
      <TransactionTypeIcon typeId={type} size={size} />
      <Typography variant="body2">{name}</Typography>
    </div>
  );
}
