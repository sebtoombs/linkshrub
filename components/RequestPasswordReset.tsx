import { FormControl, FormLabel } from "@chakra-ui/form-control";
import { Input } from "@chakra-ui/input";
import {
  Box,
  Heading,
  VStack,
  Button,
  Alert,
  AlertIcon,
  AlertDescription,
  AlertTitle,
  FormErrorMessage,
  useToast,
} from "@chakra-ui/react";
import gql from "graphql-tag";
import { useEffect, useMemo } from "react";
import { useMutation } from "urql";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { ErrorMessage } from "@hookform/error-message";
import { useForm } from "react-hook-form";

const REQUEST_RESET_MUTATION = gql`
  mutation REQUEST_RESET_MUTATION($email: String!) {
    sendUserPasswordResetLink(email: $email) {
      code
      message
    }
  }
`;

export type RequestPasswordResetFormData = {
  email: string;
};

const schema = yup.object().shape({
  email: yup.string().email().required(),
});

export default function RequestReset() {
  const toast = useToast();

  const [requestResetResult, requestReset] = useMutation(
    REQUEST_RESET_MUTATION
  );

  const { data, error, fetching } = requestResetResult;

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

  const formDefaults = useMemo<RequestPasswordResetFormData>(() => {
    return {
      email: "",
    };
  }, []);

  const { register, handleSubmit, formState } =
    useForm<RequestPasswordResetFormData>({
      defaultValues: formDefaults,
      resolver: yupResolver(schema),
    });

  const onSubmitForm = handleSubmit(async (formValues) => {
    const _res = await requestReset(formValues);
  });

  return (
    <Box>
      <form method="POST" onSubmit={onSubmitForm} noValidate>
        <VStack spacing="6" sx={{ "&>*": { minW: "100%" } }}>
          <Heading fontWeight="400">Reset password</Heading>
          {data?.sendUserPasswordResetLink === null && (
            <Alert status="success">
              <AlertIcon />
              <Box textAlign="left">
                <AlertTitle mr={2}>Request sent</AlertTitle>
                <AlertDescription>
                  Check your email for a password reset link
                </AlertDescription>
              </Box>
            </Alert>
          )}

          <VStack as="fieldset" sx={{ "&>*": { minW: "100%" } }} spacing="6">
            <FormControl id="email" isInvalid={!!formState?.errors?.email}>
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
            <Box>
              <Button
                type="submit"
                colorScheme="green"
                size="lg"
                isLoading={!!fetching}
              >
                Reset Password
              </Button>
            </Box>
          </VStack>
        </VStack>
      </form>
    </Box>
  );
}
