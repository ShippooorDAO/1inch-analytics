import { css } from '@emotion/react';
import { List } from '@mui/material';

import { SidebarItemsType } from '@/types/sidebar';

import SidebarNavSection from './SidebarNavSection';

export interface SidebarNavProps {
  items: {
    title: string;
    pages: SidebarItemsType[];
  }[];
}

const SidebarNav = ({ items }: SidebarNavProps) => {
  return (
    <div
      css={(theme) => css`
        border-right: 1px solid rgba(0, 0, 0, 0.12);
        flex-grow: 1;
        overflow: hidden;
        background-color: ${theme.sidebar.background};
        &:hover {
          overflow: auto;
        }
      `}
    >
      <List disablePadding>
        <div
          css={(theme) => css`
            padding-top: ${theme.spacing(1)};
            padding-bottom: ${theme.spacing(2.5)};
          `}
        >
          {items &&
            items.map((item) => (
              <SidebarNavSection
                component="div"
                key={item.title}
                pages={item.pages}
                title={item.title}
              />
            ))}
        </div>
      </List>
    </div>
  );
};

export default SidebarNav;
