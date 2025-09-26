import { ReactNode } from 'react';

type GenericProviderProps = {
  children: ReactNode;
};

type GenericProvider = React.ComponentType<GenericProviderProps>;

interface AppProvidersProps {
  providers: GenericProvider[];
  children: ReactNode;
}

// this component transforms the flat array of providers into a nested component
// hierarchy, typical of what you would expect to find in index.tsx
export const AppProviders = ({ providers, children }: AppProvidersProps) =>
  providers.reduceRight(
    (acc, Provider) => <Provider>{acc}</Provider>,
    children,
  );
