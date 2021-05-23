import { createSchema, list } from "@keystone-next/keystone/schema";
import {
  text,
  relationship,
  password,
  timestamp,
  select,
} from "@keystone-next/fields";
import { document } from "@keystone-next/fields-document";
import { LinkPage } from "./LinkPage";
import { LinkPageLink } from "./LinkPageLink";
import { isSignedIn } from "../access";

export const lists = createSchema({
  AdminUser: list({
    ui: {
      listView: {
        initialColumns: ["name", "posts"],
      },
    },
    fields: {
      name: text({ isRequired: true }),
      email: text({ isRequired: true, isUnique: true }),
      password: password({ isRequired: true }),
      posts: relationship({ ref: "Post.author", many: true }),
    },
  }),
  User: list({
    ui: {
      listView: {
        initialColumns: ["name", "linkPages"],
      },
    },
    fields: {
      name: text({ isRequired: true }),
      email: text({ isRequired: true, isUnique: true }),
      password: password({ isRequired: false }),
      linkPages: relationship({ ref: "LinkPage.owner", many: true }),
    },
    hooks: {
      afterChange: async ({ operation, updatedItem, context }) => {
        if (operation === "create") {
          const { lists } = context;

          await lists.LinkPage.createOne({
            data: {
              title: updatedItem.name,
              slug: updatedItem.slug,
              // status: "draft",
              owner: { connect: { id: updatedItem.id } },
            },
            query: "id title slug",
          });

          // sendWelcomeEmail(updatedItem.name, updatedItem.email);
        }
      },
      resolveInput: ({ resolvedData }) => {
        const { email } = resolvedData;

        if (email) {
          resolvedData.email = email.toLowerCase();
        }

        return resolvedData;
      },
    },
  }),
  Post: list({
    access: {
      create: isSignedIn,
      read: () => true,
      update: () => false,
      delete: () => false,
    },
    fields: {
      title: text(),
      slug: text(),
      status: select({
        options: [
          { label: "Published", value: "published" },
          { label: "Draft", value: "draft" },
        ],
        ui: {
          displayMode: "segmented-control",
        },
      }),
      content: document({
        formatting: true,
        layouts: [
          [1, 1],
          [1, 1, 1],
          [2, 1],
          [1, 2],
          [1, 2, 1],
        ],
        links: true,
        dividers: true,
      }),
      publishDate: timestamp(),
      author: relationship({
        ref: "AdminUser.posts",
        ui: {
          displayMode: "cards",
          cardFields: ["name", "email"],
          inlineEdit: { fields: ["name", "email"] },
          linkToItem: true,
          inlineCreate: { fields: ["name", "email"] },
        },
      }),
      tags: relationship({
        ref: "Tag.posts",
        ui: {
          displayMode: "cards",
          cardFields: ["name"],
          inlineEdit: { fields: ["name"] },
          linkToItem: true,
          inlineConnect: true,
          inlineCreate: { fields: ["name"] },
        },
        many: true,
      }),
    },
  }),
  Tag: list({
    access: {
      create: isSignedIn,
      read: () => true,
      update: () => false,
      delete: () => false,
    },
    ui: {
      isHidden: true,
    },
    fields: {
      name: text(),
      posts: relationship({
        ref: "Post.tags",
        many: true,
      }),
    },
  }),
  LinkPage,
  LinkPageLink,
});
