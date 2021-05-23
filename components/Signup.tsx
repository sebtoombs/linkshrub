import { FormControl, FormLabel } from "@chakra-ui/form-control";
import { Input } from "@chakra-ui/input";
import {
  Box,
  Heading,
  VStack,
  Button,
  useToast,
  Alert,
  AlertTitle,
  AlertDescription,
  AlertIcon,
  FormErrorMessage,
  Link as ChakraLink,
} from "@chakra-ui/react";
import gql from "graphql-tag";
import { useEffect, useMemo } from "react";
import { useMutation } from "urql";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { ErrorMessage } from "@hookform/error-message";
import { useForm } from "react-hook-form";
import Link from "next/link";

const SIGNUP_MUTATION = gql`
  mutation SIGNUP_MUTATION(
    $email: String!
    $name: String!
    $password: String!
  ) {
    createUser(data: { email: $email, name: $name, password: $password }) {
      id
      email
      name
    }
  }
`;

export type SignupFormData = {
  email: string;
  name: string;
  password: string;
};

const schema = yup.object().shape({
  name: yup.string().required(),
  email: yup.string().email().required(),
  password: yup.string().required(),
});

export default function SignUp() {
  const toast = useToast();
  const [signupResult, signup] = useMutation(SIGNUP_MUTATION);

  const { data, error, fetching } = signupResult;

  useEffect(() => {
    if (error) {
      if (
        error?.graphQLErrors?.length &&
        error.graphQLErrors[0].extensions?.exception?.meta?.target.includes(
          "email"
        )
      ) {
        toast({
          title: "Account exists",
          description: (
            <>
              A user already exists with that email. Maybe you meant to{" "}
              <Link href="/auth/signin" passHref>
                <ChakraLink textDecoration="underline">sign in</ChakraLink>
              </Link>{" "}
              instead?
            </>
          ),
          status: "warning",
          isClosable: true,
        });
      } else {
        toast({
          title: error?.networkError ? "Network error" : "Server error",
          description: `Something went wrong submitting your request. This is a ${
            error?.networkError
              ? "network error, meaning either you or the server is offline."
              : "server error, and is probably our fault!"
          }`,
          status: "error",
          isClosable: true,
        });
      }
      console.error(error);
    }
  }, [error]);

  const formDefaults = useMemo<SignupFormData>(() => {
    return {
      email: "",
      name: "",
      password: "",
    };
  }, []);

  const { register, handleSubmit, formState } = useForm<SignupFormData>({
    defaultValues: formDefaults,
    resolver: yupResolver(schema),
  });

  const onSubmitForm = handleSubmit(async (formValues) => {
    const res = await signup(formValues);
    console.log(res);
  });

  return (
    <Box>
      <form method="POST" onSubmit={onSubmitForm} noValidate>
        <VStack spacing="6" sx={{ "&>*": { minW: "100%" } }}>
          <Heading fontWeight="400">Sign up</Heading>
          {data?.createUser && (
            <Alert status="success">
              <AlertIcon />
              <Box textAlign="left">
                <AlertTitle mr={2}>Account created</AlertTitle>
                <AlertDescription>
                  Hi {data?.createUser?.name}! Your account was created. Go
                  ahead and{" "}
                  <Link passHref href="/auth/signin">
                    <ChakraLink textDecoration="underline">sign in</ChakraLink>
                  </Link>
                </AlertDescription>
              </Box>
            </Alert>
          )}
          <VStack as="fieldset" sx={{ "&>*": { minW: "100%" } }} spacing="6">
            <FormControl
              id="name"
              isInvalid={!!formState?.errors?.name}
              isDisabled={!!fetching}
            >
              <FormLabel>Name</FormLabel>
              <Input
                type="email"
                placeholder="Your name"
                {...register("name")}
              />
              <FormErrorMessage>
                <ErrorMessage errors={formState.errors} name="name" />
              </FormErrorMessage>
            </FormControl>
            <FormControl
              id="email"
              isInvalid={!!formState?.errors?.email}
              isDisabled={!!fetching}
            >
              <FormLabel>Email</FormLabel>
              <Input
                type="email"
                placeholder="Your email address"
                autoComplete="email"
                {...register("email")}
              />
              <FormErrorMessage>
                <ErrorMessage errors={formState.errors} name="email" />
              </FormErrorMessage>
            </FormControl>
            <FormControl
              id="password"
              isInvalid={!!formState?.errors?.password}
              isDisabled={!!fetching}
            >
              <FormLabel>Password</FormLabel>
              <Input
                type="password"
                placeholder="Your password"
                autoComplete="password"
                {...register("password")}
              />
              <FormErrorMessage>
                <ErrorMessage errors={formState.errors} name="password" />
              </FormErrorMessage>
            </FormControl>
            <Box>
              <Button
                type="submit"
                colorScheme="green"
                size="lg"
                isLoading={!!fetching}
              >
                Sign Up
              </Button>
            </Box>
          </VStack>
        </VStack>
      </form>
    </Box>
  );
}
