export interface FeatureFlags {
  enableAllExperimentalFeatures?: boolean;
  sudo?: boolean;

  enableMockData?: boolean;
}

export interface FeatureFlagsContextState extends FeatureFlags {
  hasForcedFeatureFlags: boolean;
  runtimeFeatureFlagsLoaded: boolean;
  clear: () => void;
}
