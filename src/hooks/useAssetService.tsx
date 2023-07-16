import { useOneInchAnalyticsAPIContext } from '@/shared/OneInchAnalyticsAPI/OneInchAnalyticsAPIProvider';

export function useAssetService() {
  const { assetService } = useOneInchAnalyticsAPIContext();
  return assetService;
}
