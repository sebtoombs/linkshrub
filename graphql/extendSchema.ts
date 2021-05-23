import { graphQLSchemaExtension } from "@keystone-next/keystone/schema";
import saveLinkPage from "./saveLinkPage";

// make a fake graphql tagged template literal - thanks WesBos
const graphql = String.raw;
export const extendGraphqlSchema = graphQLSchemaExtension({
  typeDefs: graphql`
    type Mutation {
      saveLinkPage(id: ID, data: LinkPageSaveInput): LinkPage
    }
    input LinkPageSaveInput {
      title: String
      heading: String
      subheading: String
      slug: String
      background: String
      avatarImage: ImageFieldInput
      status: String
      links: LinkPageLinkRelateToManyInput
    }
  `,
  resolvers: {
    Mutation: {
      saveLinkPage,
    },
  },
});
