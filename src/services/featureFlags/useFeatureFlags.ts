import { useContext } from 'react';

import { FeatureFlagsContext } from './FeatureFlagsContext';

export const useFeatureFlags = () => useContext(FeatureFlagsContext);
