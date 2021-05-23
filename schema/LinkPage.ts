import {
  integer,
  select,
  text,
  relationship,
  image,
} from "@keystone-next/fields";
import { list } from "@keystone-next/keystone/schema";
import { isSignedIn, rules } from "../access";
import slugify from "../lib/slugify";

export const LinkPage = list({
  access: {
    create: isSignedIn,
    read: () => true,
    update: rules.canManageLinkPage,
    delete: rules.canManageLinkPage,
  },
  fields: {
    title: text({ isRequired: true }),
    heading: text(),
    subheading: text(),
    slug: text({
      isRequired: true,
      isUnique: true,
      hooks: {
        resolveInput: ({ resolvedData }) => {
          const { slug } = resolvedData;

          if (slug) {
            resolvedData.slug = slugify(slug);
          }

          return slug;
        },

        // validateInput: ({ resolvedData, addValidationError, context }) => {
        //   const {lists} = context;
        //   const { title } = resolvedData;
        //   if (title === "") {
        //     // We call addValidationError to indicate an invalid value.
        //     addValidationError(
        //       "The title of a blog post cannot be the empty string"
        //     );
        //   }
        // },
      },
    }),
    background: text(),
    avatarImage: image(),
    status: select({
      options: [
        { label: "Published", value: "published" },
        { label: "Draft", value: "draft" },
      ],
      ui: {
        displayMode: "segmented-control",
      },
    }),
    links: relationship({ ref: "LinkPageLink.linkPage", many: true }),
    owner: relationship({
      ref: "User.linkPages",
      ui: {
        displayMode: "cards",
        cardFields: ["name", "email"],
        inlineEdit: { fields: ["name", "email"] },
        linkToItem: true,
        inlineCreate: { fields: ["name", "email"] },
      },
    }),
  },
});
