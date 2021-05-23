import React from "react";
import { AppProps } from "next/app";
import fetch from "isomorphic-unfetch";
import { createClient, Provider as QueryProvider } from "urql";
import { ChakraProvider } from "@chakra-ui/react";

// the URL to /api/graphql
const GRAPHQL_ENDPOINT = `http://localhost:3000/api/graphql`;

const client = createClient({
  url: GRAPHQL_ENDPOINT,
  fetch,
});

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <ChakraProvider>
      <QueryProvider value={client}>
        <Component {...pageProps} />
      </QueryProvider>
    </ChakraProvider>
  );
};

export default App;
