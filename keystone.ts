require("dotenv").config();

import { config } from "@keystone-next/keystone/schema";
import {
  statelessSessions,
  withItemData,
} from "@keystone-next/keystone/session";
import { createAuth } from "@keystone-next/auth";

import { lists } from "./schema";

let sessionSecret = process.env.SESSION_SECRET;

if (!sessionSecret) {
  if (process.env.NODE_ENV === "production") {
    throw new Error(
      "The SESSION_SECRET environment variable must be set in production"
    );
  } else {
    sessionSecret = "-- DEV COOKIE SECRET; CHANGE ME ---";
  }
}

let sessionMaxAge = 60 * 60 * 24 * 30; // 30 days

const adminAuth = createAuth({
  listKey: "AdminUser",
  identityField: "email",
  secretField: "password",
  initFirstItem: {
    fields: ["name", "email", "password"],
  },
  passwordResetLink: {
    async sendToken(args) {
      // send the email
      // await sendPasswordResetEmail(args.token, args.identity);
    },
  },
});

const userAuth = createAuth({
  listKey: "User",
  identityField: "email",
  secretField: "password",
  initFirstItem: {
    fields: ["name", "email", "password"],
  },
  passwordResetLink: {
    async sendToken(args) {
      // send the email
      // await sendPasswordResetEmail(args.token, args.identity);
      console.log("send token", args.token, args.identity);
    },
  },
});

const keystoneConfig = config({
  server: {
    cors: {
      origin: ["http://localhost:3000"],
      credentials: true,
    },
  },
  // db: {
  //   adapter: "prisma_postgresql",
  //   url:
  //     process.env.DATABASE_URL ||
  //     "postgres://postgres:password@localhost:5432/my_db?schema=public",
  // async onConnect(keystone) {
  //   console.log("Connected to the database!");
  //   if (process.argv.includes("--seed-data")) {
  //     await insertSeedData(keystone);
  //   }
  // },
  // },
  db: { provider: "sqlite", url: "file:./app.db" },
  experimental: {
    generateNextGraphqlAPI: true,
    generateNodeAPI: true,
  },

  // ui: {
  //   isAccessAllowed: (context) => {
  //     return (
  //       context?.session?.listKey === "AdminUser" &&
  //       !!context?.session?.data
  //     );
  //   },
  // },
  lists,
  images: {
    upload: "local",
    local: {
      storagePath: "public/images",
      baseUrl: "/images",
    },
  },
  session: withItemData(
    statelessSessions({
      maxAge: sessionMaxAge,
      secret: sessionSecret,
    }),
    { User: "id name email" }
  ),
});

const withUserAuth = userAuth.withAuth({
  ...keystoneConfig,
  ui: { ...keystoneConfig.ui, isDisabled: true },
});
withUserAuth!.ui!.isDisabled = false;

const withAdminUserAuth = adminAuth.withAuth(withUserAuth);

const finalConfig = withAdminUserAuth;

export default adminAuth.withAuth(finalConfig);
