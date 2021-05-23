import { Box, HStack, Button } from "@chakra-ui/react";
import { useUser } from "../hooks/useUser";
export default function AppNav() {
  const { signout } = useUser();
  return (
    <Box>
      <HStack spacing="6">
        <Button variant="link" color="black" onClick={signout} fontWeight="400">
          Sign out
        </Button>
      </HStack>
    </Box>
  );
}
