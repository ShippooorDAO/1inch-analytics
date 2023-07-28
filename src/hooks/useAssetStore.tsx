import { useOneInchAnalyticsAPIContext } from '@/contexts/OneInchAnalyticsAPI/OneInchAnalyticsAPIProvider';

export function useAssetStore() {
  const { assetService } = useOneInchAnalyticsAPIContext();
  return assetService?.store;
}
