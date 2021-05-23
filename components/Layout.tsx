import { Box } from "@chakra-ui/react";
import Brand from "../components/Brand";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Nav from "../components/Nav";
import SecondNav from "../components/SecondNav";
import { WithChildren } from "../types";

export type LayoutProps = WithChildren<{}>;

export default function Layout({ children }: LayoutProps) {
  return (
    <Box
      minH="100vh"
      display="flex"
      sx={{ "&>*": { minW: "100%" } }}
      flexDirection="column"
    >
      <Header>
        <Brand />
        <Nav />
        <SecondNav />
      </Header>
      {children}
      <Footer />
    </Box>
  );
}
