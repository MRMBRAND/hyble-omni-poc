import { ChakraProvider } from '@chakra-ui/react';

import { GenericProviderProps } from '@/AppProviders';

import { theme } from './theme/theme';

export function UiProvider({ children }: GenericProviderProps) {
  return <ChakraProvider value={theme}>{children}</ChakraProvider>;
}
