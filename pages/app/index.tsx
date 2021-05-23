import {
  FormControl,
  FormLabel,
  Box,
  useToast,
  VStack,
  Input,
  FormErrorMessage,
  FormHelperText,
} from "@chakra-ui/react";
import AppLayout from "../../components/AppLayout";
import Container from "../../components/Container";
import FileUpload from "../../components/AvatarFileUpload";
import Head from "../../components/Head";
import ProtectedPage from "../../hoc/ProtectedPage";
import { useMutation, useQuery } from "urql";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { ErrorMessage } from "@hookform/error-message";
import { useForm, Controller } from "react-hook-form";
import { useEffect, useMemo } from "react";
import { useRouter } from "next/router";
import gql from "graphql-tag";
import { useUser } from "../../hooks/useUser";
import { ImageField } from "../../interfaces";

const FETCH_LINK_PAGE_QUERY = gql`
  query FETCH_LINK_PAGE_QUERY($userID: ID!) {
    allLinkPages(where: { owner: { id: $userID } }, first: 1) {
      id
      slug
      title
      heading
      subheading
      background
      avatarImage {
        id
        width
        height
        src
      }
      links {
        id
        content
        url
        icon
        iconColor
        image {
          id
          width
          height
          src
        }
        imageBackground
      }
    }
  }
`;

const UPDATE_PAGE_MUTATION = gql`
  mutation UPDATE_PAGE_MUTATION($id: ID!, $data: LinkPageUpdateInput) {
    updateLinkPage(id: $id, data: $data) {
      id
    }
  }
`;

export type PageLinkFormData = {
  content: string;
  url: string;
  icon: string;
  iconColor: string;
  image: File | ImageField;
  imageBackground: string;
};

export type PageFormData = {
  avatarImage: File | ImageField;
  title: string;
  heading: string;
  subheading: string;
  slug: string;
  background: string;
  links: PageLinkFormData[];
};

const schema = yup.object().shape({});

export function AppDashboardPage() {
  const { user } = useUser();

  const [fetchLinkPageResult, refetchLinkPage] = useQuery({
    query: FETCH_LINK_PAGE_QUERY,
    variables: { userID: user.id },
  });

  const { data, error, fetching } = fetchLinkPageResult;
  const linkPage = useMemo(() => {
    return data && data.allLinkPages?.length ? data.allLinkPages[0] : null;
  }, [data]);

  return (
    <AppLayout>
      <Head title="Dashboard" />
      <Box>
        <Container>
          {!fetching && <LinkPageForm linkPage={linkPage} />}
        </Container>
      </Box>
    </AppLayout>
  );
}

export default ProtectedPage(AppDashboardPage);

function LinkPageForm({ linkPage }) {
  const toast = useToast();
  const [updatePageResult, updatePage] = useMutation(UPDATE_PAGE_MUTATION);
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
      title: linkPage?.title || "",
      heading: linkPage?.heading || "",
      subheading: linkPage?.subheading || "",
      slug: linkPage?.slug,
      background: linkPage?.background || "",
      links: [],
    };
  }, [linkPage]);

  const { register, handleSubmit, formState, control } = useForm<PageFormData>({
    defaultValues: formDefaults,
    resolver: yupResolver(schema),
  });

  const onSubmitForm = handleSubmit(async (formValues) => {
    const res = await updatePage(formValues);
  });

  return (
    <form onSubmit={onSubmitForm} noValidate>
      <VStack spacing="5">
        <FormControl id="avatarImage">
          <FormLabel>Avatar</FormLabel>
          <Controller
            name={`avatarImage`}
            control={control}
            render={({ field }) => <FileUpload {...field} />}
          />
        </FormControl>
        <FormControl id="heading" isInvalid={!!formState?.errors?.heading}>
          <FormLabel>Heading</FormLabel>
          <Input type="text" {...register("heading")} />
          <FormHelperText>The primary heading. Your name is a good idea.</FormHelperText>
          <FormErrorMessage>
            <ErrorMessage errors={formState.errors} name="heading" />
          </FormErrorMessage>
        </FormControl>
        <FormControl
          id="subheading"
          isInvalid={!!formState?.errors?.subheading}
        >
          <FormLabel>Subheading</FormLabel>
          <Input type="text" {...register("subheading")} />
          <FormHelperText>Introduce yourself!</FormHelperText>
          <FormErrorMessage>
            <ErrorMessage errors={formState.errors} name="subheading" />
          </FormErrorMessage>
        </FormControl>

        
      </VStack>
    </form>
  );
}
