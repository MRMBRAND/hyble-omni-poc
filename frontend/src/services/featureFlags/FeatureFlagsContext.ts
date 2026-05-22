import { createContext } from 'react';

import { FeatureFlags } from 'services/api/apis/featureFlagsApi';

export const FeatureFlagsContext = createContext<FeatureFlags>([]);
