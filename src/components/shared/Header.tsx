import { useAuth0 } from '@auth0/auth0-react';
import { Box, Button, Flex, Icon, Link, Spacer } from '@chakra-ui/react';
import { SVGProps } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAgentPanel } from '@/services/agent/AgentPanelContext';

import {
  ChevronLeft,
  HybleLogo,
  Logout,
  QuestionMark,
} from 'components/lib/Icons';

const ChatIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width="1em"
    height="1em"
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H8l-2 2V4h14v12z" />
  </svg>
);

const Header = () => {
  const navigate = useNavigate();
  const { logout } = useAuth0();
  const { togglePanel } = useAgentPanel();

  return (
    <Flex
      h="60px"
      bg="darkestTeal"
      alignItems="center"
      px="24px"
      position={'sticky'}
      boxShadow="0px 4px 20px 0px rgba(0, 0, 0, 0.25)"
    >
      <Button
        onClick={() => navigate('/')}
        background="none"
        padding="0"
        _hover={{ bgColor: 'none' }}
        _active={{ bgColor: 'none' }}
      >
        <Icon as={HybleLogo} w="57px" h="24px" />
      </Button>

      <Button
        variant="ghost"
        color="white"
        fontWeight="700"
        pb="2px"
        _hover={{ bg: 'none', opacity: 0.7 }}
        _focus={{ bg: 'none' }}
        _active={{ bg: 'none' }}
      >
        <Icon as={ChevronLeft} pb={0.5} h="100%" color="white" size="sm" />
        <Link color="white" href={window.ENV_CONFIG.urls.toolkitHomepage}>
          Back to Toolkit
        </Link>
      </Button>

      <Spacer />

      <Flex
        align={'center'}
        gap={4}
        style={{ cursor: 'pointer' }}
        color={'mrmMedTeal'}
      >
        <Box
          onClick={togglePanel}
          _hover={{ color: 'mrmMedDarkTeal' }}
          title="Toggle AI Agent"
        >
          <Icon as={ChatIcon} w="20px" h="20px" />
        </Box>

        <Link
          href={'https://support.hyble.tech/'}
          target="_blank"
          rel="noreferrer noopener"
          _hover={{ color: 'mrmTeal' }}
          data-heap="header_supportButton"
          data-testid="support-button"
        >
          <Icon
            as={QuestionMark}
            color="mrmMedDarkTeal"
            _hover={{ color: 'mrmTeal' }}
          />
        </Link>

        <Box
          onClick={() =>
            logout({ logoutParams: { returnTo: window.location.origin } })
          }
          _hover={{ color: 'mrmMedDarkTeal' }}
        >
          <Icon data-testid="header-logout" as={Logout} w="24px" h="24px" />
        </Box>
      </Flex>
    </Flex>
  );
};

export default Header;
