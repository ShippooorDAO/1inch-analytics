import { css } from '@emotion/react';
import { Typography } from '@mui/material';
import Link from 'next/link';

// @ts-ignore
import { getAddressShorthand } from '@/shared/Utils/Format';

import { AddressIcon } from '../icons/AddressIcon';

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

export interface AccountTableCellProps {
  address: string;
  tag?: string;
  ensDomain?: string;
}

export function AccountTableCell({ address, tag }: AccountTableCellProps) {
  return (
    <OptionalLink href={`/accounts/${address}`}>
      <div
        css={(theme) => css`
          display: flex;
          flex-flow: row;
          align-items: center;
          gap: 10px;
          overflow: hidden;
          &:hover {
            background-color: ${theme.palette.action.hover};
            ${theme.shadows[3]};
          }
          padding: 5px;
          border-radius: 5px;
        `}
      >
        <AddressIcon address={address} />
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
            color="textSecondary"
          >
            {address}
          </Typography>
          <Typography
            css={css`
              text-overflow: ellipsis;
              overflow: hidden;
            `}
            variant="subtitle1"
          >
            {tag ?? getAddressShorthand(address)}
          </Typography>
        </span>
      </div>
    </OptionalLink>
  );
}
