import { useOneInchAnalyticsAPIContext } from '@/shared/OneInchAnalyticsAPI/OneInchAnalyticsAPIProvider';

export function useChainStore() {
  const { chainStore } = useOneInchAnalyticsAPIContext();
  return chainStore;
}
