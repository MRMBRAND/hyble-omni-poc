import { Button, Flex, Icon } from '@chakra-ui/react';
import { ElementType } from 'react';

import gradients from 'services/ui/theme/gradients';

interface PrimaryButtonProps {
  text: string;
  onClick: () => void;
  icon?: ElementType;
  sm?: boolean;
  isDisabled?: boolean;
  isLoading?: boolean;
  loadingText?: string;
  dataTestId?: string;
}

export const PrimaryButton = ({
  text,
  onClick,
  icon,
  sm = false,
  isDisabled = false,
  isLoading = false,
  loadingText = 'Loading...',
  dataTestId = 'primary-button',
}: PrimaryButtonProps) => {
  return (
    <Button
      color={'white'}
      w={'fit-content'}
      bgGradient={isDisabled ? '' : gradients['blueMartini'][0]}
      bgColor={isDisabled ? 'charcoalGrey' : ''}
      borderRadius={'999px'}
      paddingLeft={sm ? '5' : '6'}
      paddingRight={sm ? (icon ? '4' : '5') : icon ? '5' : '6'}
      onClick={onClick}
      disabled={isDisabled}
      loading={isLoading}
      loadingText={loadingText}
      _disabled={{ bg: 'charcoalGrey' }}
      _focus={{
        bgGradient: isDisabled ? '' : gradients['blueMartini'][1],
      }}
      _hover={{
        bgGradient: isDisabled ? '' : gradients['blueMartini'][1],
      }}
      data-testid={dataTestId}
    >
      <Flex gap={3} align={'center'}>
        {text}
        {icon && <Icon as={icon} />}
      </Flex>
    </Button>
  );
};
