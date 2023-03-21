import { css } from '@emotion/react';

import { getTransactionTypeStaticDataById } from '@/shared/Model/Transaction';

import { RoundedIconWrapperProps } from './RoundedIconWrapper';

export interface TransactionTypeIconProps {
  size?: RoundedIconWrapperProps['size'];
  typeId: string;
}

export function TransactionTypeIcon({
  typeId,
  size,
  ...props
}: TransactionTypeIconProps) {
  size = size ?? 'medium';
  const sizeMap = {
    small: 30,
    medium: 46,
    large: 60,
    xl: 80,
  };
  const borderWidthMap = {
    small: 1,
    medium: 2,
    large: 2,
    xl: 2,
  };

  const sizePx = sizeMap[size];
  const borderWidth = borderWidthMap[size];

  const transactionType = getTransactionTypeStaticDataById(typeId);

  if (!transactionType) {
    return null;
  }

  const { Icon } = transactionType;

  return (
    <div
      css={(theme) => css`
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: ${theme.palette.background.default};
        border: ${borderWidth}px solid ${theme.palette.background.primary};
        border-radius: 999px;
        color: ${theme.palette.text.primary};
        height: ${sizePx}px;
        width: ${sizePx}px;
        position: relative;
      `}
    >
      {Icon && <Icon />}
    </div>
  );
}
