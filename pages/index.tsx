import React from "react";
import Link from "next/link";
// eslint-disable-next-line import/no-unresolved
import { lists } from ".keystone/api";
import SignIn from "../components/Signin";

import Layout from "../components/Layout";
import Container from "../components/Container";
import { Box, Center, Heading, Text, VStack, Button } from "@chakra-ui/react";
import Head from "../components/Head";

export default function HomePage() {
  return (
    <Layout>
      <Head
        title="LinkShrub | A landing page for your links"
        titleSuffix={false}
      />
      <Box>
        <Container>
          <Center py={["20", null, null, "32"]} textAlign="center">
            <VStack spacing="6">
              <Heading fontWeight="400" size="2xl">
                A Link You Probably Don't Need
              </Heading>
              <Text fontSize="xl">
                A quick clone of a link landing page service.
              </Text>
              <Box>
                <Link passHref href="/signup">
                  <Button colorScheme="cyan" size="lg" px="14" as="a">
                    Try it
                  </Button>
                </Link>
              </Box>
            </VStack>
          </Center>
        </Container>
      </Box>
    </Layout>
  );
}

// export async function getStaticProps() {
//   const posts = await lists.Post.findMany({ query: "title" });
//   return { props: { posts } };
// }
