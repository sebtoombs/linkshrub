import { FormControl, FormLabel } from "@chakra-ui/form-control";
import { Input } from "@chakra-ui/input";
import {
  Box,
  Heading,
  VStack,
  Button,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Link as ChakraLink,
  FormErrorMessage,
  Text,
} from "@chakra-ui/react";
import gql from "graphql-tag";
import { useEffect, useMemo, useState } from "react";
import { useMutation } from "urql";
import Link from "next/link";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { ErrorMessage } from "@hookform/error-message";
import { useForm } from "react-hook-form";

const RESET_MUTATION = gql`
  mutation RESET_MUTATION(
    $email: String!
    $password: String!
    $token: String!
  ) {
    redeemUserPasswordResetToken(
      email: $email
      token: $token
      password: $password
    ) {
      code
      message
    }
  }
`;

export type PasswordResetProps = {
  token?: string;
};

export type PasswordResetFormData = {
  email: string;
  password: string;
};

const schema = yup.object().shape({
  email: yup.string().email().required(),
  password: yup.string().required().min(8),
});

export default function Reset({ token }: PasswordResetProps) {
  const [_resetPasswordResult, resetPassword] = useMutation(RESET_MUTATION);

  const formDefaults = useMemo<PasswordResetFormData>(() => {
    return {
      email: "",
      password: "",
    };
  }, []);

  const { register, handleSubmit, formState } = useForm<PasswordResetFormData>({
    defaultValues: formDefaults,
    resolver: yupResolver(schema),
  });

  const [isMounted, setIsMounted] = useState<boolean>(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const [errorMessage, setErrorMessage] = useState<any>(null);
  useEffect(() => {
    let _errorMessage = null;
    if (!token && isMounted) {
      _errorMessage = {
        title: "Invalid token",
        description: (
          <>
            Your password reset link appears to be invalid. Please try{" "}
            <Link passHref href="/auth/password-reset-request">
              <ChakraLink textDecoration="underline">
                requesting a password reset
              </ChakraLink>
            </Link>{" "}
            again.
          </>
        ),
      };
    }

    if (!errorMessage && !_errorMessage) {
      return;
    }
    setErrorMessage(_errorMessage ? _errorMessage : null);
  }, [token]);

  const onSubmitForm = handleSubmit(async (formValues) => {
    if (!token) return;

    const res = await resetPassword({ ...formValues, token });
    console.log(res);
  });

  return (
    <Box>
      <form method="POST" onSubmit={onSubmitForm} noValidate>
        <VStack spacing="6" sx={{ "&>*": { minW: "100%" } }}>
          <Heading fontWeight="400">Reset your password</Heading>
          <Text>Set a new password for your account</Text>
          <VStack as="fieldset" sx={{ "&>*": { minW: "100%" } }} spacing="6">
            {!!errorMessage && (
              <Alert status="error">
                <AlertIcon />
                <Box textAlign="left">
                  <AlertTitle mr={2}>{errorMessage.title}</AlertTitle>
                  <AlertDescription>
                    {errorMessage.description}
                  </AlertDescription>
                </Box>
              </Alert>
            )}
            {/* `{data?.redeemUserPasswordResetToken === null && (
                
        )}` */}
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
            <FormControl
              id="password"
              isInvalid={!!formState?.errors?.password}
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
              <Button type="submit" colorScheme="green" size="lg">
                Save new password
              </Button>
            </Box>
          </VStack>
        </VStack>
      </form>
    </Box>
  );
}
