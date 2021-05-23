import React from "react";
import Link from "next/link";
import { lists } from ".keystone/api";
import Head from "../../components/Head";
import { Box, Heading, Flex, VStack, Text } from "@chakra-ui/react";

import { AiOutlineLinkedin } from "react-icons/ai";
import { FiGithub, FiTwitter, FiBookmark } from "react-icons/fi";
import { BsCalendar } from "react-icons/bs";
import Image from "next/image";
import { Global, css } from "@emotion/react";
import Logo from "../../components/Logo";
import { LinkPage } from "@prisma/client";
import { WithChildren, WithRestProps } from "../../types";

export type LinkPageProps = {
  // prisma gives us the linkpage type, but unfortunately we cant get any more detail
  // so this is still a bit of a TODO
  data: { page: (LinkPage & { avatarImage: any; links: any[] }) | null };
};

export default function IndexPage({ data }: LinkPageProps) {
  console.log(data);
  return (
    <Flex as="main" minH="100vh" flexDirection="column">
      <Global
        styles={css`
          body {
            min-height: 100vh;
            background: ${data?.page?.background};
            background-repeat: no-repeat;
          }
        `}
      />
      <Head title={data?.page?.title || "LinkShrub Page"} />
      {/* <Box px="4" py="1">
        <Link passHref href="/">
          <Flex alignItems="center" as="a">
            <Box as="span" fontSize="4xl">
              <Logo />
            </Box>
          </Flex>
        </Link>
      </Box> */}
      <Box maxW="2xl" mx="auto" py="10" px="4" flexGrow={1}>
        <Flex mb="10">
          <Box w="6rem" h="6rem" overflow="hidden" borderRadius="9999px">
            {!!data?.page?.avatarImage && (
              <Image
                src={data.page!.avatarImage?.src}
                alt={`A picture of ${data.page.title || "unknown"}`}
                width={data.page!.avatarImage?.width}
                height={data.page!.avatarImage?.height}
              />
            )}
          </Box>
          <Box pl="10" ml="auto">
            <Heading size="2xl">
              {data?.page?.heading || data?.page?.title}
            </Heading>
            {!!data?.page?.subheading && (
              <Heading color="gray.600" fontWeight="500">
                {data.page.subheading}
              </Heading>
            )}
          </Box>
        </Flex>
        <VStack sx={{ "&>*": { minW: "100%" } }} spacing="6" as="ul">
          {data?.page?.links?.map((link, index) => (
            <Item as="a" href={link.url} target="_blank" key={index}>
              <ItemIcon
                bg={link.imageBackground || "gray.100"}
                p={!!link.icon ? "0.6rem" : undefined}
                color={link.iconColor}
              >
                {!!link.icon && <Icon icon={link.icon} />}
                {!link.icon && !!link.image && (
                  <Image
                    src={link.image?.src}
                    alt={""}
                    width={link.image?.width}
                    height={link.image?.height}
                  />
                )}
              </ItemIcon>
              <ItemContent>{link.content}</ItemContent>
            </Item>
          ))}
        </VStack>
      </Box>
      <Box px="4" py="1" bg="gray.100">
        <Flex alignItems="center">
          <Link passHref href="/">
            <Flex alignItems="center" as="a">
              <Box as="span" fontSize="4xl">
                <Logo />
              </Box>
              <Text ml="3" fontSize="sm">
                <strong>Powered by LinkShrub</strong> - Like a tree, only much
                smaller.
              </Text>
            </Flex>
          </Link>
        </Flex>
      </Box>
    </Flex>
  );
}

function Icon({ icon }: { icon: string }) {
  switch (icon) {
    case "github":
      return <FiGithub />;
    case "linkedin":
      <AiOutlineLinkedin />;
    case "twitter":
      return <FiTwitter />;
    case "calendar":
      return <BsCalendar />;
    case "blog":
      return <FiBookmark />;
  }
  return null;
}

function Item({ children, ...props }: WithChildren<WithRestProps<{}>>) {
  return (
    <Box as="li" listStyleType="none">
      <Flex
        rounded="full"
        bg="white"
        p="1"
        shadow="lg"
        alignItems="center"
        transition="0.2s all ease"
        _hover={{ shadow: "xl" }}
        {...props}
      >
        {children}
      </Flex>
    </Box>
  );
}

function ItemIcon({ children, ...props }: WithChildren<WithRestProps<{}>>) {
  return (
    <Flex
      rounded="full"
      overflow="hidden"
      w="3rem"
      h="3rem"
      minW="3rem"
      minH="3rem"
      alignItems="center"
      justifyContent="center"
      sx={{ "&>*": { display: "block", w: "100%", h: "100%" } }}
      p="1"
      as="span"
      {...props}
    >
      {children}
    </Flex>
  );
}

function ItemContent({ children }: WithChildren<{}>) {
  return (
    <Box fontSize="lg" fontWeight="500" pl="6" pr="6" py="2" as="span">
      {children}
    </Box>
  );
}

function ItemSecondaryText({ children }: WithChildren<{}>) {
  return (
    <Text as="span" color="gray.500" ml="2" display="inline-block">
      {children}
    </Text>
  );
}

export async function getStaticPaths() {
  const pages = await lists.LinkPage.findMany({
    query: "slug",
    where: { status_not: "draft" },
  });

  return {
    paths: pages.map((p) => `/l/${p.slug}`),
    fallback: true,
  };
}

export async function getStaticProps(ctx: any) {
  // Cant find the type for this, im sure it exists
  const {
    params: { page: slugArray },
  } = ctx;

  const slug = slugArray?.length ? slugArray[0] : null;

  const pages = await lists.LinkPage.findMany({
    where: { slug },
    query:
      "title slug heading subheading background avatarImage {src width height } links { content url image {src width height} imageBackground icon iconColor } owner { name }",
    first: 1,
  });

  const page = pages?.length ? pages[0] : null;

  const data = {
    page,
  };

  return { props: { data }, revalidate: 60 };
}
