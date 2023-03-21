import { css } from '@emotion/react';
import { Typography } from '@mui/material';

import { getAddressShorthand } from '@/shared/Utils/Format';

import { AddressIcon } from '../icons/AddressIcon';

export interface SlimAccountTableCellProps {
  address: string;
  tag?: string;
}

export function SlimAccountTableCell({
  address,
  tag,
}: SlimAccountTableCellProps) {
  return (
    <div
      css={css`
        display: flex;
        flex-flow: row;
        gap: 10px;
        align-items: center;
        overflow: hidden;
      `}
    >
      <AddressIcon address={address} size="small" />
      <span
        css={css`
          display: flex;
          flex-flow: column;
          text-overflow: ellipsis;
          overflow: hidden;
        `}
      >
        <Typography
          css={css`
            text-overflow: ellipsis;
            overflow: hidden;
          `}
          variant="body2"
        >
          {tag ?? getAddressShorthand(address)}
        </Typography>
      </span>
    </div>
  );
}
