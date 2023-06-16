import { FeatureFlags } from './FeatureFlags.type';

export const staticFeatureFlags: FeatureFlags = {
  enableMockData: process.env.NEXT_PUBLIC_ENABLE_MOCK_DATA === 'true',
  enableTransactionsPage: false,
};
