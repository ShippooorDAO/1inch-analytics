export interface FeatureFlags {
  enableAllExperimentalFeatures?: boolean;
  sudo?: boolean;
}

export interface FeatureFlagsContextState extends FeatureFlags {
  hasForcedFeatureFlags: boolean;
  runtimeFeatureFlagsLoaded: boolean;
  clear: () => void;
}
