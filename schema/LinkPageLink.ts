import {
  integer,
  select,
  text,
  relationship,
  image,
} from "@keystone-next/fields";
import { list } from "@keystone-next/keystone/schema";
import { isSignedIn, rules } from "../access";

export const LinkPageLink = list({
  access: {
    create: isSignedIn,
    read: () => true,
    update: rules.canManageLinkPageLink,
    delete: rules.canManageLinkPageLink,
  },
  fields: {
    content: text({ isRequired: true }),
    url: text({ isRequired: true }),
    icon: text(),
    iconColor: text(),
    image: image(),
    imageBackground: text(),
    linkPage: relationship({ ref: "LinkPage.links" }),
  },
  ui: {
    isHidden: true,
  },
});
