import {
  FormControl,
  FormLabel,
  Box,
  useToast,
  VStack,
} from "@chakra-ui/react";
import AppLayout from "../../components/AppLayout";
import Container from "../../components/Container";
import FileUpload from "../../components/AvatarFileUpload";
import Head from "../../components/Head";
import ProtectedPage from "../../hoc/ProtectedPage";
import { useMutation } from "urql";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { ErrorMessage } from "@hookform/error-message";
import { useForm, Controller } from "react-hook-form";
import { useEffect, useMemo } from "react";
import { useRouter } from "next/router";
import gql from "graphql-tag";

const UPDATE_PAGE_MUTATION = gql`
  mutation UPDATE_PAGE_MUTATION($id: ID!, $data: LinkPageUpdateInput) {
    updateLinkPage(id: $id, data: $data) {
      id
    }
  }
`;

export type PageFormData = {
  avatarImage: File;
};

const schema = yup.object().shape({});

export function AppDashboardPage() {
  const toast = useToast();
  const router = useRouter();
  const [updatePageResult, signin] = useMutation(UPDATE_PAGE_MUTATION);

  const { data, error, fetching } = updatePageResult;

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

  const formDefaults = useMemo<PageFormData>(() => {
    return {
      avatarImage: null,
    };
  }, []);

  const { register, handleSubmit, formState, control } = useForm<PageFormData>({
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
    <AppLayout>
      <Head title="Dashboard" />
      <Box>
        <Container>
          <form onSubmit={onSubmitForm} noValidate>
            <VStack>
              <FormControl id="avatarImage">
                <FormLabel>Avatar</FormLabel>
                <Controller
                  name={`avatarImage`}
                  control={control}
                  render={({ field }) => <FileUpload {...field} />}
                />
              </FormControl>
            </VStack>
          </form>
        </Container>
      </Box>
    </AppLayout>
  );
}

export default ProtectedPage(AppDashboardPage);
