import { css } from '@emotion/react';
import { Alert, Button, CssBaseline, Snackbar } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import React, { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';

import { FeatureFlagsDialog } from '@/components/FeatureFlagsDialog';
import GlobalStyle from '@/components/GlobalStyle';
import Navbar from '@/components/navbar/Navbar';
import { getNavItems } from '@/components/sidebar/dashboardItems';
import Sidebar from '@/components/sidebar/Sidebar';
import { SidebarNavProps } from '@/components/sidebar/SidebarNav';
import {
  FeatureFlagsContextProvider,
  useFeatureFlags,
} from '@/shared/FeatureFlags/FeatureFlagsContextProvider';
import {
  OneInchAnalyticsAPIProvider,
  useOneInchAnalyticsAPIContext,
} from '@/shared/OneInchAnalyticsAPI/OneInchAnalyticsAPIProvider';

const DISMISSED_MESSAGES_LOCAL_STORAGE_KEY = 'dismissedMessages';

function getPreviouslyDismissedMessages(): string[] {
  if (typeof window === 'undefined') {
    return [];
  }

  const value = localStorage.getItem(DISMISSED_MESSAGES_LOCAL_STORAGE_KEY);
  if (value) {
    return JSON.parse(value);
  }
  return [];
}

function storeDismissedMessage(messages: string[]): void {
  localStorage.setItem(
    DISMISSED_MESSAGES_LOCAL_STORAGE_KEY,
    JSON.stringify(messages)
  );
}

function useSystemStatus() {
  const { systemStatus } = useOneInchAnalyticsAPIContext();

  const [dismissedMessages, setDismissedMessages] = useState(
    getPreviouslyDismissedMessages()
  );

  const message =
    systemStatus && !dismissedMessages.includes(systemStatus.id)
      ? systemStatus.message
      : undefined;

  const dismissMessage = () => {
    if (!systemStatus) {
      return;
    }
    setDismissedMessages([...dismissedMessages, systemStatus.id]);
    storeDismissedMessage([...dismissedMessages, systemStatus.id]);
  };

  return {
    dismissMessage,
    message,
  };
}

const drawerWidth = 310;

interface DashboardType {
  children?: React.ReactNode;
  sidebarNavProps?: SidebarNavProps;
}

function storeFeatureFlagsDialogOpen(value: boolean) {
  if (typeof window === 'undefined') {
    return;
  }

  localStorage.setItem('featureFlagsDialogOpen', value.toString());
}

function getFeatureFlagsDialogOpen() {
  if (typeof window === 'undefined') {
    return false;
  }

  const value = localStorage.getItem('featureFlagsDialogOpen');
  if (value === 'true') {
    return true;
  }
  return false;
}

function DashboardInternal({ children, sidebarNavProps }: DashboardType) {
  const { hasForcedFeatureFlags, clear, ...featureFlags } = useFeatureFlags();
  const [featureFlagsDialogOpen, setFeatureFlagsDialogOpen] = useState(
    getFeatureFlagsDialogOpen()
  );
  const { message, dismissMessage } = useSystemStatus();

  useEffect(() => {
    storeFeatureFlagsDialogOpen(featureFlagsDialogOpen);
  }, [featureFlagsDialogOpen]);

  sidebarNavProps = sidebarNavProps ?? getNavItems(featureFlags);
  const theme = useTheme();
  const isLg = useMediaQuery(theme.breakpoints.up('lg'));

  const [mobileOpen, setMobileOpen] = useState(true);

  useEffect(() => {
    setMobileOpen(isLg);
  }, [isLg]);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <>
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={!!message}
      >
        <Alert
          severity="warning"
          sx={{ width: '100%' }}
          action={
            <Button
              color="secondary"
              size="small"
              onClick={() => dismissMessage()}
            >
              Dismiss
            </Button>
          }
        >
          {message}
        </Alert>
      </Snackbar>
      <CssBaseline enableColorScheme />
      <GlobalStyle />
      <div
        css={(theme) => [
          css`
            width: ${0}px;
          `,
          mobileOpen &&
            css`
              width: ${drawerWidth}px;
            `,
        ]}
      >
        <div>
          <Sidebar
            variant="persistent"
            PaperProps={{
              style: {
                width: drawerWidth,
              },
            }}
            onClose={handleDrawerToggle}
            open={mobileOpen}
            sidebarNavProps={sidebarNavProps}
          />
        </div>
      </div>
      <div
        css={css`
          flex: 1;
          display: flex;
          flex-direction: column;
          max-width: 100%;
        `}
      >
        <Navbar onDrawerToggle={handleDrawerToggle} drawerOpen={!mobileOpen} />
        <div
          css={(theme) => css`
            flex: 1;
          `}
        >
          <div
            css={css`
              position: fixed;
              right: 50px;
              bottom: 50px;
              z-index: 9000;
            `}
          >
            {hasForcedFeatureFlags && (
              <FeatureFlagsDialog
                featureFlags={featureFlags}
                open={featureFlagsDialogOpen}
                onClose={() => setFeatureFlagsDialogOpen(false)}
                onOpen={() => setFeatureFlagsDialogOpen(true)}
                onClear={() => {
                  clear();
                  setFeatureFlagsDialogOpen(false);
                }}
              />
            )}
          </div>

          <div
            css={css`
              z-index: 2;
              height: 100%;
              position: relative;
            `}
          >
            {children}
          </div>
          <Outlet />
        </div>
      </div>
    </>
  );
}

const Dashboard: React.FC<DashboardType> = ({ children, sidebarNavProps }) => {
  return (
    <div
      css={css`
        display: flex;
        min-height: 100vh;
      `}
    >
      <FeatureFlagsContextProvider>
        <OneInchAnalyticsAPIProvider>
          <DashboardInternal sidebarNavProps={sidebarNavProps}>
            {children}
          </DashboardInternal>
        </OneInchAnalyticsAPIProvider>
      </FeatureFlagsContextProvider>
    </div>
  );
};

export default Dashboard;
