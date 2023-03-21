import { FeatureFlags } from './FeatureFlags.type';

const LOCAL_STORAGE_KEY = 'featureFlags';

export function storeFeatureFlags(featureFlags: FeatureFlags) {
  if (typeof window === 'undefined') {
    return;
  }

  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(featureFlags));
  return featureFlags;
}

export function storeFeatureFlag(key: string, value: boolean) {
  if (typeof window === 'undefined') {
    return;
  }

  localStorage.setItem(
    LOCAL_STORAGE_KEY,
    JSON.stringify({ ...loadStoredFeatureFlags(), [key]: value })
  );
}

export function loadStoredFeatureFlags(): FeatureFlags {
  if (typeof window === 'undefined') {
    return {};
  }

  const storedFlags = localStorage.getItem(LOCAL_STORAGE_KEY);

  if (!storedFlags) {
    return {};
  }

  return JSON.parse(storedFlags);
}
