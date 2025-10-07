import { Flex, Heading } from '@chakra-ui/react';

import { PrimaryButton } from '@/components/lib/buttons/PrimaryButton';
import { useFetchStatusQuery } from '@/services/cache/queries/useFetchStatusQuery';

function Home() {
  const { data: status } = useFetchStatusQuery();

  return (
    <Flex direction={'column'} px={10} pt={5} gap={6}>
      <Heading>Toolkit app home page</Heading>
      <div>Orders Service Status: OK: {status?.success?.toString()}</div>
      <PrimaryButton
        text="Example Button"
        onClick={() => console.log('Button clicked')}
      />
    </Flex>
  );
}

export default Home;
