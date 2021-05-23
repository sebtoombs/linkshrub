import { FormControl, FormLabel } from "@chakra-ui/form-control";
import { Input } from "@chakra-ui/input";
import {
  Box,
  Heading,
  VStack,
  Button,
  FormErrorMessage,
  useToast,
  Alert,
  AlertTitle,
  AlertDescription,
  AlertIcon,
} from "@chakra-ui/react";
import gql from "graphql-tag";
import { useEffect, useMemo } from "react";
import { useMutation } from "urql";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { ErrorMessage } from "@hookform/error-message";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";

const SIGNIN_MUTATION = gql`
  mutation SIGNIN_MUTATION($email: String!, $password: String!) {
    authenticateUserWithPassword(email: $email, password: $password) {
      ... on UserAuthenticationWithPasswordSuccess {
        item {
          id
          email
          name
        }
      }
      ... on UserAuthenticationWithPasswordFailure {
        code
        message
      }
    }
  }
`;

export type SigninFormData = {
  email: string;
  password: string;
};

const schema = yup.object().shape({
  email: yup.string().email().required(),
  password: yup.string().required(),
});

export default function SignIn() {
  const toast = useToast();
  const router = useRouter();
  const [signinResult, signin] = useMutation(SIGNIN_MUTATION);

  const { data, error, fetching } = signinResult;

  useEffect(() => {
    if (error) {
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
      console.error(error);
    }
  }, [error]);

  const formDefaults = useMemo<SigninFormData>(() => {
    return {
      email: "",
      password: "",
    };
  }, []);

  const { register, handleSubmit, formState } = useForm<SigninFormData>({
    defaultValues: formDefaults,
    resolver: yupResolver(schema),
  });

  const onSubmitForm = handleSubmit(async (formValues) => {
    const res = await signin(formValues);
    if (res?.data?.authenticateUserWithPassword?.item) {
      router.push("/app");
    }
  });

  return (
    <Box>
      <form method="POST" onSubmit={onSubmitForm}>
        <VStack spacing="6" sx={{ "&>*": { minW: "100%" } }}>
          <Heading fontWeight="400">Sign in</Heading>
          {data?.authenticateUserWithPassword?.code === "FAILURE" && (
            <Alert status="error">
              <AlertIcon />
              <Box textAlign="left">
                <AlertTitle mr={2}>
                  {data.authenticateUserWithPassword?.message ||
                    "Authentication failed"}
                </AlertTitle>
                <AlertDescription>
                  Your sign in failed. This likely means your email or password
                  is incorrect.
                </AlertDescription>
              </Box>
            </Alert>
          )}
          <VStack as="fieldset" sx={{ "&>*": { minW: "100%" } }} spacing="6">
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
                placeholder="Password"
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
                Sign In
              </Button>
            </Box>
          </VStack>
        </VStack>
      </form>
    </Box>
  );
}
