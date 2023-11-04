import { FeatureFlags } from '@/contexts/FeatureFlags/FeatureFlags.type';

import { SidebarItemsType } from './Sidebar.type';
import { SidebarNavProps } from './SidebarNav';

export enum PageSection {
  OVERVIEW,
  TRANSACTIONS,
  FUSION,
  TOKEN,
  TREASURY,
}

export const pageSections: ReadonlyMap<PageSection, SidebarItemsType> = new Map(
  [
    [
      PageSection.OVERVIEW,
      {
        href: '/',
        icon: () => (
          <img height="24px" width="24px" src="/chart.svg" alt="overview" />
        ),
        title: 'Overview',
      },
    ],
    [
      PageSection.TRANSACTIONS,
      {
        href: '/transactions',
        icon: () => (
          <img height="24px" width="24px" src="/swap.svg" alt="transactions" />
        ),
        title: 'Transactions',
      },
    ],
    [
      PageSection.FUSION,
      {
        href: '/fusion',
        icon: () => (
          <img
            height="24px"
            width="24px"
            src="/vendors/1inch/fusion.webp"
            alt="fusion"
          />
        ),
        title: 'Fusion Mode',
        badge: 'Maintenance',
        disabled: true,
      },
    ],
    [
      PageSection.TOKEN,
      {
        href: '/token',
        icon: () => (
          <img
            height="24px"
            width="24px"
            src="/vendors/1inch/1inch_logo.svg"
            alt="1inch token"
          />
        ),
        title: '1INCH Token',
      },
    ],
    [
      PageSection.TREASURY,
      {
        href: '/treasury',
        icon: () => (
          <img height="24px" width="24px" src="/bank.svg" alt="treasury" />
        ),
        title: 'Treasury',
      },
    ],
    [
      PageSection.TRANSACTIONS,
      {
        href: '/transactions',
        icon: () => (
          <img height="24px" width="24px" src="/swap.svg" alt="transactions" />
        ),
        title: 'Transactions',
        badge: 'Soon',
        disabled: true,
      },
    ],
  ]
);

export function getNavItems(featureFlags: FeatureFlags): SidebarNavProps {
  const overviewSection = pageSections.get(PageSection.OVERVIEW)!;
  const tokenSection = pageSections.get(PageSection.TOKEN)!;
  const fusionSection = pageSections.get(PageSection.FUSION)!;
  const treasurySection = pageSections.get(PageSection.TREASURY)!;

  const items: SidebarItemsType[] = [
    overviewSection,
    tokenSection,
    fusionSection,
    treasurySection,
  ];

  if (featureFlags.enableTransactionsPage) {
    const transactionsSection = pageSections.get(PageSection.TRANSACTIONS)!;
    items.push(transactionsSection);
  }

  const navProps = [
    {
      title: '',
      pages: items,
    },
  ];

  return { items: navProps };
}
