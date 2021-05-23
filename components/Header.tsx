import { Box, HStack } from "@chakra-ui/react";
import Container from "./Container";
import { WithChildren } from "../interfaces";

export type HeaderProps = WithChildren<{}>;

export default function Header({ children }: HeaderProps) {
  return (
    <Box>
      <Container>
        <HStack alignItems="center" sx={{ "&>*:last-child": { ml: "auto" } }}>
          {children}
        </HStack>
      </Container>
    </Box>
  );
}
