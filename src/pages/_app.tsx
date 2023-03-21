import {
  ApolloClient,
  ApolloProvider,
  createHttpLink,
  InMemoryCache,
} from '@apollo/client';
import { CacheProvider } from '@emotion/react';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { LocalizationProvider as MuiProLocalizationProvider } from '@mui/x-date-pickers-pro';
import { LicenseInfo } from '@mui/x-license-pro';
import Head from 'next/head';
import { NextSeo } from 'next-seo';
import type { ReactNode } from 'react';

import { ThemeProvider } from '@/contexts/ThemeContext';
import useTheme from '@/hooks/useTheme';
import { FeatureFlagsContextProvider } from '@/shared/FeatureFlags/FeatureFlagsContextProvider';
import { HighchartsContextProvider } from '@/shared/Highcharts/HighchartsContextProvider';
import { ONE_INCH_ANALYTICS_API_URL } from '@/shared/OneInchAnalyticsAPI/config';
import createEmotionCache from '@/shared/Rendering/Emotion';
import { OneInchAnalyticsAppProps } from '@/shared/Rendering/OneInchAnalyticsApp';
import createTheme from '@/theme';

const clientSideEmotionCache = createEmotionCache();

if (process.env.NEXT_PUBLIC_MUI_DATA_GRID_PREMIUM_LICENSE_KEY) {
  LicenseInfo.setLicenseKey(
    process.env.NEXT_PUBLIC_MUI_DATA_GRID_PREMIUM_LICENSE_KEY
  );
}

const link = createHttpLink({
  uri: ONE_INCH_ANALYTICS_API_URL,
});
const apolloClient = new ApolloClient({
  link,
  cache: new InMemoryCache(),
});

function App({
  Component,
  emotionCache = clientSideEmotionCache,
  pageProps,
}: OneInchAnalyticsAppProps) {
  const { theme } = useTheme();

  const getLayout = Component.getLayout ?? ((page: ReactNode) => page);

  return (
    <CacheProvider value={emotionCache}>
      <ApolloProvider client={apolloClient}>
        <FeatureFlagsContextProvider>
          {/* @ts-ignore */}
          <MuiProLocalizationProvider
            dateAdapter={AdapterMoment}
            localeText={{ start: 'Start date', end: 'End date' }}
          >
            <LocalizationProvider
              dateAdapter={AdapterMoment}
              localeText={{ start: 'Start date', end: 'End date' }}
            >
              <MuiThemeProvider theme={createTheme(theme)}>
                <HighchartsContextProvider>
                  {/* 
                  TODO: Hook up Google Analytics
                  <Script
                    src="https://www.googletagmanager.com/gtag/js?id=G-7FF1E0RN1X"
                    strategy="afterInteractive"
                  />
                      <Script id="google-analytics" strategy="afterInteractive">
                        {`
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){window.dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', 'G-7FF1E0RN1X');
                `}
                  </Script> */}
                  <NextSeo
                    title="1inch Info | Analytics for 1inch DEX Aggregator"
                    description="1inch Info is an analytics platform for 1inch DEX Aggregator. Explore protocol performance metrics, transactions and 1INCH fusion. Powered by Warden Finance."
                    canonical="https://info.inch.io/"
                    openGraph={{
                      url: 'https://info.inch.io/',
                      title: '1inch Info | Analytics for 1inch DEX Aggregator',
                      description:
                        '1inch Info is an analytics platform for 1inch DEX Aggregator. Explore protocol performance metrics, transactions and 1inch fusion. Powered by Warden Finance.',
                      siteName: '1inch Info',
                      images: [
                        {
                          url: 'https://i.imgur.com/2hfmY8X.jpg', // TODO: Change this
                          width: 1024,
                          height: 512,
                          type: 'image/jpeg',
                          alt: '1inch Info Banner',
                        },
                      ],
                      locale: 'en',
                    }}
                    twitter={{
                      handle: '@warden_finance',
                      site: 'https://twitter.com/warden_finance',
                      cardType: 'summary_large_image',
                    }}
                  />
                  {getLayout(<Component {...pageProps} />)}
                </HighchartsContextProvider>
              </MuiThemeProvider>
            </LocalizationProvider>
          </MuiProLocalizationProvider>
        </FeatureFlagsContextProvider>
      </ApolloProvider>
    </CacheProvider>
  );
}

const withThemeProvider = (Component: any) => {
  const AppWithThemeProvider = (props: JSX.IntrinsicAttributes) => {
    return (
      <ThemeProvider>
        <Head>
          <meta
            name="viewport"
            content="initial-scale=1.0, width=device-width"
          />
        </Head>
        <Component {...props} />
      </ThemeProvider>
    );
  };
  AppWithThemeProvider.displayName = 'AppWithThemeProvider';
  return AppWithThemeProvider;
};

export default withThemeProvider(App);
