import { Container as ChakraContainer } from "@chakra-ui/react";
import { WithChildren, WithRestProps } from "../interfaces";

export type ContainerProps = WithRestProps<WithChildren<{}>>;

export default function Container({ children, ...props }: ContainerProps) {
  return (
    <ChakraContainer
      maxW={["container.sm", "container.md", "container.lg", "container.xl"]}
      px="2"
      {...props}
    >
      {children}
    </ChakraContainer>
  );
}
