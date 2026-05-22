import { Heading, Text, VStack } from '@chakra-ui/react';

function Unauthorized() {
  return (
    <VStack align="center" justify="center" pt={5}>
      <Heading size="lg" color="red">
        Access denied
      </Heading>
      <Text fontSize="lg">You are not permitted to access this app.</Text>
    </VStack>
  );
}

export default Unauthorized;
