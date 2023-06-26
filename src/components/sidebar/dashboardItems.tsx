import AccountBalanceOutlinedIcon from '@mui/icons-material/AccountBalanceOutlined';
import StackedBarChartOutlinedIcon from '@mui/icons-material/StackedBarChartOutlined';

import { FeatureFlags } from '@/shared/FeatureFlags/FeatureFlags.type';
import { SidebarItemsType } from '@/types/sidebar';

import { RoundedImageIcon } from '../icons/RoundedImageIcon';
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
        icon: () => <StackedBarChartOutlinedIcon />,
        title: 'Overview',
      },
    ],
    [
      PageSection.TRANSACTIONS,
      {
        href: '/transactions',
        icon: () => <RoundedImageIcon size="small" src="/warden/swap.svg" />,
        title: 'Transactions',
      },
    ],
    [
      PageSection.FUSION,
      {
        href: '/fusion',
        icon: () => (
          <img
            height="20px"
            width="20px"
            src="/vendors/1inch/fusion.webp"
            alt="fusion"
          />
        ),
        title: 'Fusion Mode',
      },
    ],
    [
      PageSection.TOKEN,
      {
        href: '/token',
        icon: () => (
          <img
            height="20px"
            width="20px"
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
        icon: () => <AccountBalanceOutlinedIcon />,
        title: 'Treasury',
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
