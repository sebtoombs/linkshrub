import React from "react";
import NextLink from "next/link";
import SignIn from "../../components/Signin";

import Layout from "../../components/Layout";
import Container from "../../components/Container";
import { Box, Center, Flex, Link } from "@chakra-ui/react";
import Head from "../../components/Head";

export default function SigninPage() {
  return (
    <Layout>
      <Head title="Sigin" />
      <Box>
        <Container maxW="lg">
          <Center py={["20", null, null, "32"]} textAlign="center">
            <Box bg="white" shadow="xl" rounded="lg" minW="100%" py="4" px="6">
              <SignIn />
              <Flex mt="6">
                <Box>
                  <NextLink passHref href="/auth/password-reset-request">
                    <Link>Forgot password?</Link>
                  </NextLink>
                </Box>
                <Box ml="auto">
                  <NextLink passHref href="/auth/signup">
                    <Link>Register</Link>
                  </NextLink>
                </Box>
              </Flex>
            </Box>
          </Center>
        </Container>
      </Box>
    </Layout>
  );
}
