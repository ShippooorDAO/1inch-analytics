import { useOneInchAnalyticsAPIContext } from '@/contexts/OneInchAnalyticsAPI/OneInchAnalyticsAPIProvider';

export function useChainStore() {
  const { chainStore } = useOneInchAnalyticsAPIContext();
  return chainStore;
}
