import { Box } from "@chakra-ui/react";
import Brand from "../components/Brand";
import Header from "../components/Header";
import Footer from "../components/Footer";
import AppNav from "./AppNav";

import { WithChildren } from "../types";

export type AppLayoutProps = WithChildren<{}>;

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <Box
      minH="100vh"
      display="flex"
      sx={{ "&>*": { minW: "100%" } }}
      flexDirection="column"
    >
      <Header>
        <Brand />
        <Box />
        <AppNav />
      </Header>
      {children}
      <Footer />
    </Box>
  );
}
