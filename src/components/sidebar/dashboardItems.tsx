import { List, Users } from 'react-feather';

import { SidebarItemsType } from '@/types/sidebar';

import { RoundedImageIcon } from '../icons/RoundedImageIcon';
import { SidebarNavProps } from './SidebarNav';

export enum PageSection {
  OVERVIEW,
  TRANSACTIONS,
  FUSION,
  TOKEN,
}

export const pageSections: ReadonlyMap<PageSection, SidebarItemsType> = new Map(
  [
    [
      PageSection.OVERVIEW,
      {
        href: '/',
        icon: Users,
        title: 'Overview',
      },
    ],
    [
      PageSection.TRANSACTIONS,
      {
        href: '/transactions',
        icon: List,
        title: 'Transactions',
      },
    ],
    [
      PageSection.FUSION,
      {
        href: '/fusion',
        icon: () => (
          <RoundedImageIcon size="small" src="/vendors/1inch/fusion.webp" />
        ),
        title: 'Fusion Mode',
      },
    ],
    [
      PageSection.TOKEN,
      {
        href: '/token',
        icon: () => (
          <RoundedImageIcon size="small" src="/vendors/1inch/1inch_logo.svg" />
        ),
        title: '1INCH Token',
      },
    ],
  ]
);

export function getNavItems(): SidebarNavProps {
  const overviewSection = pageSections.get(PageSection.OVERVIEW)!;
  const transactionsSection = pageSections.get(PageSection.TRANSACTIONS)!;
  const tokenSection = pageSections.get(PageSection.TOKEN)!;
  const fusionSection = pageSections.get(PageSection.FUSION)!;

  const items: SidebarItemsType[] = [
    overviewSection,
    transactionsSection,
    tokenSection,
    fusionSection,
  ];

  const navProps = [
    {
      title: '',
      pages: items,
    },
  ];

  return { items: navProps };
}
