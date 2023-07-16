import { useOneInchAnalyticsAPIContext } from '@/shared/OneInchAnalyticsAPI/OneInchAnalyticsAPIProvider';

export function useAssetStore() {
  const { assetService } = useOneInchAnalyticsAPIContext();
  return assetService?.store;
}
