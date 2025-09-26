import { createApiClient } from '../createApiClient';
import {
  getLocalFeatureFlagsEndpoint,
  getRemoteFeatureFlagsEndpoint,
} from '../endpoints';

export type FeatureFlag = 'example-feature-1' | 'example-feature-2';
export type FeatureFlags = FeatureFlag[];

const FEATURE_FLAGS_NAMESPACE = 'HYBLE';

// local app still fetches from dev and we can override using public/features.json
function combineFeatureFlags(featureFlags: FeatureFlag[]) {
  const set = new Set<string>();

  for (const featureFlag of featureFlags) {
    if (featureFlag.startsWith('-')) {
      set.delete(featureFlag.slice(1));
    } else {
      set.add(featureFlag);
    }
  }

  return Array.from(set) as FeatureFlags;
}

export const createFeatureFlagsApi = (
  apiClient: ReturnType<typeof createApiClient>,
) => ({
  fetchFeatureFlags: async (): Promise<FeatureFlags> => {
    const remoteFeatureFlagsRequest = new Request(
      getRemoteFeatureFlagsEndpoint(),
      {
        headers: new Headers({
          'X-Hyble-Namespace': FEATURE_FLAGS_NAMESPACE,
        }),
      },
    );

    const remoteFeatureFlags = await apiClient.fetchHelper<FeatureFlags>(
      remoteFeatureFlagsRequest,
    );

    let localFeatureFlags: FeatureFlags = [];

    try {
      const localFeatureFlagsRequest = new Request(
        getLocalFeatureFlagsEndpoint(),
      );

      localFeatureFlags = await apiClient.fetchHelper<FeatureFlags>(
        localFeatureFlagsRequest,
      );
    } catch {
      // ignore
    }

    const allFeatureFlags = combineFeatureFlags([
      ...remoteFeatureFlags,
      ...localFeatureFlags,
    ]);

    console.log(allFeatureFlags);

    return allFeatureFlags;
  },
});
