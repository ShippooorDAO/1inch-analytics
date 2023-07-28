import { useOneInchAnalyticsAPIContext } from '@/contexts/OneInchAnalyticsAPI/OneInchAnalyticsAPIProvider';

export function useAssetService() {
  const { assetService } = useOneInchAnalyticsAPIContext();
  return assetService;
}
