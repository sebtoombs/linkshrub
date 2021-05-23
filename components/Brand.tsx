import { Flex, Heading, Box } from "@chakra-ui/react";
import Link from "next/link";
import Logo from "./Logo";
export default function Brand() {
  return (
    <Link passHref href="/">
      <Flex alignItems="center" as="a">
        <Box as="span" fontSize="6xl">
          <Logo />
        </Box>
        <Heading ml="3" size="md" as="span">
          linkshrub
        </Heading>
      </Flex>
    </Link>
  );
}
