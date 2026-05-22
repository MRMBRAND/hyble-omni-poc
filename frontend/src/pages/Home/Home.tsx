import { Flex, Heading } from '@chakra-ui/react';

import { PrimaryButton } from '@/components/lib/buttons/PrimaryButton';

function Home() {
  return (
    <Flex direction={'column'} px={10} pt={5} gap={6}>
      <Heading>Hyble Omni POC</Heading>
      <div>Nice page</div>
      <PrimaryButton
        text="Nice button"
        onClick={() => console.log('Button clicked')}
      />
    </Flex>
  );
}

export default Home;
