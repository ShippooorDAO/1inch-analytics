import { EmotionCache } from '@emotion/react';
import type { NextPage } from 'next';
import type { AppProps } from 'next/app';
import { ReactNode } from 'react';

export type GetLayout = (page: ReactNode) => ReactNode;

export type Page<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: GetLayout;
};

export type OneInchAnalyticsAppProps<P = {}> = AppProps<P> & {
  emotionCache?: EmotionCache;
  Component: Page<P>;
};
