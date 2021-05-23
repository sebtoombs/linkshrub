import React from "react";
import NextLink from "next/link";
import SignUp from "../../components/Signup";

import Layout from "../../components/Layout";
import Container from "../../components/Container";
import { Box, Center, Flex, Link } from "@chakra-ui/react";
import Head from "../../components/Head";

export default function SignupPage() {
  return (
    <Layout>
      <Head title="Signup" />
      <Box>
        <Container maxW="lg">
          <Center py={["20", null, null, "32"]} textAlign="center">
            <Box bg="white" shadow="xl" rounded="lg" minW="100%" py="4" px="6">
              <SignUp />
              <Flex mt="6">
                <Box ml="auto">
                  <NextLink passHref href="/auth/signin">
                    <Link>Sign in</Link>
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
