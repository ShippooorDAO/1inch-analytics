import { css } from '@emotion/react';
import { Menu as MenuIcon } from '@mui/icons-material';
import {
  AppBar,
  Button,
  IconButton,
  Link,
  Toolbar,
  Typography,
} from '@mui/material';
import React from 'react';

import { LastSyncWidget } from './LastSyncWidget';

interface NavbarProps {
  drawerOpen: boolean;
  onDrawerToggle: React.MouseEventHandler<HTMLElement>;
}

function Navbar({ onDrawerToggle, drawerOpen }: NavbarProps) {
  return (
    <React.Fragment>
      <AppBar
        position="sticky"
        elevation={0}
        css={(theme) => css`
          background: ${theme.sidebar.background};
          border-radius: 0;
          color: ${theme.header.color};
        `}
      >
        <Toolbar>
          <div
            css={css`
              display: flex;
              flex-flow: row;
              justify-content: space-between;
              align-items: center;
              gap: 20px;
              width: 100%;
              padding: 10px 5px;
              white-space: nowrap;
            `}
          >
            {drawerOpen && (
              <div
                css={css`
                  display: flex;
                  flex-flow: row;
                  justify-content: space-between;
                  align-items: center;
                  gap: 10px;
                `}
              >
                <Link
                  href="/"
                  css={css`
                    display: flex;
                  `}
                >
                  <img
                    alt="1inch logo"
                    src="/vendors/1inch/1inch_logo_dark_full.svg"
                    height="35px"
                  />
                </Link>
                <IconButton
                  color="inherit"
                  aria-label="Open drawer"
                  onClick={onDrawerToggle}
                  size="large"
                  css={css`
                    svg {
                      width: 22px;
                      height: 22px;
                    }
                  `}
                >
                  <MenuIcon />
                </IconButton>
              </div>
            )}
            <div
              css={css`
                flex-grow: 1;
              `}
            />
            <Button href="https://dune.com/1inch/" target="_blank">
              <Typography variant="body2">Dune Analytics</Typography>
            </Button>
            <Button href="https://app.1inch.io/" target="_blank">
              <Typography variant="body2">1inch App</Typography>
            </Button>
            <LastSyncWidget />
          </div>
        </Toolbar>
      </AppBar>
    </React.Fragment>
  );
}

export default Navbar;
