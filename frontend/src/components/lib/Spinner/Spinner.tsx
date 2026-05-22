import { Center, Spinner as ChakraSpinner } from '@chakra-ui/react';
import { useEffect } from 'react';

interface ISpinnerProps {
  fullscreen: boolean;
}

export function Spinner({ fullscreen }: ISpinnerProps) {
  // prevents unwanted scrollbar
  useEffect(() => {
    if (!fullscreen) return;

    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [fullscreen]);

  if (fullscreen) {
    return (
      <Center position="fixed" top={0} left={0} right={0} bottom={0}>
        <ChakraSpinner size="lg" data-testid="spinner" />
      </Center>
    );
  }
  return <ChakraSpinner data-testid="spinner" />;
}
