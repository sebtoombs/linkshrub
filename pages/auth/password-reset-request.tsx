import React from "react";
import NextLink from "next/link";
import RequestPasswordReset from "../../components/RequestPasswordReset";
import { useRouter } from "next/router";
import Layout from "../../components/Layout";
import Container from "../../components/Container";
import { Box, Center, Flex, Link } from "@chakra-ui/react";
import Head from "../../components/Head";

export default function PasswordResetRequestPage() {
  const router = useRouter();

  return (
    <Layout>
      <Head title="Forgot password" />
      <Box>
        <Container maxW="lg">
          <Center py={["20", null, null, "32"]} textAlign="center">
            <Box bg="white" shadow="xl" rounded="lg" minW="100%" py="4" px="6">
              <RequestPasswordReset />
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
