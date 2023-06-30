import { css } from '@emotion/react';
import { useRouter } from 'next/router';
import React from 'react';

import { SidebarItemsType } from '@/types/sidebar';

import reduceChildRoutes from './reduceChildRoutes';

interface SidebarNavListProps {
  depth: number;
  pages: SidebarItemsType[];
}

const SidebarNavList = (props: SidebarNavListProps) => {
  const { pages, depth } = props;
  const { pathname } = useRouter();

  const childRoutes = pages.reduce(
    (items, page) =>
      reduceChildRoutes({ items, page, currentRoute: pathname, depth }),
    [] as JSX.Element[]
  );

  return (
    <React.Fragment>
      <div
        css={css`
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 4px;
          padding: 0 12px;
          align-items: flex-start;
        `}
      >
        {childRoutes}
      </div>
    </React.Fragment>
  );
};

export default SidebarNavList;
