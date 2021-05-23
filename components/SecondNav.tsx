import { Box, Link, HStack, Button } from "@chakra-ui/react";
import NextLink from "next/link";
import { useUser } from "../hooks/useUser";
export default function SecondNav() {
  const { user, loading } = useUser();
  return (
    <Box>
      <HStack spacing="6">
        {!loading && !!user ? (
          <NextLink passHref href="/app">
            <Button colorScheme="cyan">Dashboard</Button>
          </NextLink>
        ) : (
          <>
            <NextLink passHref href="/auth/signin">
              <Link>Login</Link>
            </NextLink>
            <NextLink passHref href="/auth/signup">
              <Button colorScheme="green" as="a">
                Sign up
              </Button>
            </NextLink>
          </>
        )}
      </HStack>
    </Box>
  );
}
