import { FeatureFlags } from './FeatureFlags.type';

export const staticFeatureFlags: FeatureFlags = {
  enableTransactionsPage:
    process.env.NEXT_PUBLIC_FEATURE_FLAG_ENABLE_TRANSACTIONS_PAGE === 'true',
};
