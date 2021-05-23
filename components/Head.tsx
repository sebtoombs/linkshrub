import NextHead from "next/head";

import { WithChildren } from "../interfaces";

export type HeadProps = WithChildren<{
  title: string;
  titleSuffix?: string | boolean;
}>;

export default function Head({
  title,
  titleSuffix = " | LinkShrub",
  children = null,
}: HeadProps) {
  return (
    <NextHead>
      <title>{[title, titleSuffix].filter(Boolean).join("")}</title>
      <meta charSet="utf-8" />
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      {children}
    </NextHead>
  );
}
