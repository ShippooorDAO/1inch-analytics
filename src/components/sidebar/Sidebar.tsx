import { css } from '@emotion/react';
import { Menu } from '@mui/icons-material';
import { Drawer, IconButton, PaperProps } from '@mui/material';
import Link from 'next/link';

import { UniswapV3SubgraphProvider } from '@/contexts/UniswapV3Subgraph/UniswapV3SubgraphProvider';

import { GasMeter } from '../GasMeter';
import SidebarNav, { SidebarNavProps } from './SidebarNav';

export interface SidebarProps {
  PaperProps?: PaperProps;
  variant?: 'permanent' | 'persistent' | 'temporary';
  open?: boolean;
  onClose?: () => void;
  sidebarNavProps: SidebarNavProps;
}

const Sidebar = ({ sidebarNavProps, ...rest }: SidebarProps) => {
  return (
    <Drawer
      css={css`
        border-right: 0;
        > div {
          border-right: 0;
        }
      `}
      variant="permanent"
      anchor="left"
      {...rest}
    >
      <div
        css={(theme) => css`
          display: flex;
          flex-flow: row;
          justify-content: space-between;
          align-items: center;
          background-color: ${theme.sidebar.background};
        `}
      >
        <Link href="/">
          <div
            css={css`
              display: flex;
              flex-flow: row;
              padding: 20px 30px;
              cursor: pointer;
            `}
          >
            <img
              alt="1inch logo"
              src="/vendors/1inch/1inch_logo_dark_full.svg"
              height="35px"
            />
          </div>
        </Link>
        <IconButton
          color="inherit"
          aria-label="Open drawer"
          onClick={rest.onClose}
          size="large"
          css={css`
            svg {
              width: 22px;
              height: 22px;
            }
          `}
        >
          <Menu />
        </IconButton>
      </div>

      <SidebarNav {...sidebarNavProps} />

      <div
        css={(theme) => css`
          display: flex;
          justify-content: center;
          background-color: ${theme.sidebar.background};
          padding: 0 12px 20px;
        `}
      >
        <UniswapV3SubgraphProvider>
          <GasMeter />
        </UniswapV3SubgraphProvider>
      </div>
    </Drawer>
  );
};

export default Sidebar;
