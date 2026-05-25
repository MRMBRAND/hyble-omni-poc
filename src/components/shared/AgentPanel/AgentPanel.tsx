import { Box, Flex, Spinner, Text, VStack } from '@chakra-ui/react';
import { useRef } from 'react';

import { OmniEmbed } from '@/components/shared/OmniEmbed/OmniEmbed';
import { useFetchOmniAgentUrlQuery } from '@/services/cache/queries/useFetchOmniAgentUrlQuery';

interface AgentPanelProps {
  isOpen: boolean;
  minWidth?: number;
  maxWidth?: number;
  initialWidth?: number;
}

export function AgentPanel({
  isOpen,
  minWidth = 250,
  maxWidth = 800,
  initialWidth = 350,
}: AgentPanelProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const { data, isLoading, error } = useFetchOmniAgentUrlQuery(isOpen);

  const renderContent = () => {
    if (isLoading) {
      return (
        <Flex justify="center" align="center" w="100%" h="100%">
          <Spinner size="lg" />
        </Flex>
      );
    }

    if (error || !data?.url) {
      return (
        <VStack justify="center" align="center" w="100%" h="100%" gap={4} p={4}>
          <Text color="red.600" textAlign="center" fontSize="sm">
            Failed to load AI Agent. Please try refreshing the page.
          </Text>
        </VStack>
      );
    }

    return <OmniEmbed url={data.url} allowMicrophone />;
  };

  if (!isOpen) {
    return null;
  }

  return (
    <Box
      ref={panelRef}
      w={`${initialWidth}px`}
      minW={`${minWidth}px`}
      maxW={`${maxWidth}px`}
      h="100%"
      borderLeft="1px solid"
      borderColor="gray.200"
      bg="white"
      display="flex"
      flexDirection="column"
      resize="horizontal"
      overflowX="auto"
      css={{
        '&::-webkit-resizer': {
          backgroundColor: 'rgba(0, 0, 0, 0.1)',
        },
      }}
    >
      {renderContent()}
    </Box>
  );
}
