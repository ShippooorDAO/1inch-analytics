import { css } from '@emotion/react';
import { Typography } from '@mui/material';
import Link from 'next/link';
import React from 'react';

type BreadcrumbLink = {
  title: string;
  uri: string;
};

export default function Breadcrumbs({ links }: { links: BreadcrumbLink[] }) {
  return (
    <div
      css={css`
        display: flex;
        flex-flow: row;
        gap: 5px;
      `}
    >
      {links.map(({ title, uri }, i) => (
        <React.Fragment key={uri}>
          <Link href={uri}>
            <a>
              <Typography color="textPrimary">{title}</Typography>
            </a>
          </Link>
          <span>{i !== links.length - 1 ? ' > ' : ''}</span>
        </React.Fragment>
      ))}
    </div>
  );
}
