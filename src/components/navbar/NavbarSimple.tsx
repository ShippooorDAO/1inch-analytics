import styled from '@emotion/styled';
import { Menu as MenuIcon } from '@mui/icons-material';
import {
  AppBar as MuiAppBar,
  Grid,
  IconButton as MuiIconButton,
  Toolbar,
} from '@mui/material';
import React from 'react';

const AppBar = styled(MuiAppBar)`
  background: ${(props) => props.theme.header.background};
  color: ${(props) => props.theme.header.color};
`;

const IconButton = styled(MuiIconButton)`
  svg {
    width: 22px;
    height: 22px;
  }
`;

interface NavbarProps {
  onDrawerToggle: React.MouseEventHandler<HTMLElement>;
}

function NavbarSimple({ onDrawerToggle }: NavbarProps) {
  return (
    <React.Fragment>
      <AppBar position="sticky" elevation={0}>
        <Toolbar>
          <Grid container alignItems="center">
            <Grid item sx={{ display: { xs: 'block', md: 'none' } }}>
              <IconButton
                color="inherit"
                aria-label="Open drawer"
                onClick={onDrawerToggle}
                size="large"
              >
                <MenuIcon />
              </IconButton>
              <img
                alt="1inch logo"
                src="/vendors/1inch/1inch_logo_dark_full.svg"
                height="35px"
              />
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
    </React.Fragment>
  );
}

export default NavbarSimple;
