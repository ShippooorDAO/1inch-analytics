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

  return <React.Fragment>{childRoutes}</React.Fragment>;
};

export default SidebarNavList;
