export interface FeatureFlags {
  enableAllExperimentalFeatures?: boolean;
  sudo?: boolean;
  enableTransactionsPage?: boolean;
}

export interface FeatureFlagsContextState extends FeatureFlags {
  hasForcedFeatureFlags: boolean;
  runtimeFeatureFlagsLoaded: boolean;
  clear: () => void;
}
