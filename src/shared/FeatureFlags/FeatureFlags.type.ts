export interface FeatureFlags {
  enableAllExperimentalFeatures?: boolean;
  sudo?: boolean;
  enableTransactionsPage?: boolean;
  enableMockData?: boolean;
}

export interface FeatureFlagsContextState extends FeatureFlags {
  hasForcedFeatureFlags: boolean;
  runtimeFeatureFlagsLoaded: boolean;
  clear: () => void;
}
