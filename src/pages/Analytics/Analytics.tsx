import { Box, Flex, Spinner, Tabs, Text } from '@chakra-ui/react';
import { useState } from 'react';

import { OmniEmbed } from '@/components/shared/OmniEmbed/OmniEmbed';
import { useFetchOmniAgentUrlQuery } from '@/services/cache/queries/useFetchOmniAgentUrlQuery';
import { useFetchOmniEmbedUrlQuery } from '@/services/cache/queries/useFetchOmniEmbedUrlQuery';

function Analytics() {
  const [activeTab, setActiveTab] = useState<'analytics' | 'agent'>(
    'analytics',
  );

  const embedQuery = useFetchOmniEmbedUrlQuery();
  const agentQuery = useFetchOmniAgentUrlQuery(activeTab === 'agent');

  const renderTabContent = (
    query: ReturnType<
      typeof useFetchOmniEmbedUrlQuery | typeof useFetchOmniAgentUrlQuery
    >,
    allowMicrophone: boolean,
  ) => {
    const { data, isLoading, error } = query;

    if (isLoading) {
      return (
        <Flex justify="center" align="center" w="100%" h="100%">
          <Spinner size="lg" />
        </Flex>
      );
    }

    if (error || !data?.url) {
      return (
        <Flex justify="center" align="center" w="100%" h="100%">
          <Box
            p={6}
            borderRadius="md"
            bg="red.50"
            borderLeft="4px solid"
            borderColor="red.500"
          >
            <Text color="red.800">
              Failed to load embed. Please try refreshing the page.
            </Text>
          </Box>
        </Flex>
      );
    }

    return <OmniEmbed url={data.url} allowMicrophone={allowMicrophone} />;
  };

  return (
    <Flex direction="column" h="calc(100vh - 80px)">
      <Tabs.Root
        value={activeTab}
        onValueChange={(e) => setActiveTab(e.value as 'analytics' | 'agent')}
        display="flex"
        flexDirection="column"
        h="100%"
      >
        <Tabs.List>
          <Tabs.Trigger value="analytics">Analytics</Tabs.Trigger>
          <Tabs.Trigger value="agent">AI Agent</Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content
          value="analytics"
          flex="1"
          display="flex"
          overflowY="auto"
        >
          {renderTabContent(embedQuery, false)}
        </Tabs.Content>
        <Tabs.Content value="agent" flex="1" display="flex" overflowY="auto">
          {renderTabContent(agentQuery, true)}
        </Tabs.Content>
      </Tabs.Root>
    </Flex>
  );
}

export default Analytics;
