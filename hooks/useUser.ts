import gql from "graphql-tag";
import { useRouter } from "next/router";
import { useMutation, useQuery } from "urql";

const CURRENT_USER_QUERY = gql`
  query {
    authenticatedItem {
      ... on User {
        id
        email
        name
      }
    }
  }
`;

const SIGN_OUT_MUTATION = gql`
  mutation {
    endSession
  }
`;

export function useUser() {
  const router = useRouter();
  const [response, _refetch] = useQuery({ query: CURRENT_USER_QUERY });

  const { fetching } = response;

  const [_signoutResponse, signout] = useMutation(SIGN_OUT_MUTATION);

  const doSignout = async () => {
    await signout();
    router.push("/");
  };

  return {
    user: response.data?.authenticatedItem,
    signout: doSignout,
    loading: !!fetching,
  };
}

export { CURRENT_USER_QUERY };
