import { Box, Flex, Spinner, Text } from '@chakra-ui/react';

import { OmniEmbed } from '@/components/shared/OmniEmbed/OmniEmbed';
import { useFetchOmniEmbedUrlQuery } from '@/services/cache/queries/useFetchOmniEmbedUrlQuery';

function Analytics() {
  const { data, isLoading, error } = useFetchOmniEmbedUrlQuery();

  if (isLoading) {
    return (
      <Flex justify="center" align="center" h="calc(100vh - 80px)">
        <Spinner size="lg" />
      </Flex>
    );
  }

  if (error || !data?.url) {
    return (
      <Flex justify="center" align="center" h="calc(100vh - 80px)">
        <Box
          p={6}
          borderRadius="md"
          bg="red.50"
          borderLeft="4px solid"
          borderColor="red.500"
        >
          <Text color="red.800">
            Failed to load analytics embed. Please try refreshing the page.
          </Text>
        </Box>
      </Flex>
    );
  }

  return <OmniEmbed url={data.url} />;
}

export default Analytics;
